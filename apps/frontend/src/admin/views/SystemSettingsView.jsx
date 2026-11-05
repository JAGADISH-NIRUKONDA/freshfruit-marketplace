import React, { useState, useEffect } from 'react';
import {
  History,
  Sliders,
  KeyRound,
  Shield,
  Save,
  CheckCircle,
} from 'lucide-react';
import { adminApi } from '../adminApi';

export default function SystemSettingsView({ initialTab = 'audit' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [auditLogs, setAuditLogs] = useState([]);
  const [settings, setSettings] = useState({
    platformName: 'FreshFruit Market',
    supportEmail: 'admin@freshfruit.demo',
    contactPhone: '+91 98000 00000',
    currency: 'INR',
    deliveryFee: 40,
    minOrderAmount: 199,
    sellerCommissionRate: 5,
    maintenanceMode: false,
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    adminApi.getAuditLogs().then((data) => setAuditLogs(data.logs || []));
    adminApi.getSettings().then((data) => {
      if (data) setSettings(data);
    });
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    setSavedSuccess(false);
    try {
      await adminApi.updateSettings(settings);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert(err.message);
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs flex items-center gap-2">
        <button
          onClick={() => setActiveTab('audit')}
          className={`text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
            activeTab === 'audit'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Audit Logs ({auditLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Platform Settings</span>
        </button>

        <button
          onClick={() => setActiveTab('roles')}
          className={`text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
            activeTab === 'roles'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Roles & Permissions Matrix</span>
        </button>
      </div>

      {/* 1. Audit Activity Logs */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-stone-200">
            <h3 className="font-extrabold text-stone-900 text-base">Administrative Audit Trail</h3>
            <p className="text-xs text-stone-500">
              Immutable records of administrator actions, approvals, and stock modifications
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase font-extrabold text-[10px] tracking-wider">
                <tr>
                  <th className="py-4 px-6">Timestamp</th>
                  <th className="py-4 px-6">Administrator</th>
                  <th className="py-4 px-6">Action Event</th>
                  <th className="py-4 px-6">Entity</th>
                  <th className="py-4 px-6">Event Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {auditLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-stone-50/80 transition">
                    <td className="py-4 px-6 text-stone-500 font-mono text-[11px]">
                      {new Date(log.createdAt).toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-6 font-semibold text-stone-900">
                      {log.adminEmail}
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-stone-100 text-stone-800">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-4 px-6 uppercase text-[11px] font-mono text-emerald-800">
                      {log.entityType}
                    </td>
                    <td className="py-4 px-6 text-stone-600 font-mono text-[11px] truncate max-w-xs">
                      {JSON.stringify(log.details)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. Platform Settings */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 sm:p-8 max-w-2xl">
          <h3 className="text-lg font-black text-stone-900 mb-1">Global Marketplace Parameters</h3>
          <p className="text-xs text-stone-500 mb-6">
            Configure marketplace rules, commission rates, and checkout requirements
          </p>

          {savedSuccess && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Settings saved and updated across marketplace services.
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Platform Name</label>
              <input
                type="text"
                value={settings.platformName || ''}
                onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-stone-200 font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Support Email</label>
                <input
                  type="email"
                  value={settings.supportEmail || ''}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-200 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={settings.contactPhone || ''}
                  onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-200 font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Currency</label>
                <input
                  type="text"
                  disabled
                  value={settings.currency || 'INR'}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Flat Delivery Fee (₹)</label>
                <input
                  type="number"
                  value={settings.deliveryFee || 0}
                  onChange={(e) => setSettings({ ...settings, deliveryFee: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-stone-200 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Seller Commission (%)</label>
                <input
                  type="number"
                  value={settings.sellerCommissionRate || 5}
                  onChange={(e) => setSettings({ ...settings, sellerCommissionRate: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-stone-200 font-bold"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <input
                type="checkbox"
                id="maintenance"
                checked={settings.maintenanceMode || false}
                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="maintenance" className="font-bold text-stone-800">
                Maintenance Mode (Restricts public checkout transactions)
              </label>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={savingSettings}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2.5 rounded-xl transition flex items-center gap-2 shadow-xs disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{savingSettings ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Roles Matrix */}
      {activeTab === 'roles' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-black text-stone-900">Role-Based Access Control Matrix</h3>
          <p className="text-xs text-stone-500">
            Administrative permissions enforced by server-side middleware (`authorize('admin')`)
          </p>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 uppercase font-extrabold text-[10px] tracking-wider text-stone-600">
                <tr>
                  <th className="py-3 px-4">Marketplace Module</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Seller / Farmer</th>
                  <th className="py-3 px-4">Delivery Fleet</th>
                  <th className="py-3 px-4">Support Agent</th>
                  <th className="py-3 px-4">Super Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {[
                  { module: 'Produce Browsing & Checkout', customer: 'Read/Write', seller: 'Read', delivery: 'Read', support: 'Read', admin: 'Full Access' },
                  { module: 'Seller Verification Queue', customer: 'No Access', seller: 'Own Profile', delivery: 'No Access', support: 'Read', admin: 'Approve / Reject' },
                  { module: 'Product Catalogue Approvals', customer: 'No Access', seller: 'Own Listings', delivery: 'No Access', support: 'Read', admin: 'Approve / Reject' },
                  { module: 'Inventory Stock Adjustments', customer: 'No Access', seller: 'Own Stock', delivery: 'No Access', support: 'Read', admin: 'Full Override' },
                  { module: 'Refund Decisions & Financials', customer: 'Request', seller: 'View Impact', delivery: 'No Access', support: 'Review', admin: 'Authorize Payout' },
                  { module: 'Platform Settings & Audit Logs', customer: 'No Access', seller: 'No Access', delivery: 'No Access', support: 'No Access', admin: 'Full Control' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-stone-50">
                    <td className="py-3 px-4 font-bold text-stone-900">{row.module}</td>
                    <td className="py-3 px-4 text-stone-600">{row.customer}</td>
                    <td className="py-3 px-4 text-stone-600">{row.seller}</td>
                    <td className="py-3 px-4 text-stone-600">{row.delivery}</td>
                    <td className="py-3 px-4 text-stone-600">{row.support}</td>
                    <td className="py-3 px-4 font-extrabold text-emerald-800 bg-emerald-50/50">{row.admin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

