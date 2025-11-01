'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestAuthPage() {
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleTestSignIn = async () => {
    setIsLoading(true);
    setResult('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setResult(`Error: ${result.error}`);
      } else {
        setResult('Success! Authentication working properly.');
      }
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
          <CardHeader>
            <CardTitle>Authentication Test</CardTitle>
            <CardDescription>Test the demo credentials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email:</label>
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Password:</label>
              <Input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <Button onClick={handleTestSignIn} disabled={isLoading} className="w-full">
              {isLoading ? 'Testing...' : 'Test Sign In'}
            </Button>

            {result && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  result.includes('Success')
                    ? 'bg-green-400/10 text-green-400'
                    : 'bg-red-400/10 text-red-400'
                }`}
              >
                {result}
              </div>
            )}

            <div className="text-sm text-gray-400 bg-gray-800/30 p-3 rounded-lg">
              <p className="font-medium mb-1">Demo Credentials:</p>
              <p>Email: demo@example.com</p>
              <p>Password: password123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
