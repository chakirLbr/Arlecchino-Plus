'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Bell, ShoppingBag, CalendarDays, Check, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'order' | 'reservation';
  title: string;
  message: string;
  time: string;
  read: boolean;
  link: string;
}

// Default sound file
const DEFAULT_SOUND = 'universfield-new-notification-033-480571';

// Storage key for seen notifications
const SEEN_NOTIFICATIONS_KEY = 'admin-seen-notifications';

// Get seen notification IDs from localStorage
function getSeenNotifications(): Set<string> {
  try {
    const stored = localStorage.getItem(SEEN_NOTIFICATIONS_KEY);
    if (stored) {
      return new Set(JSON.parse(stored));
    }
  } catch {}
  return new Set();
}

// Save seen notification IDs to localStorage
function saveSeenNotifications(ids: Set<string>) {
  try {
    // Keep only the last 100 IDs to prevent localStorage from growing too large
    const idsArray = Array.from(ids).slice(-100);
    localStorage.setItem(SEEN_NOTIFICATIONS_KEY, JSON.stringify(idsArray));
  } catch {}
}

// Mark a notification as seen
function markNotificationSeen(id: string) {
  const seen = getSeenNotifications();
  seen.add(id);
  saveSeenNotifications(seen);
}

// Mark all notifications as seen
function markAllNotificationsSeen(ids: string[]) {
  const seen = getSeenNotifications();
  ids.forEach((id) => seen.add(id));
  saveSeenNotifications(seen);
}

// Audio instance for reuse
let audioInstance: HTMLAudioElement | null = null;

// Play notification sound
function playNotificationSound() {
  try {
    const volume = parseInt(localStorage.getItem('notification-volume') || '100') / 100;
    const soundType = localStorage.getItem('notification-sound-type') || DEFAULT_SOUND;

    if (!audioInstance) {
      audioInstance = new Audio();
    }

    audioInstance.src = `/audio/notifications/${soundType}.mp3`;
    audioInstance.volume = volume;
    audioInstance.play().catch(() => {});
  } catch {}
}

// Unlock audio on first user interaction
function unlockAudio() {
  if (!audioInstance) {
    audioInstance = new Audio();
    audioInstance.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==';
    audioInstance.volume = 0;
    audioInstance.play().catch(() => {});
  }
}

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());
  const prevNotificationIdsRef = useRef<Set<string>>(new Set());
  const isFirstLoadRef = useRef(true);

  // Load preferences and seen notifications
  useEffect(() => {
    const savedSound = localStorage.getItem('notification-sound');
    if (savedSound !== null) {
      setSoundEnabled(savedSound === 'true');
    }
    setSeenIds(getSeenNotifications());

    // Unlock audio on user interaction
    const handleInteraction = () => {
      unlockAudio();
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  const toggleSound = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    localStorage.setItem('notification-sound', String(newValue));
    if (newValue) playNotificationSound();
  };

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/notifications');
      if (response.ok) {
        const data = await response.json();
        const newNotifications: Notification[] = data.notifications || [];

        // Check for truly new notifications (not seen before)
        const currentIds = new Set(newNotifications.map((n) => n.id));
        const currentSeenIds = getSeenNotifications();

        if (!isFirstLoadRef.current && soundEnabled) {
          // Find notifications that are new (not in previous fetch AND not seen)
          for (const n of newNotifications) {
            if (!prevNotificationIdsRef.current.has(n.id) && !currentSeenIds.has(n.id)) {
              playNotificationSound();
              break; // Play sound only once even if multiple new notifications
            }
          }
        }

        prevNotificationIdsRef.current = currentIds;
        isFirstLoadRef.current = false;

        // Mark notifications as read based on seen status
        const notificationsWithReadStatus = newNotifications.map((n) => ({
          ...n,
          read: currentSeenIds.has(n.id),
        }));

        setNotifications(notificationsWithReadStatus);
        setSeenIds(currentSeenIds);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [soundEnabled]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Calculate unread count based on seen status
  const unreadCount = notifications.filter((n) => !seenIds.has(n.id)).length;

  const markAsRead = (id: string) => {
    markNotificationSeen(id);
    setSeenIds((prev) => new Set([...prev, id]));
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    const allIds = notifications.map((n) => n.id);
    markAllNotificationsSeen(allIds);
    setSeenIds(new Set(allIds));
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="h-4 w-4 text-brand-red-600" />;
      case 'reservation':
        return <CalendarDays className="h-4 w-4 text-blue-600" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className={cn("h-5 w-5", unreadCount > 0 && "animate-pulse")} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-brand-red-600 text-white text-xs font-medium flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Benachrichtigungen</h3>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={toggleSound}
              title={soundEnabled ? 'Ton ausschalten' : 'Ton einschalten'}
            >
              {soundEnabled ? (
                <Volume2 className="h-4 w-4 text-green-600" />
              ) : (
                <VolumeX className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-auto py-1"
                onClick={markAllAsRead}
              >
                <Check className="h-3 w-3 mr-1" />
                Alle gelesen
              </Button>
            )}
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              Laden...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">
                Keine neuen Benachrichtigungen
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <Link
                key={notification.id}
                href={notification.link}
                onClick={() => {
                  markAsRead(notification.id);
                  setOpen(false);
                }}
                className={cn(
                  'flex items-start gap-3 p-4 border-b last:border-b-0 hover:bg-muted transition-colors',
                  !seenIds.has(notification.id) && 'bg-primary/5'
                )}
              >
                <div className="mt-0.5">{getIcon(notification.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm', !seenIds.has(notification.id) && 'font-medium')}>
                    {notification.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {notification.time}
                  </p>
                </div>
                {!seenIds.has(notification.id) && (
                  <div className="h-2 w-2 rounded-full bg-brand-red-600 mt-2" />
                )}
              </Link>
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <div className="p-2 border-t">
            <Link href="/admin/bestellungen" onClick={() => setOpen(false)}>
              <Button variant="ghost" className="w-full text-sm" size="sm">
                Alle Bestellungen anzeigen
              </Button>
            </Link>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
