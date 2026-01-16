import { z } from 'zod';

const envSchema = z.object({
    VITE_SUPABASE_URL: z.string().url("VITE_SUPABASE_URL must be a valid URL"),
    VITE_SUPABASE_ANON_KEY: z.string().min(1, "VITE_SUPABASE_ANON_KEY is required"),
});

const env = envSchema.safeParse(import.meta.env);

if (!env.success) {
    console.error("❌ Invalid environment variables:", env.error.format());
    // Don't throw, so the app can at least start and show specific error UI where needed
}

export const config = env.success ? env.data : {};
