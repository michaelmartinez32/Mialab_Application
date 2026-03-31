export function ApplicationHeader() {
  return (
    <header className="border-b border-gray-200 bg-[#f7f7f8] shadow-sm">
      <div className="mx-auto flex h-20 max-w-4xl items-center justify-between px-6">
        <div className="flex items-center py-2 pl-1">
          {/* Plain img — bypasses Next.js Image pipeline, loads directly from /public */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/mialab-logo.png"
            alt="Mialab"
            style={{ height: '50px', width: 'auto' }}
          />
        </div>
        <div className="text-sm font-semibold tracking-wide text-gray-600">
          Mialab Account Application
        </div>
      </div>
    </header>
  )
}
