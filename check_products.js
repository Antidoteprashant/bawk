
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hrvfbkjzopndoztsgoyv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhydmZia2p6b3BuZG96dHNnb3l2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NzY4NDMsImV4cCI6MjA4NDE1Mjg0M30.ueWFpcaavt640CJiahnBIkxOl3yxCgmUenxtpcNLwpg';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkProducts() {
    const { data, error } = await supabase
        .from('products')
        .select('id, name, description')
        .or('name.ilike.%cosplay%,description.ilike.%cosplay%');

    if (error) {
        console.error('Error fetching products:', error);
        return;
    }
    console.log('Products with Cosplay:', JSON.stringify(data, null, 2));
}

checkProducts();
