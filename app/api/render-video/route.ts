import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({ error: 'Use /api/render-shotstack instead' }, { status: 410 })
}