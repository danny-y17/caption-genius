'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

type SupabaseContextType = {
    session: Session | null;
};

const SupabaseContext = createContext<SupabaseContextType>({
    session: null,
});

export function useSupabase() {
    return useContext(SupabaseContext);
}

const Providers = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <SupabaseContext.Provider value={{ session }}>
            {children}
        </SupabaseContext.Provider>
    );
};

export default Providers; 