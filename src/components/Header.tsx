'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { User, LogOut, Menu, X, Sparkles, Settings, UserCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Container } from '@/components/ui/container';
import { menuConfig } from '@/data/menu';
import { useSupabase } from './Providers';
import { supabase } from '@/lib/supabase/client';

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { session } = useSupabase();
    const router = useRouter();
    const pathname = usePathname();

    const toggleMenu = () => setIsOpen(!isOpen);
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut();
            router.push('/login');
            router.refresh();
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const menuItems = session ? menuConfig.authenticated : menuConfig.unauthenticated;

    return (
        <motion.header 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 w-full h-[70px] bg-background/95 backdrop-blur-md border-b border-gray-100/20 shadow-sm"
        >
            <Container className="h-full">
                <div className="flex items-center justify-between h-full max-w-7xl mx-auto">
                    <div className="flex-1">
                        <Link href="/" className="flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-primary" />
                            <span className="text-xl font-bold">Caption Genius</span>
                        </Link>
                    </div>

                    {/* Desktop navigation */}
                    <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link 
                                    key={item.url}
                                    href={item.url}
                                    className={`text-sm font-medium transition-colors ${
                                        pathname === item.url 
                                            ? 'text-primary' 
                                            : 'text-foreground/60 hover:text-foreground'
                                    }`}
                                >
                                    {Icon && <Icon className="w-4 h-4 inline-block mr-2" />}
                                    {item.text}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Auth section */}
                    <div className="flex-1 flex justify-end">
                        {!session ? (
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
                        ) : (
                            <div className="relative" ref={dropdownRef}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={toggleDropdown}
                                    className="flex items-center gap-2 text-foreground/80"
                                >
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <User className="w-4 h-4 text-primary" />
                                    </div>
                                </motion.button>

                                {isDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 mt-2 w-48 rounded-lg bg-background border border-gray-100/20 shadow-lg py-1"
                                    >
                                        <div className="px-4 py-2 border-b border-gray-100/20">
                                            <p className="text-sm font-medium text-foreground">{session.user.email}</p>
                                        </div>
                                        <Link
                                            href="/profile"
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-foreground/60 hover:text-foreground hover:bg-gray-100/10"
                                        >
                                            <UserCircle className="w-4 h-4" />
                                            Profile
                                        </Link>
                                        <Link
                                            href="/account"
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-foreground/60 hover:text-foreground hover:bg-gray-100/10"
                                        >
                                            <Settings className="w-4 h-4" />
                                            Account Settings
                                        </Link>
                                        <button
                                            onClick={handleSignOut}
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-foreground/60 hover:text-foreground hover:bg-gray-100/10 w-full"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </motion.div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100/10"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
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
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link 
                                        key={item.url}
                                        href={item.url}
                                        className="flex items-center gap-2 text-sm font-medium text-foreground/60 hover:text-foreground"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {Icon && <Icon className="w-4 h-4" />}
                                        {item.text}
                                    </Link>
                                );
                            })}
                            {session && (
                                <>
                                    <Link 
                                        href="/profile" 
                                        className="flex items-center gap-2 text-sm font-medium text-foreground/60 hover:text-foreground"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <UserCircle className="w-4 h-4" />
                                        Profile
                                    </Link>
                                    <Link 
                                        href="/account" 
                                        className="flex items-center gap-2 text-sm font-medium text-foreground/60 hover:text-foreground"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <Settings className="w-4 h-4" />
                                        Account Settings
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
                            )}
                        </div>
                    </motion.div>
                )}
            </Container>
        </motion.header>
    );
};

export default Header;
