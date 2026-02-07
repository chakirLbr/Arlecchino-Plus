import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch all contact messages
export async function GET() {
  try {
    const messages = await db.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// PATCH - Mark message as read/unread
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, isRead } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      );
    }

    const message = await db.contactMessage.update({
      where: { id },
      data: { isRead },
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Failed to update message:', error);
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a message
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      );
    }

    await db.contactMessage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete message:', error);
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    );
  }
}
