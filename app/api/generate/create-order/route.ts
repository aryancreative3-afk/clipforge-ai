import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(req: Request) {
  try {
    const { plan, amount } = await req.json()

    const order = await razorpay.orders.create({
      amount: amount * 100, // in paise
      currency: 'INR',
      receipt: `receipt_${plan}_${Date.now()}`,
      notes: { plan }
    })

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error('Razorpay error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}