import { NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

export async function GET() {
  const apiKey = process.env.SENDGRID_API_KEY
  const mailFrom = process.env.MAIL_FROM || 'cs@mialab.com'
  const mailTo = process.env.MAIL_TO_INTERNAL || 'michael@mialab.com'

  const envCheck = {
    SENDGRID_API_KEY: apiKey ? `set (starts with: ${apiKey.slice(0, 6)}...)` : 'MISSING',
    MAIL_FROM: mailFrom,
    MAIL_TO_INTERNAL: mailTo,
  }

  if (!apiKey) {
    return NextResponse.json({ error: 'SENDGRID_API_KEY is not set', envCheck }, { status: 500 })
  }

  sgMail.setApiKey(apiKey)

  try {
    const response = await sgMail.send({
      to: mailTo,
      from: { email: mailFrom, name: 'Mialab' },
      subject: 'Mialab Production Email Test',
      text: 'This is a production email delivery test. If you received this, SendGrid is working correctly.',
      html: '<p>This is a production email delivery test. If you received this, SendGrid is working correctly.</p>',
    })

    return NextResponse.json({
      success: true,
      envCheck,
      sendgridStatus: response[0]?.statusCode,
      messageId: response[0]?.headers?.['x-message-id'] || 'not returned',
    })
  } catch (error: unknown) {
    let errorBody = null
    let errorStatus = null

    if (error && typeof error === 'object' && 'response' in error) {
      const sgError = error as { response?: { body?: unknown; status?: number } }
      errorBody = sgError.response?.body
      errorStatus = sgError.response?.status
    }

    return NextResponse.json({
      success: false,
      envCheck,
      errorMessage: error instanceof Error ? error.message : String(error),
      sendgridStatus: errorStatus,
      sendgridErrorBody: errorBody,
    }, { status: 500 })
  }
}
