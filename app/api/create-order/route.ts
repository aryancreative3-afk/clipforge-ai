import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { plan, amount } = await req.json()

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    if (!keyId || !keySecret) {
      return NextResponse.json({ error: 'Payment not configured' }, { status: 500 })
    }

    const Razorpay = require('razorpay')
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret })

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: `receipt_${plan}_${Date.now()}`,
      notes: { plan }
    })

    return NextResponse.json({ success: true, order })

  } catch (error: any) {
    console.error('Razorpay error:', error?.message || error)
    return NextResponse.json({ error: error?.message || 'Failed' }, { status: 500 })
  }
}