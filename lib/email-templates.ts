import type { ApplicationFormData } from './form-types'
import type { Lang } from './translations'

interface CustomerEmailParams {
  primaryContactName: string
  lang?: Lang
}

interface InternalEmailParams {
  applicationId: string
  submissionDate: string
  formData: ApplicationFormData
  signatureType: 'typed' | 'drawn'
  resaleCertificateUploaded: boolean
}

export function generateCustomerConfirmationEmail({ primaryContactName, lang = 'en' }: CustomerEmailParams): string {
  const isEs = lang === 'es'
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Mialab Account Application Has Been Received</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: #b40000; padding: 30px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Mialab</h1>
              <p style="margin: 8px 0 0; color: #ffffff; font-size: 14px; opacity: 0.9;">Wholesale Optical Laboratory</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #474748; font-size: 16px; line-height: 1.6;">
                ${isEs ? `Hola ${primaryContactName},` : `Hello ${primaryContactName},`}
              </p>

              <p style="margin: 0 0 20px; color: #474748; font-size: 16px; line-height: 1.6;">
                ${isEs ? 'Gracias por enviar su solicitud de cuenta con Mialab.' : 'Thank you for submitting your account application with Mialab.'}
              </p>

              <p style="margin: 0 0 20px; color: #474748; font-size: 16px; line-height: 1.6;">
                ${isEs ? 'Hemos recibido su solicitud correctamente y actualmente está en revisión. Nuestro equipo revisará la información proporcionada y se comunicará con usted dentro de las <strong>24 horas hábiles</strong> siguientes para informarle sobre el estado de su cuenta.' : 'We have successfully received your application and it is currently under review. Our team will review the information provided and follow up with you within <strong>24 business hours</strong> regarding the status of your account.'}
              </p>

              <p style="margin: 0 0 20px; color: #474748; font-size: 16px; line-height: 1.6;">
                ${isEs ? 'Para sus registros, una copia de su solicitud completada está adjunta a este correo electrónico.' : 'For your records, a copy of your completed application is attached to this email.'}
              </p>

              <p style="margin: 0 0 30px; color: #474748; font-size: 16px; line-height: 1.6;">
                ${isEs ? 'Si tiene alguna pregunta mientras tanto, no dude en comunicarse con nosotros al <a href="tel:+13053647100" style="color: #b40000; text-decoration: none; font-weight: bold;">305-364-7100</a>.' : 'If you have any questions in the meantime, please feel free to contact us at <a href="tel:+13053647100" style="color: #b40000; text-decoration: none; font-weight: bold;">305-364-7100</a>.'}
              </p>

              <p style="margin: 0 0 8px; color: #474748; font-size: 16px; line-height: 1.6;">
                ${isEs ? 'Gracias por su interés en trabajar con Mialab.' : 'Thank you for your interest in working with Mialab.'}
              </p>

              <p style="margin: 0; color: #474748; font-size: 16px; line-height: 1.6;">
                ${isEs ? 'Atentamente,<br><strong>Equipo de Mialab</strong>' : 'Best regards,<br><strong>Mialab Team</strong>'}
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f8f8; padding: 30px 40px; border-top: 1px solid #eeeeee;">
              <table role="presentation" style="width: 100%;">
                <tr>
                  <td style="text-align: center;">
                    <p style="margin: 0 0 8px; color: #666666; font-size: 14px;">
                      <strong>Mialab</strong>
                    </p>
                    <p style="margin: 0 0 4px; color: #666666; font-size: 13px;">
                      Phone: <a href="tel:+13053647100" style="color: #b40000; text-decoration: none;">305-364-7100</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim()
}

