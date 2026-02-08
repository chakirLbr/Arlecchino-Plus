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

// Audio instance for reuse
let audioInstance: HTMLAudioElement | null = null;

// Play notification sound using MP3 files
function playNotificationSound() {
  try {
    // Get settings from localStorage
    const volume = parseInt(localStorage.getItem('notification-volume') || '100') / 100;
    const soundType = localStorage.getItem('notification-sound-type') || DEFAULT_SOUND;

    // Reuse or create audio element
    if (!audioInstance) {
      audioInstance = new Audio();
    }

    audioInstance.src = `/audio/notifications/${soundType}.mp3`;
    audioInstance.volume = volume;

    // Play the sound
    const playPromise = audioInstance.play();

    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.log('Could not play notification sound (browser autoplay blocked):', error.message);
      });
    }
  } catch (error) {
    console.log('Could not play notification sound:', error);
  }
}

// Unlock audio on first user interaction
function unlockAudio() {
  if (!audioInstance) {
    audioInstance = new Audio();
    // Try to play a silent sound to unlock audio
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
  const prevUnreadCountRef = useRef<number>(0);
  const isFirstLoadRef = useRef(true);

  // Load sound preference from localStorage and unlock audio
  useEffect(() => {
    const saved = localStorage.getItem('notification-sound');
    if (saved !== null) {
      setSoundEnabled(saved === 'true');
    }

    // Unlock audio on any user interaction
    const handleInteraction = () => {
      unlockAudio();
      // Remove listeners after first interaction
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

  // Save sound preference
  const toggleSound = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    localStorage.setItem('notification-sound', String(newValue));

    // Play test sound when enabling
    if (newValue) {
      playNotificationSound();
    }
  };

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/notifications');
      if (response.ok) {
        const data = await response.json();
        const newNotifications = data.notifications || [];
        const newUnreadCount = newNotifications.filter((n: Notification) => !n.read).length;

        // Play sound if there are new unread notifications (not on first load)
        if (!isFirstLoadRef.current && soundEnabled && newUnreadCount > prevUnreadCountRef.current) {
          playNotificationSound();
        }

        prevUnreadCountRef.current = newUnreadCount;
        isFirstLoadRef.current = false;
        setNotifications(newNotifications);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [soundEnabled]);

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 15 seconds
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (id: string) => {
    try {
      await fetch('/api/admin/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      prevUnreadCountRef.current = Math.max(0, prevUnreadCountRef.current - 1);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('/api/admin/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      prevUnreadCountRef.current = 0;
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
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
        {/* Header */}
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

        {/* Notifications list */}
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
                  if (!notification.read) {
                    markAsRead(notification.id);
                  }
                  setOpen(false);
                }}
                className={cn(
                  'flex items-start gap-3 p-4 border-b last:border-b-0 hover:bg-muted transition-colors',
                  !notification.read && 'bg-primary/5'
                )}
              >
                <div className="mt-0.5">{getIcon(notification.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm', !notification.read && 'font-medium')}>
                    {notification.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {notification.time}
                  </p>
                </div>
                {!notification.read && (
                  <div className="h-2 w-2 rounded-full bg-brand-red-600 mt-2" />
                )}
              </Link>
            ))
          )}
        </div>

        {/* Footer */}
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
