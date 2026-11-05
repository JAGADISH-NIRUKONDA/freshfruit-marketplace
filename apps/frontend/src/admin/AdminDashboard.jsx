import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminOverview from './AdminOverview';
import UsersView from './views/UsersView';
import SellersView from './views/SellersView';
import ProductsView from './views/ProductsView';
import CategoriesView from './views/CategoriesView';
import InventoryView from './views/InventoryView';
import OrdersView from './views/OrdersView';
import PaymentsRefundsView from './views/PaymentsRefundsView';
import DeliveryView from './views/DeliveryView';
import AnalyticsReportsView from './views/AnalyticsReportsView';
import EngagementView from './views/EngagementView';
import SystemSettingsView from './views/SystemSettingsView';
import { adminApi } from './adminApi';

const TAB_TITLES = {
  dashboard: 'Executive Overview',
  users_all: 'User Management · All Users',
  users_customers: 'User Management · Customers',
  users_sellers: 'User Management · Sellers & Farmers',
  users_delivery: 'User Management · Delivery Partners',
  users_support: 'User Management · Support Agents',
  seller_approvals: 'Marketplace · Farmer & Seller Approvals',
  product_approvals: 'Marketplace · Product Quality Approvals',
  products_all: 'Marketplace · All Products Catalog',
  categories: 'Marketplace · Category Hierarchy',
  inventory: 'Marketplace · Inventory & Batch Tracking',
  quality: 'Marketplace · Organic Grade Inspection',
  orders_all: 'Order Operations · Full Order Registry',
  orders_pending: 'Order Operations · Pending Dispatch',
  orders_processing: 'Order Operations · Processing in Packing House',
  orders_completed: 'Order Operations · Completed & Delivered',
  orders_returns: 'Order Operations · Returns & Cancellations',
  payments_transactions: 'Financials · Unified Payment Journal',
  payments_razorpay: 'Financials · Razorpay Gateway Transactions',
  payments_cod: 'Financials · Cash on Delivery Settlement',
  refunds: 'Financials · Disputed & Refund Queue',
  delivery_partners: 'Logistics · Courier Fleet & Partners',
  delivery_assignments: 'Logistics · Live Dispatch & Assignments',
  delivery_delayed: 'Logistics · Delayed Route Alerts',
  analytics_revenue: 'Intelligence · Revenue & Sales Dynamics',
  analytics_reports: 'Intelligence · Operational & Audit Reports',
  reviews: 'Engagement · Verified Customer Reviews',
  coupons: 'Engagement · Discount Codes & Marketing',
  notifications: 'Engagement · Broadcast Announcements',
  support: 'Engagement · Helpdesk Support Desk',
  system_roles: 'Governance · RBAC Role Matrix',
  audit_logs: 'Governance · Real-time Audit Trail',
  platform_settings: 'Governance · Global Platform Configuration',
};

export default function AdminDashboard({ adminUser, onLogout, onExitToMarketplace }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pendingCounts, setPendingCounts] = useState({
    sellerApprovals: 0,
    productApprovals: 0,
    lowStock: 0,
    refunds: 0,
    delayedDeliveries: 0,
    supportTickets: 0,
  });

  const loadPendingCounts = useCallback(async () => {
    try {
      const stats = await adminApi.getOverviewStats();
      if (stats) {
        setPendingCounts({
          sellerApprovals: stats.pendingSellers || 0,
          productApprovals: stats.pendingProducts || 0,
          lowStock: stats.lowStockProducts || 0,
          refunds: stats.pendingRefunds || 0,
          delayedDeliveries: stats.delayedDeliveries || 0,
          supportTickets: stats.pendingTickets || 0,
        });
      }
    } catch (err) {
      console.warn('Failed to fetch pending badge counts:', err.message);
    }
  }, []);

  useEffect(() => {
    loadPendingCounts();
  }, [loadPendingCounts]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadPendingCounts();
    // Dispatch a custom event so the active view can refresh its own data
    window.dispatchEvent(new CustomEvent('admin-refresh-data'));
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminOverview onNavigate={(tab) => setActiveTab(tab)} />;

      // User Management
      case 'users_all':
      case 'users_customers':
      case 'users_sellers':
      case 'users_delivery':
      case 'users_support':
        return <UsersView subTab={activeTab} />;

      // Marketplace & Catalog
      case 'seller_approvals':
        return <SellersView subTab="seller_approvals" />;
      case 'product_approvals':
      case 'products_all':
      case 'quality':
        return <ProductsView subTab={activeTab} />;
      case 'categories':
        return <CategoriesView />;
      case 'inventory':
        return <InventoryView />;

      // Orders
      case 'orders_all':
      case 'orders_pending':
      case 'orders_processing':
      case 'orders_completed':
      case 'orders_returns':
        return <OrdersView subTab={activeTab} />;

      // Payments & Refunds
      case 'payments_transactions':
      case 'payments_razorpay':
      case 'payments_cod':
      case 'refunds':
        return <PaymentsRefundsView subTab={activeTab} />;

      // Delivery & Fleet
      case 'delivery_partners':
      case 'delivery_assignments':
      case 'delivery_delayed':
        return <DeliveryView subTab={activeTab} />;

      // Analytics
      case 'analytics_revenue':
      case 'analytics_reports':
        return <AnalyticsReportsView subTab={activeTab} />;

      // Engagement
      case 'reviews':
      case 'coupons':
      case 'notifications':
      case 'support':
        return <EngagementView subTab={activeTab} />;

      // System Management
      case 'system_roles':
      case 'audit_logs':
      case 'platform_settings':
        return <SystemSettingsView subTab={activeTab} />;

      default:
        return <AdminOverview onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <div className="flex h-screen bg-stone-100 font-sans overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full shrink-0">
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          onLogout={onLogout}
          onExitToMarketplace={onExitToMarketplace}
          pendingCounts={pendingCounts}
        />
      </div>

      {/* Mobile Drawer Sidebar */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#0f2d21]">
            <AdminSidebar
              activeTab={activeTab}
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setIsMobileSidebarOpen(false);
              }}
              isCollapsed={false}
              setIsCollapsed={() => setIsMobileSidebarOpen(false)}
              onLogout={onLogout}
              onExitToMarketplace={onExitToMarketplace}
              pendingCounts={pendingCounts}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader
          activeTabTitle={TAB_TITLES[activeTab] || 'Admin Dashboard'}
          adminUser={adminUser}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          onExitToMarketplace={onExitToMarketplace}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-6">
            {renderActiveView()}
          </div>
        </main>
      </div>
    </div>
  );
}

