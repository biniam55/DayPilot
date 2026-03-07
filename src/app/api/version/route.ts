import { NextResponse } from 'next/server';

const APP_VERSION = '1.0.4'; // Keep this in sync with useVersionCheck.ts
const BUILD_TIME = new Date().toISOString();

export async function GET() {
  return NextResponse.json({
    version: APP_VERSION,
    buildTime: BUILD_TIME,
    status: 'ok'
  });
}
