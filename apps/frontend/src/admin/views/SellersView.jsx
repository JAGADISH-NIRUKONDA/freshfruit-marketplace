import React, { useState, useEffect } from 'react';
import {
  Tractor,
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin,
  Award,
  Phone,
  Mail,
  Search,
  Star,
  FileCheck,
} from 'lucide-react';
import { adminApi } from '../adminApi';

export default function SellersView({ filterStatus = 'all' }) {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(filterStatus);
  const [rejectModal, setRejectModal] = useState({ open: false, farmerId: null, reason: '' });

  useEffect(() => {
    setStatus(filterStatus);
  }, [filterStatus]);

  const fetchSellers = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getSellers({ status, search });
      setSellers(data.sellers || []);
    } catch (err) {
      console.error('[Fetch Sellers Error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, [status]);

  const handleApprove = async (id) => {
    if (!window.confirm('Approve this farmer profile for active marketplace selling?')) return;
    try {
      await adminApi.updateSellerVerification(id, 'approved');
      await fetchSellers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectModal.reason.trim()) {
      alert('Please provide a specific rejection reason for the grower.');
      return;
    }
    try {
      await adminApi.updateSellerVerification(rejectModal.farmerId, 'rejected', rejectModal.reason);
      setRejectModal({ open: false, farmerId: null, reason: '' });
      await fetchSellers();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner with Farmer Photography */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-r from-[#153d2c] to-[#1e583f] text-white shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-lime-300 bg-emerald-950/60 px-2.5 py-1 rounded-full">
            Grower Traceability & Compliance
          </span>
          <h2 className="text-2xl font-black tracking-tight">
            Seller & Farm Verification Queue
          </h2>
          <p className="text-xs text-emerald-100/90 leading-relaxed">
            Audit farmer profiles, verify PGS-India and NPOP organic certifications, and ensure only legitimate chemical-free growers publish produce to the marketplace.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'all', label: 'All Growers' },
            { id: 'pending', label: 'Pending Review' },
            { id: 'under_review', label: 'Under Review' },
            { id: 'approved', label: 'Approved Verified' },
            { id: 'rejected', label: 'Rejected' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatus(tab.id)}
              className={`text-xs font-bold px-4 py-2 rounded-xl transition ${
                status === tab.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-stone-500 font-semibold">
          Showing {sellers.length} registered farms
        </div>
      </div>

      {/* Sellers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sellers.map((farmer) => (
          <div
            key={farmer._id}
            className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Header Profile */}
              <div className="flex items-start justify-between gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg shrink-0">
                  <Tractor className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-extrabold text-stone-900 text-base leading-tight">
                    {farmer.farmName}
                  </h3>
                  <div className="text-xs text-stone-500 mt-0.5">
                    Owner: {farmer.userId?.name || 'Local Farmer'}
                  </div>
                </div>
                <span
                  className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full shrink-0 ${
                    farmer.verificationStatus === 'approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : farmer.verificationStatus === 'rejected'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {farmer.verificationStatus}
                </span>
              </div>

              {/* Bio & Location */}
              <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                {farmer.bio || 'Chemical-free fruit and vegetable agriculturalist.'}
              </p>

              <div className="space-y-1.5 pt-2 border-t border-stone-100 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    {farmer.farmAddress?.street}, {farmer.farmAddress?.city}, {farmer.farmAddress?.state}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>{farmer.phone || farmer.userId?.phone || 'No phone'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                  <span className="font-bold text-stone-800">{farmer.rating} ★</span>
                  <span className="text-stone-400">({farmer.totalReviews} buyer ratings)</span>
                </div>
              </div>

              {/* Certifications Badges */}
              {farmer.certifications?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {farmer.certifications.map((cert) => (
                    <span
                      key={cert}
                      className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1"
                    >
                      <Award className="w-3 h-3 text-emerald-600" />
                      {cert}
                    </span>
                  ))}
                </div>
              )}

              {farmer.rejectionReason && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                  <strong>Rejection Note:</strong> {farmer.rejectionReason}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-5 mt-5 border-t border-stone-100 flex items-center gap-2">
              {farmer.verificationStatus !== 'approved' && (
                <button
                  onClick={() => handleApprove(farmer._id)}
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" /> Approve
                </button>
              )}

              {farmer.verificationStatus !== 'rejected' && (
                <button
                  onClick={() => setRejectModal({ open: true, farmerId: farmer._id, reason: '' })}
                  className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" /> Reject
                </button>
              )}
            </div>
          </div>
        ))}

        {sellers.length === 0 && !loading && (
          <div className="col-span-3 py-16 text-center bg-white rounded-3xl border border-dashed border-stone-300 text-stone-400">
            No farmer profiles in this category.
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-stone-900">
              Provide Grower Rejection Reason
            </h3>
            <p className="text-xs text-stone-500">
              State why the farmer registration or documentation was rejected (e.g. missing residue-free certificates, invalid GPS coordinates).
            </p>

            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <textarea
                required
                rows={4}
                value={rejectModal.reason}
                onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
                placeholder="Enter detailed feedback for the grower..."
                className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:border-rose-600 outline-hidden"
              />

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setRejectModal({ open: false, farmerId: null, reason: '' })}
                  className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold py-2.5 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold py-2.5 rounded-xl"
                >
                  Submit Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

