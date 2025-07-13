import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database helper functions (shared with web app)
export const dealService = {
  async getDeals(filters?: any) {
    let query = supabase
      .from('electronics_deals')
      .select('*')
      .order('is_promoted', { ascending: false })
      .order('promotion_order', { ascending: true })
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
    if (filters?.minPrice) {
      query = query.gte('deal_price', filters.minPrice);
    }
    if (filters?.maxPrice) {
      query = query.lte('deal_price', filters.maxPrice);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getDeal(id: string) {
    const { data, error } = await supabase
      .from('electronics_deals')
      .select('*')
      .eq('id', id)
      .single();
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
  },

  async promoteDeal(dealId: string, promoted: boolean, promotionOrder: number = 0) {
    const { data, error } = await supabase.rpc('promote_deal', {
      deal_id: dealId,
      promoted,
      promotion_order: promotionOrder
    });
    if (error) throw error;
    return data;
  }
};

export const userService = {
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateUserLocation(location: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('user_locations')
      .upsert({
        user_id: user.id,
        ...location,
        updated_at: new Date().toISOString()
      });
    
    if (error) throw error;
    return data;
  }
};