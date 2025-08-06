// /app/login/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { motion } from 'framer-motion';
import { Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Checkbox } from '@/components/ui/checkbox';
import Header from '@/components/layout/Header';
import { FormInput } from '@/components/ui/form-input';
import { useAuth } from '@/features/caption/hooks/useAuth';

const LoginPage = () => {
  const { login, loading, error, getRememberedEmail } = useAuth();
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Load remembered email on component mount
  useEffect(() => {
    const rememberedEmail = getRememberedEmail();
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, [getRememberedEmail]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    
    try {
      await login({ email, password, rememberMe });
    } catch (error) {
      // Error is handled by the hook
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center">
        <section className="w-full bg-background/80 backdrop-blur-sm">
          <Container>
            <div className="max-w-md mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6"
              >
                <Heading variant="h1" className="mb-1">
                  Welcome Back
                </Heading>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="flex flex-col">
                    <FormInput
                      id="email"
                      name="email"
                      label="Email"
                      type="email"
                      placeholder="Enter your email"
                      icon={Mail}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />

                    <FormInput
                      id="password"
                      name="password"
                      label="Password"
                      type="password"
                      placeholder="Enter your password"
                      icon={Lock}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                    />

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <Checkbox 
                          id="remember" 
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label 
                          htmlFor="remember" 
                          className="text-sm text-foreground/80 cursor-pointer select-none"
                        >
                          Remember me
                        </label>
                      </div>
                      <Link href="/forgot-password" className="text-sm text-primary hover:text-primary/90">
                        Forgot password?
                      </Link>
                    </div>
                  </div>

                  {error && (
                    <div className="text-sm text-red-500 text-center">{error}</div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full bg-primary/90 hover:bg-primary backdrop-blur-sm"
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <Text className="text-foreground/60">
                    Don't have an account?{' '}
                    <Link href="/signup" className="text-primary hover:text-primary/90">
                      Sign up
                    </Link>
                  </Text>
                </div>
              </motion.div>
            </div>
          </Container>
        </section>
      </main>
    </div>
  );
};

export default LoginPage;
