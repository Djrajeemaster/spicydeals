import React from 'react';
import { ThumbsUp, ThumbsDown, MapPin, Clock, ExternalLink, Star } from 'lucide-react';
import { Deal } from '../types';
import { formatPrice, formatTimeAgo, generateAffiliateLink } from '../lib/utils';
import { Button } from './ui/button';

interface DealCardProps {
  deal: Deal;
  onVote: (dealId: string, voteType: 'up' | 'down') => void;
  onDealClick: (deal: Deal) => void;
  isPromoted?: boolean;
}

export const DealCard: React.FC<DealCardProps> = ({ deal, onVote, onDealClick, isPromoted }) => {
  const handleDealClick = () => {
    const affiliateUrl = generateAffiliateLink(deal.deal_url, deal.merchant);
    window.open(affiliateUrl, '_blank');
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger card click if clicking on buttons or voting
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onDealClick(deal);
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden cursor-pointer ${
      isPromoted ? 'ring-2 ring-orange-500 relative' : ''
      }`}
      onClick={handleCardClick}
    >
      {isPromoted && (
        <div className="absolute top-0 right-0 bg-orange-500 text-white px-3 py-1 text-xs font-semibold rounded-bl-lg">
          <Star className="inline h-3 w-3 mr-1" />
          Promoted
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start space-x-4">
          {/* Product Image */}
          <div className="flex-shrink-0">
            <img
              src={deal.image_url || 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=200'}
              alt={deal.title}
              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
            />
          </div>

          {/* Deal Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2 mb-1">
                  {deal.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2 hidden sm:block">
                  {deal.brand} • {deal.category}
                </p>
                
                {/* Price Section */}
                <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                  <span className="text-lg sm:text-2xl font-bold text-green-600">
                    {formatPrice(deal.deal_price)}
                  </span>
                  {deal.original_price > deal.deal_price && (
                    <>
                      <span className="text-sm sm:text-lg text-gray-500 line-through hidden sm:inline">
                        {formatPrice(deal.original_price)}
                      </span>
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs sm:text-sm font-semibold">
                        {deal.discount_percentage}% OFF
                      </span>
                    </>
                  )}
                </div>

                {/* Location & Time */}
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3 hidden sm:flex">
                  {deal.city && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{deal.city}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatTimeAgo(deal.created_at)}</span>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    {deal.merchant}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-700 text-sm line-clamp-2 mb-2 sm:mb-4">
                  {deal.description}
                </p>
              </div>

              {/* Voting Section */}
              <div className="flex flex-col items-center space-y-1 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onVote(deal.id, 'up')}
                  className="p-1 hover:bg-green-50 hover:text-green-600"
                >
                  <ThumbsUp className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                <span className="text-xs sm:text-sm font-semibold text-gray-700">
                  {deal.upvotes - deal.downvotes}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onVote(deal.id, 'down')}
                  className="p-1 hover:bg-red-50 hover:text-red-600"
                >
                  <ThumbsDown className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2 sm:pt-4 border-t">
              <div className="flex items-center space-x-2">
                {deal.is_verified && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold hidden sm:inline">
                    Verified
                  </span>
                )}
                {deal.deal_type === 'physical' && (
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-semibold hidden sm:inline">
                    In-Store
                  </span>
                )}
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs sm:hidden">
                  {deal.merchant}
                </span>
              </div>
              
              <Button
                onClick={handleDealClick}
                className="bg-orange-500 hover:bg-orange-600 text-white"
                size="sm"
              >
                <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Get Deal
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};