// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   BarChart3, ShoppingBag, FileText, LogOut, ChevronRight,
//   Package, Clock, CheckCircle2, Truck, Bell, Settings,
//   TrendingUp, Users, Home, Send,
// } from "lucide-react";
// import { useUser } from "../context/UserContext";

// const NAV = [
//   { id: "overview", icon: Home, label: "Overview" },
//   { id: "orders", icon: ShoppingBag, label: "My Orders" },
//   { id: "quotes", icon: Send, label: "Quotations" },
//   { id: "invoices", icon: FileText, label: "Invoices" },
//   { id: "reports", icon: BarChart3, label: "Reports" },
//   { id: "profile", icon: Settings, label: "Account" },
// ] as const;

// type Tab = (typeof NAV)[number]["id"];

// const MOCK_ORDERS = [
//   { id: "WS-2025-001", date: "Jan 10, 2025", items: "La Vie Passion Juice × 50 cartons", total: 450000, status: "Delivered" },
//   { id: "WS-2025-002", date: "Jan 20, 2025", items: "Vicas Sugarcane Wine × 30 boxes", total: 330000, status: "Processing" },
//   { id: "WS-2025-003", date: "Feb 3, 2025", items: "Mixed Beverage Gift Set × 20", total: 500000, status: "Pending Payment" },
// ];

// const MOCK_QUOTES = [
//   { id: "QT-2025-001", date: "Jan 8, 2025", products: "Passion Juice — 100 cartons", status: "Approved", amount: 900000 },
//   { id: "QT-2025-002", date: "Jan 25, 2025", products: "Sugarcane Wine — 60 boxes", status: "Pending", amount: 660000 },
//   { id: "QT-2025-003", date: "Feb 5, 2025", products: "Mixed export order", status: "Under Review", amount: 1200000 },
// ];

// const STATUS_STYLES: Record<string, string> = {
//   Delivered: "bg-green-50 text-green-700 border-green-200",
//   Processing: "bg-blue-50 text-blue-700 border-blue-200",
//   "Pending Payment": "bg-amber-50 text-amber-700 border-amber-200",
//   Shipped: "bg-purple-50 text-purple-700 border-purple-200",
//   Cancelled: "bg-red-50 text-red-700 border-red-200",
//   Approved: "bg-green-50 text-green-700 border-green-200",
//   Pending: "bg-amber-50 text-amber-700 border-amber-200",
//   "Under Review": "bg-blue-50 text-blue-700 border-blue-200",
// };

// const STATUS_ICONS: Record<string, typeof Package> = {
//   Delivered: CheckCircle2,
//   Processing: Package,
//   "Pending Payment": Clock,
//   Shipped: Truck,
// };

// export default function WholesalerDashboard() {
//   const [activeTab, setActiveTab] = useState<Tab>("overview");
//   const [mobileNavOpen, setMobileNavOpen] = useState(false);
//   const { user, logout } = useUser();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate("/");
//   };

//   const firstName = user?.name?.split(" ")[0] || "Partner";
//   const initials = user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "WS";
//   const totalSpend = MOCK_ORDERS.reduce((s, o) => s + o.total, 0);

//   return (
//     <div className="min-h-screen bg-[#0d0906] text-white">

//       {/* Header */}
//       <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#1e1410] bg-[#0f0a08]/95 px-5 sm:px-8 backdrop-blur">
//         <Link to="/" className="flex items-center gap-2.5">
//           <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#c94708]">
//             <span className="text-sm font-black text-white">E</span>
//           </div>
//           <span className="font-black text-white">EXALTO</span>
//           <span className="hidden rounded-full border border-[#c94708]/30 bg-[#c94708]/10 px-2 py-0.5 text-[10px] font-bold text-[#c94708] sm:block">
//             Wholesale
//           </span>
//         </Link>

