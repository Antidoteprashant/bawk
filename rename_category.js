
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hrvfbkjzopndoztsgoyv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhydmZia2p6b3BuZG96dHNnb3l2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NzY4NDMsImV4cCI6MjA4NDE1Mjg0M30.ueWFpcaavt640CJiahnBIkxOl3yxCgmUenxtpcNLwpg';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function renameCategory() {
    const { data, error } = await supabase
        .from('categories')
        .update({ name: 'WATCH', slug: 'watch' })
        .eq('id', '0868e6ad-bab2-48b2-98ae-d7391c628e00');

    if (error) {
        console.error('Error updating category:', error);
        return;
    }
    console.log('Category updated successfully:', JSON.stringify(data, null, 2));
}

renameCategory();
