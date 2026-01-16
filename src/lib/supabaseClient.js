import { createClient } from '@supabase/supabase-js';

// Access environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a client with error handling implementation
let supabaseClient;
try {
    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('Supabase credentials missing! Check your .env file.');
        // Create a dummy client object that warns on usage to prevent crash
        supabaseClient = {
            from: () => ({
                select: () => Promise.resolve({ data: [], error: { message: 'Supabase not configured' } }),
                insert: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
                order: function () { return this; },
                limit: function () { return this; }
            })
        };
    } else {
        supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    }
} catch (e) {
    console.error('Failed to initialize Supabase client:', e);
    supabaseClient = null;
}

export const supabase = supabaseClient;