//         <div className="flex items-center gap-3">
//           <button className="relative hidden h-9 w-9 items-center justify-center rounded-xl border border-[#1e1410] bg-[#1a1008] text-[#6b5e58] hover:text-white transition sm:flex">
//             <Bell size={16} />
//             <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#c94708]" />
//           </button>
//           <Link to="/shop" className="hidden items-center gap-1 rounded-xl border border-[#1e1410] bg-[#1a1008] px-4 py-2 text-xs font-semibold text-[#6b5e58] hover:text-white transition sm:flex">
//             Shop <ChevronRight size={13} />
//           </Link>
//           <button onClick={() => setMobileNavOpen(!mobileNavOpen)}
//             className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#1e1410] bg-[#1a1008] text-[#6b5e58] sm:hidden">
//             <Users size={16} />
//           </button>
//         </div>
//       </header>

//       <div className="flex min-h-[calc(100vh-64px)]">

//         {/* Sidebar */}
//         <aside className={`${mobileNavOpen ? "flex" : "hidden"} sm:flex w-64 flex-shrink-0 flex-col border-r border-[#1e1410] bg-[#0f0a08] sticky top-16 h-[calc(100vh-64px)] overflow-y-auto`}>

//           {/* Profile */}
//           <div className="border-b border-[#1e1410] p-6">
//             <div className="flex items-center gap-3">
//               <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#c94708] to-[#9f3506] text-base font-black text-white shadow-[0_4px_12px_rgba(201,71,8,0.4)]">
//                 {initials}
//               </div>
//               <div className="min-w-0">
//                 <p className="truncate font-bold text-white">{user?.name || "Wholesaler"}</p>
//                 <p className="truncate text-xs text-[#6b5e58]">{user?.email || ""}</p>
//                 <span className="mt-1 inline-block rounded-full bg-[#c94708]/20 px-2 py-0.5 text-[10px] font-bold text-[#c94708]">
//                   Wholesale Partner
//                 </span>
//               </div>
//             </div>
//             {user?.company && (
//               <div className="mt-3 rounded-lg border border-[#1e1410] bg-[#1a1008] px-3 py-2">
//                 <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#4a3d38]">Company</p>
//                 <p className="text-xs font-bold text-white">{user.company}</p>
//               </div>
//             )}
//           </div>

//           {/* Nav */}
//           <nav className="flex-1 space-y-1 p-4">
//             {NAV.map(({ id, icon: Icon, label }) => (
//               <button
//                 key={id}
//                 onClick={() => { setActiveTab(id); setMobileNavOpen(false); }}
//                 className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition ${activeTab === id
//                   ? "bg-[#c94708] text-white shadow-[0_4px_12px_rgba(201,71,8,0.4)]"
//                   : "text-[#6b5e58] hover:bg-[#1e1410] hover:text-white"}`}
//               >
//                 <Icon size={17} className="flex-shrink-0" />
//                 {label}
//               </button>
//             ))}
//           </nav>

//           <div className="border-t border-[#1e1410] p-4">
//             <button onClick={handleLogout}
//               className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-[#6b5e58] hover:bg-red-950/40 hover:text-red-400 transition">
//               <LogOut size={17} />
//               Sign Out
//             </button>
//           </div>
//         </aside>

//         {/* Main */}
//         <main className="flex-1 overflow-auto p-5 sm:p-8">

