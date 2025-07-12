import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, Star, Eye, Filter } from 'lucide-react';
import { Deal } from '../../types';
import { dealService } from '../../lib/supabase';
import { formatPrice, formatTimeAgo } from '../../lib/utils';
import { Button } from '../ui/button';

export const DealManagement: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'promoted' | 'verified'>('all');
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);

  useEffect(() => {
    loadDeals();
  }, []);

  useEffect(() => {
    filterDeals();
  }, [deals, searchQuery, filterStatus]);

  const loadDeals = async () => {
    try {
      setLoading(true);
      // In a real app, this would fetch from Supabase
      // For now, we'll use mock data
      const mockDeals: Deal[] = [
        {
          id: '1',
          title: 'iPhone 15 Pro Max 256GB - Natural Titanium',
          brand: 'Apple',
          category: 'Mobiles',
          description: 'Latest iPhone with A17 Pro chip',
          original_price: 159900,
          deal_price: 149900,
          discount_percentage: 6,
          merchant: 'Amazon',
          deal_url: 'https://amazon.in/iphone-15-pro-max',
          image_url: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400',
          created_by: 'user1',
          upvotes: 45,
          downvotes: 3,
          is_verified: true,
          created_at: '2024-01-15T10:30:00Z',
          deal_type: 'online',
          city: 'Mumbai',
          state: 'Maharashtra',
          is_promoted: true,
          promotion_order: 1
        },
        {
          id: '2',
          title: 'Samsung Galaxy S24 Ultra 512GB',
          brand: 'Samsung',
          category: 'Mobiles',
          description: 'Flagship Samsung phone with S Pen',
          original_price: 139999,
          deal_price: 119999,
          discount_percentage: 14,
          merchant: 'Flipkart',
          deal_url: 'https://flipkart.com/samsung-s24-ultra',
          image_url: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=400',
          created_by: 'user2',
          upvotes: 32,
          downvotes: 1,
          is_verified: true,
          created_at: '2024-01-14T15:45:00Z',
          deal_type: 'online',
          city: 'Delhi',
          state: 'Delhi',
          is_promoted: false,
          promotion_order: 0
        }
      ];
      setDeals(mockDeals);
    } catch (error) {
      console.error('Error loading deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterDeals = () => {
    let filtered = deals;

    if (searchQuery) {
      filtered = filtered.filter(deal =>
        deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterStatus === 'promoted') {
      filtered = filtered.filter(deal => deal.is_promoted);
    } else if (filterStatus === 'verified') {
      filtered = filtered.filter(deal => deal.is_verified);
    }

    setFilteredDeals(filtered);
  };

  const togglePromotion = async (dealId: string, currentStatus: boolean) => {
    try {
      // In a real app, this would update the database
      setDeals(prevDeals =>
        prevDeals.map(deal =>
          deal.id === dealId
            ? { ...deal, is_promoted: !currentStatus }
            : deal
        )
      );
    } catch (error) {
      console.error('Error updating promotion status:', error);
    }
  };

  const updatePromotionOrder = async (dealId: string, order: number) => {
    try {
      setDeals(prevDeals =>
        prevDeals.map(deal =>
          deal.id === dealId
            ? { ...deal, promotion_order: order }
            : deal
        )
      );
    } catch (error) {
      console.error('Error updating promotion order:', error);
    }
  };

  const deleteDeal = async (dealId: string) => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      try {
        setDeals(prevDeals => prevDeals.filter(deal => deal.id !== dealId));
      } catch (error) {
        console.error('Error deleting deal:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Deal Management</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {filteredDeals.length} of {deals.length} deals
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search deals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">All Deals</option>
            <option value="promoted">Promoted Only</option>
            <option value="verified">Verified Only</option>
          </select>
        </div>
      </div>

      {/* Deals Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Promotion
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDeals.map((deal) => (
                <tr key={deal.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={deal.image_url || 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=100'}
                        alt={deal.title}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">
                          {deal.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {deal.brand} • {deal.category}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatTimeAgo(deal.created_at)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-green-600">
                        {formatPrice(deal.deal_price)}
                      </p>
                      {deal.original_price > deal.deal_price && (
                        <p className="text-xs text-gray-500 line-through">
                          {formatPrice(deal.original_price)}
                        </p>
                      )}
                      <span className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold mt-1">
                        {deal.discount_percentage}% OFF
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      {deal.is_verified && (
                        <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                          Verified
                        </span>
                      )}
                      <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {deal.merchant}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant={deal.is_promoted ? "default" : "outline"}
                        size="sm"
                        onClick={() => togglePromotion(deal.id, deal.is_promoted)}
                        className={deal.is_promoted ? "bg-orange-500 hover:bg-orange-600" : ""}
                      >
                        <Star className="h-4 w-4 mr-1" />
                        {deal.is_promoted ? 'Promoted' : 'Promote'}
                      </Button>
                      {deal.is_promoted && (
                        <input
                          type="number"
                          value={deal.promotion_order}
                          onChange={(e) => updatePromotionOrder(deal.id, parseInt(e.target.value) || 0)}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="Order"
                          min="0"
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingDeal(deal)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteDeal(deal.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredDeals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No deals found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};