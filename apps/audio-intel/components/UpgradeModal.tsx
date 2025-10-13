'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Zap, Check, X } from 'lucide-react'
import Link from 'next/link'

interface UpgradeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reason: 'limit_reached' | 'near_limit'
  enrichmentsUsed: number
  enrichmentsLimit: number
}

export function UpgradeModal({ open, onOpenChange, reason, enrichmentsUsed, enrichmentsLimit }: UpgradeModalProps) {
  const isAtLimit = reason === 'limit_reached'
  const remaining = enrichmentsLimit - enrichmentsUsed

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            {isAtLimit ? (
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <X className="h-6 w-6 text-red-600" />
              </div>
            ) : (
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            )}
            <div>
              <DialogTitle className="text-2xl font-black">
                {isAtLimit ? 'Beta Limit Reached' : 'Running Low on Enrichments'}
              </DialogTitle>
              <DialogDescription className="text-base">
                {isAtLimit
                  ? `You've used all ${enrichmentsLimit} beta enrichments`
                  : `Only ${remaining} enrichments remaining`
                }
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
              <div className="text-2xl font-black text-gray-900">{enrichmentsUsed}</div>
              <div className="text-xs text-gray-600 font-semibold">Used</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
              <div className="text-2xl font-black text-gray-900">{remaining}</div>
              <div className="text-xs text-gray-600 font-semibold">Remaining</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
              <div className="text-2xl font-black text-gray-900">{enrichmentsLimit}</div>
              <div className="text-xs text-gray-600 font-semibold">Limit</div>
            </div>
          </div>

          {/* Upgrade options */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Professional */}
            <div className="border-4 border-black rounded-xl p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="mb-4">
                <Badge className="bg-blue-500 text-white mb-2">Most Popular</Badge>
                <h3 className="text-xl font-black">Professional</h3>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-black">£19</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Unlimited enrichments</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Advanced intelligence</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Priority support</span>
                </li>
              </ul>
              <Link href="/pricing?tier=professional" className="block">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  Upgrade to Professional
                </Button>
              </Link>
            </div>

            {/* Agency */}
            <div className="border-4 border-black rounded-xl p-6 bg-gradient-to-br from-blue-50 to-blue-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="mb-4">
                <Badge className="bg-blue-500 text-white mb-2">Best Value</Badge>
                <h3 className="text-xl font-black">Agency</h3>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-black">£79</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Everything in Professional</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Team collaboration</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm">White-label exports</span>
                </li>
              </ul>
              <Link href="/pricing?tier=agency" className="block">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  Upgrade to Agency
                </Button>
              </Link>
            </div>
          </div>

          {/* Message */}
          <div className="text-center p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <Zap className="inline h-4 w-4 mr-1" />
              Upgrade now and get <strong>50% off your first year</strong> as a beta founder
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
