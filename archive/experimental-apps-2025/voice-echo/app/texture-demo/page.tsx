'use client';

import React from 'react';
import { TextureCard, TexturePricingCard, TextureFeatureCard } from '@/components/ui/texture-card';
import {
  TextureButton,
  TextureGradientButton,
  TextureButtonGroup,
} from '@/components/ui/texture-button';
import {
  TextureSection,
  TextureHeroSection,
  TexturePricingSection,
  TextureFeaturesSection,
  TextureContainer,
  TextureGrid,
} from '@/components/ui/texture-section';

export default function TextureDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <TextureHeroSection texture="paper" opacity="08">
        <TextureContainer maxWidth="2xl">
          <div className="text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold gradient-text">Texture Demo</h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              Explore the comprehensive texture system for Audio Intel
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <TextureGradientButton size="xl" texture="grain" animation="pulse">
                Get Started
              </TextureGradientButton>
              <TextureButton variant="outline" size="xl" texture="paper-2">
                Learn More
              </TextureButton>
            </div>
          </div>
        </TextureContainer>
      </TextureHeroSection>

      {/* Basic Texture Cards */}
      <TextureSection texture="grain" opacity="05" padding="xl">
        <TextureContainer maxWidth="xl">
          <h2 className="text-3xl font-bold text-center mb-12 gradient-text">
            Basic Texture Cards
          </h2>
          <TextureGrid cols={3} gap="lg">
            <TextureCard texture="paper" animation="entrance" rotation="1">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">Paper Texture</h3>
                <p className="text-gray-600">Classic paper texture with subtle rotation</p>
              </div>
            </TextureCard>

            <TextureCard texture="grain" animation="entrance" rotation="-1" delay="200">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">Grain Texture</h3>
                <p className="text-gray-600">Fine grain texture for tactile feel</p>
              </div>
            </TextureCard>

            <TextureCard texture="luma" animation="entrance" rotation="0.5" delay="400">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">Luma Gradient</h3>
                <p className="text-gray-600">Soft gradient overlay for depth</p>
              </div>
            </TextureCard>
          </TextureGrid>
        </TextureContainer>
      </TextureSection>

      {/* Pricing Cards */}
      <TexturePricingSection texture="grain" opacity="05">
        <TextureContainer maxWidth="xl">
          <h2 className="text-3xl font-bold text-center mb-12 gradient-text">
            Pricing Cards with Staggered Animation
          </h2>
          <TextureGrid cols={3} gap="lg">
            <TexturePricingCard tier="basic" delay="100">
              <div className="text-center space-y-6">
                <h3 className="text-2xl font-bold">Starter</h3>
                <div className="text-4xl font-bold gradient-text">
                  $9
                  <span className="text-lg text-gray-500">/month</span>
                </div>
                <ul className="space-y-3">
                  <li className="text-gray-600">✓ Basic analytics</li>
                  <li className="text-gray-600">✓ 5 campaigns</li>
                  <li className="text-gray-600">✓ Email support</li>
                </ul>
                <TextureButton variant="primary" texture="grain" fullWidth>
                  Choose Plan
                </TextureButton>
              </div>
            </TexturePricingCard>

            <TexturePricingCard tier="pro" delay="200">
              <div className="text-center space-y-6">
                <h3 className="text-2xl font-bold">Professional</h3>
                <div className="text-4xl font-bold gradient-text">
                  $29
                  <span className="text-lg text-gray-500">/month</span>
                </div>
                <ul className="space-y-3">
                  <li className="text-gray-600">✓ Advanced analytics</li>
                  <li className="text-gray-600">✓ Unlimited campaigns</li>
                  <li className="text-gray-600">✓ Priority support</li>
                </ul>
                <TextureButton variant="primary" texture="grain" fullWidth>
                  Choose Plan
                </TextureButton>
              </div>
            </TexturePricingCard>

            <TexturePricingCard tier="enterprise" delay="300">
              <div className="text-center space-y-6">
                <h3 className="text-2xl font-bold">Enterprise</h3>
                <div className="text-4xl font-bold gradient-text">
                  $99
                  <span className="text-lg text-gray-500">/month</span>
                </div>
                <ul className="space-y-3">
                  <li className="text-gray-600">✓ Custom integrations</li>
                  <li className="text-gray-600">✓ Dedicated support</li>
                  <li className="text-gray-600">✓ White-label options</li>
                </ul>
                <TextureButton variant="primary" texture="grain" fullWidth>
                  Choose Plan
                </TextureButton>
              </div>
            </TexturePricingCard>
          </TextureGrid>
        </TextureContainer>
      </TexturePricingSection>

      {/* Feature Cards */}
      <TextureFeaturesSection texture="paper-2" opacity="03">
        <TextureContainer maxWidth="xl">
          <h2 className="text-3xl font-bold text-center mb-12 gradient-text">
            Feature Cards with Organic Feel
          </h2>
          <TextureGrid cols={3} gap="lg">
            <TextureFeatureCard index={0}>
              <div className="text-center space-y-4">
                <div className="text-4xl">📊</div>
                <h3 className="text-xl font-semibold">AI-Powered Analytics</h3>
                <p className="text-gray-600">
                  Get deep insights into your audience and campaign performance
                </p>
              </div>
            </TextureFeatureCard>

            <TextureFeatureCard index={1}>
              <div className="text-center space-y-4">
                <div className="text-4xl">🤖</div>
                <h3 className="text-xl font-semibold">Automated Campaigns</h3>
                <p className="text-gray-600">
                  Set up and run campaigns automatically with smart optimization
                </p>
              </div>
            </TextureFeatureCard>

            <TextureFeatureCard index={2}>
              <div className="text-center space-y-4">
                <div className="text-4xl">🔗</div>
                <h3 className="text-xl font-semibold">Multi-Platform Integration</h3>
                <p className="text-gray-600">
                  Connect all your social media and streaming platforms
                </p>
              </div>
            </TextureFeatureCard>

            <TextureFeatureCard index={3}>
              <div className="text-center space-y-4">
                <div className="text-4xl">📱</div>
                <h3 className="text-xl font-semibold">Real-time Monitoring</h3>
                <p className="text-gray-600">
                  Track your campaigns and audience engagement in real-time
                </p>
              </div>
            </TextureFeatureCard>

            <TextureFeatureCard index={4}>
              <div className="text-center space-y-4">
                <div className="text-4xl">📈</div>
                <h3 className="text-xl font-semibold">Custom Reporting</h3>
                <p className="text-gray-600">Generate detailed reports tailored to your needs</p>
              </div>
            </TextureFeatureCard>

            <TextureFeatureCard index={5}>
              <div className="text-center space-y-4">
                <div className="text-4xl">🎵</div>
                <h3 className="text-xl font-semibold">Expert Support</h3>
                <p className="text-gray-600">
                  Get help from music industry experts when you need it
                </p>
              </div>
            </TextureFeatureCard>
          </TextureGrid>
        </TextureContainer>
      </TextureFeaturesSection>

      {/* Button Showcase */}
      <TextureSection texture="luma" opacity="05" padding="xl">
        <TextureContainer maxWidth="xl">
          <h2 className="text-3xl font-bold text-center mb-12 gradient-text">
            Texture Button Variants
          </h2>
          <div className="space-y-8">
            {/* Primary Buttons */}
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">Primary Buttons</h3>
              <div className="flex flex-wrap gap-4 justify-center">
                <TextureButton variant="primary" texture="grain" size="md">
                  Get Started
                </TextureButton>
                <TextureButton variant="primary" texture="paper" size="lg" animation="pulse">
                  Learn More
                </TextureButton>
                <TextureButton variant="primary" texture="luma" size="xl" animation="wave">
                  Upgrade Now
                </TextureButton>
              </div>
            </div>

            {/* Gradient Buttons */}
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">Gradient Buttons</h3>
              <div className="flex flex-wrap gap-4 justify-center">
                <TextureGradientButton texture="grain" size="md">
                  Start Trial
                </TextureGradientButton>
                <TextureGradientButton texture="paper" size="lg" animation="shimmer">
                  View Demo
                </TextureGradientButton>
                <TextureGradientButton texture="luma" size="xl" animation="breathe">
                  Contact Sales
                </TextureGradientButton>
              </div>
            </div>

            {/* Button Groups */}
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold">Button Groups</h3>
              <div className="flex flex-col sm:flex-row gap-8 justify-center">
                <TextureButtonGroup>
                  <TextureButton variant="outline" texture="grain">
                    Previous
                  </TextureButton>
                  <TextureButton variant="primary" texture="grain">
                    Next
                  </TextureButton>
                </TextureButtonGroup>

                <TextureButtonGroup vertical>
                  <TextureButton variant="outline" texture="paper">
                    Option 1
                  </TextureButton>
                  <TextureButton variant="outline" texture="paper">
                    Option 2
                  </TextureButton>
                  <TextureButton variant="outline" texture="paper">
                    Option 3
                  </TextureButton>
                </TextureButtonGroup>
              </div>
            </div>
          </div>
        </TextureContainer>
      </TextureSection>

      {/* Animation Showcase */}
      <TextureSection texture="paper" opacity="03" padding="xl">
        <TextureContainer maxWidth="xl">
          <h2 className="text-3xl font-bold text-center mb-12 gradient-text">Animation Showcase</h2>
          <TextureGrid cols={4} gap="lg">
            <TextureCard texture="grain" animation="float">
              <div className="p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">Float</h3>
                <p className="text-sm text-gray-600">Gentle floating motion</p>
              </div>
            </TextureCard>

            <TextureCard texture="paper" animation="pulse">
              <div className="p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">Pulse</h3>
                <p className="text-sm text-gray-600">Breathing effect</p>
              </div>
            </TextureCard>

            <TextureCard texture="luma" animation="wave">
              <div className="p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">Wave</h3>
                <p className="text-sm text-gray-600">Wave-like motion</p>
              </div>
            </TextureCard>

            <TextureCard texture="grain-2" animation="breathe">
              <div className="p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">Breathe</h3>
                <p className="text-sm text-gray-600">Slow breathing effect</p>
              </div>
            </TextureCard>
          </TextureGrid>
        </TextureContainer>
      </TextureSection>

      {/* Footer */}
      <TextureSection variant="footer" texture="paper" opacity="03" padding="lg">
        <TextureContainer maxWidth="xl">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold gradient-text">Ready to Get Started?</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Transform your music promotion with Audio Intel's comprehensive texture system and
              AI-powered tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <TextureGradientButton size="lg" texture="grain" animation="pulse">
                Start Free Trial
              </TextureGradientButton>
              <TextureButton variant="outline" size="lg" texture="paper">
                Schedule Demo
              </TextureButton>
            </div>
          </div>
        </TextureContainer>
      </TextureSection>
    </div>
  );
}
