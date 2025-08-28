'use client'

import { TextureOverlay, TextureBackground, TextureCard } from "@/components/ui/texture-overlay"

export default function TextureTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <h1 className="text-4xl font-black text-gray-900 text-center mb-12">
          Texture System Test
        </h1>

        {/* Texture Overlay Test */}
        <section className="space-y-6">
          <h2 className="text-2xl font-black text-gray-900">Texture Overlay Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TextureOverlay textureType="paper" textureVariant={1} blendMode="overlay" opacity={0.15}>
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h3 className="text-xl font-black mb-4">Paper Texture</h3>
                <p className="text-gray-700">This should have a paper texture overlay.</p>
              </div>
            </TextureOverlay>

            <TextureOverlay textureType="grain" textureVariant={1} blendMode="multiply" opacity={0.1}>
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h3 className="text-xl font-black mb-4">Grain Texture</h3>
                <p className="text-gray-700">This should have a grain texture overlay.</p>
              </div>
            </TextureOverlay>

            <TextureOverlay textureType="luma" textureVariant={1} blendMode="soft-light" opacity={0.12}>
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h3 className="text-xl font-black mb-4">Luma Texture</h3>
                <p className="text-gray-700">This should have a luma texture overlay.</p>
              </div>
            </TextureOverlay>
          </div>
        </section>

        {/* Texture Background Test */}
        <section className="space-y-6">
          <h2 className="text-2xl font-black text-gray-900">Texture Background Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextureBackground textureType="paper" textureVariant={2} blendMode="overlay" opacity={0.08}>
              <div className="p-8">
                <h3 className="text-xl font-black mb-4">Paper Background</h3>
                <p className="text-gray-700">This should have a paper texture background.</p>
              </div>
            </TextureBackground>

            <TextureBackground textureType="grain" textureVariant={2} blendMode="multiply" opacity={0.05}>
              <div className="p-8">
                <h3 className="text-xl font-black mb-4">Grain Background</h3>
                <p className="text-gray-700">This should have a grain texture background.</p>
              </div>
            </TextureBackground>
          </div>
        </section>

        {/* Texture Card Test */}
        <section className="space-y-6">
          <h2 className="text-2xl font-black text-gray-900">Texture Card Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TextureCard textureType="paper" textureVariant={3} rotation={-1} floating={true}>
              <div className="p-6">
                <h3 className="text-xl font-black mb-4">Paper Card</h3>
                <p className="text-gray-700">This should have a paper texture with floating animation.</p>
              </div>
            </TextureCard>

            <TextureCard textureType="grain" textureVariant={3} rotation={1} entrance={true}>
              <div className="p-6">
                <h3 className="text-xl font-black mb-4">Grain Card</h3>
                <p className="text-gray-700">This should have a grain texture with entrance animation.</p>
              </div>
            </TextureCard>

            <TextureCard textureType="luma" textureVariant={3} rotation={0} floating={true}>
              <div className="p-6">
                <h3 className="text-xl font-black mb-4">Luma Card</h3>
                <p className="text-gray-700">This should have a luma texture with floating animation.</p>
              </div>
            </TextureCard>
          </div>
        </section>

        {/* CSS-only Texture Test */}
        <section className="space-y-6">
          <h2 className="text-2xl font-black text-gray-900">CSS-only Texture Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-xl shadow-lg texture-paper-css">
              <h3 className="text-xl font-black mb-4">CSS Paper</h3>
              <p className="text-gray-700">This uses CSS-only paper texture.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg texture-grain-css">
              <h3 className="text-xl font-black mb-4">CSS Grain</h3>
              <p className="text-gray-700">This uses CSS-only grain texture.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg texture-luma-css">
              <h3 className="text-xl font-black mb-4">CSS Luma</h3>
              <p className="text-gray-700">This uses CSS-only luma texture.</p>
            </div>
          </div>
        </section>

        {/* PostCraft Style Test */}
        <section className="space-y-6">
          <h2 className="text-2xl font-black text-gray-900">PostCraft Style Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="postcraft-container postcraft-shadow-soft p-8 rounded-xl">
              <h3 className="text-xl font-black mb-4">Soft Shadow</h3>
              <p className="text-gray-700">This uses PostCraft soft shadow style.</p>
            </div>

            <div className="postcraft-container postcraft-shadow-elevated p-8 rounded-xl">
              <h3 className="text-xl font-black mb-4">Elevated Shadow</h3>
              <p className="text-gray-700">This uses PostCraft elevated shadow style.</p>
            </div>

            <div className="postcraft-container postcraft-shadow-floating p-8 rounded-xl">
              <h3 className="text-xl font-black mb-4">Floating Shadow</h3>
              <p className="text-gray-700">This uses PostCraft floating shadow style.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
} 