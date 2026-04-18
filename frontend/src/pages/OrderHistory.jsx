// src/pages/OrderHistory.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, Navigate } from "react-router-dom";
import api from "../api/axios";
import OrderStatusBadge from "../components/OrderStatusBadge";
import { useAuth } from "../context/AuthContext";
import {
  ShoppingBag,
  Package,
  RefreshCw,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Utensils,
  Clock,
  MapPin,
  Flame,
} from "lucide-react";

// Common neumorphic styles & tokens matching Profile/Cart
const colors = {
  primary: '#2C1A0E',
  muted: '#A08060',
  accent: '#E8732A',
  bg: '#F0E8DC',
  success: '#5AAB5E',
  error: '#E85A2A',
  blue: '#4A90E2', // For 'preparing' state
  amber: '#F5A623', // For 'pending' state
}

const neumorphic = {
  raised: {
    background: colors.bg,
    boxShadow: '6px 6px 16px rgba(180,130,90,0.32), -6px -6px 16px rgba(255,255,255,0.85)',
    border: 'none',
  },
  inset: {
    background: colors.bg,
    boxShadow: 'inset 5px 5px 12px rgba(180,130,90,0.26), inset -5px -5px 12px rgba(255,255,255,0.78)',
    border: 'none',
  },
  buttonRaised: {
    background: 'linear-gradient(135deg, #E8732A, #C87820)',
    boxShadow: '6px 6px 16px rgba(180,130,90,0.32), -6px -6px 16px rgba(255,255,255,0.85), 0 4px 12px rgba(232,115,42,0.3)',
    border: 'none',
    color: '#ffffff'
  }
}

const fonts = {
  heading: { fontFamily: "'Outfit', sans-serif" },
  body: { fontFamily: "'Outfit', sans-serif" }
}

