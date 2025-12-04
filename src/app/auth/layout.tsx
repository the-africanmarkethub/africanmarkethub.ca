import Image from 'next/image'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src="/icon/auth.svg"
          alt="African Market Hub"
          fill
          className="object-cover"
          priority
        />
      </div>
      
      {/* Right side - Auth forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <Image
              src="/icon/logo.svg"
              alt="African Market Hub"
              width={200}
              height={67}
              className="mx-auto mb-8"
            />
          </div>
          
          {children}
        </div>
      </div>
    </div>
  )
}