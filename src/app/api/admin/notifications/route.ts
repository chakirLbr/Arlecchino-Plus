import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Type for AdminNotification from database
interface AdminNotificationRecord {
  id: string;
  type: string;
  referenceId: string;
  title: string;
  message: string;
  link: string;
  read: boolean;
  readAt: Date | null;
  createdAt: Date;
}

// Helper to format time ago
function timeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Gerade eben';
  if (minutes < 60) return `Vor ${minutes} Min`;
  if (hours < 24) return `Vor ${hours} Std`;
  if (days === 1) return 'Gestern';
  return `Vor ${days} Tagen`;
}

// GET - Fetch notifications from database
export async function GET() {
  try {
    // Get notifications from database (last 24 hours)
    const notifications = await db.adminNotification.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    // Transform to response format
    const formattedNotifications = (notifications as AdminNotificationRecord[]).map((notification: AdminNotificationRecord) => ({
      id: notification.id,
      type: notification.type.toLowerCase() as 'order' | 'reservation',
      title: notification.title,
      message: notification.message,
      time: timeAgo(notification.createdAt),
      read: notification.read,
      link: notification.link,
    }));

    // Count unread
    const unreadCount = (notifications as AdminNotificationRecord[]).filter((n: AdminNotificationRecord) => !n.read).length;

    return NextResponse.json({
      notifications: formattedNotifications,
      unreadCount,
    });
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    return NextResponse.json({ notifications: [], unreadCount: 0 });
  }
}

// PATCH - Mark notification(s) as read
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, markAll } = body;

    if (markAll) {
      // Mark all unread notifications as read
      await db.adminNotification.updateMany({
        where: { read: false },
        data: {
          read: true,
          readAt: new Date(),
        },
      });

      return NextResponse.json({ success: true });
    }

    if (id) {
      // Mark single notification as read
      await db.adminNotification.update({
        where: { id },
        data: {
          read: true,
          readAt: new Date(),
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}
