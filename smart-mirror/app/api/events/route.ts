import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const { date } = await req.json();
    if (!date) {
      return NextResponse.json({ error: 'Missing date' }, { status: 400 });
    }

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setHours(23, 59, 59, 999);
    
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: session.accessToken });

    
    const calendar = google.calendar({
      version: 'v3',
      auth: oauth2Client,
    });

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });
    console.log("Fetched Events:", response.data.items);
    return NextResponse.json(response.data.items || []);
  } catch (err) {
    console.error('Google Calendar error:', err);
    return NextResponse.json({ error: 'Failed to fetch calendar events' }, { status: 500 });
  }
}