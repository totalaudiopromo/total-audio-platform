'use client'

import { useState, useEffect } from "react"
import { trackPageView } from "@/utils/analytics"
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
  // Track page view
  useEffect(() => {
    trackPageView('beta-access', 'Beta Access - Audio Intel');
  }, []);

  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [experience, setExperience] = useState('')
  const [howDidYouHear, setHowDidYouHear] = useState('')
  const [newsletterOptIn, setNewsletterOptIn] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string>('')
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({})

  const handleBetaSignup = async (e: React.FormEvent) => {
    console.log('🚀 Form handler called!')
    e.preventDefault()
    e.stopPropagation()
    
    // Reset errors
    setError('')
    setFieldErrors({})
    
    // Validate required fields
    const errors: {[key: string]: string} = {}
    if (!email) errors.email = 'Email is required'
    if (!firstName) errors.firstName = 'First name is required'
    
    // Email format validation
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address'
    }
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
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
          tags: newsletterOptIn 
            ? ['beta_user', 'free_trial', 'lifetime_discount_eligible', 'beta-page-signup', 'newsletter_unsigned_advantage']
            : ['beta_user', 'free_trial', 'lifetime_discount_eligible', 'beta-page-signup'],
          fields: {
            company: company || '',
            role: role || '',
            experience: experience || '',
            how_did_you_hear: howDidYouHear || '',
            signup_page: 'beta-access-page',
            signup_timestamp: new Date().toISOString(),
            newsletter_opt_in: newsletterOptIn
          }
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        console.log('✅ Successfully subscribed to ConvertKit:', result)
        setSubmitted(true)
      } else {
        console.error('❌ ConvertKit API error:', result.error)
        setError(`Signup failed: ${result.error}. Please try again or contact support.`)
      }
    } catch (error) {
      console.error('❌ Network error:', error)
      setError('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
    
    return false
  }

  console.log('Current submitted state:', submitted)
  
  if (submitted) {
    console.log('🎉 Rendering success page because submitted = true')
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="beta-success-card max-w-2xl w-full text-center p-8 border-4 border-green-500 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <div className="beta-success-icon w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <Check className="w-12 h-12 text-white" />
          </div>
          <h1 className="beta-success-title text-4xl font-black text-gray-900 mb-4">
            Welcome to Audio Intel Beta! 🎉
          </h1>
          <p className="beta-success-description text-xl font-bold text-gray-700 mb-6">
            You're in! Check your email for your free beta access details. Try everything for free, then get 50% off your first year when you're ready to upgrade.
          </p>
          <div className="beta-success-perks bg-yellow-100 border-4 border-yellow-400 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Crown className="w-6 h-6 text-yellow-600" />
              <h3 className="text-lg font-black text-yellow-800">Beta Founder Perks</h3>
            </div>
            <ul className="text-sm font-bold text-yellow-800 space-y-2">
              <li>✅ Free beta access (no payment required)</li>
              <li>✅ 50% discount on first year when you upgrade</li>
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
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
      {/* Hero Section */}
      <section className="glass-panel px-6 py-16 sm:px-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Badge className="beta-exclusive-badge bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-black text-lg px-6 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              EXCLUSIVE BETA ACCESS
            </Badge>
          </div>
          
          {/* Enlarged logo for beta page */}
          <div className="mb-12">
            <Image 
              src="/images/total_audio_promo_logo_trans.png" 
              alt="Total Audio Promo - Music Industry Intelligence" 
              width={180} 
              height={180}
              className="mx-auto mb-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-xl bg-white p-3"
            />
          </div>
          
          <h1 className="beta-hero-title text-6xl md:text-8xl font-black text-gray-900 mb-8 leading-tight">
            Try Audio Intel
            <span className="block text-blue-600">Free Beta</span>
          </h1>

          <p className="beta-hero-description text-2xl text-blue-600 mb-4 max-w-3xl mx-auto leading-relaxed font-bold">
            AI-powered contact research tool that turns email addresses into detailed music industry profiles
          </p>
          
          <p className="beta-hero-description text-xl text-gray-600 mb-6 max-w-3xl mx-auto leading-relaxed font-medium">
            Test Audio Intel completely free. No payment required.
            <strong> When you love it, get 50% off your first year</strong> as a founding beta user.
          </p>
          
          <div className="beta-hero-cta bg-gradient-to-r from-green-500 to-blue-500 p-8 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-12">
            <h3 className="text-3xl font-black text-white mb-4">
              Try Free → Then £9.99/month
            </h3>
            <p className="text-xl font-bold text-white/90 mb-6">
              Test everything free during beta, then £9.99/month for your first year (50% off). After that, £19.99/month.
            </p>
          </div>
        </div>

      </section>

      {/* What You'll Be Testing */}
      <section className="glass-panel px-6 py-12 sm:px-10">
        <h2 className="text-3xl font-bold text-center mb-8 sm:text-4xl">
          What You'll Be Testing
        </h2>

        <div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-8 h-8 text-blue-600" />
                  <h3 className="text-2xl font-black text-gray-900">Core Features</h3>
                </div>
                <ul className="space-y-3 text-lg font-bold text-gray-700">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span>AI contact enrichment from email addresses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span>Submission guidelines & contact preferences</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span>Spreadsheet upload & bulk processing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span>Export enriched data to CSV/Excel</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-8 h-8 text-blue-600" />
                  <h3 className="text-2xl font-black text-gray-900">Beta Access Includes</h3>
                </div>
                <ul className="space-y-3 text-lg font-bold text-gray-700">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span>Full platform access during beta</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span>Unlimited contact enrichment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span>Direct feedback channel to founder</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span>Priority support & feature requests</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
              <p className="text-lg font-bold text-blue-800 text-center">
                <strong>Perfect for:</strong> Radio promoters, playlist curators, music bloggers, label managers, and independent artists who spend hours researching industry contacts
              </p>
            </div>
          </div>
      </section>

      {/* Beta Benefits */}
      <section className="glass-panel px-6 py-12 sm:px-10">
        <h2 className="text-3xl font-bold text-center mb-8 sm:text-4xl">
          Why Join as a Beta Founder?
        </h2>
          
          <div className="beta-benefits-grid grid lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="glass-panel border-yellow-500">
                <div className="beta-benefit-icon-container flex items-center gap-4 mb-6">
                  <Image 
                    src="/assets/loading-states/success-complete.png"
                    alt="Success - 50% lifetime discount exclusive offer"
                    width={80}
                    height={80}
                    className=""
                  />
                  <div>
                    <h3 className="beta-benefit-title text-2xl font-black text-gray-900">50% Off First Year</h3>
                    <Badge className="bg-yellow-500 text-white font-black">EXCLUSIVE</Badge>
                  </div>
                </div>
                <p className="beta-benefit-description text-lg font-bold text-gray-700">
                  Try everything free during beta. When you're ready to upgrade to Professional,
                  get 50% off your first year (just £9.99/month for 12 months, then £19.99/month).
                </p>
              </div>

              <div className="glass-panel border-blue-500">
                <div className="beta-benefit-icon-container flex items-center gap-4 mb-6">
                  <Image 
                    src="/assets/loading-states/vinyl-throw-action.png"
                    alt="Direct founder access - personalized support"
                    width={80}
                    height={80}
                    className=""
                  />
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
              <div className="glass-panel border-green-500">
                <div className="beta-benefit-icon-container flex items-center gap-4 mb-6">
                  <Image 
                    src="/assets/loading-states/analyzing-data.png"
                    alt="Early access to features - first to test new tools"
                    width={80}
                    height={80}
                    className=""
                  />
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

              <div className="glass-panel border-blue-500">
                <div className="beta-benefit-icon-container flex items-center gap-4 mb-6">
                  <Image 
                    src="/assets/loading-states/intelligence-complete.png"
                    alt="Beta founder recognition - legacy status"
                    width={80}
                    height={80}
                    className=""
                  />
                  <div>
                    <h3 className="beta-benefit-title text-2xl font-black text-gray-900">Beta Founder Recognition</h3>
                    <Badge className="bg-blue-500 text-white font-black">LEGACY</Badge>
                  </div>
                </div>
                <p className="beta-benefit-description text-lg font-bold text-gray-700">
                  Get permanent "Founding Beta User" badge in your account and recognition 
                  as someone who helped build Audio Intel.
                </p>
              </div>
            </div>
          </div>
      </section>

      {/* Signup Form */}
      <section className="glass-panel px-6 py-12 sm:px-10">
        <div className="max-w-2xl mx-auto">
          <Card className="beta-form-card p-8 sm:p-12 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="text-center pb-8">
              {/* Processing/organizing PNG for signup form */}
              <div className="mb-6">
                <Image 
                  src="/assets/loading-states/processing-organizing.png"
                  alt="Processing and organising your beta access - getting everything ready"
                  width={120}
                  height={120}
                  className="mx-auto"
                />
              </div>
              <CardTitle className="beta-form-title text-3xl font-black text-gray-900">
                Get Free Beta Access
              </CardTitle>
              <CardDescription className="beta-form-description text-lg font-bold text-gray-600">
                Try Audio Intel completely free, then get 50% off your first year when you're ready
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
                      className={`beta-form-input h-12 text-base border-2 mt-2 ${fieldErrors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                    {fieldErrors.firstName && (
                      <p className="text-red-600 text-sm font-bold mt-1">{fieldErrors.firstName}</p>
                    )}
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
                    className={`beta-form-input h-12 text-base border-2 mt-2 ${fieldErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {fieldErrors.email && (
                    <p className="text-red-600 text-sm font-bold mt-1">{fieldErrors.email}</p>
                  )}
                </div>
                
                <div className="beta-newsletter-field bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="newsletter"
                      className="mt-1 h-4 w-4 text-blue-600 border-2 border-gray-300 rounded"
                      checked={newsletterOptIn}
                      onChange={(e) => setNewsletterOptIn(e.target.checked)}
                    />
                    <div className="flex-1">
                      <Label htmlFor="newsletter" className="text-sm font-black text-yellow-900 cursor-pointer">
                        Weekly Newsletter: The Unsigned Advantage
                      </Label>
                      <p className="text-xs font-bold text-yellow-800 mt-1">
                        Get insider tips for indie artists juggling day jobs and £50 budgets. Unsubscribe anytime.
                      </p>
                    </div>
                  </div>
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
                    <li>✅ 50% discount on first year when you upgrade (£9.99/month for 12 months)</li>
                    <li>✅ Priority support and direct founder access</li>
                    <li>✅ Early access to new features</li>
                    <li>✅ Founding beta user recognition</li>
                  </ul>
                </div>

                {error && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-bold">!</span>
                      </div>
                      <p className="text-red-700 font-bold">{error}</p>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="beta-submit-button w-full h-16 text-xl font-black bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all"
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
      </section>

      {/* Social Proof */}
      <section className="glass-panel px-6 py-10 sm:px-10">
        <div className="max-w-4xl mx-auto text-center">
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
      </section>

      {/* Limited Time Notice */}
      <section className="glass-panel border-red-500 bg-gradient-to-r from-red-50 to-orange-50 px-6 py-10 sm:px-10">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            ⏰ Limited Beta Spots Available
          </h3>
          <p className="text-lg text-gray-700">
            We're accepting a limited number of free beta users to ensure quality support.
            The 50% lifetime discount is only available for beta testers who decide to upgrade.
          </p>
        </div>
      </section>
    </div>
  )
}