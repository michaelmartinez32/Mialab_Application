import Image from 'next/image'

export function ApplicationHeader() {
  return (
    <header className="border-b border-gray-200 bg-[#f7f7f8] shadow-sm">
      <div className="mx-auto flex h-20 max-w-4xl items-center justify-between px-6">
        <div className="flex items-center py-3">
          <Image
            src="/images/mialab-logo-clean.png"
            alt="Mialab"
            width={160}
            height={99}
            className="h-12 w-auto"
            style={{ mixBlendMode: 'multiply' }}
            priority
          />
        </div>
        <div className="text-sm font-semibold tracking-wide text-gray-600">
          Mialab Account Application
        </div>
      </div>
    </header>
  )
}
