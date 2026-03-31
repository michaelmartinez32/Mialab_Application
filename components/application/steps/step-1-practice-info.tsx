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

interface Step1Props {
  formData: ApplicationFormData
  updateFormData: (data: Partial<ApplicationFormData>) => void
  errors: Record<string, string>
  lang: Lang
}

export function Step1PracticeInfo({ formData, updateFormData, errors, lang }: Step1Props) {
  const T = translations[lang].step1
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
            <Label htmlFor="practiceName" className="text-[#474748]">
              {T.practiceNameLabel} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="practiceName"
              value={formData.practiceName}
              onChange={(e) => updateFormData({ practiceName: e.target.value })}
              placeholder={T.practiceNamePlaceholder}
              className={errors.practiceName ? 'border-red-500' : ''}
            />
            {errors.practiceName && (
              <p className="text-sm text-red-500">{errors.practiceName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dbaName" className="text-[#474748]">
              {T.dbaNameLabel} <span className="text-muted-foreground">{T.optional}</span>
            </Label>
            <Input
              id="dbaName"
              value={formData.dbaName}
              onChange={(e) => updateFormData({ dbaName: e.target.value })}
              placeholder={T.dbaNamePlaceholder}
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="doctorOwnerName" className="text-[#474748]">
              {T.doctorOwnerLabel} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="doctorOwnerName"
              value={formData.doctorOwnerName}
              onChange={(e) => updateFormData({ doctorOwnerName: e.target.value })}
              placeholder={T.doctorOwnerPlaceholder}
              className={errors.doctorOwnerName ? 'border-red-500' : ''}
            />
            {errors.doctorOwnerName && (
              <p className="text-sm text-red-500">{errors.doctorOwnerName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="primaryContactName" className="text-[#474748]">
              {T.primaryContactLabel} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="primaryContactName"
              value={formData.primaryContactName}
              onChange={(e) => updateFormData({ primaryContactName: e.target.value })}
              placeholder={T.primaryContactPlaceholder}
              className={errors.primaryContactName ? 'border-red-500' : ''}
            />
            {errors.primaryContactName && (
              <p className="text-sm text-red-500">{errors.primaryContactName}</p>
            )}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#474748]">
              {T.emailLabel} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData({ email: e.target.value })}
              placeholder="email@practice.com"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-[#474748]">
              {T.phoneLabel} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => updateFormData({ phone: e.target.value })}
              placeholder="(555) 123-4567"
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="website" className="text-[#474748]">
            {T.websiteLabel} <span className="text-muted-foreground">{T.optional}</span>
          </Label>
          <Input
            id="website"
            type="url"
            value={formData.website}
            onChange={(e) => updateFormData({ website: e.target.value })}
            placeholder={T.websitePlaceholder}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="businessType" className="text-[#474748]">
              {T.businessTypeLabel} <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.businessType}
              onValueChange={(value) => updateFormData({ businessType: value })}
            >
              <SelectTrigger className={errors.businessType ? 'border-red-500' : ''}>
                <SelectValue placeholder={T.businessTypePlaceholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="optometry">{T.businessTypes['optometry']}</SelectItem>
                <SelectItem value="ophthalmology">{T.businessTypes['ophthalmology']}</SelectItem>
                <SelectItem value="optical-store">{T.businessTypes['optical-store']}</SelectItem>
                <SelectItem value="other">{T.businessTypes['other']}</SelectItem>
              </SelectContent>
            </Select>
            {errors.businessType && (
              <p className="text-sm text-red-500">{errors.businessType}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="yearsInBusiness" className="text-[#474748]">
              {T.yearsInBusinessLabel} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="yearsInBusiness"
              type="number"
              min="0"
              value={formData.yearsInBusiness}
              onChange={(e) => updateFormData({ yearsInBusiness: e.target.value })}
              placeholder={T.yearsInBusinessPlaceholder}
              className={errors.yearsInBusiness ? 'border-red-500' : ''}
            />
            {errors.yearsInBusiness && (
              <p className="text-sm text-red-500">{errors.yearsInBusiness}</p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-[#474748]">
            {T.ownerPrincipalLabel} <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            value={formData.isOwnerPrincipal}
            onValueChange={(value) => updateFormData({ isOwnerPrincipal: value })}
            className="space-y-2"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-3 transition-colors hover:bg-gray-50">
              <RadioGroupItem value="yes" id="owner-yes" />
              <Label htmlFor="owner-yes" className="cursor-pointer font-normal">
                {T.ownerPrincipalYes}
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-3 transition-colors hover:bg-gray-50">
              <RadioGroupItem value="no" id="owner-no" />
              <Label htmlFor="owner-no" className="cursor-pointer font-normal">
                {T.ownerPrincipalNo}
              </Label>
            </div>
          </RadioGroup>
          {errors.isOwnerPrincipal && (
            <p className="text-sm text-red-500">{errors.isOwnerPrincipal}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
