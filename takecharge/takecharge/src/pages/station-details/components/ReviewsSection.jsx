import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ReviewsSection = ({ reviews, overallRating, totalReviews }) => {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const displayedReviews = showAllReviews ? reviews : reviews?.slice(0, 3);

  const ratingDistribution = [
    { stars: 5, count: 45, percentage: 65 },
    { stars: 4, count: 15, percentage: 22 },
    { stars: 3, count: 6, percentage: 9 },
    { stars: 2, count: 2, percentage: 3 },
    { stars: 1, count: 1, percentage: 1 }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Reviews' },
    { value: '5', label: '5 Stars' },
    { value: '4', label: '4 Stars' },
    { value: 'recent', label: 'Most Recent' },
    { value: 'helpful', label: 'Most Helpful' }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="Star"
        size={14}
        className={`${
          index < rating ? 'text-warning fill-current' : 'text-muted-foreground'
        }`}
      />
    ));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-card rounded-lg shadow-elevation-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Reviews & Ratings</h2>
        <Button
          variant="outline"
          size="sm"
          iconName="Plus"
          iconPosition="left"
          iconSize={16}
        >
          Write Review
        </Button>
      </div>
      {/* Overall Rating Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
            <span className="text-4xl font-bold text-foreground">{overallRating}</span>
            <div className="flex items-center">
              {renderStars(Math.floor(overallRating))}
            </div>
          </div>
          <p className="text-muted-foreground">
            Based on {totalReviews} reviews
          </p>
        </div>

        <div className="lg:col-span-2">
          <div className="space-y-2">
            {ratingDistribution?.map((item) => (
              <div key={item?.stars} className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground w-8">
                  {item?.stars}★
                </span>
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div
                    className="bg-warning h-2 rounded-full transition-all duration-300"
                    style={{ width: `${item?.percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-muted-foreground w-8">
                  {item?.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Filter Options */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filterOptions?.map((option) => (
          <button
            key={option?.value}
            onClick={() => setSelectedFilter(option?.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
              selectedFilter === option?.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {option?.label}
          </button>
        ))}
      </div>
      {/* Reviews List */}
      <div className="space-y-6">
        {displayedReviews?.map((review) => (
          <div key={review?.id} className="border-b border-border pb-6 last:border-b-0 last:pb-0">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-10 h-10 bg-secondary rounded-full flex-shrink-0">
                <span className="text-sm font-medium text-secondary-foreground">
                  {review?.userName?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-foreground">{review?.userName}</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {renderStars(review?.rating)}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(review?.date)}
                      </span>
                    </div>
                  </div>
                  
                  {review?.verified && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-success/10 text-success rounded-full">
                      <Icon name="CheckCircle" size={12} />
                      <span className="text-xs font-medium">Verified</span>
                    </div>
                  )}
                </div>
                
                <p className="text-foreground mb-3 leading-relaxed">
                  {review?.comment}
                </p>
                
                {review?.photos && review?.photos?.length > 0 && (
                  <div className="flex gap-2 mb-3">
                    {review?.photos?.slice(0, 3)?.map((photo, index) => (
                      <div key={index} className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
                        <img
                          src={photo}
                          alt={`Review photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {review?.photos?.length > 3 && (
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">
                          +{review?.photos?.length - 3}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <button className="flex items-center gap-1 hover:text-foreground transition-colors duration-200">
                    <Icon name="ThumbsUp" size={14} />
                    <span>Helpful ({review?.helpfulCount})</span>
                  </button>
                  <button className="hover:text-foreground transition-colors duration-200">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Show More/Less Button */}
      {reviews?.length > 3 && (
        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            onClick={() => setShowAllReviews(!showAllReviews)}
            iconName={showAllReviews ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
            iconSize={16}
          >
            {showAllReviews ? 'Show Less' : `Show All ${reviews?.length} Reviews`}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;