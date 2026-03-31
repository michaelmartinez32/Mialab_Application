import { Shield, Smartphone, Clock } from 'lucide-react'
import { translations, type Lang } from '@/lib/translations'

interface TrustIndicatorsProps {
  lang: Lang
}

export function TrustIndicators({ lang }: TrustIndicatorsProps) {
  const T = translations[lang].trust
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-[#6fcbdb]" />
        <span>{T.secure}</span>
      </div>
      <div className="flex items-center gap-2">
        <Smartphone className="h-4 w-4 text-[#6fcbdb]" />
        <span>{T.mobile}</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-[#6fcbdb]" />
        <span>{T.time}</span>
      </div>
    </div>
  )
}
