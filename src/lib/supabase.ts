import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database helper functions
export const dealService = {
  async getDeals(filters?: any) {
    let query = supabase
      .from('electronics_deals')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.brand) {
      query = query.eq('brand', filters.brand);
    }
    if (filters?.city) {
      query = query.eq('city', filters.city);
    }
    if (filters?.dealType && filters.dealType !== 'all') {
      query = query.eq('deal_type', filters.dealType);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async createDeal(deal: any) {
    const { data, error } = await supabase
      .from('electronics_deals')
      .insert([deal])
      .select();
    if (error) throw error;
    return data[0];
  },

  async updateDeal(id: string, updates: any) {
    const { data, error } = await supabase
      .from('electronics_deals')
      .update(updates)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data[0];
  },

  async voteDeal(dealId: string, voteType: 'up' | 'down') {
    const { data, error } = await supabase.rpc('vote_deal', {
      deal_id: dealId,
      vote_type: voteType
    });
    if (error) throw error;
    return data;
  }
};