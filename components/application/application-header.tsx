import Image from 'next/image'

export function ApplicationHeader() {
  return (
    <header className="border-b border-gray-200 bg-[#f7f7f8] shadow-sm">
      <div className="mx-auto flex h-20 max-w-4xl items-center justify-between px-6">
        <div className="flex items-center py-2 pl-1">
          <Image
            src="/images/mialab_logo_full_optimized.png"
            alt="Mialab"
            width={500}
            height={278}
            className="h-14 w-auto"
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
