'use client'

import { useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Upload, FileText, X, AlertCircle } from 'lucide-react'
import type { ApplicationFormData } from '@/lib/form-types'

interface Step6Props {
  formData: ApplicationFormData
  updateFormData: (data: Partial<ApplicationFormData>) => void
  errors: Record<string, string>
}

export function Step6SalesTax({ formData, updateFormData, errors }: Step6Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      updateFormData({
        resaleCertificateFile: file,
        resaleCertificateFileName: file.name,
      })
    }
  }

  const removeFile = () => {
    updateFormData({
      resaleCertificateFile: null,
      resaleCertificateFileName: '',
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Card className="premium-card border-0">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-semibold text-[#b40000]">
          Sales Tax Information (if applicable)
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Sales tax documentation is only required in certain states such as Alabama, New Mexico, Utah, and California. Florida and most other states do not require this for prescription eyewear.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          If this does not apply to your business, you may leave this section blank and our team will follow up if needed.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="text-[#474748]">
            Do you have a resale certificate? <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            value={formData.hasResaleCertificate}
            onValueChange={(value) => updateFormData({ hasResaleCertificate: value })}
            className="space-y-2"
          >
            <div className="flex items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-gray-50">
              <RadioGroupItem value="yes" id="resale-yes" />
              <Label htmlFor="resale-yes" className="cursor-pointer font-normal">
                <span className="font-medium">Yes</span>
                <p className="mt-1 text-sm text-muted-foreground">
                  I have a valid resale certificate to upload
                </p>
              </Label>
            </div>
            <div className="flex items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-gray-50">
              <RadioGroupItem value="no" id="resale-no" />
              <Label htmlFor="resale-no" className="cursor-pointer font-normal">
                <span className="font-medium">No</span>
                <p className="mt-1 text-sm text-muted-foreground">
                  I do not have a resale certificate at this time
                </p>
              </Label>
            </div>
          </RadioGroup>
          {errors.hasResaleCertificate && (
            <p className="text-sm text-red-500">{errors.hasResaleCertificate}</p>
          )}
        </div>

        {formData.hasResaleCertificate === 'yes' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <Label className="text-[#474748]">
              Upload Resale Certificate <span className="text-red-500">*</span>
            </Label>
            
            {!formData.resaleCertificateFileName ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition-colors hover:border-[#6fcbdb] hover:bg-gray-50"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-3 text-sm font-medium text-[#474748]">
                  Click to upload or drag and drop
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  PDF, JPG, or PNG (max 10MB)
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between rounded-lg border bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#6fcbdb]/20">
                    <FileText className="h-5 w-5 text-[#474748]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#474748]">
                      {formData.resaleCertificateFileName}
                    </p>
                    <p className="text-xs text-muted-foreground">Ready to upload</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  className="text-muted-foreground hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            {errors.resaleCertificateFile && (
              <p className="text-sm text-red-500">{errors.resaleCertificateFile}</p>
            )}
          </div>
        )}

        {formData.hasResaleCertificate === 'no' && (
          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <p className="text-sm font-medium text-amber-800">Sales Tax May Apply</p>
              <p className="mt-1 text-sm text-amber-700">
                Sales tax may apply to applicable orders unless a valid resale certificate is provided. You can upload a certificate later through your account settings.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
