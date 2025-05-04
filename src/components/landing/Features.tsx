'use client';

import { Sparkles, Zap, Shield, BarChart } from 'lucide-react';
import { Section } from '@/components/ui/section';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Grid } from '@/components/ui/grid';

const features = [
  {
    name: 'AI-Powered Captions',
    description: 'Generate engaging captions using advanced AI technology that understands your content and audience.',
    icon: Sparkles
  },
  {
    name: 'Lightning Fast',
    description: 'Get your captions in seconds, not hours. Perfect for content creators who need to move quickly.',
    icon: Zap
  },
  {
    name: 'Privacy First',
    description: 'Your content is processed securely and never stored. Your privacy is our top priority.',
    icon: Shield
  },
  {
    name: 'Performance Analytics',
    description: 'Track how your captions perform and get insights to improve your content strategy.',
    icon: BarChart
  }
];

export const Features = () => {
  return (
    <Section variant="gray">
      <div className="text-center mb-16">
        <Heading variant="h2" align="center">
          Everything you need to create amazing captions
        </Heading>
        <Text variant="lead" align="center" className="mt-4">
          Our AI-powered platform helps you create engaging captions that resonate with your audience.
        </Text>
      </div>

      <Grid cols={4}>
        {features.map((feature) => (
          <div
            key={feature.name}
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <feature.icon className="w-6 h-6 text-primary" />
            </div>
            <Heading variant="h4">{feature.name}</Heading>
            <Text variant="muted" className="mt-2">
              {feature.description}
            </Text>
          </div>
        ))}
      </Grid>
    </Section>
  );
}; 