import React from 'react';
import { ArrowLeft, ThumbsUp, ThumbsDown, MapPin, Clock, ExternalLink, Star, Shield, Truck } from 'lucide-react';
import { Deal } from '../types';
import { formatPrice, formatTimeAgo, generateAffiliateLink } from '../lib/utils';
import { Button } from './ui/button';

interface DealDetailPageProps {
  deal: Deal;
  onVote: (dealId: string, voteType: 'up' | 'down') => void;
  onBack: () => void;
}

export const DealDetailPage: React.FC<DealDetailPageProps> = ({ deal, onVote, onBack }) => {
  const handleDealClick = () => {
    const affiliateUrl = generateAffiliateLink(deal.deal_url, deal.merchant);
    window.open(affiliateUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900 truncate">Deal Details</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {deal.is_promoted && (
            <div className="bg-orange-500 text-white px-4 py-2 text-center">
              <Star className="inline h-4 w-4 mr-2" />
              <span className="font-semibold">Promoted Deal</span>
            </div>
          )}

          <div className="p-6">
            {/* Product Image and Basic Info */}
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="flex-shrink-0">
                <img
                  src={deal.image_url || 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400'}
                  alt={deal.title}
                  className="w-full md:w-64 h-64 object-cover rounded-lg"
                />
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{deal.title}</h2>
                {deal.model_number && (
                  <p className="text-gray-600 mb-2">Model: {deal.model_number}</p>
                )}
                <p className="text-lg text-gray-700 mb-4">{deal.brand} • {deal.category}</p>

                {/* Price Section */}
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-3xl font-bold text-green-600">
                    {formatPrice(deal.deal_price)}
                  </span>
                  {deal.original_price > deal.deal_price && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        {formatPrice(deal.original_price)}
                      </span>
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {deal.discount_percentage}% OFF
                      </span>
                    </>
                  )}
                </div>

                {/* Voting and Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onVote(deal.id, 'up')}
                        className="hover:bg-green-50 hover:text-green-600"
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {deal.upvotes}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onVote(deal.id, 'down')}
                        className="hover:bg-red-50 hover:text-red-600"
                      >
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        {deal.downvotes}
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={handleDealClick}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2"
                    size="lg"
                  >
                    <ExternalLink className="h-5 w-5 mr-2" />
                    Get This Deal
                  </Button>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">{deal.description}</p>
            </div>

            {/* Specifications */}
            {deal.specs && Object.keys(deal.specs).length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(deal.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-600 capitalize">{key.replace('_', ' ')}</span>
                      <span className="text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Deal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Merchant & Store Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Store Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-semibold">
                      {deal.merchant}
                    </span>
                    <span className="text-sm text-gray-600">
                      {deal.deal_type === 'online' ? 'Online Store' : 'Physical Store'}
                    </span>
                  </div>
                  {deal.store_name && (
                    <p className="text-sm text-gray-700">{deal.store_name}</p>
                  )}
                  {deal.address && (
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div className="text-sm text-gray-700">
                        <p>{deal.address}</p>
                        <p>{deal.city}, {deal.state} {deal.pincode}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Additional Information</h4>
                <div className="space-y-3">
                  {deal.warranty_info && (
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700">{deal.warranty_info}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">Posted {formatTimeAgo(deal.created_at)}</span>
                  </div>
                  {deal.expires_at && (
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-red-600">
                        Expires: {new Date(deal.expires_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Status Badges */}
            <div className="flex flex-wrap gap-2">
              {deal.is_verified && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  <Shield className="inline h-3 w-3 mr-1" />
                  Verified Deal
                </span>
              )}
              {deal.deal_type === 'physical' && (
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                  <MapPin className="inline h-3 w-3 mr-1" />
                  In-Store Only
                </span>
              )}
              {deal.is_promoted && (
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
                  <Star className="inline h-3 w-3 mr-1" />
                  Promoted
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};