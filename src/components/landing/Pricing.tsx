'use client';

import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Section } from '@/components/ui/section';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Grid } from '@/components/ui/grid';

const plans = [
  {
    name: 'Starter',
    price: '$9',
    period: '/month',
    description: 'Perfect for individuals and small creators',
    features: [
      '100 caption generations per month',
      'Basic AI models',
      'Standard support',
      'Export to social media',
      'Basic analytics'
    ],
    cta: 'Get Started'
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'For growing creators and small businesses',
    features: [
      '500 caption generations per month',
      'Advanced AI models',
      'Priority support',
      'Bulk generation',
      'Advanced analytics',
      'API access',
      'Custom templates'
    ],
    cta: 'Start Free Trial',
    featured: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large teams and agencies',
    features: [
      'Unlimited generations',
      'Custom AI models',
      'Dedicated support',
      'Team collaboration',
      'Custom integrations',
      'White-label options',
      'SLA guarantee'
    ],
    cta: 'Contact Sales'
  }
];

export const Pricing = () => {
  return (
    <Section>
      <div className="text-center mb-16">
        <Heading variant="h2" align="center">
          Simple, transparent pricing
        </Heading>
        <Text variant="lead" align="center" className="mt-4">
          Choose the plan that's right for you. All plans include a 14-day free trial.
        </Text>
      </div>

      <Grid cols={3}>
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`bg-white rounded-lg shadow-sm p-8 ${
              plan.featured ? 'ring-2 ring-primary' : ''
            }`}
          >
            <div className="mb-8">
              <Heading variant="h3">{plan.name}</Heading>
              <div className="flex items-baseline mb-2">
                <span className="text-4xl font-bold text-foreground">
                  {plan.price}
                </span>
                <Text variant="muted" className="ml-1">
                  {plan.period}
                </Text>
              </div>
              <Text variant="muted">{plan.description}</Text>
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start">
                  <Check className="w-5 h-5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                  <Text variant="muted">{feature}</Text>
                </li>
              ))}
            </ul>

            <Button
              className={`w-full ${
                plan.featured ? 'bg-primary hover:bg-primary/90' : ''
              }`}
            >
              {plan.cta}
            </Button>
          </div>
        ))}
      </Grid>
    </Section>
  );
}; 