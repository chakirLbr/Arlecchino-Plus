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
  Store,
  User,
  Lock,
  Phone,
  Mail,
  MapPin,
  Clock,
  Eye,
  EyeOff,
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
  // Restaurant info
  restaurantName: string;
  restaurantStreet: string;
  restaurantPostalCode: string;
  restaurantCity: string;
  restaurantPhone: string;
  restaurantEmail: string;
  openingHours: string;
}

interface AdminProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

const notificationSounds = [
  { id: 'universfield-new-notification-033-480571', name: 'Benachrichtigung 1' },
  { id: 'universfield-new-notification-029-480565', name: 'Benachrichtigung 2' },
  { id: 'universfield-new-notification-031-480569', name: 'Benachrichtigung 3' },
  { id: 'universfield-new-notification-030-480567', name: 'Benachrichtigung 4' },
  { id: 'alex_jauk-bell-ring-199839', name: 'Glocke' },
  { id: 'freesounds123-bell-sound-370341', name: 'Glocke Lang' },
  { id: 'soundreality-bell-fx-410608', name: 'Glocke FX' },
  { id: 'waltermidnight-vintage-doorbell-ring-sound-effect-325247', name: 'Türklingel Vintage' },
];

// Play notification sound (MP3)
function playTestSound(soundId: string, volume: number) {
  try {
    const volumeLevel = volume / 100;
    const audio = new Audio(`/audio/notifications/${soundId}.mp3`);
    audio.volume = volumeLevel;
    audio.play().catch((error) => {
      console.log('Could not play sound:', error);
    });
  } catch (error) {
    console.log('Could not play sound:', error);
  }
}

