import React, { useState, useEffect } from 'react';
import { Truck, Clock, AlertTriangle, CheckCircle, MapPin, UserCheck, Shield } from 'lucide-react';
import { adminApi } from '../adminApi';

export default function DeliveryView({ showDelayedOnly = false }) {
  const [deliveries, setDeliveries] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getDeliveries();
      setDeliveries(data.assignments || []);
      setPartners(data.partners || []);
    } catch (err) {
      console.error('[Delivery Error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = showDelayedOnly
    ? deliveries.filter((d) => d.isDelayed || d.status === 'delayed')
    : deliveries;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-stone-900 tracking-tight">
            Cold-Chain Delivery & Fleet Tracking
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Monitor real-time farm-to-table transit dispatch and delayed route alerts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
            {partners.length} Active Fleet Drivers
          </span>
        </div>
      </div>

      {/* Deliveries Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase font-extrabold text-[10px] tracking-wider">
              <tr>
                <th className="py-4 px-6">Order Number</th>
                <th className="py-4 px-6">Assigned Fleet Driver</th>
                <th className="py-4 px-6">Pickup Farm Location</th>
                <th className="py-4 px-6">Drop Customer Address</th>
                <th className="py-4 px-6">Fulfillment Status</th>
                <th className="py-4 px-6">Transit Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((d) => (
                <tr key={d._id} className="hover:bg-stone-50/80 transition">
                  <td className="py-4 px-6 font-mono font-bold text-stone-900">
                    {d.orderNumber}
                  </td>
                  <td className="py-4 px-6 font-semibold text-stone-800">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-emerald-600" />
                      <span>{d.partnerName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-stone-600">
                    {d.pickupLocation?.city || 'Nashik Agri Hub'}
                  </td>
                  <td className="py-4 px-6 text-stone-600">
                    {d.dropLocation?.city || 'Buyer City'}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                        d.status === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : d.status === 'delayed'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-sky-100 text-sky-800'
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {d.isDelayed || d.status === 'delayed' ? (
                      <span className="flex items-center gap-1.5 text-rose-700 font-bold text-[11px]">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {d.delayReason || 'Transit delayed'}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px]">
                        <CheckCircle className="w-3.5 h-3.5" />
                        On Schedule
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-stone-400">
                    No delivery records matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