//           {/* OVERVIEW */}
//           {activeTab === "overview" && (
//             <div className="space-y-6 max-w-5xl">
//               {/* Welcome banner */}
//               <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#c94708] to-[#7a2d06] p-7 shadow-[0_8px_30px_rgba(201,71,8,0.4)]">
//                 <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5" />
//                 <div className="absolute -bottom-8 right-20 h-28 w-28 rounded-full bg-white/5" />
//                 <div className="relative z-10">
//                   <p className="text-sm font-medium text-white/70">Welcome back,</p>
//                   <h1 className="mt-1 text-3xl font-black text-white">{firstName} 👋</h1>
//                   {user?.company && <p className="mt-1 text-sm text-white/60">{user.company}</p>}
//                   <p className="mt-2 text-sm text-white/60">Manage your wholesale orders, quotations, and account from here.</p>
//                   <div className="mt-5 flex flex-wrap gap-3">
//                     <Link to="/shop" className="inline-flex items-center gap-2 rounded-xl bg-white/20 px-5 py-2.5 text-sm font-bold text-white hover:bg-white/30 transition">
//                       Place New Order <ChevronRight size={15} />
//                     </Link>
//                     <button onClick={() => setActiveTab("quotes")} className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-5 py-2.5 text-sm font-bold text-white hover:bg-white/10 transition">
//                       Request Quote
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* Stats */}
//               <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
//                 {[
//                   { label: "Total Orders", value: MOCK_ORDERS.length, icon: ShoppingBag, color: "text-[#c94708]", bg: "bg-[#c94708]/10" },
//                   { label: "Total Spend", value: `Fr ${(totalSpend / 1000).toFixed(0)}K`, icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-400/10" },
//                   { label: "Quotations", value: MOCK_QUOTES.length, icon: Send, color: "text-blue-400", bg: "bg-blue-400/10" },
//                   { label: "Delivered", value: MOCK_ORDERS.filter((o) => o.status === "Delivered").length, icon: CheckCircle2, color: "text-purple-400", bg: "bg-purple-400/10" },
//                 ].map(({ label, value, icon: Icon, color, bg }) => (
//                   <div key={label} className="rounded-2xl border border-[#1e1410] bg-[#0f0a08] p-5">
//                     <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
//                       <Icon size={18} className={color} />
//                     </div>
//                     <p className="text-2xl font-black text-white">{value}</p>
//                     <p className="text-xs text-[#4a3d38]">{label}</p>
//                   </div>
//                 ))}
//               </div>

//               {/* Recent orders */}
//               <div className="rounded-2xl border border-[#1e1410] bg-[#0f0a08] p-6">
//                 <div className="mb-5 flex items-center justify-between">
//                   <h2 className="font-bold text-white">Recent Orders</h2>
//                   <button onClick={() => setActiveTab("orders")} className="text-xs font-semibold text-[#c94708] hover:underline">View all</button>
//                 </div>
//                 <div className="space-y-3">
//                   {MOCK_ORDERS.slice(0, 2).map((order) => {
//                     const StatusIcon = STATUS_ICONS[order.status] ?? Package;
//                     return (
//                       <div key={order.id} className="flex items-center gap-4 rounded-xl border border-[#1e1410] bg-[#1a1008] p-4 hover:border-[#c94708]/30 transition">
//                         <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#c94708]/10">
//                           <StatusIcon size={18} className="text-[#c94708]" />
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <p className="text-sm font-bold text-white">{order.id}</p>
//                           <p className="truncate text-xs text-[#4a3d38]">{order.items}</p>
//                         </div>
//                         <div className="text-right flex-shrink-0">
//                           <p className="text-sm font-bold text-[#c94708]">Fr {order.total.toLocaleString()}</p>
//                           <span className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold ${STATUS_STYLES[order.status]}`}>{order.status}</span>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* Quick links */}
//               <div className="grid gap-4 sm:grid-cols-3">
//                 {[
//                   { label: "New Bulk Order", sub: "Place a wholesale order", to: "/shop", icon: ShoppingBag },
//                   { label: "Export Quote", sub: "Request international quote", to: "/export", icon: Send },
//                   { label: "Contact Manager", sub: "Speak to your account manager", to: "/contact", icon: Users },
//                 ].map(({ label, sub, to, icon: Icon }) => (
//                   <Link key={label} to={to} className="flex items-center gap-4 rounded-2xl border border-[#1e1410] bg-[#0f0a08] p-5 hover:border-[#c94708]/40 transition group">
//                     <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#c94708]/10 group-hover:bg-[#c94708]/20 transition">
//                       <Icon size={18} className="text-[#c94708]" />
//                     </div>
//                     <div>
//                       <p className="font-bold text-white">{label}</p>
//                       <p className="text-xs text-[#4a3d38]">{sub}</p>
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* ORDERS */}
//           {activeTab === "orders" && (
//             <div className="max-w-5xl">
//               <div className="mb-6 flex items-center justify-between">
//                 <h1 className="text-2xl font-black text-white">My Orders</h1>
//                 <Link to="/shop" className="inline-flex items-center gap-2 bg-[#c94708] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#9f3506] transition">
//                   + New Order
//                 </Link>
//               </div>
//               <div className="space-y-4">
//                 {MOCK_ORDERS.map((order) => {
//                   const StatusIcon = STATUS_ICONS[order.status] ?? Package;
//                   return (
//                     <div key={order.id} className="rounded-2xl border border-[#1e1410] bg-[#0f0a08] p-6">
//                       <div className="flex flex-wrap items-start justify-between gap-4">
//                         <div className="flex items-center gap-4">
//                           <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#c94708]/10">
//                             <StatusIcon size={20} className="text-[#c94708]" />
//                           </div>
//                           <div>
//                             <p className="font-bold text-white">{order.id}</p>
//                             <p className="text-xs text-[#4a3d38]">{order.date}</p>
//                           </div>
//                         </div>
//                         <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_STYLES[order.status]}`}>{order.status}</span>
//                       </div>
//                       <div className="mt-4 border-t border-[#1e1410] pt-4">
//                         <p className="text-sm text-[#6b5e58]">{order.items}</p>
//                         <div className="mt-3 flex items-center justify-between">
//                           <p className="text-xl font-black text-[#c94708]">Fr {order.total.toLocaleString()}</p>
//                           <div className="flex gap-2">
//                             <button className="rounded-xl border border-[#1e1410] px-4 py-2 text-xs font-semibold text-[#6b5e58] hover:border-[#c94708] hover:text-[#c94708] transition">
//                               Download Invoice
//                             </button>
//                             {order.status === "Pending Payment" && (
//                               <Link to="/checkout" className="rounded-xl bg-[#c94708] px-4 py-2 text-xs font-semibold text-white hover:bg-[#9f3506] transition">
//                                 Pay Now
//                               </Link>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           )}

