'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { User, LogOut, Menu, X, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import Container from './Container';

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleSignOut = async () => {
        try {
            await signOut({ 
                redirect: false,
                callbackUrl: '/login'
            });
            router.push('/login');
            router.refresh();
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <motion.header 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 w-full h-[70px] bg-background/95 backdrop-blur-md border-b border-gray-100/20 shadow-sm"
        >
            <Container className="h-full">
                <div className="flex items-center justify-between h-full">
                    <Link href="/" className="flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-primary" />
                        <span className="text-xl font-bold">Caption Genius</span>
                    </Link>

                    {/* Mobile menu button */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100/10"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>

                    {/* Desktop navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {session ? (
                            <>
                                <Link 
                                    href="/generate" 
                                    className={`text-sm font-medium transition-colors ${
                                        pathname === '/generate' 
                                            ? 'text-primary' 
                                            : 'text-foreground/60 hover:text-foreground'
                                    }`}
                                >
                                    Generate
                                </Link>
                                <Link 
                                    href="/history" 
                                    className={`text-sm font-medium transition-colors ${
                                        pathname === '/history' 
                                            ? 'text-primary' 
                                            : 'text-foreground/60 hover:text-foreground'
                                    }`}
                                >
                                    History
                                </Link>
                                <Link 
                                    href="/analytics" 
                                    className={`text-sm font-medium transition-colors ${
                                        pathname === '/analytics' 
                                            ? 'text-primary' 
                                            : 'text-foreground/60 hover:text-foreground'
                                    }`}
                                >
                                    Analytics
                                </Link>
                                <Link 
                                    href="/settings" 
                                    className={`text-sm font-medium transition-colors ${
                                        pathname === '/settings' 
                                            ? 'text-primary' 
                                            : 'text-foreground/60 hover:text-foreground'
                                    }`}
                                >
                                    Settings
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link 
                                    href="/features" 
                                    className={`text-sm font-medium transition-colors ${
                                        pathname === '/features' 
                                            ? 'text-primary' 
                                            : 'text-foreground/60 hover:text-foreground'
                                    }`}
                                >
                                    Features
                                </Link>
                                <Link 
                                    href="/pricing" 
                                    className={`text-sm font-medium transition-colors ${
                                        pathname === '/pricing' 
                                            ? 'text-primary' 
                                            : 'text-foreground/60 hover:text-foreground'
                                    }`}
                                >
                                    Pricing
                                </Link>
                                <Link 
                                    href="/about" 
                                    className={`text-sm font-medium transition-colors ${
                                        pathname === '/about' 
                                            ? 'text-primary' 
                                            : 'text-foreground/60 hover:text-foreground'
                                    }`}
                                >
                                    About
                                </Link>
                                <Link 
                                    href="/contact" 
                                    className={`text-sm font-medium transition-colors ${
                                        pathname === '/contact' 
                                            ? 'text-primary' 
                                            : 'text-foreground/60 hover:text-foreground'
                                    }`}
                                >
                                    Contact
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* Auth section */}
                    <div className="hidden md:flex items-center gap-4">
                        {status === 'loading' ? (
                            <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
                        ) : session ? (
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-4"
                            >
                                <div className="flex items-center gap-2 text-foreground/80">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <User className="w-4 h-4 text-primary" />
                                    </div>
                                    <span className="font-medium leading-none">{session.user?.name || session.user?.email}</span>
                                </div>
                                <button
                                    onClick={handleSignOut}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors font-medium leading-none"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Sign Out</span>
                                </button>
                            </motion.div>
                        ) : (
                            <div className="flex items-center gap-4">
                                {pathname !== '/login' && (
                                    <Link
                                        href="/login"
                                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors font-medium leading-none"
                                    >
                                        <User className="w-4 h-4" />
                                        <span>Sign In</span>
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile menu */}
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-[70px] left-0 right-0 bg-background border-b border-gray-100/20 md:hidden"
                    >
                        <div className="py-4 px-4 space-y-4">
                            {session ? (
                                <>
                                    <Link 
                                        href="/generate" 
                                        className="block text-sm font-medium text-foreground/60 hover:text-foreground"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Generate
                                    </Link>
                                    <Link 
                                        href="/history" 
                                        className="block text-sm font-medium text-foreground/60 hover:text-foreground"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        History
                                    </Link>
                                    <Link 
                                        href="/analytics" 
                                        className="block text-sm font-medium text-foreground/60 hover:text-foreground"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Analytics
                                    </Link>
                                    <Link 
                                        href="/settings" 
                                        className="block text-sm font-medium text-foreground/60 hover:text-foreground"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Settings
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleSignOut();
                                            setIsOpen(false);
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors font-medium w-full"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Sign Out</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link 
                                        href="/features" 
                                        className="block text-sm font-medium text-foreground/60 hover:text-foreground"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Features
                                    </Link>
                                    <Link 
                                        href="/pricing" 
                                        className="block text-sm font-medium text-foreground/60 hover:text-foreground"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Pricing
                                    </Link>
                                    <Link 
                                        href="/about" 
                                        className="block text-sm font-medium text-foreground/60 hover:text-foreground"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        About
                                    </Link>
                                    <Link 
                                        href="/contact" 
                                        className="block text-sm font-medium text-foreground/60 hover:text-foreground"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Contact
                                    </Link>
                                    {pathname !== '/login' && (
                                        <Link
                                            href="/login"
                                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors font-medium w-full"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <User className="w-4 h-4" />
                                            <span>Sign In</span>
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </Container>
        </motion.header>
    );
};

export default Header;
