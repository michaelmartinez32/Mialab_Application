import { Shield, Smartphone, Clock } from 'lucide-react'

export function TrustIndicators() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-[#6fcbdb]" />
        <span>Secure Application</span>
      </div>
      <div className="flex items-center gap-2">
        <Smartphone className="h-4 w-4 text-[#6fcbdb]" />
        <span>Mobile Friendly</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-[#6fcbdb]" />
        <span>Takes about 5 minutes</span>
      </div>
    </div>
  )
}
