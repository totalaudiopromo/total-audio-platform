'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Mail, 
  Users, 
  Target, 
  Zap, 
  Check, 
  Play, 
  ArrowRight, 
  Star, 
  Clock, 
  TrendingUp,
  Crown,
  Sparkles,
  Gift
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function BetaAccessPage() {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [experience, setExperience] = useState('')
  const [howDidYouHear, setHowDidYouHear] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleBetaSignup = async (e: React.FormEvent) => {
    console.log('🚀 Form handler called!')
    e.preventDefault()
    e.stopPropagation()
    
    if (!email || !firstName) {
      alert('Please fill in your email and first name')
      return false
    }
    
    setIsSubmitting(true)
    
    try {
      console.log('📝 Submitting form data:', { email, firstName, lastName })
      
      const response = await fetch('/api/convertkit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          first_name: firstName,
          last_name: lastName,
          form_id: '8440957', // Beta access form
          tags: ['beta_user', 'free_trial', 'lifetime_discount_eligible', 'beta-page-signup'],
          fields: {
            company: company || '',
            role: role || '',
            experience: experience || '',
            how_did_you_hear: howDidYouHear || '',
            signup_page: 'beta-access-page',
            signup_timestamp: new Date().toISOString()
          }
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        console.log('✅ Successfully subscribed to ConvertKit:', result)
        setSubmitted(true)
      } else {
        console.error('❌ ConvertKit API error:', result.error)
        alert(`Signup failed: ${result.error}. Please try again or contact support.`)
      }
    } catch (error) {
      console.error('❌ Network error:', error)
      alert('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
    
    return false
  }

  console.log('Current submitted state:', submitted)
  
  if (submitted) {
    console.log('🎉 Rendering success page because submitted = true')
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="beta-success-card max-w-2xl w-full text-center p-8 border-4 border-green-500 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <div className="beta-success-icon w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <Check className="w-12 h-12 text-white" />
          </div>
          <h1 className="beta-success-title text-4xl font-black text-gray-900 mb-4">
            Welcome to Audio Intel Beta! 🎉
          </h1>
          <p className="beta-success-description text-xl font-bold text-gray-700 mb-6">
            You're in! Check your email for your free beta access details. Try everything for free, then get 50% off forever when you're ready to upgrade.
          </p>
          <div className="beta-success-perks bg-yellow-100 border-4 border-yellow-400 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Crown className="w-6 h-6 text-yellow-600" />
              <h3 className="text-lg font-black text-yellow-800">Beta Founder Perks</h3>
            </div>
            <ul className="text-sm font-bold text-yellow-800 space-y-2">
              <li>✅ Free beta access (no payment required)</li>
              <li>✅ 50% lifetime discount when you upgrade</li>
              <li>✅ Priority feature requests</li>
              <li>✅ Direct access to the founder</li>
              <li>✅ Beta tester badge and recognition</li>
            </ul>
          </div>
          <Button
            size="lg"
            className="beta-success-button bg-blue-600 hover:bg-blue-700 text-white font-black text-lg px-8 py-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            onClick={() => window.location.href = '/demo'}
          >
            Start Using Audio Intel
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="beta-header sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="beta-container container flex h-16 items-center justify-between">
          <Link href="/" className="beta-logo-container flex items-center space-x-4">
            <Image 
              src="/images/total_audio_promo_logo_trans.png" 
              alt="Total Audio Promo Logo" 
              width={40} 
              height={40}
              className=""
            />
            <div className="flex items-center space-x-2">
              <span className="beta-logo-text text-3xl font-black text-gray-900">Audio Intel</span>
              <Badge variant="secondary" className="beta-badge bg-blue-100 text-blue-800 font-bold">Beta</Badge>
            </div>
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link href="/" className="beta-nav-link text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors">
              Back to Home
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="beta-hero container px-4 py-24 mx-auto">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Badge className="beta-exclusive-badge bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-black text-lg px-6 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              EXCLUSIVE BETA ACCESS
            </Badge>
          </div>
          
          <h1 className="beta-hero-title text-6xl md:text-8xl font-black text-gray-900 mb-8 leading-tight">
            Try Audio Intel
            <span className="block text-blue-600">Free Beta</span>
          </h1>
          
          <p className="beta-hero-description text-2xl text-gray-600 mb-6 max-w-3xl mx-auto leading-relaxed font-medium">
            Test Audio Intel completely free. No payment required. 
            <strong> When you love it, get 50% off forever</strong> as a founding beta user.
          </p>
          
          <div className="beta-hero-cta bg-gradient-to-r from-green-500 to-blue-500 p-8 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-12">
            <h3 className="text-3xl font-black text-white mb-4">
              Try Free → Then £9.99/month Forever
            </h3>
            <p className="text-xl font-bold text-white/90 mb-6">
              Test everything free during beta, then lock in 50% lifetime discount (normally £19.99/month).
            </p>
          </div>
        </div>

        {/* Beta Benefits */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="beta-section-title text-4xl font-black text-gray-900 text-center mb-12">
            Why Join as a Beta Founder?
          </h2>
          
          <div className="beta-benefits-grid grid lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="beta-benefit-card bg-white p-8 rounded-2xl border-4 border-yellow-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="beta-benefit-icon-container flex items-center gap-4 mb-6">
                  <div className="beta-benefit-icon w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <Gift className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="beta-benefit-title text-2xl font-black text-gray-900">50% Lifetime Discount</h3>
                    <Badge className="bg-yellow-500 text-white font-black">EXCLUSIVE</Badge>
                  </div>
                </div>
                <p className="beta-benefit-description text-lg font-bold text-gray-700">
                  Try everything free during beta. When you're ready to upgrade, 
                  lock in £9.99/month forever (50% off the £19.99 retail price).
                </p>
              </div>

              <div className="beta-benefit-card bg-white p-8 rounded-2xl border-4 border-blue-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="beta-benefit-icon-container flex items-center gap-4 mb-6">
                  <div className="beta-benefit-icon w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="beta-benefit-title text-2xl font-black text-gray-900">Direct Founder Access</h3>
                    <Badge className="bg-blue-500 text-white font-black">VIP</Badge>
                  </div>
                </div>
                <p className="beta-benefit-description text-lg font-bold text-gray-700">
                  Get direct access to me (the founder) for feature requests, feedback, 
                  and industry insights. Shape the product's future.
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="beta-benefit-card bg-white p-8 rounded-2xl border-4 border-green-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="beta-benefit-icon-container flex items-center gap-4 mb-6">
                  <div className="beta-benefit-icon w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="beta-benefit-title text-2xl font-black text-gray-900">Early Access to Features</h3>
                    <Badge className="bg-green-500 text-white font-black">FIRST</Badge>
                  </div>
                </div>
                <p className="beta-benefit-description text-lg font-bold text-gray-700">
                  Get new features weeks before public release. Help test and refine 
                  tools before they go live to everyone else.
                </p>
              </div>

              <div className="beta-benefit-card bg-white p-8 rounded-2xl border-4 border-purple-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="beta-benefit-icon-container flex items-center gap-4 mb-6">
                  <div className="beta-benefit-icon w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="beta-benefit-title text-2xl font-black text-gray-900">Beta Founder Recognition</h3>
                    <Badge className="bg-purple-500 text-white font-black">LEGACY</Badge>
                  </div>
                </div>
                <p className="beta-benefit-description text-lg font-bold text-gray-700">
                  Get permanent "Founding Beta User" badge in your account and recognition 
                  as someone who helped build Audio Intel.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Signup Form */}
        <div className="max-w-2xl mx-auto">
          <Card className="beta-form-card p-12 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="text-center pb-8">
              <CardTitle className="beta-form-title text-3xl font-black text-gray-900">
                Get Free Beta Access
              </CardTitle>
              <CardDescription className="beta-form-description text-lg font-bold text-gray-600">
                Try Audio Intel completely free, then get 50% off forever when you're ready
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleBetaSignup} className="space-y-6">
                <div className="beta-form-grid grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="beta-form-field">
                    <Label htmlFor="firstName" className="beta-form-label text-lg font-black text-gray-900">
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Phoebe"
                      className="beta-form-input h-12 text-base border-2 border-gray-300 mt-2"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="beta-form-field">
                    <Label htmlFor="lastName" className="beta-form-label text-lg font-black text-gray-900">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Bridgers"
                      className="beta-form-input h-12 text-base border-2 border-gray-300 mt-2"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="beta-form-field">
                  <Label htmlFor="email" className="beta-form-label text-lg font-black text-gray-900">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="theboss@springsteen.com"
                    className="beta-form-input h-12 text-base border-2 border-gray-300 mt-2"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <div className="beta-form-grid grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="beta-form-field">
                    <Label htmlFor="company" className="beta-form-label text-lg font-black text-gray-900">
                      Company/Label
                    </Label>
                    <Input
                      id="company"
                      type="text"
                      placeholder="Rinse FM"
                      className="beta-form-input h-12 text-base border-2 border-gray-300 mt-2"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>
                  <div className="beta-form-field">
                    <Label htmlFor="role" className="beta-form-label text-lg font-black text-gray-900">
                      Role
                    </Label>
                    <Input
                      id="role"
                      type="text"
                      placeholder="Artist, Producer, Label Manager..."
                      className="beta-form-input h-12 text-base border-2 border-gray-300 mt-2"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="beta-form-field">
                  <Label htmlFor="experience" className="beta-form-label text-lg font-black text-gray-900">
                    Experience Level
                  </Label>
                  <select
                    id="experience"
                    className="beta-form-select w-full h-12 text-base border-2 border-gray-300 rounded-md px-3 py-2 bg-white mt-2"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                  >
                    <option value="">Select your experience level</option>
                    <option value="first-release">Working on my first release</option>
                    <option value="few-releases">Released a few tracks/albums</option>
                    <option value="experienced">Experienced with promotion</option>
                    <option value="professional">Industry professional</option>
                  </select>
                </div>
                
                <div className="beta-form-field">
                  <Label htmlFor="howDidYouHear" className="beta-form-label text-lg font-black text-gray-900">
                    How did you hear about Audio Intel?
                  </Label>
                  <select
                    id="howDidYouHear"
                    className="beta-form-select w-full h-12 text-base border-2 border-gray-300 rounded-md px-3 py-2 bg-white mt-2"
                    value={howDidYouHear}
                    onChange={(e) => setHowDidYouHear(e.target.value)}
                  >
                    <option value="">How did you discover us?</option>
                    <option value="chris-told-me">Chris Schofield told me personally</option>
                    <option value="social-media">Social media (Instagram, Twitter, etc.)</option>
                    <option value="google-search">Google search</option>
                    <option value="friend-recommendation">Friend/colleague recommended it</option>
                    <option value="industry-event">Met at industry event/conference</option>
                    <option value="reddit-forum">Reddit or music forum</option>
                    <option value="podcast-interview">Heard Chris on a podcast</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="beta-benefits-list bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                  <h4 className="font-black text-blue-900 mb-3">What You Get:</h4>
                  <ul className="space-y-2 text-sm font-bold text-blue-800">
                    <li>✅ Immediate free access to Audio Intel</li>
                    <li>✅ Test everything during beta (no payment required)</li>
                    <li>✅ 50% lifetime discount when you upgrade (£9.99/month forever)</li>
                    <li>✅ Priority support and direct founder access</li>
                    <li>✅ Early access to new features</li>
                    <li>✅ Founding beta user recognition</li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="beta-submit-button w-full h-16 text-xl font-black bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    'Setting up your free beta access...'
                  ) : (
                    <>
                      <Crown className="w-6 h-6 mr-3" />
                      Get Free Beta Access
                    </>
                  )}
                </Button>

                <p className="text-sm text-gray-600 text-center">
                  By signing up, you agree to our terms and will receive marketing emails. 
                  You can unsubscribe at any time. <strong>No credit card required - completely free beta access.</strong>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Social Proof */}
        <div className="beta-social-proof max-w-4xl mx-auto mt-16 text-center">
          <h3 className="text-2xl font-black text-gray-900 mb-8">
            Built by a Working Radio Promoter
          </h3>
          <p className="text-lg font-bold text-gray-700 mb-8">
            "I built Audio Intel because I needed it myself. After years of spending hours 
            researching contacts for radio campaigns, I automated the process with AI. 
            Now I'm sharing it with fellow music industry professionals."
          </p>
          <div className="beta-founder-info flex items-center justify-center gap-4">
            <Image 
              src="/images/chris-schofield-founder-photo.jpg" 
              alt="Chris Schofield - Founder of Total Audio Promo" 
              width={80} 
              height={80}
              className="beta-founder-photo rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] object-cover aspect-square"
            />
            <div className="beta-founder-details text-left">
              <div className="beta-founder-name font-black text-gray-900">Chris Schofield</div>
              <div className="beta-founder-title font-bold text-gray-600">Founder, Total Audio Promo</div>
            </div>
          </div>
        </div>

        {/* Limited Time Notice */}
        <div className="max-w-2xl mx-auto mt-16">
          <div className="beta-limited-notice bg-gradient-to-r from-red-500 to-orange-500 p-8 rounded-2xl text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-2xl font-black text-white mb-4">
              ⏰ Limited Beta Spots Available
            </h3>
            <p className="text-lg font-bold text-white/90">
              We're accepting a limited number of free beta users to ensure quality support. 
              The 50% lifetime discount is only available for beta testers who decide to upgrade.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}