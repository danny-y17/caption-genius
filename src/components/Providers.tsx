'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

type SupabaseContextType = {
    session: Session | null;
    isLoading: boolean;
};

const SupabaseContext = createContext<SupabaseContextType>({
    session: null,
    isLoading: true,
});

export function useSupabase() {
    return useContext(SupabaseContext);
}

const Providers = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeSession = async () => {
            try {
                const { data: { session: initialSession } } = await supabase.auth.getSession();
                setSession(initialSession);
            } catch (error) {
                console.error('Error getting initial session:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            console.log('Auth state changed:', { event: _event, hasSession: !!session });
            setSession(session);
            setIsLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return (
        <SupabaseContext.Provider value={{ session, isLoading }}>
            {children}
        </SupabaseContext.Provider>
    );
};

export default Providers; 