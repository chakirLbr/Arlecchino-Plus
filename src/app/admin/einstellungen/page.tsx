'use client';

import { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Bell,
  ShoppingBag,
  AlertTriangle,
  Save,
  Play,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

interface Settings {
  acceptingOrders: boolean;
  ordersPausedMessage: string;
  notificationVolume: number;
  notificationSound: string;
}

const notificationSounds = [
  { id: 'default', name: 'Standard (3 Töne)', frequencies: [1200, 1200, 1500] },
  { id: 'urgent', name: 'Dringend (Schnell)', frequencies: [1500, 1500, 1800] },
  { id: 'gentle', name: 'Sanft (Tief)', frequencies: [800, 900, 1000] },
  { id: 'alarm', name: 'Alarm (Laut)', frequencies: [1800, 1800, 2000] },
];

// Play notification sound with custom settings
function playTestSound(soundId: string, volume: number) {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const sound = notificationSounds.find((s) => s.id === soundId) || notificationSounds[0];
    const volumeLevel = volume / 100;

    const playTone = (frequency: number, startTime: number, duration: number) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = soundId === 'gentle' ? 'sine' : 'square';

      gainNode.gain.setValueAtTime(volumeLevel, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };

    const now = audioContext.currentTime;
    const [f1, f2, f3] = sound.frequencies;

    // First pattern
    playTone(f1, now, 0.15);
    playTone(f2, now + 0.2, 0.15);
    playTone(f3, now + 0.4, 0.25);

    // Repeat
    playTone(f1, now + 0.8, 0.15);
    playTone(f2, now + 1.0, 0.15);
    playTone(f3, now + 1.2, 0.25);

  } catch (error) {
    console.log('Could not play sound:', error);
  }
}

export default function EinstellungenPage() {
  const [settings, setSettings] = useState<Settings>({
    acceptingOrders: true,
    ordersPausedMessage: 'Wir nehmen momentan keine Bestellungen an aufgrund hoher Auslastung. Bitte versuchen Sie es später erneut. Wir entschuldigen uns für die Unannehmlichkeiten.',
    notificationVolume: 100,
    notificationSound: 'default',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Save a single setting
  const saveSetting = async (key: string, value: any) => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      });

      if (response.ok) {
        setSavedMessage('Gespeichert!');
        setTimeout(() => setSavedMessage(''), 2000);
      }
    } catch (error) {
      console.error('Failed to save setting:', error);
    } finally {
      setSaving(false);
    }
  };

  // Handle order acceptance toggle
  const handleOrderToggle = async (checked: boolean) => {
    setSettings((prev) => ({ ...prev, acceptingOrders: checked }));
    await saveSetting('acceptingOrders', checked);
  };

  // Handle message change
  const handleMessageSave = async () => {
    await saveSetting('ordersPausedMessage', settings.ordersPausedMessage);
  };

  // Handle volume change
  const handleVolumeChange = async (value: number[]) => {
    const volume = value[0];
    setSettings((prev) => ({ ...prev, notificationVolume: volume }));
    // Save with debounce effect (save when user stops sliding)
  };

  const handleVolumeSave = async () => {
    await saveSetting('notificationVolume', settings.notificationVolume);
    // Also save to localStorage for immediate effect
    localStorage.setItem('notification-volume', String(settings.notificationVolume));
  };

  // Handle sound selection
  const handleSoundChange = async (soundId: string) => {
    setSettings((prev) => ({ ...prev, notificationSound: soundId }));
    await saveSetting('notificationSound', soundId);
    localStorage.setItem('notification-sound-type', soundId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Laden...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Einstellungen</h1>
          <p className="text-muted-foreground">
            Verwalten Sie Ihre Restaurant-Einstellungen
          </p>
        </div>
        {savedMessage && (
          <Badge variant="default" className="bg-green-600">
            {savedMessage}
          </Badge>
        )}
      </div>

      {/* Order Acceptance */}
      <Card className={!settings.acceptingOrders ? 'border-orange-500 border-2' : ''}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-5 w-5 text-brand-red-600" />
              <div>
                <CardTitle>Bestellungen annehmen</CardTitle>
                <CardDescription>
                  Schalten Sie die Annahme neuer Bestellungen ein oder aus
                </CardDescription>
              </div>
            </div>
            <Switch
              checked={settings.acceptingOrders}
              onCheckedChange={handleOrderToggle}
            />
          </div>
        </CardHeader>
        {!settings.acceptingOrders && (
          <CardContent className="pt-0">
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="font-medium text-orange-700 dark:text-orange-400">
                    Bestellungen sind pausiert
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Kunden sehen eine Nachricht, dass keine Bestellungen angenommen werden.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Label htmlFor="pausedMessage">Nachricht für Kunden</Label>
              <Textarea
                id="pausedMessage"
                value={settings.ordersPausedMessage}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, ordersPausedMessage: e.target.value }))
                }
                rows={3}
                placeholder="Nachricht, die Kunden sehen werden..."
              />
              <Button
                size="sm"
                onClick={handleMessageSave}
                disabled={saving}
              >
                <Save className="h-4 w-4 mr-2" />
                Nachricht speichern
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Notification Sound */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-brand-red-600" />
            <div>
              <CardTitle>Benachrichtigungston</CardTitle>
              <CardDescription>
                Wählen Sie den Ton und die Lautstärke für neue Bestellungen
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sound Selection */}
          <div className="space-y-3">
            <Label>Ton auswählen</Label>
            <div className="grid gap-2">
              {notificationSounds.map((sound) => (
                <div
                  key={sound.id}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                    settings.notificationSound === sound.id
                      ? 'border-brand-red-600 bg-primary/5'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => handleSoundChange(sound.id)}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="sound"
                      checked={settings.notificationSound === sound.id}
                      onChange={() => handleSoundChange(sound.id)}
                      className="text-brand-red-600"
                    />
                    <span className="font-medium">{sound.name}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      playTestSound(sound.id, settings.notificationVolume);
                    }}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Test
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Volume Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Lautstärke</Label>
              <span className="text-sm text-muted-foreground">
                {settings.notificationVolume}%
              </span>
            </div>
            <div className="flex items-center gap-4">
              <VolumeX className="h-5 w-5 text-muted-foreground" />
              <Slider
                value={[settings.notificationVolume]}
                onValueChange={handleVolumeChange}
                onValueCommit={handleVolumeSave}
                max={100}
                min={10}
                step={10}
                className="flex-1"
              />
              <Volume2 className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
              Tipp: Stellen Sie die Lautstärke hoch ein, damit der Ton in der Küche gehört wird.
            </p>
          </div>

          {/* Test Button */}
          <Button
            onClick={() => playTestSound(settings.notificationSound, settings.notificationVolume)}
            className="w-full"
          >
            <Play className="h-4 w-4 mr-2" />
            Ton testen mit aktuellen Einstellungen
          </Button>
        </CardContent>
      </Card>

      {/* Restaurant Info (placeholder for future) */}
      <Card>
        <CardHeader>
          <CardTitle>Restaurant-Informationen</CardTitle>
          <CardDescription>
            Öffnungszeiten und Kontaktdaten (kommt bald)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Hier können Sie bald Öffnungszeiten, Kontaktdaten und mehr bearbeiten.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