//           {/* QUOTES */}
//           {activeTab === "quotes" && (
//             <div className="max-w-5xl">
//               <div className="mb-6 flex items-center justify-between">
//                 <h1 className="text-2xl font-black text-white">Quotations</h1>
//                 <Link to="/wholesale" className="inline-flex items-center gap-2 bg-[#c94708] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#9f3506] transition">
//                   + New Quote Request
//                 </Link>
//               </div>
//               <div className="overflow-hidden rounded-2xl border border-[#1e1410] bg-[#0f0a08]">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="border-b border-[#1e1410]">
//                       {["Quote ID", "Date", "Products", "Amount", "Status", ""].map((h) => (
//                         <th key={h} className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-[#4a3d38]">{h}</th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {MOCK_QUOTES.map((q) => (
//                       <tr key={q.id} className="border-b border-[#1e1410] hover:bg-[#1a1008] transition">
//                         <td className="px-5 py-4 text-sm font-bold text-white">{q.id}</td>
//                         <td className="px-5 py-4 text-sm text-[#6b5e58]">{q.date}</td>
//                         <td className="px-5 py-4 text-sm text-[#6b5e58]">{q.products}</td>
//                         <td className="px-5 py-4 text-sm font-bold text-[#c94708]">Fr {q.amount.toLocaleString()}</td>
//                         <td className="px-5 py-4">
//                           <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${STATUS_STYLES[q.status]}`}>{q.status}</span>
//                         </td>
//                         <td className="px-5 py-4">
//                           <button className="text-xs font-semibold text-[#c94708] hover:underline">View</button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {/* INVOICES */}
//           {activeTab === "invoices" && (
//             <div className="max-w-5xl">
//               <h1 className="mb-6 text-2xl font-black text-white">Invoices</h1>
//               <div className="overflow-hidden rounded-2xl border border-[#1e1410] bg-[#0f0a08]">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="border-b border-[#1e1410]">
//                       {["Invoice", "Date", "Amount", "Status", ""].map((h) => (
//                         <th key={h} className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-[#4a3d38]">{h}</th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {MOCK_ORDERS.map((order) => (
//                       <tr key={order.id} className="border-b border-[#1e1410] hover:bg-[#1a1008] transition">
//                         <td className="px-5 py-4 text-sm font-bold text-white">{order.id}</td>
//                         <td className="px-5 py-4 text-sm text-[#6b5e58]">{order.date}</td>
//                         <td className="px-5 py-4 text-sm font-bold text-[#c94708]">Fr {order.total.toLocaleString()}</td>
//                         <td className="px-5 py-4">
//                           <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${STATUS_STYLES[order.status]}`}>{order.status}</span>
//                         </td>
//                         <td className="px-5 py-4">
//                           <button className="text-xs font-semibold text-[#c94708] hover:underline">Download PDF</button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {/* REPORTS */}
//           {activeTab === "reports" && (
//             <div className="max-w-5xl space-y-6">
//               <h1 className="text-2xl font-black text-white">Reports</h1>
//               <div className="grid gap-5 sm:grid-cols-3">
//                 {[
//                   { label: "Total Spend", value: `Fr ${totalSpend.toLocaleString()}`, sub: "All time", icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-400/10" },
//                   { label: "Orders Placed", value: MOCK_ORDERS.length, sub: "All time", icon: ShoppingBag, color: "text-[#c94708]", bg: "bg-[#c94708]/10" },
//                   { label: "Avg. Order Value", value: `Fr ${Math.round(totalSpend / MOCK_ORDERS.length).toLocaleString()}`, sub: "Per order", icon: BarChart3, color: "text-blue-400", bg: "bg-blue-400/10" },
//                 ].map(({ label, value, sub, icon: Icon, color, bg }) => (
//                   <div key={label} className="rounded-2xl border border-[#1e1410] bg-[#0f0a08] p-6">
//                     <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${bg}`}>
//                       <Icon size={22} className={color} />
//                     </div>
//                     <p className="text-2xl font-black text-white">{value}</p>
//                     <p className="text-sm font-semibold text-white/70">{label}</p>
//                     <p className="text-xs text-[#4a3d38]">{sub}</p>
//                   </div>
//                 ))}
//               </div>
//               <div className="rounded-2xl border border-[#1e1410] bg-[#0f0a08] p-6">
//                 <h3 className="mb-4 font-bold text-white">Order Breakdown</h3>
//                 <div className="space-y-3">
//                   {MOCK_ORDERS.map((o) => (
//                     <div key={o.id} className="flex items-center gap-4">
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center justify-between mb-1">
//                           <span className="text-xs font-semibold text-white">{o.id}</span>
//                           <span className="text-xs font-bold text-[#c94708]">Fr {o.total.toLocaleString()}</span>
//                         </div>
//                         <div className="h-2 w-full rounded-full bg-[#1e1410]">
//                           <div className="h-2 rounded-full bg-[#c94708]" style={{ width: `${(o.total / totalSpend) * 100}%` }} />
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* PROFILE */}
//           {activeTab === "profile" && (
//             <div className="max-w-xl">
//               <h1 className="mb-6 text-2xl font-black text-white">Account Settings</h1>
//               <div className="rounded-2xl border border-[#1e1410] bg-[#0f0a08] p-7">
//                 <div className="mb-6 flex items-center gap-4">
//                   <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#c94708] to-[#9f3506] text-xl font-black text-white shadow-[0_4px_16px_rgba(201,71,8,0.4)]">
//                     {initials}
//                   </div>
//                   <div>
//                     <p className="text-lg font-black text-white">{user?.name}</p>
//                     <p className="text-sm text-[#6b5e58]">{user?.email}</p>
//                     <span className="mt-1 inline-block rounded-full bg-[#c94708]/20 px-2 py-0.5 text-[10px] font-bold text-[#c94708]">Wholesale Partner</span>
//                   </div>
//                 </div>
//                 <div className="space-y-4">
//                   {[
//                     { label: "Full Name", value: user?.name || "" },
//                     { label: "Company Name", value: user?.company || "" },
//                     { label: "Email Address", value: user?.email || "" },
//                     { label: "Phone Number", value: user?.phone || "" },
//                   ].map(({ label, value }) => (
//                     <div key={label}>
//                       <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-[#4a3d38]">{label}</label>
//                       <input defaultValue={value} className="w-full border border-[#1e1410] bg-[#1a1008] px-4 py-3 text-sm text-white outline-none focus:border-[#c94708] focus:ring-1 focus:ring-[#c94708]/30" />
//                     </div>
//                   ))}
//                   <button className="w-full bg-[#c94708] py-3 text-sm font-bold text-white hover:bg-[#9f3506] transition">
//                     Save Changes
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//         </main>
//       </div>
//     </div>
//   );
// }
