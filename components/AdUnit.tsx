'use client'
import { useEffect } from 'react'

export default function AdUnit() {
  useEffect(() => {
    try {
      // Trigger the ad load once the component mounts
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
    } catch (err) {
      console.error('AdSense error:', err)
    }
  }, [])

  return (
    <div className="my-6 flex justify-center w-full overflow-hidden">
      {/* Replace data-ad-client and data-ad-slot with your actual IDs */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-3150303085572679" 
        data-ad-slot="5263056924"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}