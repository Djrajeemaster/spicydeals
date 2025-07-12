import React, { useState, useEffect } from 'react';
import { Filter, Plus, Settings } from 'lucide-react';
import { Header } from './components/Header';
import { DealCard } from './components/DealCard';
import { DealDetailPage } from './components/DealDetailPage';
import { FilterSidebar } from './components/FilterSidebar';
import { AdminLayout } from './components/Admin/AdminLayout';
import { DealManagement } from './components/Admin/DealManagement';
import { Button } from './components/ui/button';
import { Deal, DealFilters } from './types';
import { dealService } from './lib/supabase';

// Mock data for demonstration
const mockDeals: Deal[] = [
  {
    id: '1',
    title: 'iPhone 15 Pro Max 256GB - Natural Titanium',
    model_number: 'A3108',
    brand: 'Apple',
    category: 'Mobiles',
    description: 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system. Perfect for photography enthusiasts.',
    original_price: 159900,
    deal_price: 149900,
    discount_percentage: 6,
    merchant: 'Amazon',
    deal_url: 'https://amazon.in/iphone-15-pro-max',
    image_url: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400',
    specs: { storage: '256GB', color: 'Natural Titanium', ram: '8GB' },
    warranty_info: '1 Year Apple Warranty',
    expires_at: '2024-12-31T23:59:59Z',
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
    title: 'Samsung Galaxy S24 Ultra 512GB - Titanium Black',
    model_number: 'SM-S928B',
    brand: 'Samsung',
    category: 'Mobiles',
    description: 'Flagship Samsung phone with S Pen, 200MP camera, and AI features. Great for productivity and creativity.',
    original_price: 139999,
    deal_price: 119999,
    discount_percentage: 14,
    merchant: 'Flipkart',
    deal_url: 'https://flipkart.com/samsung-s24-ultra',
    image_url: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=400',
    specs: { storage: '512GB', color: 'Titanium Black', ram: '12GB' },
    warranty_info: '1 Year Samsung Warranty',
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
  },
  {
    id: '3',
    title: 'MacBook Air M3 15-inch 512GB - Midnight',
    model_number: 'MQKW3HN/A',
    brand: 'Apple',
    category: 'Laptops',
    description: 'Latest MacBook Air with M3 chip, 15-inch Liquid Retina display, and all-day battery life.',
    original_price: 174900,
    deal_price: 164900,
    discount_percentage: 6,
    merchant: 'Croma',
    deal_url: 'https://croma.com/macbook-air-m3',
    image_url: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=400',
    specs: { storage: '512GB SSD', color: 'Midnight', ram: '8GB' },
    warranty_info: '1 Year Apple Warranty',
    created_by: 'user3',
    upvotes: 28,
    downvotes: 2,
    is_verified: true,
    created_at: '2024-01-13T09:20:00Z',
    deal_type: 'physical',
    store_name: 'Croma Electronics',
    address: 'Phoenix Mall, Bangalore',
    city: 'Bangalore',
    state: 'Karnataka',
    is_promoted: false,
    promotion_order: 0
  },
  {
    id: '4',
    title: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
    model_number: 'WH1000XM5/B',
    brand: 'Sony',
    category: 'Audio',
    description: 'Industry-leading noise canceling with exceptional sound quality. Perfect for travel and work.',
    original_price: 29990,
    deal_price: 24990,
    discount_percentage: 17,
    merchant: 'Amazon',
    deal_url: 'https://amazon.in/sony-wh1000xm5',
    image_url: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
    specs: { type: 'Over-ear', connectivity: 'Bluetooth 5.2', battery: '30 hours' },
    warranty_info: '1 Year Sony Warranty',
    created_by: 'user4',
    upvotes: 19,
    downvotes: 0,
    is_verified: true,
    created_at: '2024-01-12T14:10:00Z',
    deal_type: 'online',
    city: 'Chennai',
    state: 'Tamil Nadu',
    is_promoted: true,
    promotion_order: 2
  }
];