const DEMO_ORDERS = [
  {
    id: 101,
    created_at: new Date().toISOString(),
    pickup_time: new Date().toISOString(),
    total_price: 760,
    status: "ready",
    items: [
      {
        quantity: 2,
        menu_item: { name: 'Chicken Fried Rice', price: 350, image_url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=400' }
      }
    ],
  },
  {
    id: 102,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    pickup_time: new Date(Date.now() - 86400000).toISOString(),
    total_price: 480,
    status: "preparing",
    items: [
      {
        quantity: 1,
        menu_item: { name: 'Chicken Burger', price: 480, image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400' }
      }
    ],
  },
  {
    id: 103,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    pickup_time: new Date(Date.now() - 172800000).toISOString(),
    total_price: 320,
    status: "pending",
    items: [
      {
        quantity: 4,
        menu_item: { name: 'Mango Juice', price: 80, image_url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=400' }
      }
    ],
  },
];

function SkeletonOrder() {
  return (
    <div style={{ ...neumorphic.raised, borderRadius: '24px' }} className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-5 w-32 rounded-full" style={{ background: '#dbcfc1' }} />
        <div className="h-8 w-24 rounded-full" style={{ background: '#dbcfc1' }} />
      </div>
      <div className="flex gap-4">
        <div className="h-16 w-16 rounded-[20px]" style={{ background: '#dbcfc1' }} />
        <div className="space-y-4 flex-1 py-1">
          <div className="h-4 w-48 rounded-lg" style={{ background: '#dbcfc1' }} />
          <div className="h-4 w-32 rounded-lg" style={{ background: '#dbcfc1' }} />
        </div>
      </div>
    </div>
  );
}

export default function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (user?.role === "admin") {
      setLoading(false);
      return;
    }

    api
      .get("/orders/my")
      .then((res) => setOrders(res.data))
      .catch(() => setOrders(DEMO_ORDERS))
      .finally(() => setLoading(false));
  }, []);

  const filtered = orders.filter((o) => {
    if (filter === "active") return ["pending", "preparing"].includes(o.status);
    if (filter === "done") return o.status === "ready";
    return true;
  });

  const formatDate = (iso) => {
    if (!iso) return "N/A";
    const dateStr = iso.endsWith("Z") ? iso : `${iso}Z`;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Invalid Date";

    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  if (user?.role === "admin") {
    return (
      <div className="min-h-screen pt-28 pb-20 px-6 flex items-center justify-center overflow-x-hidden" style={{ background: colors.bg, ...fonts.body }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ ...neumorphic.raised, borderRadius: '32px' }}
          className="p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto"
        >
          <div 
            className="w-24 h-24 mb-6 rounded-full flex items-center justify-center"
            style={neumorphic.inset}
          >
            <Utensils size={48} color={colors.accent} strokeWidth={1.5} />
          </div>
          <h3 className="text-[26px] font-semibold mb-3" style={{ ...fonts.heading, color: colors.primary }}>
            Admin Accounts Drop Anchor Here
          </h3>
          <p className="mb-8 font-medium text-[15px]" style={{ color: colors.muted }}>
            As an administrator, you manage the restaurant's orders rather than
            placing your own. Head over to the dashboard to keep the kitchen
            running!
          </p>
          <Link to="/admin">
            <motion.button
              whileHover={{ y: -1, boxShadow: neumorphic.buttonRaised.boxShadow.replace('0.3', '0.45') }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3.5 rounded-[18px] flex items-center gap-2 font-medium"
              style={{ ...neumorphic.buttonRaised, fontSize: '16px' }}
            >
              <Clock size={18} /> Go to Admin Dashboard
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 overflow-x-hidden" style={{ background: colors.bg, ...fonts.body }}>
      <div className="max-w-4xl mx-auto">
        
        {/* Header section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-5 mb-10"
        >
          <div 
            className="w-[72px] h-[72px] rounded-[24px] flex items-center justify-center relative overflow-hidden"
            style={neumorphic.raised}
          >
            <div className="absolute inset-0 opacity-40 blur-xl" style={{ background: colors.accent }}></div>
            <ShoppingBag size={32} strokeWidth={1.5} color={colors.accent} className="relative z-10" />
          </div>
          <div>
            <h1 className="text-[36px] font-semibold tracking-tight leading-tight" style={{ ...fonts.heading, color: colors.primary }}>
              Order{' '}
              <span style={{ background: `linear-gradient(90deg, ${colors.accent}, #C8931A)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                History
              </span>
            </h1>
            <p className="font-medium tracking-wide mt-1 flex items-center gap-2 text-[15px]" style={{ color: colors.muted }}>
              <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: colors.accent }}></span>
              {orders.length} culinary journeys
            </p>
          </div>
        </motion.div>

        {/* Filters */}
        <div 
          className="p-2 rounded-[24px] inline-flex flex-wrap gap-2 mb-10 overflow-hidden"
          style={neumorphic.inset}
        >
          {[
            { key: "all", label: "All Orders", icon: <Package size={16} /> },
            { key: "active", label: "Active", icon: <RefreshCw size={16} /> },
            { key: "done", label: "Completed", icon: <CheckCircle size={16} /> },
          ].map((tab) => {
            const isActive = filter === tab.key;
            return (
              <motion.button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                whileTap={{ scale: isActive ? 1 : 0.96 }}
                className={`flex items-center gap-2 px-6 py-3 rounded-[16px] text-sm md:text-[15px] font-medium transition-colors duration-300`}
                style={isActive ? neumorphic.buttonRaised : { color: colors.muted, background: 'transparent' }}
              >
                <span className={isActive ? "animate-bounce-slow" : ""}>
                  {tab.icon}
                </span>
                {tab.label}
              </motion.button>
            )
          })}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <SkeletonOrder key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-12 text-center flex flex-col items-center justify-center mt-10"
            style={{ ...neumorphic.raised, borderRadius: '32px' }}
          >
            <div 
              className="w-28 h-28 mb-8 rounded-[32px] flex items-center justify-center"
              style={neumorphic.inset}
            >
              <Utensils size={48} color={colors.muted} strokeWidth={1.5} />
            </div>
            <h3 className="text-[26px] font-semibold mb-3" style={{ ...fonts.heading, color: colors.primary }}>
              No orders found
            </h3>
            <p className="mb-8 font-medium text-[15px] max-w-md" style={{ color: colors.muted }}>
              We couldn't find any orders matching your current filter. Time to
              discover something delicious!
            </p>
            <Link to="/">
              <motion.button
                whileHover={{ y: -1, boxShadow: neumorphic.buttonRaised.boxShadow.replace('0.3', '0.45') }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3.5 rounded-[18px] flex items-center gap-2 font-medium"
                style={{ ...neumorphic.buttonRaised, fontSize: '16px' }}
              >
                <Flame size={18} /> Browse Menu
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-8 relative before:absolute before:inset-0 before:-left-[18px] before:w-[3px] md:before:block before:hidden"
            style={{ '--tw-before-bg': colors.accent + '66' }} // semi-transparent accent for timeline
          >
            <div className="hidden md:block absolute top-0 bottom-0 -left-[18px] w-[3px]" style={{ background: `linear-gradient(to bottom, ${colors.accent}66, transparent)` }} />

            {filtered.map((order) => {
              const isExpanded = expanded === order.id;

              return (
                <motion.div
                  key={order.id}
                  variants={itemVariants}
                  className="relative md:ml-2"
                >
                  {/* Timeline Connector */}
                  <div className="hidden md:block absolute -left-[45px] top-[42px] w-6 h-[3px]" style={{ background: colors.accent + '66' }} />
                  <div
                    className="hidden md:block absolute -left-[54px] top-[37px] w-4 h-4 rounded-full border-[3px] shadow-sm z-10"
                    style={{
                      background: colors.bg,
                      borderColor: order.status === "ready" 
                        ? colors.success 
                        : order.status === "preparing" 
                          ? colors.blue 
                          : colors.amber
                    }}
                  />

                  {/* Order Card */}
                  <div
                    className="overflow-hidden transition-all duration-300"
                    style={{ 
                      ...neumorphic.raised, 
                      borderRadius: '28px',
                      ...(isExpanded && { boxShadow: `6px 6px 16px rgba(180,130,90,0.4), -6px -6px 16px rgba(255,255,255,0.9)` })
                    }}
                  >
                    {/* Header bar of the card */}
                    <div
                      className="p-6 cursor-pointer flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
                      onClick={() => setExpanded(isExpanded ? null : order.id)}
                    >
                      <div className="flex gap-5 items-center w-full sm:w-auto">
                        {/* Icon Block */}
                        <div
                          className="w-[64px] h-[64px] rounded-[20px] flex items-center justify-center shrink-0"
                          style={neumorphic.inset}
                        >
                          {order.status === "ready" ? (
                            <CheckCircle size={28} color={colors.success} />
                          ) : order.status === "preparing" ? (
                            <RefreshCw
                              size={28}
                              color={colors.blue}
                              className="animate-spin-slow"
                            />
                          ) : (
                            <Clock size={28} color={colors.amber} />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1.5">
                            <span className="text-[18px] font-semibold tracking-tight" style={{ ...fonts.heading, color: colors.primary }}>
                              Order #{order.id}
                            </span>
                            <OrderStatusBadge status={order.status} />
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-[13px] font-medium" style={{ color: colors.muted }}>
                            <span className="flex items-center gap-1.5">
                              <Clock size={13} /> {formatDate(order.created_at)}
                            </span>
                            <span className="hidden sm:flex items-center gap-1.5 opacity-60">|</span>
                            <span className="flex items-center gap-1.5">
                              <MapPin size={13} /> Pickup: {formatDate(order.pickup_time)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:flex-col sm:items-end w-full sm:w-auto pt-4 sm:pt-0 border-t border-black/5 sm:border-0 mt-2 sm:mt-0">
                        <p className="text-[24px] font-bold" style={{ ...fonts.heading, color: colors.accent }}>
                          <span className="text-[14px] font-semibold mr-1.5 opacity-80" style={{ color: colors.primary }}>
                            LKR
                          </span>
                          {order.total_price?.toFixed(2)}
                        </p>
                        
                        <div 
                          className="flex items-center gap-1.5 text-[12px] font-bold px-3 py-1.5 rounded-full mt-3"
                          style={{
                            ...(isExpanded ? neumorphic.inset : neumorphic.raised),
                            color: isExpanded ? colors.accent : colors.muted
                          }}
                        >
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          {isExpanded ? "HIDE DETAILS" : "VIEW DETAILS"}
                        </div>
                      </div>
                    </div>

                    {/* Expandable Order Details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ ease: "easeInOut", duration: 0.3 }}
                        >
                          <div className="px-6 py-6 border-t" style={{ borderColor: 'rgba(180,130,90,0.1)' }}>
                            <h4 className="text-[12px] font-bold uppercase tracking-widest flex items-center gap-2 mb-5" style={{ color: colors.primary }}>
                              <Utensils size={14} color={colors.accent} /> Order Items
                            </h4>

                            {order.items?.length > 0 ? (
                              <div className="space-y-4 mb-8">
                                {order.items.map((item, j) => (
                                  <div
                                    key={j}
                                    className="flex items-center justify-between p-3 sm:p-4 rounded-[20px]"
                                    style={neumorphic.inset}
                                  >
                                    <div className="flex items-center gap-4">
                                      {item.menu_item?.image_url ? (
                                        <div 
                                          className="w-[48px] h-[48px] rounded-[14px] overflow-hidden p-1"
                                          style={neumorphic.raised}
                                        >
                                          <img
                                            loading="lazy"
                                            src={item.menu_item.image_url}
                                            alt={item.menu_item.name}
                                            className="w-full h-full object-cover rounded-[10px]"
                                          />
                                        </div>
                                      ) : (
                                        <div 
                                          className="w-[48px] h-[48px] rounded-[14px] flex items-center justify-center shrink-0"
                                          style={neumorphic.raised}
                                        >
                                          <Utensils size={20} color={colors.accent} />
                                        </div>
                                      )}
                                      
                                      <div 
                                        className="w-8 h-8 rounded-[10px] flex items-center justify-center font-bold text-[12px] shrink-0"
                                        style={{ ...neumorphic.raised, color: colors.accent }}
                                      >
                                        x{item.quantity}
                                      </div>
                                      
                                      <span className="font-semibold text-[15px]" style={{ color: colors.primary }}>
                                        {item.menu_item?.name || `Item #${item.menu_id}`}
                                      </span>
                                    </div>

                                    <span className="font-bold text-[15px] shrink-0 ml-4" style={{ color: colors.primary }}>
                                      <span className="text-[12px] font-medium mr-1" style={{ color: colors.muted }}>LKR</span>
                                      {(item.menu_item?.price * item.quantity || 0).toFixed(2)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div
                                className="p-5 rounded-[20px] mb-8 text-center"
                                style={neumorphic.inset}
                              >
                                <p className="font-medium text-[14px]" style={{ color: colors.muted }}>
                                  No detailed items available for this order.
                                </p>
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex justify-end gap-4 mt-2">
                              <motion.button
                                whileHover={{ y: -1 }}
                                whileTap={{ scale: 0.98, ...neumorphic.inset }}
                                className="px-6 py-3 rounded-[16px] text-[14px] font-semibold transition-all"
                                style={{ ...neumorphic.raised, color: colors.primary }}
                              >
                                Support
                              </motion.button>
                              
                              <Link to="/">
                                <motion.button
                                  whileHover={{ y: -1, boxShadow: neumorphic.buttonRaised.boxShadow.replace('0.3', '0.45') }}
                                  whileTap={{ scale: 0.98 }}
                                  className="px-6 py-3 rounded-[16px] text-[14px] font-medium flex items-center gap-2"
                                  style={{ ...neumorphic.buttonRaised }}
                                >
                                  <RefreshCw size={15} /> Reorder
                                </motion.button>
                              </Link>
                            </div>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
