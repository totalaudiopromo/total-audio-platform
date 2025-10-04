import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ArrowLeft, 
  Code, 
  Key, 
  Send, 
  FileText, 
  ExternalLink,
  Mail,
  Check,
  AlertCircle
} from "lucide-react"

export const metadata: Metadata = {
  title: "API Documentation | Audio Intel",
  description: "Integrate Audio Intel's contact enrichment API into your applications. RESTful API for music industry intelligence.",
  alternates: { canonical: 'https://intel.totalaudiopromo.com/api' },
  openGraph: { url: 'https://intel.totalaudiopromo.com/api' }
}

export default function APIPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <img 
                  src="/images/total_audio_promo_logo_trans.png" 
                  alt="Total Audio Promo Logo" 
                  className="w-8 h-8"
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-3xl font-black text-gray-900">Audio Intel</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-bold">API</Badge>
              </div>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2 inline" />
              Back to Home
            </Link>
            <Link href="/documentation" className="text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors">
              <FileText className="w-4 h-4 mr-2 inline" />
              Documentation
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black text-lg px-6 py-3 rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Code className="w-5 h-5 mr-2" />
              API Documentation
            </Badge>
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-black text-gray-900 mb-8">
            Audio Intel API
          </h1>
          
          <p className="text-2xl font-bold text-gray-700 mb-12 max-w-3xl mx-auto">
            Integrate music industry contact enrichment directly into your applications. 
            RESTful API with real-time processing and comprehensive analytics.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg px-8 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all">
              <Key className="w-5 h-5 mr-2" />
              Get API Key
            </Button>
            <Button variant="outline" size="lg" className="font-bold text-lg px-8 py-4 border-2 border-gray-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <FileText className="w-5 h-5 mr-2" />
              View Documentation
            </Button>
          </div>
        </div>
      </section>

      {/* API Features */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-gray-900 text-center mb-16">
            Powerful API Features
          </h2>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="border-4 border-blue-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Send className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-black">Contact Enrichment</CardTitle>
                <CardDescription className="text-lg font-bold">
                  Enrich contact data with music industry intelligence
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="font-bold">Email validation & verification</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="font-bold">Social media profile discovery</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="font-bold">Company & role identification</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="font-bold">Genre & specialization mapping</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-4 border-green-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-black">Batch Processing</CardTitle>
                <CardDescription className="text-lg font-bold">
                  Process hundreds of contacts simultaneously
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="font-bold">Bulk upload via CSV/JSON</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="font-bold">Real-time processing status</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="font-bold">Webhook notifications</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="font-bold">Downloadable results</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-4 border-purple-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-black">Developer-Friendly</CardTitle>
                <CardDescription className="text-lg font-bold">
                  RESTful API with comprehensive documentation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="font-bold">OpenAPI 3.0 specification</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="font-bold">SDK for popular languages</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="font-bold">Sandbox environment</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="font-bold">Rate limiting & monitoring</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Coming Soon Notice */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="border-4 border-yellow-500 bg-gradient-to-br from-yellow-50 to-yellow-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader>
              <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <AlertCircle className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-black text-gray-900">
                API Coming Soon
              </CardTitle>
              <CardDescription className="text-xl font-bold text-gray-700 mt-4">
                We're putting the finishing touches on our API. Get early access and shape the final version.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-white p-6 rounded-xl border-2 border-yellow-200">
                <h3 className="text-2xl font-black text-gray-900 mb-4">Get Early Access</h3>
                <p className="text-lg font-bold text-gray-700 mb-6">
                  Join our API beta program and help us build the perfect developer experience 
                  for music industry applications.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="mailto:api@totalaudiopromo.com?subject=API Early Access Request">
                    <Button size="lg" className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-white font-bold text-lg px-8 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all">
                      <Mail className="w-5 h-5 mr-2" />
                      Request Early Access
                    </Button>
                  </a>
                  <Link href="/beta">
                    <Button variant="outline" size="lg" className="font-bold text-lg px-8 py-4 border-2 border-gray-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      Join Beta Program
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-left">
                <div className="bg-white p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-black text-gray-900 mb-2">Beta Benefits</h4>
                  <ul className="space-y-2 text-sm font-bold text-gray-700">
                    <li>• Free API credits during beta</li>
                    <li>• Priority support channel</li>
                    <li>• Influence API design decisions</li>
                    <li>• Early access to new features</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-black text-gray-900 mb-2">Expected Launch</h4>
                  <ul className="space-y-2 text-sm font-bold text-gray-700">
                    <li>• Public API: Q4 2024</li>
                    <li>• Beta access: Available now</li>
                    <li>• Documentation: Coming soon</li>
                    <li>• SDKs: Following API launch</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}