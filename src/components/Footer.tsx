import Link from 'next/link';
import { FaGithub, FaTwitter, FaLinkedin, FaFingerprint } from 'react-icons/fa';
import { siteDetails } from '@/data/siteDetails';

const Footer = () => {
  return (
    <footer className="bg-background border-t border-gray-100/20 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex items-center justify-center">
                <FaFingerprint className="w-6 h-6 text-primary" />
              </div>
              <span className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                {siteDetails.siteName}
              </span>
            </Link>
            <p className="text-foreground/60 text-sm">
              AI-powered caption generation for your social media content.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-foreground/60 hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/generate" className="text-foreground/60 hover:text-primary transition-colors">
                  Generate
                </Link>
              </li>
              <li>
                <Link href="/history" className="text-foreground/60 hover:text-primary transition-colors">
                  History
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="text-foreground/60 hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-foreground/60 hover:text-primary transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-foreground/60 hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/60 hover:text-primary transition-colors"
              >
                <FaGithub className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/60 hover:text-primary transition-colors"
              >
                <FaTwitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/60 hover:text-primary transition-colors"
              >
                <FaLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-100/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-foreground/60 text-sm">
              © {new Date().getFullYear()} {siteDetails.siteName}. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-foreground/60 hover:text-primary transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-foreground/60 hover:text-primary transition-colors text-sm">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 