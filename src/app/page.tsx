'use client';

import { motion, useInView } from 'framer-motion';
import { Sparkles, Zap, Shield, Globe, Code, BarChart, CheckCircle, Users, Clock, Target } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';
import { useSupabase } from '@/components/Providers';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Grid } from '@/components/ui/grid';
import Header from '@/components/Header';

const features = [
    {
        icon: Sparkles,
        title: 'AI-Powered Captions',
        description: 'Generate engaging captions using advanced AI technology that understands your content and audience.',
        benefits: [
            'Natural language understanding',
            'Context-aware suggestions',
            'Emotion and tone analysis'
        ]
    },
    {
        icon: Zap,
        title: 'Lightning Fast',
        description: 'Get high-quality captions in seconds, not hours. Perfect for content creators on the go.',
        benefits: [
            'Instant generation',
            'Batch processing',
            'Real-time preview'
        ]
    },
    {
        icon: Shield,
        title: 'Brand Safe',
        description: 'Our AI is trained to maintain your brand voice and avoid inappropriate content.',
        benefits: [
            'Brand voice consistency',
            'Content moderation',
            'Custom style guides'
        ]
    },
    {
        icon: Globe,
        title: 'Multi-Platform',
        description: 'Optimize captions for any social media platform with platform-specific formatting.',
        benefits: [
            'Platform-specific templates',
            'Character count optimization',
            'Hashtag suggestions'
        ]
    },
    {
        icon: Code,
        title: 'Developer API',
        description: 'Integrate caption generation directly into your workflow with our powerful API.',
        benefits: [
            'RESTful API access',
            'Webhook support',
            'SDKs for popular languages'
        ]
    },
    {
        icon: BarChart,
        title: 'Performance Analytics',
        description: 'Track engagement metrics and optimize your captions based on real data.',
        benefits: [
            'Engagement tracking',
            'A/B testing',
            'Performance insights'
        ]
    }
];

const benefits = [
    {
        icon: Users,
        title: 'For Content Creators',
        description: 'Save hours of time writing captions and focus on creating great content.'
    },
    {
        icon: Clock,
        title: 'For Social Media Managers',
        description: 'Maintain consistent brand voice across all platforms and channels.'
    },
    {
        icon: Target,
        title: 'For Marketing Teams',
        description: 'Increase engagement and reach with optimized, platform-specific captions.'
    }
];


export default function Home() {
    const { session } = useSupabase();
    const heroRef = useRef(null);
    const benefitsRef = useRef(null);
    const featuresRef = useRef(null);
    const ctaRef = useRef(null);

    const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
    const benefitsInView = useInView(benefitsRef, { once: true, margin: "-100px" });
    const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" });
    const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                {/* Hero Section */}
                <section ref={heroRef} className="py-20 bg-gradient-to-b from-background to-background/80 relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
                    <Container>
                        <div className="max-w-3xl mx-auto text-center relative">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                                    <Sparkles className="w-4 h-4" />
                                    <span className="text-sm font-medium">AI-Powered Caption Generation</span>
                                </div>
                                <Heading variant="h1" align="center" className="mb-6">
                                    Generate Perfect Captions with AI
                                </Heading>
                                <Text className="text-xl mb-8 text-foreground/80">
                                    Create engaging, on-brand captions for your social media content in seconds.
                                </Text>
                                <div className="flex justify-center gap-4">
                                    {!session ? (
                                        <Link href="/login">
                                            <Button size="lg" className="bg-primary hover:bg-primary/90">
                                                Get Started
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Link href="/caption">
                                            <Button size="lg" className="bg-primary hover:bg-primary/90">
                                                Generate Captions
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </Container>
                </section>

                {/* Benefits Section */}
                <section ref={benefitsRef} className="py-16 bg-background/50">
                    <Container>
                        <Grid className="gap-6">
                            {benefits.map((benefit, index) => {
                                const Icon = benefit.icon;
                                return (
                                    <motion.div
                                        key={benefit.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={benefitsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        className="p-6 rounded-xl bg-background border border-gray-100/20 hover:border-primary/20 transition-colors"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                            <Icon className="w-6 h-6 text-primary" />
                                        </div>
                                        <Heading variant="h3" className="mb-2">
                                            {benefit.title}
                                        </Heading>
                                        <Text className="text-foreground/60">
                                            {benefit.description}
                                        </Text>
                                    </motion.div>
                                );
                            })}
                        </Grid>
                    </Container>
                </section>

                {/* Features Section */}
                <section ref={featuresRef} className="py-16 bg-background">
                    <Container>
                        <Grid className="gap-6">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <motion.div
                                        key={feature.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        className="p-6 rounded-xl bg-background border border-gray-100/20 hover:border-primary/20 transition-colors"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                            <Icon className="w-6 h-6 text-primary" />
                                        </div>
                                        <Heading variant="h3" className="mb-2">
                                            {feature.title}
                                        </Heading>
                                        <Text className="text-foreground/60 mb-4">
                                            {feature.description}
                                        </Text>
                                        <ul className="space-y-2">
                                            {feature.benefits.map((benefit) => (
                                                <li key={benefit} className="flex items-center gap-2 text-foreground/60">
                                                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                                                    <span>{benefit}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                );
                            })}
                        </Grid>
                    </Container>
                </section>

                {/* CTA Section */}
                <section ref={ctaRef} className="py-20 bg-background">
                    <Container>
                        <div className="max-w-3xl mx-auto text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Heading variant="h2" align="center" className="mb-6">
                                    Ready to Transform Your Captions?
                                </Heading>
                                <Text className="text-xl mb-8 text-foreground/80">
                                    Join thousands of content creators who are saving time and increasing engagement with Caption Genius.
                                </Text>
                                <div className="flex justify-center gap-4">
                                    {!session ? (
                                        <Link href="/login">
                                            <Button size="lg" className="bg-primary hover:bg-primary/90">
                                                Get Started Free
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Link href="/caption">
                                            <Button size="lg" className="bg-primary hover:bg-primary/90">
                                                Generate Captions
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </Container>
                </section>
            </main>
        </div>
    );
}