export function generateInternalNotificationEmail({
  applicationId,
  submissionDate,
  formData,
  signatureType,
  resaleCertificateUploaded,
}: InternalEmailParams): string {
  const shippingAddress = formData.shippingSameAsBilling
    ? `${formData.billingAddress1}${formData.billingAddress2 ? ', ' + formData.billingAddress2 : ''}, ${formData.billingCity}, ${formData.billingState} ${formData.billingZip} (Same as Billing)`
    : `${formData.shippingAddress1 || 'N/A'}${formData.shippingAddress2 ? ', ' + formData.shippingAddress2 : ''}, ${formData.shippingCity || ''}, ${formData.shippingState || ''} ${formData.shippingZip || ''}`

  const billingAddress = `${formData.billingAddress1}${formData.billingAddress2 ? ', ' + formData.billingAddress2 : ''}, ${formData.billingCity}, ${formData.billingState} ${formData.billingZip}`

  const formatLabel = (label: string, value: string | boolean | undefined | null): string => {
    const displayValue = typeof value === 'boolean' 
      ? (value ? 'Yes' : 'No') 
      : (value || 'N/A')
    return `
      <tr>
        <td style="padding: 8px 12px; color: #666666; font-size: 13px; width: 200px; vertical-align: top;">${label}</td>
        <td style="padding: 8px 12px; color: #474748; font-size: 13px; vertical-align: top;">${displayValue}</td>
      </tr>
    `
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Mialab Account Application Submitted</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 700px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: #474748; padding: 25px 40px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: bold;">New Account Application Submitted</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 30px 40px;">
              <p style="margin: 0 0 25px; color: #474748; font-size: 15px; line-height: 1.5;">
                A new account application has been submitted and requires review. The signed application PDF is attached.
              </p>
              
              <!-- Application Info Section -->
              <h2 style="margin: 0 0 15px; padding-bottom: 10px; border-bottom: 2px solid #b40000; color: #b40000; font-size: 16px;">Application Information</h2>
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                ${formatLabel('Application ID', applicationId)}
                ${formatLabel('Submission Date', submissionDate)}
              </table>
              
              <!-- Practice Info Section -->
              <h2 style="margin: 0 0 15px; padding-bottom: 10px; border-bottom: 2px solid #b40000; color: #b40000; font-size: 16px;">Practice Information</h2>
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                ${formatLabel('Practice / Business Name', formData.practiceName)}
                ${formatLabel('DBA / Trade Name', formData.dbaName)}
                ${formatLabel('Doctor / Owner Name', formData.doctorOwnerName)}
                ${formatLabel('Primary Contact Name', formData.primaryContactName)}
                ${formatLabel('Email Address', formData.email)}
                ${formatLabel('Phone Number', formData.phone)}
                ${formatLabel('Website', formData.website)}
                ${formatLabel('Type of Business', formData.businessType)}
                ${formatLabel('Years in Business', formData.yearsInBusiness)}
                ${formatLabel('Owner / Principal', formData.isOwnerPrincipal)}
              </table>
              
              <!-- Billing Section -->
              <h2 style="margin: 0 0 15px; padding-bottom: 10px; border-bottom: 2px solid #b40000; color: #b40000; font-size: 16px;">Billing Information</h2>
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                ${formatLabel('Billing Address', billingAddress)}
                ${formatLabel('Accounts Payable Contact', formData.apContactName)}
                ${formatLabel('Accounts Payable Email', formData.apEmail)}
                ${formatLabel('Monthly Statement by Email', formData.monthlyStatementEmailPreference)}
              </table>
              
              <!-- Shipping Section -->
              <h2 style="margin: 0 0 15px; padding-bottom: 10px; border-bottom: 2px solid #b40000; color: #b40000; font-size: 16px;">Shipping Information</h2>
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                ${formatLabel('Shipping Address', shippingAddress)}
              </table>

              ${formData.hasMultipleLocations === 'yes' && formData.additionalLocations?.length ? `
              <!-- Additional Locations Section -->
              <h2 style="margin: 0 0 15px; padding-bottom: 10px; border-bottom: 2px solid #b40000; color: #b40000; font-size: 16px;">Additional Locations (${formData.additionalLocations.length})</h2>
              ${formData.additionalLocations.map((loc, i) => `
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                <tr><td colspan="2" style="padding: 6px 12px; color: #474748; font-size: 13px; font-weight: bold; background-color: #f8f8f8; border-radius: 4px;">Location ${i + 1}</td></tr>
                ${formatLabel('Name', loc.sameBusinessName ? formData.practiceName : (loc.locationName || 'N/A'))}
                ${formatLabel('FEI/EIN', loc.sameEin ? (formData.taxId || 'N/A') : (loc.ein || 'N/A'))}
                ${formatLabel('Address', [loc.address1, loc.address2].filter(Boolean).join(', '))}
                ${formatLabel('City, State, ZIP', [loc.city, loc.state, loc.zip].filter(Boolean).join(', '))}
                ${loc.contactPerson ? formatLabel('Contact Person', loc.contactPerson) : ''}
                ${loc.phone ? formatLabel('Phone', loc.phone) : ''}
                ${loc.email ? formatLabel('Email', loc.email) : ''}
              </table>
              `).join('')}
              ` : ''}

              <!-- Business Details Section -->
              <h2 style="margin: 0 0 15px; padding-bottom: 10px; border-bottom: 2px solid #b40000; color: #b40000; font-size: 16px;">Business Details</h2>
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                ${formatLabel('EIN / Tax ID', formData.taxId)}
                ${formatLabel('Number of Locations', formData.numberOfLocations)}
                ${formatLabel('Estimated Monthly Lab Volume', formData.monthlyLabVolume)}
                ${formatLabel('Weekly Eye Exams', formData.weeklyExams)}
                ${formatLabel('In-House Edging', formData.edgeLensesInHouse)}
              </table>
              
              <!-- Lab Orders Section -->
              <h2 style="margin: 0 0 15px; padding-bottom: 10px; border-bottom: 2px solid #b40000; color: #b40000; font-size: 16px;">Lab Orders</h2>
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                ${formatLabel('Who Manages Lab Orders', formData.labOrdersManager)}
                ${formatLabel('Lab Orders Contact Name', formData.labOrdersContactName)}
                ${formatLabel('Lab Orders Contact Email', formData.labOrdersContactEmail)}
                ${formatLabel('When They Plan to Start', formData.planToBeginSending)}
                ${formatLabel('Reason for Opening Account', formData.mainReason)}
              </table>
              
              <!-- Financial Section -->
              <h2 style="margin: 0 0 15px; padding-bottom: 10px; border-bottom: 2px solid #b40000; color: #b40000; font-size: 16px;">Financial Information</h2>
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                ${formatLabel('Resale Certificate Uploaded', resaleCertificateUploaded ? 'Yes' : 'No')}
                ${formatLabel('Credit Application', formData.applyForCredit)}
                ${formatLabel('Requested Credit Amount', formData.requestedCreditAmount)}
                ${formatLabel('Preferred Payment Method', formData.paymentMethod)}
              </table>
              
              <!-- Signature Section -->
              <h2 style="margin: 0 0 15px; padding-bottom: 10px; border-bottom: 2px solid #b40000; color: #b40000; font-size: 16px;">Signature</h2>
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                ${formatLabel('Signature Completed', 'Yes')}
                ${formatLabel('Signature Type', signatureType === 'typed' ? 'Typed' : 'Drawn')}
                ${formatLabel('Printed Name', formData.printedName)}
                ${formatLabel('Title', formData.title)}
                ${formatLabel('Signature Date', formData.signatureDate)}
              </table>
              
              <div style="margin-top: 30px; padding: 20px; background-color: #f8f8f8; border-radius: 6px; border-left: 4px solid #6fcbdb;">
                <p style="margin: 0; color: #474748; font-size: 14px;">
                  <strong>Attachments:</strong> The signed application PDF is attached to this email.${resaleCertificateUploaded ? ' A resale certificate was also uploaded and is included in the evidence package.' : ''}
                </p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim()
}

export const EMAIL_SUBJECTS = {
  customerConfirmation: 'Your Mialab Account Application Has Been Received',
  customerConfirmationEs: 'Su Solicitud de Cuenta con Mialab Ha Sido Recibida',
  internalNotification: 'New Mialab Account Application Submitted',
}
