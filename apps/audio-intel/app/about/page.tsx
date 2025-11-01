'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Music,
  Users,
  Target,
  Zap,
  Globe,
  Award,
  Heart,
  Shield,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Mail,
  ExternalLink,
  Headphones,
  Radio,
  Instagram,
  MessageCircle,
  CheckCircle,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black text-gray-900 mb-4">About Audio Intel</h1>
          <p className="text-2xl font-bold text-gray-700 mb-4">
            Revolutionizing Music Industry Contact Intelligence
          </p>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We're on a mission to democratize access to music industry intelligence, making powerful
            contact research and enrichment tools available to independent artists and small
            agencies.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <Card className="p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-black text-gray-900 mb-6">Our Mission</h2>
                <p className="text-xl text-gray-700 mb-6">
                  The music industry has always been about connections, but the tools to build those
                  connections have been expensive, complex, and out of reach for most artists.
                </p>
                <p className="text-lg text-gray-600 mb-8">
                  Audio Intel changes that. We believe every artist deserves access to the same
                  intelligence tools that major labels use, but at a price and complexity level that
                  works for independent musicians.
                </p>
                <div className="flex gap-4">
                  <Link href="/beta">
                    <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold">
                      <Sparkles className="w-5 h-5 mr-2" />
                      Try Audio Intel Free
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="border-2 border-gray-300 hover:bg-gray-50 font-bold"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Contact Us
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg text-center">
                  <Users className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <div className="text-2xl font-black text-gray-900">10,000+</div>
                  <div className="text-sm text-gray-600">Artists Served</div>
                </div>
                <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg text-center">
                  <Target className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <div className="text-2xl font-black text-gray-900">500K+</div>
                  <div className="text-sm text-gray-600">Contacts Enriched</div>
                </div>
                <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg text-center">
                  <Zap className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <div className="text-2xl font-black text-gray-900">95%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
                <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg text-center">
                  <Globe className="w-12 h-12 text-orange-600 mx-auto mb-3" />
                  <div className="text-2xl font-black text-gray-900">50+</div>
                  <div className="text-sm text-gray-600">Countries</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-700">The principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center">
              <Heart className="w-16 h-16 text-red-500 mx-auto mb-6" />
              <h3 className="text-2xl font-black text-gray-900 mb-4">Artist-First</h3>
              <p className="text-gray-600">
                Every decision we make starts with the question: "How does this help independent
                artists succeed?" We're not building tools for labels - we're building tools for the
                artists who are changing music.
              </p>
            </Card>
            <Card className="p-8 text-center">
              <Shield className="w-16 h-16 text-blue-500 mx-auto mb-6" />
              <h3 className="text-2xl font-black text-gray-900 mb-4">Transparency</h3>
              <p className="text-gray-600">
                No hidden fees, no complex pricing, no surprises. We believe in honest,
                straightforward relationships with our users. What you see is what you get.
              </p>
            </Card>
            <Card className="p-8 text-center">
              <TrendingUp className="w-16 h-16 text-green-500 mx-auto mb-6" />
              <h3 className="text-2xl font-black text-gray-900 mb-4">Innovation</h3>
              <p className="text-gray-600">
                We're constantly pushing the boundaries of what's possible with AI and music
                industry intelligence. The tools we build today are just the beginning.
              </p>
            </Card>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <Card className="p-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-gray-900 mb-4">
                Powered by Total Audio Promo
              </h2>
              <p className="text-xl text-gray-700">
                Audio Intel is built by the team behind Total Audio Promo, a company with deep roots
                in the music industry
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-black text-gray-900 mb-6">Our Story</h3>
                <p className="text-lg text-gray-700 mb-4">
                  Total Audio Promo was founded by music industry veterans who saw the same problems
                  affecting independent artists year after year: lack of access to quality contacts,
                  expensive tools, and complex processes.
                </p>
                <p className="text-lg text-gray-700 mb-6">
                  We started by building better radio promotion tools, but quickly realised that the
                  real problem was bigger - artists needed better intelligence about who to contact
                  and how to reach them effectively.
                </p>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="border-2 border-gray-300 hover:bg-gray-50 font-bold"
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Visit Total Audio Promo
                  </Button>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900 mb-6">Our Expertise</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="font-bold text-gray-900">15+ Years in Music Industry</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="font-bold text-gray-900">
                      AI & Machine Learning Specialists
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="font-bold text-gray-900">Music Technology Experts</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="font-bold text-gray-900">Independent Artist Advocates</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="font-bold text-gray-900">Data Science & Analytics</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Technology Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Cutting-Edge Technology</h2>
            <p className="text-xl text-gray-700">
              Built with the latest AI and machine learning technologies
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition-all bg-gradient-to-br from-blue-50 to-blue-100">
              <Zap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">AI-Powered Research</h3>
              <p className="text-sm text-gray-600">
                Advanced AI models analyse contact data and provide intelligent insights
              </p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-all bg-gradient-to-br from-green-50 to-green-100">
              <Globe className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Multi-Platform Search</h3>
              <p className="text-sm text-gray-600">
                Search across Reddit, Instagram, Spotify, Discord, and more
              </p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-all bg-gradient-to-br from-blue-50 to-blue-100">
              <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Real-Time Analytics</h3>
              <p className="text-sm text-gray-600">
                Live data processing and analytics for immediate insights
              </p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-all bg-gradient-to-br from-orange-50 to-orange-100">
              <Shield className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Enterprise Security</h3>
              <p className="text-sm text-gray-600">
                Bank-level security and data protection for your contacts
              </p>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mb-16">
          <Card className="p-12 text-center bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <h2 className="text-4xl font-black mb-6">Ready to Transform Your Music Career?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of artists who are already using Audio Intel to build better
              connections and grow their careers in the music industry.
            </p>
            <div className="flex gap-4 justify-center">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 font-bold text-lg px-8 py-4">
                <Sparkles className="w-6 h-6 mr-2" />
                Start Free Trial
              </Button>
              <Button
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold text-lg px-8 py-4"
              >
                <Mail className="w-6 h-6 mr-2" />
                Contact Sales
              </Button>
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">Have questions? We'd love to hear from you</p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" className="border-2 border-gray-300 hover:bg-gray-50">
              <Mail className="w-4 h-4 mr-2" />
              info@totalaudiopromo.com
            </Button>
            <Button variant="outline" className="border-2 border-gray-300 hover:bg-gray-50">
              <ExternalLink className="w-4 h-4 mr-2" />
              Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