function App() {
  const [deals, setDeals] = useState<Deal[]>(mockDeals);
  const [filters, setFilters] = useState<DealFilters>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminActiveTab, setAdminActiveTab] = useState('deals');

  // Filter deals based on current filters
  const filteredDeals = deals.filter(deal => {
    if (filters.category && deal.category !== filters.category) return false;
    if (filters.brand && deal.brand !== filters.brand) return false;
    if (filters.city && deal.city !== filters.city) return false;
    if (filters.dealType && filters.dealType !== 'all' && deal.deal_type !== filters.dealType) return false;
    if (filters.minPrice && deal.deal_price < filters.minPrice) return false;
    if (filters.maxPrice && deal.deal_price > filters.maxPrice) return false;
    return true;
  });

  // Sort deals
  const sortedDeals = [...filteredDeals].sort((a, b) => {
    // Always show promoted deals first
    if (a.is_promoted && !b.is_promoted) return -1;
    if (!a.is_promoted && b.is_promoted) return 1;
    if (a.is_promoted && b.is_promoted) return a.promotion_order - b.promotion_order;

    switch (filters.sortBy) {
      case 'popular':
        return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
      case 'discount':
        return b.discount_percentage - a.discount_percentage;
      case 'price_low':
        return a.deal_price - b.deal_price;
      case 'price_high':
        return b.deal_price - a.deal_price;
      default: // newest
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const handleVote = async (dealId: string, voteType: 'up' | 'down') => {
    try {
      // In a real app, this would call the API
      setDeals(prevDeals => 
        prevDeals.map(deal => {
          if (deal.id === dealId) {
            return {
              ...deal,
              upvotes: voteType === 'up' ? deal.upvotes + 1 : deal.upvotes,
              downvotes: voteType === 'down' ? deal.downvotes + 1 : deal.downvotes
            };
          }
          return deal;
        })
      );
    } catch (error) {
      console.error('Error voting on deal:', error);
    }
  };

  const handleLocationChange = (location: string) => {
    setCurrentLocation(location);
    // You could also update filters to show deals for this location
  };

  const handleDealClick = (deal: Deal) => {
    setSelectedDeal(deal);
  };

  const handleBackToDeals = () => {
    setSelectedDeal(null);
  };

  // Admin mode toggle (in a real app, this would be based on user role)
  const toggleAdminMode = () => {
    setIsAdminMode(!isAdminMode);
  };

  // If in admin mode, render admin layout
  if (isAdminMode) {
    return (
      <AdminLayout activeTab={adminActiveTab} onTabChange={setAdminActiveTab}>
        {adminActiveTab === 'deals' && <DealManagement />}
        {adminActiveTab === 'users' && (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">User Management</h2>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        )}
        {adminActiveTab === 'analytics' && (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Analytics</h2>
            <p className="text-gray-600">Coming soon...</p>
          </div>
        )}
        {adminActiveTab === 'settings' && (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Settings</h2>
            <p className="text-gray-600">Coming soon...</p>
            <Button
              onClick={toggleAdminMode}
              className="mt-4"
              variant="outline"
            >
              Exit Admin Mode
            </Button>
          </div>
        )}
      </AdminLayout>
    );
  }

  // If viewing deal details, render detail page
  if (selectedDeal) {
    return (
      <DealDetailPage
        deal={selectedDeal}
        onVote={handleVote}
        onBack={handleBackToDeals}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onLocationChange={handleLocationChange}
        currentLocation={currentLocation}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <FilterSidebar
            filters={filters}
            onFiltersChange={setFilters}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          />

          {/* Main Content */}
          <div className="flex-1">
            {/* Header Actions */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">
                  Electronics Deals
                  {filters.city && ` in ${filters.city}`}
                </h1>
                <span className="text-sm text-gray-500">
                  ({sortedDeals.length} deals found)
                </span>
              </div>

              <Button className="bg-orange-500 hover:bg-orange-600">
                <Plus className="h-4 w-4 mr-2" />
                Submit Deal
              </Button>
              
              {/* Admin Mode Toggle - In a real app, this would be role-based */}
              <Button
                variant="outline"
                onClick={toggleAdminMode}
                className="hidden sm:flex"
              >
                <Settings className="h-4 w-4 mr-2" />
                Admin
              </Button>
            </div>

            {/* Deals Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              </div>
            ) : sortedDeals.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No deals found matching your criteria.</p>
                <Button
                  variant="outline"
                  onClick={() => setFilters({})}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {sortedDeals.map((deal) => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    onVote={handleVote}
                    onDealClick={handleDealClick}
                    isPromoted={deal.is_promoted}
                  />
                ))}
              </div>
            )}

            {/* Load More */}
            {sortedDeals.length > 0 && (
              <div className="text-center mt-8">
                <Button variant="outline" size="lg">
                  Load More Deals
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;