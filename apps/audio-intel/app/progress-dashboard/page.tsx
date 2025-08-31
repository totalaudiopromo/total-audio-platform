"use client"
import { AnalyticsDashboard } from "@/components/ui/analytics-dashboard"
import Image from "next/image"

export default function StudioPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <div className="text-center mb-12 pt-8">
        <div className="inline-flex items-center gap-4 mb-6">
          <Image 
            src="/images/total_audio_promo_logo_trans.png" 
            alt="Total Audio Promo Mascot" 
            width={64} 
            height={64}
            className="object-contain filter drop-shadow-lg"
          />
          <div className="text-left">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900">Progress Dashboard</h1>
            <p className="text-lg text-gray-600 font-medium">Audio Intel Analytics & Campaign Management</p>
          </div>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <div className="container mx-auto px-4 pb-12">
        <AnalyticsDashboard />
      </div>
    </div>
  )
}
