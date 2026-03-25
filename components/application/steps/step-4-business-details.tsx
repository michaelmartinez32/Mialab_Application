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

interface Step4Props {
  formData: ApplicationFormData
  updateFormData: (data: Partial<ApplicationFormData>) => void
  errors: Record<string, string>
}

export function Step4BusinessDetails({ formData, updateFormData, errors }: Step4Props) {
  return (
    <Card className="premium-card border-0">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-semibold text-[#b40000]">
          Business Details
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Help us understand your practice better so we can serve you effectively.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="taxId" className="text-[#474748]">
              Federal EIN / Tax ID <span className="text-red-500">*</span>
            </Label>
            <Input
              id="taxId"
              value={formData.taxId}
              onChange={(e) => updateFormData({ taxId: e.target.value })}
              placeholder="XX-XXXXXXX"
              className={errors.taxId ? 'border-red-500' : ''}
            />
            {errors.taxId && (
              <p className="text-sm text-red-500">{errors.taxId}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="numberOfLocations" className="text-[#474748]">
              Number of Locations <span className="text-red-500">*</span>
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
              Estimated Monthly Lab Volume <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.monthlyLabVolume}
              onValueChange={(value) => updateFormData({ monthlyLabVolume: value })}
            >
              <SelectTrigger className={errors.monthlyLabVolume ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select estimated volume" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-2000">Under $2,000</SelectItem>
                <SelectItem value="2000-5000">$2,000 - $5,000</SelectItem>
                <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                <SelectItem value="10000-plus">$10,000+</SelectItem>
              </SelectContent>
            </Select>
            {errors.monthlyLabVolume && (
              <p className="text-sm text-red-500">{errors.monthlyLabVolume}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="weeklyExams" className="text-[#474748]">
              Weekly Eye Exams <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.weeklyExams}
              onValueChange={(value) => updateFormData({ weeklyExams: value })}
            >
              <SelectTrigger className={errors.weeklyExams ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select exam volume" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-20">Under 20</SelectItem>
                <SelectItem value="20-40">20-40</SelectItem>
                <SelectItem value="40-60">40-60</SelectItem>
                <SelectItem value="60-80">60-80</SelectItem>
                <SelectItem value="80-plus">80+</SelectItem>
              </SelectContent>
            </Select>
            {errors.weeklyExams && (
              <p className="text-sm text-red-500">{errors.weeklyExams}</p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-[#474748]">
            Does your practice edge lenses in-house? <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            value={formData.edgeLensesInHouse}
            onValueChange={(value) => updateFormData({ edgeLensesInHouse: value })}
            className="flex flex-wrap gap-3"
          >
            {['Yes', 'No', 'Sometimes'].map((option) => (
              <div
                key={option}
                className="flex items-center space-x-2 rounded-lg border px-4 py-2 transition-colors hover:bg-gray-50"
              >
                <RadioGroupItem value={option.toLowerCase()} id={`edge-${option.toLowerCase()}`} />
                <Label htmlFor={`edge-${option.toLowerCase()}`} className="cursor-pointer font-normal">
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
            Who currently manages lab orders at your practice? <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.labOrdersManager}
            onValueChange={(value) => updateFormData({ labOrdersManager: value })}
          >
            <SelectTrigger className={errors.labOrdersManager ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select who manages lab orders" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="doctor-owner">Doctor / Owner</SelectItem>
              <SelectItem value="office-manager">Office Manager</SelectItem>
              <SelectItem value="optician">Optician</SelectItem>
              <SelectItem value="optical-manager">Optical Manager</SelectItem>
              <SelectItem value="multiple-staff">Multiple Staff Members</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.labOrdersManager && (
            <p className="text-sm text-red-500">{errors.labOrdersManager}</p>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="labOrdersContactName" className="text-[#474748]">
              Lab Orders Contact Name <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="labOrdersContactName"
              value={formData.labOrdersContactName}
              onChange={(e) => updateFormData({ labOrdersContactName: e.target.value })}
              placeholder="Contact name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="labOrdersContactEmail" className="text-[#474748]">
              Lab Orders Contact Email <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="labOrdersContactEmail"
              type="email"
              value={formData.labOrdersContactEmail}
              onChange={(e) => updateFormData({ labOrdersContactEmail: e.target.value })}
              placeholder="laborders@practice.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="planToBeginSending" className="text-[#474748]">
            When do you plan to begin sending jobs to Mialab? <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.planToBeginSending}
            onValueChange={(value) => updateFormData({ planToBeginSending: value })}
          >
            <SelectTrigger className={errors.planToBeginSending ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select timeline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediately">Immediately</SelectItem>
              <SelectItem value="within-30-days">Within 30 days</SelectItem>
              <SelectItem value="within-60-90-days">Within 60-90 days</SelectItem>
              <SelectItem value="exploring">Just exploring options</SelectItem>
            </SelectContent>
          </Select>
          {errors.planToBeginSending && (
            <p className="text-sm text-red-500">{errors.planToBeginSending}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="mainReason" className="text-[#474748]">
            What is the main reason you are opening a Mialab account? <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.mainReason}
            onValueChange={(value) => updateFormData({ mainReason: value })}
          >
            <SelectTrigger className={errors.mainReason ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select primary reason" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="turnaround-times">Better turnaround times</SelectItem>
              <SelectItem value="pricing">Better pricing</SelectItem>
              <SelectItem value="quality">Higher quality lenses</SelectItem>
              <SelectItem value="expanding-options">Expanding lab options</SelectItem>
              <SelectItem value="referral">Referred by another doctor</SelectItem>
              <SelectItem value="other">Other</SelectItem>
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
