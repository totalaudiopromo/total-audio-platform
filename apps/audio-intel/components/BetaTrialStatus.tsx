'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, Crown, Sparkles } from 'lucide-react'
import { getBetaUserStatus, generateTrialExpiryMessage } from '@/utils/betaAccessControl'

interface BetaTrialStatusProps {
  userEmail?: string;
  signupTimestamp?: string;
  onUpgradeClick?: () => void;
}

export default function BetaTrialStatus({ userEmail, signupTimestamp, onUpgradeClick }: BetaTrialStatusProps) {
  const [trialStatus, setTrialStatus] = useState<any>(null);
  
  useEffect(() => {
    if (signupTimestamp) {
      const status = getBetaUserStatus(userEmail || '', signupTimestamp);
      setTrialStatus(status);
    }
  }, [userEmail, signupTimestamp]);

  if (!trialStatus) {
    return null;
  }

  const isExpired = trialStatus.hasExpired;
  const isExpiringSoon = trialStatus.daysRemaining <= 3 && trialStatus.daysRemaining > 0;

  if (isExpired) {
    return (
      <Card className="border-4 border-red-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-6">
        <CardHeader className="bg-red-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-black text-red-900">
                Free Trial Expired
              </CardTitle>
              <Badge className="bg-red-500 text-white font-black mt-1">
                UPGRADE REQUIRED
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-lg font-bold text-red-800 mb-4">
            {generateTrialExpiryMessage(trialStatus.daysRemaining)}
          </p>
          <div className="bg-yellow-100 border-4 border-yellow-400 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3 mb-2">
              <Crown className="w-5 h-5 text-yellow-600" />
              <h4 className="font-black text-yellow-800">Exclusive Beta Founder Discount</h4>
            </div>
            <p className="text-sm font-bold text-yellow-800">
              As a beta tester, you get <strong>50% off forever</strong>: 
              <span className="block text-xl font-black mt-1">
                £9.99/month instead of £19.99/month
              </span>
            </p>
          </div>
          <Button 
            onClick={onUpgradeClick}
            size="lg"
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-black text-lg rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <Crown className="w-5 h-5 mr-2" />
            Upgrade Now - Lock in 50% Lifetime Discount
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isExpiringSoon) {
    return (
      <Card className="border-4 border-orange-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-6">
        <CardHeader className="bg-orange-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center animate-pulse">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-black text-orange-900">
                Trial Expires Soon
              </CardTitle>
              <Badge className="bg-orange-500 text-white font-black mt-1">
                {trialStatus.daysRemaining} DAYS LEFT
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-lg font-bold text-orange-800 mb-4">
            {generateTrialExpiryMessage(trialStatus.daysRemaining)}
          </p>
          <div className="bg-green-100 border-4 border-green-400 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-5 h-5 text-green-600" />
              <h4 className="font-black text-green-800">Beta Founder Benefits</h4>
            </div>
            <ul className="text-sm font-bold text-green-800 space-y-1">
              <li>✅ 50% lifetime discount (£9.99 vs £19.99)</li>
              <li>✅ Early access to new features</li>
              <li>✅ Direct founder access</li>
              <li>✅ Founding member recognition</li>
            </ul>
          </div>
          <Button 
            onClick={onUpgradeClick}
            size="lg"
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-black text-lg rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <Crown className="w-5 h-5 mr-2" />
            Secure 50% Lifetime Discount Now
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Active trial - show subtle reminder
  return (
    <Card className="border-2 border-blue-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] mb-6">
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-bold text-blue-900">
                Free Trial: {trialStatus.daysRemaining} days remaining
              </p>
              <p className="text-sm text-blue-700">
                Then £9.99/month (50% lifetime discount)
              </p>
            </div>
          </div>
          <Badge className="bg-blue-500 text-white font-black">
            BETA FOUNDER
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}