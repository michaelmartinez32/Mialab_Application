'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type { ApplicationFormData } from '@/lib/form-types'
import { translations, type Lang } from '@/lib/translations'

interface Step4Props {
  formData: ApplicationFormData
  updateFormData: (data: Partial<ApplicationFormData>) => void
  errors: Record<string, string>
  lang: Lang
}

export function Step4BusinessDetails({ formData, updateFormData, errors, lang }: Step4Props) {
  const T = translations[lang].step4
  return (
    <Card className="premium-card border-0">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-semibold text-[#b40000]">
          {T.title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {T.subtitle}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="taxId" className="text-[#474748]">
              {T.taxIdLabel} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="taxId"
              value={formData.taxId}
              onChange={(e) => updateFormData({ taxId: e.target.value })}
              placeholder={T.taxIdPlaceholder}
              className={errors.taxId ? 'border-red-500' : ''}
            />
            {errors.taxId && (
              <p className="text-sm text-red-500">{errors.taxId}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="numberOfLocations" className="text-[#474748]">
              {T.numLocationsLabel} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="numberOfLocations"
              type="number"
              min="1"
              value={formData.numberOfLocations}
              onChange={(e) => updateFormData({ numberOfLocations: e.target.value })}
              placeholder="1"
              className={errors.numberOfLocations ? 'border-red-500' : ''}
            />
            {errors.numberOfLocations && (
              <p className="text-sm text-red-500">{errors.numberOfLocations}</p>
            )}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="monthlyLabVolume" className="text-[#474748]">
              {T.monthlyLabVolumeLabel} <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.monthlyLabVolume}
              onValueChange={(value) => updateFormData({ monthlyLabVolume: value })}
            >
              <SelectTrigger className={errors.monthlyLabVolume ? 'border-red-500' : ''}>
                <SelectValue placeholder={T.monthlyLabVolumePlaceholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-2000">{T.monthlyLabVolumeOptions['under-2000']}</SelectItem>
                <SelectItem value="2000-5000">{T.monthlyLabVolumeOptions['2000-5000']}</SelectItem>
                <SelectItem value="5000-10000">{T.monthlyLabVolumeOptions['5000-10000']}</SelectItem>
                <SelectItem value="10000-plus">{T.monthlyLabVolumeOptions['10000-plus']}</SelectItem>
              </SelectContent>
            </Select>
            {errors.monthlyLabVolume && (
              <p className="text-sm text-red-500">{errors.monthlyLabVolume}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="weeklyExams" className="text-[#474748]">
              {T.weeklyExamsLabel} <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.weeklyExams}
              onValueChange={(value) => updateFormData({ weeklyExams: value })}
            >
              <SelectTrigger className={errors.weeklyExams ? 'border-red-500' : ''}>
                <SelectValue placeholder={T.weeklyExamsPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-20">{T.weeklyExamsOptions['under-20']}</SelectItem>
                <SelectItem value="20-40">{T.weeklyExamsOptions['20-40']}</SelectItem>
                <SelectItem value="40-60">{T.weeklyExamsOptions['40-60']}</SelectItem>
                <SelectItem value="60-80">{T.weeklyExamsOptions['60-80']}</SelectItem>
                <SelectItem value="80-plus">{T.weeklyExamsOptions['80-plus']}</SelectItem>
              </SelectContent>
            </Select>
            {errors.weeklyExams && (
              <p className="text-sm text-red-500">{errors.weeklyExams}</p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-[#474748]">
            {T.edgeLensesLabel} <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            value={formData.edgeLensesInHouse}
            onValueChange={(value) => updateFormData({ edgeLensesInHouse: value })}
            className="flex flex-wrap gap-3"
          >
            {T.edgeLensesOptions.map((option, idx) => (
              <div
                key={T.edgeLensesValues[idx]}
                className="flex items-center space-x-2 rounded-lg border px-4 py-2 transition-colors hover:bg-gray-50"
              >
                <RadioGroupItem value={T.edgeLensesValues[idx]} id={`edge-${T.edgeLensesValues[idx]}`} />
                <Label htmlFor={`edge-${T.edgeLensesValues[idx]}`} className="cursor-pointer font-normal">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
          {errors.edgeLensesInHouse && (
            <p className="text-sm text-red-500">{errors.edgeLensesInHouse}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="labOrdersManager" className="text-[#474748]">
            {T.labOrdersManagerLabel} <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.labOrdersManager}
            onValueChange={(value) => updateFormData({ labOrdersManager: value })}
          >
            <SelectTrigger className={errors.labOrdersManager ? 'border-red-500' : ''}>
              <SelectValue placeholder={T.labOrdersManagerPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="doctor-owner">{T.labOrdersManagerOptions['doctor-owner']}</SelectItem>
              <SelectItem value="office-manager">{T.labOrdersManagerOptions['office-manager']}</SelectItem>
              <SelectItem value="optician">{T.labOrdersManagerOptions['optician']}</SelectItem>
              <SelectItem value="optical-manager">{T.labOrdersManagerOptions['optical-manager']}</SelectItem>
              <SelectItem value="multiple-staff">{T.labOrdersManagerOptions['multiple-staff']}</SelectItem>
              <SelectItem value="other">{T.labOrdersManagerOptions['other']}</SelectItem>
            </SelectContent>
          </Select>
          {errors.labOrdersManager && (
            <p className="text-sm text-red-500">{errors.labOrdersManager}</p>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="labOrdersContactName" className="text-[#474748]">
              {T.labContactNameLabel} <span className="text-muted-foreground">{T.optional}</span>
            </Label>
            <Input
              id="labOrdersContactName"
              value={formData.labOrdersContactName}
              onChange={(e) => updateFormData({ labOrdersContactName: e.target.value })}
              placeholder={T.labContactNamePlaceholder}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="labOrdersContactEmail" className="text-[#474748]">
              {T.labContactEmailLabel} <span className="text-muted-foreground">{T.optional}</span>
            </Label>
            <Input
              id="labOrdersContactEmail"
              type="email"
              value={formData.labOrdersContactEmail}
              onChange={(e) => updateFormData({ labOrdersContactEmail: e.target.value })}
              placeholder={T.labContactEmailPlaceholder}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="planToBeginSending" className="text-[#474748]">
            {T.planToBeginLabel} <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.planToBeginSending}
            onValueChange={(value) => updateFormData({ planToBeginSending: value })}
          >
            <SelectTrigger className={errors.planToBeginSending ? 'border-red-500' : ''}>
              <SelectValue placeholder={T.planToBeginPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediately">{T.planToBeginOptions['immediately']}</SelectItem>
              <SelectItem value="within-30-days">{T.planToBeginOptions['within-30-days']}</SelectItem>
              <SelectItem value="within-60-90-days">{T.planToBeginOptions['within-60-90-days']}</SelectItem>
              <SelectItem value="exploring">{T.planToBeginOptions['exploring']}</SelectItem>
            </SelectContent>
          </Select>
          {errors.planToBeginSending && (
            <p className="text-sm text-red-500">{errors.planToBeginSending}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="mainReason" className="text-[#474748]">
            {T.mainReasonLabel} <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.mainReason}
            onValueChange={(value) => updateFormData({ mainReason: value })}
          >
            <SelectTrigger className={errors.mainReason ? 'border-red-500' : ''}>
              <SelectValue placeholder={T.mainReasonPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="turnaround-times">{T.mainReasonOptions['turnaround-times']}</SelectItem>
              <SelectItem value="pricing">{T.mainReasonOptions['pricing']}</SelectItem>
              <SelectItem value="quality">{T.mainReasonOptions['quality']}</SelectItem>
              <SelectItem value="expanding-options">{T.mainReasonOptions['expanding-options']}</SelectItem>
              <SelectItem value="referral">{T.mainReasonOptions['referral']}</SelectItem>
              <SelectItem value="other">{T.mainReasonOptions['other']}</SelectItem>
            </SelectContent>
          </Select>
          {errors.mainReason && (
            <p className="text-sm text-red-500">{errors.mainReason}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