export default function EinstellungenPage() {
  const [settings, setSettings] = useState<Settings>({
    acceptingOrders: true,
    ordersPausedMessage: 'Wir nehmen momentan keine Bestellungen an aufgrund hoher Auslastung. Bitte versuchen Sie es später erneut. Wir entschuldigen uns für die Unannehmlichkeiten.',
    notificationVolume: 100,
    notificationSound: 'universfield-new-notification-033-480571',
    // Restaurant defaults
    restaurantName: 'Arlecchino Plus',
    restaurantStreet: 'Kölner Str. 1',
    restaurantPostalCode: '42781',
    restaurantCity: 'Haan',
    restaurantPhone: '02129 6663',
    restaurantEmail: 'info@arlecchino-plus.de',
    openingHours: 'Mo-Fr: 11:00-22:00, Sa-So: 12:00-23:00',
  });
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Fetch settings and admin profile
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, profileRes] = await Promise.all([
          fetch('/api/admin/settings'),
          fetch('/api/admin/profile'),
        ]);

        if (settingsRes.ok) {
          const data = await settingsRes.json();
          setSettings((prev) => ({ ...prev, ...data }));
        }

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setAdminProfile(profileData);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  // Save restaurant information
  const handleSaveRestaurantInfo = async () => {
    setSaving(true);
    try {
      const restaurantFields = [
        'restaurantName',
        'restaurantStreet',
        'restaurantPostalCode',
        'restaurantCity',
        'restaurantPhone',
        'restaurantEmail',
        'openingHours',
      ];

      for (const field of restaurantFields) {
        await saveSetting(field, settings[field as keyof Settings]);
      }

      setSavedMessage('Restaurant-Informationen gespeichert!');
      setTimeout(() => setSavedMessage(''), 2000);
    } catch (error) {
      console.error('Failed to save restaurant info:', error);
    } finally {
      setSaving(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    setPasswordError('');
    setPasswordSuccess('');

    // Validate
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('Bitte füllen Sie alle Felder aus');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError('Das neue Passwort muss mindestens 8 Zeichen lang sein');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Die Passwörter stimmen nicht überein');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/admin/profile/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (response.ok) {
        setPasswordSuccess('Passwort erfolgreich geändert!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setPasswordSuccess(''), 3000);
      } else {
        const data = await response.json();
        setPasswordError(data.error || 'Fehler beim Ändern des Passworts');
      }
    } catch (error) {
      setPasswordError('Fehler beim Ändern des Passworts');
    } finally {
      setSaving(false);
    }
  };

  // Save admin profile
  const handleSaveProfile = async () => {
    if (!adminProfile) return;

    setSaving(true);
    try {
      const response = await fetch('/api/admin/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: adminProfile.firstName,
          lastName: adminProfile.lastName,
          email: adminProfile.email,
        }),
      });

      if (response.ok) {
        setSavedMessage('Profil gespeichert!');
        setTimeout(() => setSavedMessage(''), 2000);
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setSaving(false);
    }
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

      {/* Restaurant Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Store className="h-5 w-5 text-brand-red-600" />
            <div>
              <CardTitle>Restaurant-Informationen</CardTitle>
              <CardDescription>
                Kontaktdaten und Öffnungszeiten Ihres Restaurants
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Restaurant Name */}
          <div className="space-y-2">
            <Label htmlFor="restaurantName">Restaurant-Name</Label>
            <Input
              id="restaurantName"
              value={settings.restaurantName}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, restaurantName: e.target.value }))
              }
              placeholder="Arlecchino Plus"
            />
          </div>

          {/* Address */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="restaurantStreet">
                <MapPin className="h-4 w-4 inline mr-1" />
                Straße & Hausnummer
              </Label>
              <Input
                id="restaurantStreet"
                value={settings.restaurantStreet}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, restaurantStreet: e.target.value }))
                }
                placeholder="Kölner Str. 1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="restaurantPostalCode">PLZ</Label>
              <Input
                id="restaurantPostalCode"
                value={settings.restaurantPostalCode}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, restaurantPostalCode: e.target.value }))
                }
                placeholder="42781"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="restaurantCity">Stadt</Label>
            <Input
              id="restaurantCity"
              value={settings.restaurantCity}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, restaurantCity: e.target.value }))
              }
              placeholder="Haan"
            />
          </div>

          {/* Contact */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="restaurantPhone">
                <Phone className="h-4 w-4 inline mr-1" />
                Telefon
              </Label>
              <Input
                id="restaurantPhone"
                value={settings.restaurantPhone}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, restaurantPhone: e.target.value }))
                }
                placeholder="02129 6663"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="restaurantEmail">
                <Mail className="h-4 w-4 inline mr-1" />
                E-Mail
              </Label>
              <Input
                id="restaurantEmail"
                type="email"
                value={settings.restaurantEmail}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, restaurantEmail: e.target.value }))
                }
                placeholder="info@arlecchino-plus.de"
              />
            </div>
          </div>

          {/* Opening Hours */}
          <div className="space-y-2">
            <Label htmlFor="openingHours">
              <Clock className="h-4 w-4 inline mr-1" />
              Öffnungszeiten
            </Label>
            <Textarea
              id="openingHours"
              value={settings.openingHours}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, openingHours: e.target.value }))
              }
              placeholder="Mo-Fr: 11:00-22:00, Sa-So: 12:00-23:00"
              rows={2}
            />
            <p className="text-xs text-muted-foreground">
              Diese Informationen werden auf der Kontaktseite angezeigt
            </p>
          </div>

          <Button onClick={handleSaveRestaurantInfo} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            Restaurant-Informationen speichern
          </Button>
        </CardContent>
      </Card>

      {/* Admin Profile */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-brand-red-600" />
            <div>
              <CardTitle>Admin-Profil</CardTitle>
              <CardDescription>
                Ihre persönlichen Informationen
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {adminProfile ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Vorname</Label>
                  <Input
                    id="firstName"
                    value={adminProfile.firstName}
                    onChange={(e) =>
                      setAdminProfile((prev) =>
                        prev ? { ...prev, firstName: e.target.value } : prev
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nachname</Label>
                  <Input
                    id="lastName"
                    value={adminProfile.lastName}
                    onChange={(e) =>
                      setAdminProfile((prev) =>
                        prev ? { ...prev, lastName: e.target.value } : prev
                      )
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminEmail">E-Mail</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={adminProfile.email}
                  onChange={(e) =>
                    setAdminProfile((prev) =>
                      prev ? { ...prev, email: e.target.value } : prev
                    )
                  }
                />
              </div>

              <Button onClick={handleSaveProfile} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                Profil speichern
              </Button>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Kein Admin-Profil gefunden. Bitte melden Sie sich an.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Password Change */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-brand-red-600" />
            <div>
              <CardTitle>Passwort ändern</CardTitle>
              <CardDescription>
                Ändern Sie Ihr Login-Passwort
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {passwordError && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <p className="text-sm text-destructive">{passwordError}</p>
            </div>
          )}

          {passwordSuccess && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              <p className="text-sm text-green-600 dark:text-green-400">{passwordSuccess}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="currentPassword">Aktuelles Passwort</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPasswords.current ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))
                }
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((prev) => ({ ...prev, current: !prev.current }))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPasswords.current ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Neues Passwort</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPasswords.new ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))
                }
                placeholder="Mindestens 8 Zeichen"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPasswords.new ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Neues Passwort bestätigen</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPasswords.confirm ? 'text' : 'password'}
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                }
                placeholder="Passwort wiederholen"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button onClick={handlePasswordChange} disabled={saving}>
            <Lock className="h-4 w-4 mr-2" />
            Passwort ändern
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
