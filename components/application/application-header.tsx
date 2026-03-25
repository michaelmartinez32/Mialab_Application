import Image from 'next/image'

export function ApplicationHeader() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
        <div className="flex items-center">
          <Image
            src="/images/mialab-logo.png"
            alt="Mia Lab"
            width={120}
            height={48}
            className="h-10 w-auto"
            priority
          />
        </div>
        <div className="text-sm text-muted-foreground">
          Account Application
        </div>
      </div>
    </header>
  )
}
