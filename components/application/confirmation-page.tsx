import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  CheckCircle2, 
  FileSearch, 
  UserCog, 
  Mail, 
  CreditCard, 
  Send,
  Phone,
  AtSign,
  FileText,
  Copy,
  Check
} from 'lucide-react'
import { useState } from 'react'

interface ConfirmationPageProps {
  applicationId: string
  submittedAt: string
  email: string
}

const steps = [
  {
    number: 1,
    title: 'Application Review',
    description: 'Our team reviews your application and credit request.',
    icon: FileSearch,
  },
  {
    number: 2,
    title: 'Account Setup',
    description: 'Once approved, we will create your Mialab account.',
    icon: UserCog,
  },
  {
    number: 3,
    title: 'Login Credentials Sent',
    description: 'You will receive an email containing your account number, username, and login instructions so your practice can begin placing orders.',
    icon: Mail,
  },
  {
    number: 4,
    title: 'Payment Setup',
    description: 'If you selected a card on file option, you will receive a secure payment link.',
    icon: CreditCard,
  },
  {
    number: 5,
    title: 'Start Sending Jobs',
    description: 'Once your credentials are received, you can begin submitting orders to Mialab.',
    icon: Send,
  },
]

export function ConfirmationPage({ applicationId, submittedAt, email }: ConfirmationPageProps) {
  const [copied, setCopied] = useState(false)

  const copyApplicationId = async () => {
    await navigator.clipboard.writeText(applicationId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formattedDate = new Date(submittedAt).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-12">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-[#474748]">
          Thank You for Applying with Mialab
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Your account application has been successfully submitted.
        </p>
      </div>

      {/* Application Details Card */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold text-[#b40000]">
            <FileText className="h-5 w-5" />
            Application Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Application ID</p>
                <div className="mt-1 flex items-center gap-2">
                  <code className="rounded bg-white px-2 py-1 font-mono text-sm text-[#474748]">
                    {applicationId.slice(0, 8)}...
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyApplicationId}
                    className="h-7 w-7 p-0"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Submitted</p>
                <p className="mt-1 text-sm text-[#474748]">{formattedDate}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm font-medium text-muted-foreground">Confirmation Email</p>
                <p className="mt-1 text-sm text-[#474748]">
                  A confirmation email has been sent to <strong>{email}</strong>
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <p className="text-sm text-green-800">
              <strong>A copy of your completed application has been emailed to you for your records.</strong> Our team will review your application and respond within 24 business hours.
            </p>
          </div>
          <div className="rounded-lg border border-[#6fcbdb]/30 bg-[#6fcbdb]/5 p-4">
            <p className="text-sm text-[#474748]">
              <strong>Important:</strong> Please save your Application ID for your records. 
              Your signed application PDF and all submitted documents have been securely stored 
              and cannot be modified. If you need to make changes, you will need to submit a 
              new amendment request.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-[#b40000]">
            What Happens Next
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={step.number} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6fcbdb]/20 text-[#474748]">
                      <Icon className="h-5 w-5" />
                    </div>
                    {index < steps.length - 1 && (
                      <div className="mt-2 h-full w-px bg-gray-200" />
                    )}
                  </div>
                  <div className="pb-6">
                    <h3 className="font-medium text-[#474748]">
                      {step.number}. {step.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-[#474748]">
            Need Assistance?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Our team is here to help if you have any questions about your application or need support.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="outline" className="gap-2" asChild>
              <a href="mailto:support@mialab.com">
                <AtSign className="h-4 w-4" />
                support@mialab.com
              </a>
            </Button>
            <Button variant="outline" className="gap-2" asChild>
              <a href="tel:+13053647100">
                <Phone className="h-4 w-4" />
                (305) 364-7100
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button
          asChild
          className="bg-[#b40000] text-white hover:bg-[#8f0000]"
        >
          <a href="/">Return to Home</a>
        </Button>
      </div>
    </div>
  )
}
