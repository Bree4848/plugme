export default function AboutPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
      {/* Changed max-w-md to max-w-3xl on desktop (md:max-w-3xl) 
          but kept it narrow on mobile (w-full).
      */}
      <div className="w-full max-w-md md:max-w-3xl rounded-xl bg-white p-8 md:p-12 shadow-sm border">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          About Us
        </h1>
        
        <div className="mt-6 space-y-6 text-base md:text-lg text-gray-600 leading-relaxed">
          <p>
            <strong className="text-gray-900 font-semibold">PlugMe</strong> is a local business discovery platform designed
            to help people find trusted services and businesses near them.
          </p>

          <p>
            Our mission is simple: make it easier for businesses to be discovered
            and for customers to connect with reliable services.
          </p>

          <p>
            Whether you’re a small business owner looking to grow or a customer
            searching for quality services, PlugMe is built to connect you.
          </p>
        </div>
        
        <div className="mt-10 pt-8 border-t text-center">
          <p className="text-sm text-gray-400 italic">
            Connecting communities, one business at a time.
          </p>
        </div>
      </div>
    </div>
  )
}