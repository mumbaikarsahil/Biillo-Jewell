'use client'

import { useEffect, useRef } from 'react'
import { BrowserMultiFormatReader } from '@zxing/library'

interface ScannerCameraProps {
  onScan: (barcode: string) => void
}

export default function ScannerCamera({ onScan }: ScannerCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    let isMounted = true
    const codeReader = new BrowserMultiFormatReader()

    codeReader.decodeFromVideoDevice(
      null,
      videoRef.current,
      (result, err) => {
        if (result && isMounted) {
          onScan(result.getText())
        }
      }
    )

    return () => {
      isMounted = false
      codeReader.reset()
    }
  }, [onScan])

  return (
    <div className="w-full">
      <video ref={videoRef} className="w-full rounded-xl" />
    </div>
  )
}
