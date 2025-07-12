import React from 'react';
import { Filter, X } from 'lucide-react';
import { DealFilters } from '../types';
import { Button } from './ui/button';

interface FilterSidebarProps {
  filters: DealFilters;
  onFiltersChange: (filters: DealFilters) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFiltersChange,
  isOpen,
  onClose
}) => {
  const categories = [
    'Mobiles', 'Laptops', 'Tablets', 'Cameras', 'Audio', 'Gaming', 
    'Smart TV', 'Accessories', 'Components', 'Wearables'
  ];

  const brands = [
    'Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Realme', 'HP', 'Dell', 
    'Lenovo', 'Asus', 'Sony', 'LG', 'Canon', 'Nikon'
  ];

  const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad',
    'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'
  ];

  const updateFilter = (key: keyof DealFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:shadow-none lg:border-r
      `}>
        <div className="p-6 h-full overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Category</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  checked={!filters.category}
                  onChange={() => updateFilter('category', undefined)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">All Categories</span>
              </label>
              {categories.map((category) => (
                <label key={category} className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === category}
                    onChange={() => updateFilter('category', category)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Brand</h3>
            <select
              value={filters.brand || ''}
              onChange={(e) => updateFilter('brand', e.target.value || undefined)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Min Price (₹)</label>
                <input
                  type="number"
                  value={filters.minPrice || ''}
                  onChange={(e) => updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Max Price (₹)</label>
                <input
                  type="number"
                  value={filters.maxPrice || ''}
                  onChange={(e) => updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="No limit"
                />
              </div>
            </div>
          </div>

          {/* Location Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Location</h3>
            <select
              value={filters.city || ''}
              onChange={(e) => updateFilter('city', e.target.value || undefined)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">All Locations</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Deal Type Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Deal Type</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="dealType"
                  checked={filters.dealType === 'all' || !filters.dealType}
                  onChange={() => updateFilter('dealType', 'all')}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">All Deals</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="dealType"
                  checked={filters.dealType === 'online'}
                  onChange={() => updateFilter('dealType', 'online')}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Online Only</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="dealType"
                  checked={filters.dealType === 'physical'}
                  onChange={() => updateFilter('dealType', 'physical')}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">In-Store Only</span>
              </label>
            </div>
          </div>

          {/* Sort By */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Sort By</h3>
            <select
              value={filters.sortBy || 'newest'}
              onChange={(e) => updateFilter('sortBy', e.target.value as any)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
              <option value="discount">Highest Discount</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>

          {/* Clear Filters */}
          <Button
            variant="outline"
            onClick={() => onFiltersChange({})}
            className="w-full"
          >
            Clear All Filters
          </Button>
        </div>
      </div>
    </>
  );
};