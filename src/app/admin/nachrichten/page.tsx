'use client';

import { useState, useEffect } from 'react';
import { Mail, MailOpen, Trash2, RefreshCw, Search, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function NachrichtenPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/messages');
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markAsRead = async (id: string, isRead: boolean) => {
    try {
      await fetch('/api/admin/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isRead }),
      });
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isRead } : m))
      );
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, isRead });
      }
    } catch (error) {
      console.error('Failed to update message:', error);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Nachricht wirklich löschen?')) return;

    try {
      await fetch(`/api/admin/messages?id=${id}`, {
        method: 'DELETE',
      });
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredMessages = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Nachrichten</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0
              ? `${unreadCount} ungelesene Nachricht${unreadCount > 1 ? 'en' : ''}`
              : 'Keine ungelesenen Nachrichten'}
          </p>
        </div>
        <Button onClick={fetchMessages} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Aktualisieren
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Nachrichten durchsuchen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Message List */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">
                Laden...
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="p-8 text-center">
                <Mail className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery ? 'Keine Nachrichten gefunden' : 'Keine Nachrichten vorhanden'}
                </p>
              </div>
            ) : (
              <div className="divide-y max-h-[600px] overflow-y-auto">
                {filteredMessages.map((message) => (
                  <button
                    key={message.id}
                    onClick={() => {
                      setSelectedMessage(message);
                      if (!message.isRead) {
                        markAsRead(message.id, true);
                      }
                    }}
                    className={cn(
                      'w-full text-left p-4 hover:bg-muted transition-colors',
                      selectedMessage?.id === message.id && 'bg-muted',
                      !message.isRead && 'bg-primary/5'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {message.isRead ? (
                          <MailOpen className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <Mail className="h-5 w-5 text-brand-red-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={cn('font-medium truncate', !message.isRead && 'font-semibold')}>
                            {message.name}
                          </p>
                          {!message.isRead && (
                            <Badge variant="default" className="shrink-0">
                              Neu
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {message.email}
                        </p>
                        {message.subject && (
                          <p className="text-sm font-medium truncate mt-1">
                            {message.subject}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {message.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Message Detail */}
        <Card>
          <CardContent className="p-6">
            {selectedMessage ? (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">{selectedMessage.name}</h2>
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="text-sm text-brand-red-600 hover:underline"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => markAsRead(selectedMessage.id, !selectedMessage.isRead)}
                      title={selectedMessage.isRead ? 'Als ungelesen markieren' : 'Als gelesen markieren'}
                    >
                      {selectedMessage.isRead ? (
                        <Mail className="h-4 w-4" />
                      ) : (
                        <MailOpen className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => deleteMessage(selectedMessage.id)}
                      className="text-destructive hover:text-destructive"
                      title="Löschen"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Subject */}
                {selectedMessage.subject && (
                  <div>
                    <p className="text-sm text-muted-foreground">Betreff</p>
                    <p className="font-medium">{selectedMessage.subject}</p>
                  </div>
                )}

                {/* Date */}
                <div>
                  <p className="text-sm text-muted-foreground">Empfangen am</p>
                  <p>{formatDate(selectedMessage.createdAt)}</p>
                </div>

                {/* Message */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Nachricht</p>
                  <div className="bg-muted rounded-lg p-4">
                    <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>

                {/* Reply Button */}
                <Button asChild className="w-full">
                  <a href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Ihre Anfrage'}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    Antworten
                  </a>
                </Button>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-center py-12">
                <div>
                  <Mail className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground">
                    Wählen Sie eine Nachricht aus, um sie zu lesen
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
