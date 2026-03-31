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
import { translations, type Lang } from '@/lib/translations'

interface ConfirmationPageProps {
  applicationId: string
  submittedAt: string
  email: string
  lang: Lang
}

const stepIcons = [FileSearch, UserCog, Mail, CreditCard, Send]

export function ConfirmationPage({ applicationId, submittedAt, email, lang }: ConfirmationPageProps) {
  const T = translations[lang].confirmation
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
          {T.heading}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          {T.subheading}
        </p>
      </div>

      {/* Application Details Card */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold text-[#b40000]">
            <FileText className="h-5 w-5" />
            {T.detailsTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{T.applicationIdLabel}</p>
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
                <p className="text-sm font-medium text-muted-foreground">{T.submittedLabel}</p>
                <p className="mt-1 text-sm text-[#474748]">{formattedDate}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm font-medium text-muted-foreground">{T.confirmationEmailLabel}</p>
                <p className="mt-1 text-sm text-[#474748]">
                  {T.confirmationEmailSentTo} <strong>{email}</strong>
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <p className="text-sm text-green-800">
              <strong>{T.copyEmailedBody}</strong> {T.reviewTime}
            </p>
          </div>
          <div className="rounded-lg border border-[#6fcbdb]/30 bg-[#6fcbdb]/5 p-4">
            <p className="text-sm text-[#474748]">
              <strong>{T.importantLabel}</strong> {T.importantText}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-[#b40000]">
            {T.whatNextTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {T.nextSteps.map((step, index) => {
              const Icon = stepIcons[index]
              return (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6fcbdb]/20 text-[#474748]">
                      <Icon className="h-5 w-5" />
                    </div>
                    {index < T.nextSteps.length - 1 && (
                      <div className="mt-2 h-full w-px bg-gray-200" />
                    )}
                  </div>
                  <div className="pb-6">
                    <h3 className="font-medium text-[#474748]">
                      {index + 1}. {step.title}
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
            {T.assistanceTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            {T.assistanceDesc}
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
          <a href="/">{T.returnHome}</a>
        </Button>
      </div>
    </div>
  )
}
