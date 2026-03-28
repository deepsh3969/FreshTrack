import React, { useState, useEffect } from 'react';
import { Star, Send, CheckCircle2, Store, Utensils, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Review {
  id: string;
  vendorName: string;
  vendorId?: string;
  foodItem: string;
  rating: number;
  reviewText: string;
  timestamp: number;
}

export default function FoodReviewSystem() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [vendorName, setVendorName] = useState('');
  const [vendorId, setVendorId] = useState('');
  const [foodItem, setFoodItem] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [filterRating, setFilterRating] = useState<number | null>(null);

  useEffect(() => {
    const savedReviews = localStorage.getItem('freshTrack_reviews');
    if (savedReviews) {
      try {
        setReviews(JSON.parse(savedReviews));
      } catch (e) {
        console.error('Failed to parse reviews');
      }
    }
  }, []);

  const saveReviews = (newReviews: Review[]) => {
    setReviews(newReviews);
    localStorage.setItem('freshTrack_reviews', JSON.stringify(newReviews));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!vendorName.trim()) {
      setError('Vendor Name is required');
      return;
    }
    if (!foodItem.trim()) {
      setError('Food Item Name is required');
      return;
    }
    if (rating === 0) {
      setError('Please provide a rating');
      return;
    }

    // Basic spam check: prevent exact duplicate reviews within 1 minute
    const isSpam = reviews.some(
      (r) =>
        r.vendorName === vendorName &&
        r.foodItem === foodItem &&
        r.reviewText === reviewText &&
        Date.now() - r.timestamp < 60000
    );

    if (isSpam) {
      setError('You recently submitted an identical review.');
      return;
    }

    const newReview: Review = {
      id: Date.now().toString(),
      vendorName,
      vendorId,
      foodItem,
      rating,
      reviewText,
      timestamp: Date.now(),
    };

    saveReviews([newReview, ...reviews]);
    setSuccess(true);
    
    // Reset form
    setVendorName('');
    setVendorId('');
    setFoodItem('');
    setRating(0);
    setReviewText('');
    
    setTimeout(() => setSuccess(false), 3000);
  };

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const filteredReviews = filterRating 
    ? reviews.filter(r => r.rating >= filterRating)
    : reviews;

  return (
    <div className="mt-12 space-y-8">
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-6 flex items-center">
          <Star className="w-6 h-6 mr-3 text-orange-500 fill-orange-500" />
          Customer Food Review
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                <Store className="w-3 h-3 mr-1" /> Vendor Name *
              </label>
              <input
                type="text"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                placeholder="e.g. Railway Kitchen 1"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-slate-50 focus:bg-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                <Store className="w-3 h-3 mr-1" /> Vendor ID (Optional)
              </label>
              <input
                type="text"
                value={vendorId}
                onChange={(e) => setVendorId(e.target.value)}
                placeholder="e.g. VEND-1234"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
              <Utensils className="w-3 h-3 mr-1" /> Food Item Name *
            </label>
            <input
              type="text"
              value={foodItem}
              onChange={(e) => setFoodItem(e.target.value)}
              placeholder="e.g. Veg Biryani"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-slate-50 focus:bg-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rating *</label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoverRating || rating)
                        ? 'text-orange-500 fill-orange-500'
                        : 'text-slate-200'
                    } transition-colors`}
                  />
                </button>
              ))}
              <span className="ml-3 text-sm font-bold text-slate-400">
                {rating > 0 ? `${rating} out of 5` : 'Select rating'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Review / Feedback</label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience with the food quality, taste, and freshness..."
              rows={4}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-slate-50 focus:bg-white resize-none"
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-xl border border-red-100"
              >
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-green-600 text-sm font-medium bg-green-50 p-3 rounded-xl border border-green-100 flex items-center"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Review submitted successfully!
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold shadow-lg shadow-green-200 hover:bg-green-700 transition-all active:scale-95 flex items-center justify-center"
          >
            <Send className="w-5 h-5 mr-2" />
            Submit Review
          </button>
        </form>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Recent Reviews</h3>
          {reviews.length > 0 && (
            <select 
              className="bg-white border border-slate-200 text-slate-600 text-sm rounded-xl px-3 py-2 outline-none focus:border-green-500 font-medium"
              value={filterRating || ''}
              onChange={(e) => setFilterRating(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars Only</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
            </select>
          )}
        </div>

        {filteredReviews.length === 0 ? (
          <div className="bg-slate-50 rounded-[2rem] p-8 text-center border border-slate-100 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
              <Star className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium">No reviews yet. Be the first to share your experience!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence>
              {filteredReviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-black text-slate-900 text-lg">{review.vendorName}</h4>
                      <div className="flex items-center text-xs text-slate-500 font-medium mt-1">
                        <Utensils className="w-3 h-3 mr-1" /> {review.foodItem}
                        {review.vendorId && (
                          <span className="ml-2 px-2 py-0.5 bg-slate-100 rounded-md text-[10px] uppercase tracking-wider">
                            ID: {review.vendorId}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 bg-orange-50 px-2 py-1 rounded-lg border border-orange-100">
                      <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                      <span className="font-black text-orange-600 text-sm">{review.rating}.0</span>
                    </div>
                  </div>
                  
                  {review.reviewText && (
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      "{review.reviewText}"
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-slate-400 font-medium pt-4 border-t border-slate-50">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatTimeAgo(review.timestamp)}
                    </div>
                    <button className="flex items-center hover:text-green-600 transition-colors">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Helpful
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
