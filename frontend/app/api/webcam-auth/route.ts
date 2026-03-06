import {cookies} from 'next/headers'
import {NextResponse} from 'next/server'
import crypto from 'crypto'

const COOKIE_NAME = 'webcam_auth'
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60 // 30 days

function hashPassword(password: string): string {
  return crypto.createHmac('sha256', 'houndaround-webcam').update(password).digest('hex')
}

export async function GET() {
  const password = process.env.WEBCAM_PASSWORD
  if (!password) {
    return NextResponse.json({authenticated: true})
  }

  const cookieStore = await cookies()
  const cookie = cookieStore.get(COOKIE_NAME)
  const expectedHash = hashPassword(password)
  const authenticated = cookie?.value === expectedHash

  return NextResponse.json({authenticated})
}

export async function POST(request: Request) {
  const password = process.env.WEBCAM_PASSWORD
  if (!password) {
    return NextResponse.json({success: true, authenticated: true})
  }

  const body = await request.json()
  const submitted = body.password as string

  if (!submitted || submitted !== password) {
    return NextResponse.json({success: false, error: 'Invalid password'}, {status: 401})
  }

  const hash = hashPassword(password)
  const response = NextResponse.json({success: true, authenticated: true})
  response.cookies.set(COOKIE_NAME, hash, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  })

  return response
}
