import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Plus, CheckCircle2, X } from 'lucide-react';
import { customerApi } from '../../services/customerApi';

export default function ReviewsView() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await customerApi.getReviews();
      setReviews(data || []);
    } catch (err) {
      console.error('Failed to load customer reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Mock product id or use first available
      await customerApi.createReview({
        productId: '67cb97cb4f19ca305140bb01',
        rating,
        title,
        body,
      });
      setIsModalOpen(false);
      setTitle('');
      setBody('');
      setRating(5);
      await fetchReviews();
    } catch (err) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="bg-white rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
            <h2 className="text-xl font-black text-stone-900">Reviews & Ratings</h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Share feedback on fresh produce quality with farmers & community
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0a3d24] text-white text-xs font-bold hover:bg-[#072c1a] transition cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Write Review</span>
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-3xl border border-stone-200 p-5 animate-pulse h-28" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-3">
          <p className="text-3xl">⭐</p>
          <h3 className="text-lg font-bold text-stone-800">No Reviews Written Yet</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Once you receive your fresh fruits and vegetables, you can rate and review them right here!
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 rounded-xl bg-[#0a3d24] text-white text-xs font-bold hover:bg-[#072c1a] transition"
          >
            Review Your Produce
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev._id}
              className="bg-white rounded-3xl border border-stone-200/80 p-5 space-y-2 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= rev.rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-stone-300'
                      }`}
                    />
                  ))}
                  <span className="text-xs font-bold text-stone-800 ml-1.5">{rev.title}</span>
                </div>
                <span className="text-[10px] text-stone-400">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </span>
              </div>

              <p className="text-xs text-stone-600">{rev.body || rev.comment}</p>

              <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-800 pt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified FreshFruit Purchase</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-black text-stone-900">Write a Review</h3>
              <p className="text-xs text-stone-500">How was your farm-fresh produce?</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1.5">
                  Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setRating(s)}
                      className="cursor-pointer transition transform hover:scale-110"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          s <= rating ? 'text-amber-400 fill-amber-400' : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-stone-700 ml-2">
                    {rating === 5 ? 'Exceptional Harvest!' : `${rating} Stars`}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Headline / Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Crisp, sweet and exceptionally fresh apples!"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-emerald-600 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Detailed Feedback
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Tell us about the freshness, packaging, aroma and taste..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-emerald-600 text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-bold hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-[#0a3d24] text-white font-bold hover:bg-[#072c1a] cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Post Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
