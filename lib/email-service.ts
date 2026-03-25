import sgMail from '@sendgrid/mail'

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

const MIALAB_FROM_EMAIL = process.env.MIALAB_FROM_EMAIL || 'noreply@mialab.com'
const MIALAB_FROM_NAME = process.env.MIALAB_FROM_NAME || 'Mialab'
const MIALAB_INTERNAL_EMAIL = process.env.MIALAB_INTERNAL_EMAIL || 'newaccounts@mialab.com'

export interface EmailAttachment {
  content: string // Base64 encoded content
  filename: string
  type: string
  disposition?: 'attachment' | 'inline'
}

export interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}

export async function sendEmail(
  to: string,
  subject: string,
  htmlContent: string,
  attachments?: EmailAttachment[]
): Promise<EmailResult> {
  try {
    const msg: sgMail.MailDataRequired = {
      to,
      from: {
        email: MIALAB_FROM_EMAIL,
        name: MIALAB_FROM_NAME,
      },
      subject,
      html: htmlContent,
      attachments: attachments?.map(att => ({
        content: att.content,
        filename: att.filename,
        type: att.type,
        disposition: att.disposition || 'attachment',
      })),
    }

    const response = await sgMail.send(msg)
    const messageId = response[0]?.headers?.['x-message-id'] || 'unknown'

    return {
      success: true,
      messageId,
    }
  } catch (error) {
    console.error('SendGrid email error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown email error',
    }
  }
}

export function getMialabInternalEmail(): string {
  return MIALAB_INTERNAL_EMAIL
}
