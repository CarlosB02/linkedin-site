import { createClient } from "@supabase/supabase-js";

// This client must ONLY be used on the server side (e.g., in webhooks or secure server actions).
// It bypasses Row Level Security (RLS).
export const createAdminClient = () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        console.error("CRITICAL ERROR: EXACTLY NEXT_PUBLIC_SUPABASE_URL is missing in Vercel.");
    }
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error("CRITICAL ERROR: EXACTLY SUPABASE_SERVICE_ROLE_KEY is missing in Vercel.");
    }

    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
            },
        }
    );
};
