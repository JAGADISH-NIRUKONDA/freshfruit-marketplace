import React from 'react';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Tractor,
  Truck,
  Headphones,
  CheckSquare,
  ShieldCheck,
  Package,
  Layers,
  Boxes,
  Microscope,
  ShoppingBag,
  Clock,
  RotateCcw,
  CreditCard,
  Banknote,
  DollarSign,
  TrendingUp,
  FileText,
  Star,
  Tag,
  Bell,
  MessageSquare,
  KeyRound,
  History,
  Sliders,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Leaf,
  LogOut,
  ExternalLink,
} from 'lucide-react';

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  onLogout,
  onExitToMarketplace,
  pendingCounts = {},
}) {
  const [openSections, setOpenSections] = React.useState({
    overview: true,
    users: true,
    marketplace: true,
    orders: true,
    payments: false,
    delivery: false,
    analytics: false,
    engagement: false,
    system: false,
  });

  const toggleSection = (sec) => {
    setOpenSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  const menuSections = [
    {
      id: 'overview',
      title: 'ADMIN OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      id: 'users',
      title: 'USER MANAGEMENT',
      items: [
        { id: 'users_all', label: 'All Users', icon: Users },
        { id: 'users_customers', label: 'Customers', icon: UserCheck },
        { id: 'users_sellers', label: 'Sellers & Farmers', icon: Tractor },
        { id: 'users_delivery', label: 'Delivery Partners', icon: Truck },
        { id: 'users_support', label: 'Support Agents', icon: Headphones },
      ],
    },
    {
      id: 'marketplace',
      title: 'MARKETPLACE MANAGEMENT',
      items: [
        { id: 'seller_approvals', label: 'Seller Approvals', icon: CheckSquare, badge: pendingCounts.sellerApprovals },
        { id: 'product_approvals', label: 'Product Approvals', icon: ShieldCheck, badge: pendingCounts.productApprovals },
        { id: 'products_all', label: 'All Products', icon: Package },
        { id: 'categories', label: 'Categories', icon: Layers },
        { id: 'inventory', label: 'Inventory Management', icon: Boxes, badge: pendingCounts.lowStock },
        { id: 'quality', label: 'Quality Inspection', icon: Microscope },
      ],
    },
    {
      id: 'orders',
      title: 'ORDER OPERATIONS',
      items: [
        { id: 'orders_all', label: 'All Orders', icon: ShoppingBag },
        { id: 'orders_pending', label: 'Pending Orders', icon: Clock },
        { id: 'orders_processing', label: 'Processing Orders', icon: Package },
        { id: 'orders_completed', label: 'Completed Orders', icon: CheckSquare },
        { id: 'orders_returns', label: 'Returns & Cancelled', icon: RotateCcw },
      ],
    },
    {
      id: 'payments',
      title: 'PAYMENTS & REFUNDS',
      items: [
        { id: 'payments_transactions', label: 'All Transactions', icon: CreditCard },
        { id: 'payments_razorpay', label: 'Razorpay Online', icon: DollarSign },
        { id: 'payments_cod', label: 'Cash on Delivery', icon: Banknote },
        { id: 'refunds', label: 'Refund Management', icon: RotateCcw, badge: pendingCounts.refunds },
      ],
    },
    {
      id: 'delivery',
      title: 'DELIVERY MANAGEMENT',
      items: [
        { id: 'delivery_partners', label: 'Fleet & Partners', icon: Truck },
        { id: 'delivery_assignments', label: 'Live Assignments', icon: Clock },
        { id: 'delivery_delayed', label: 'Delayed Deliveries', icon: RotateCcw, badge: pendingCounts.delayedDeliveries },
      ],
    },
    {
      id: 'analytics',
      title: 'BUSINESS ANALYTICS',
      items: [
        { id: 'analytics_revenue', label: 'Revenue & Sales', icon: TrendingUp },
        { id: 'analytics_reports', label: 'Audit Reports & Export', icon: FileText },
      ],
    },
    {
      id: 'engagement',
      title: 'CUSTOMER ENGAGEMENT',
      items: [
        { id: 'reviews', label: 'Reviews & Ratings', icon: Star },
        { id: 'coupons', label: 'Coupons & Offers', icon: Tag },
        { id: 'notifications', label: 'Broadcast Alerts', icon: Bell },
        { id: 'support', label: 'Support Tickets', icon: MessageSquare, badge: pendingCounts.supportTickets },
      ],
    },
    {
      id: 'system',
      title: 'SYSTEM MANAGEMENT',
      items: [
        { id: 'system_roles', label: 'Roles & Permissions', icon: KeyRound },
        { id: 'audit_logs', label: 'Audit Activity Logs', icon: History },
        { id: 'platform_settings', label: 'Platform Settings', icon: Sliders },
      ],
    },
  ];

  return (
    <aside
      className={`bg-[#0f2d21] text-stone-200 transition-all duration-300 flex flex-col shrink-0 border-r border-[#153d2c] z-30 select-none ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Brand Header */}
      <div className="h-20 flex items-center justify-between px-4 border-b border-[#1b4b37] bg-[#0c241a]">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-lime-500 flex items-center justify-center text-stone-950 font-black shrink-0 shadow-md">
            <Leaf className="w-5 h-5 text-[#0f2d21]" />
          </div>
          {!isCollapsed && (
            <div>
              <span className="font-extrabold text-base tracking-tight text-white block leading-none">
                FreshFruit<span className="text-lime-400">.</span>
              </span>
              <span className="text-[10px] tracking-wider uppercase font-bold text-emerald-300/80 block mt-0.5">
                Admin Central
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-[#1b4b37] transition"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Nav Menu Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-emerald-800">
        {menuSections.map((sec) => (
          <div key={sec.id} className="space-y-1">
            {!isCollapsed && (
              <button
                onClick={() => toggleSection(sec.id)}
                className="w-full flex items-center justify-between text-[10px] font-extrabold uppercase tracking-widest text-emerald-400/80 px-2 py-1 hover:text-emerald-200 transition"
              >
                <span>{sec.title}</span>
                <ChevronDown
                  className={`w-3 h-3 transform transition-transform ${
                    openSections[sec.id] ? 'rotate-180' : ''
                  }`}
                />
              </button>
            )}

            {(openSections[sec.id] || isCollapsed) && (
              <div className="space-y-0.5">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      title={isCollapsed ? item.label : undefined}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all relative ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-sm font-bold'
                          : 'text-stone-300 hover:bg-[#153d2c] hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-lime-300' : 'text-emerald-400'}`} />
                      {!isCollapsed && (
                        <span className="flex-1 text-left truncate">{item.label}</span>
                      )}
                      {!isCollapsed && Boolean(item.badge) && item.badge > 0 && (
                        <span className="bg-amber-400 text-stone-950 font-black text-[10px] px-1.5 py-0.2 rounded-full">
                          {item.badge}
                        </span>
                      )}
                      {isActive && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-lime-400 rounded-l-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Exit / Profile */}
      <div className="p-3 border-t border-[#1b4b37] bg-[#0c241a] space-y-1.5">
        <button
          onClick={onExitToMarketplace}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-emerald-300 hover:bg-[#153d2c] hover:text-white transition"
          title="Back to Customer Marketplace"
        >
          <ExternalLink className="w-4 h-4 text-emerald-400 shrink-0" />
          {!isCollapsed && <span>View Marketplace</span>}
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 transition"
          title="Log out of Admin"
        >
          <LogOut className="w-4 h-4 text-rose-400 shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}

