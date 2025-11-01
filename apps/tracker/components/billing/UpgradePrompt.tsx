'use client';

import { AlertCircle, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

interface UpgradePromptProps {
  title?: string;
  message?: string;
  feature?: string;
  inline?: boolean;
}

export function UpgradePrompt({
  title = 'Upgrade Required',
  message = "You've reached your plan's limit.",
  feature,
  inline = false,
}: UpgradePromptProps) {
  if (inline) {
    return (
      <div className="flex items-center gap-3 p-4 bg-teal-50 border border-teal-200 rounded-lg">
        <AlertCircle className="h-5 w-5 text-teal-600 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-teal-900">{title}</p>
          <p className="text-sm text-teal-700">{message}</p>
        </div>
        <Link href="/billing">
          <Button size="sm" variant="default" className="flex-shrink-0">
            <Crown className="h-4 w-4 mr-2" />
            Upgrade
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <Card className="border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-orange-100">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-100 rounded-lg">
            <Crown className="h-6 w-6 text-teal-600" />
          </div>
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription className="text-teal-700">
              {message}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {feature && (
          <p className="text-sm text-gray-700">
            <strong>{feature}</strong> is available on paid plans.
          </p>
        )}

        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900">Upgrade to unlock:</h4>
          <ul className="space-y-1 text-sm text-gray-700">
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 bg-teal-600 rounded-full" />
              Unlimited campaigns
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 bg-teal-600 rounded-full" />
              Advanced analytics and insights
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 bg-teal-600 rounded-full" />
              Priority support
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 bg-teal-600 rounded-full" />
              CSV export and custom reports
            </li>
          </ul>
        </div>

        <div className="flex gap-3">
          <Link href="/billing" className="flex-1">
            <Button className="w-full" size="lg">
              <Crown className="h-4 w-4 mr-2" />
              View Plans
            </Button>
          </Link>
          <Link href="/pricing" className="flex-1">
            <Button variant="outline" className="w-full" size="lg">
              Learn More
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Modal version of the upgrade prompt
 */
export function UpgradeModal({
  isOpen,
  onClose,
  title,
  message,
  feature,
}: UpgradePromptProps & {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-xl">
          <div className="p-6">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <span className="sr-only">Close</span>✕
            </button>

            <UpgradePrompt title={title} message={message} feature={feature} />
          </div>
        </div>
      </div>
    </div>
  );
}
