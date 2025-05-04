'use client';

import Link from 'next/link';
import { Twitter, Instagram, Linkedin, Github } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Text } from '@/components/ui/text';
import { Grid } from '@/components/ui/grid';

const footerLinks = {
  product: [
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Demo', href: '/demo' },
    { name: 'Updates', href: '/updates' }
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' }
  ],
  resources: [
    { name: 'Documentation', href: '/docs' },
    { name: 'Help Center', href: '/help' },
    { name: 'API', href: '/api' },
    { name: 'Status', href: '/status' }
  ],
  legal: [
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
    { name: 'Security', href: '/security' }
  ]
};

const socialLinks = [
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'Instagram', icon: Instagram, href: '#' },
  { name: 'LinkedIn', icon: Linkedin, href: '#' },
  { name: 'GitHub', icon: Github, href: '#' }
];

export const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <Container>
        <div className="py-12">
          <Grid cols={4} gap="lg">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                  {category}
                </h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-foreground/60 hover:text-foreground transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Grid>

          <div className="border-t border-gray-200 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="text-foreground/60 hover:text-foreground transition-colors"
                  >
                    <span className="sr-only">{social.name}</span>
                    <social.icon className="w-5 h-5" />
                  </Link>
                ))}
              </div>
              <Text variant="muted" className="text-sm">
                © {new Date().getFullYear()} Caption Genius. All rights reserved.
              </Text>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}; 