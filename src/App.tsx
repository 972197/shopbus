import { useState, useEffect, createContext, useContext } from "react";
import {
  ShoppingCart, Search, Heart, User, Menu, X, Star,
  ChevronRight, Truck, Shield, RefreshCw, Headphones,
  Plus, Minus, Trash2, ArrowLeft, Eye, EyeOff, LogOut,
  Package, MapPin, CreditCard, CheckCircle, Filter, ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  brand: string;
  images: string[];
  stock: number;
  ratings: number;
  numReviews: number;
  featured?: boolean;
}

interface CartItem extends Product { quantity: number; }
interface User { _id: string; name: string; email: string; role: string; avatar?: string; }

// ─── Context ──────────────────────────────────────────────────────────────────
const AppContext = createContext<any>(null);

const useApp = () => useContext(AppContext);

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_PRODUCTS: Product[] = [
  { _id: "1", name: "Arc'teryx Beta Jacket", description: "Premium Gore-Tex shell for alpine pursuits. Waterproof, breathable, and built to last a lifetime.", price: 799, discountPrice: 649, category: "Outerwear", brand: "Arc'teryx", images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600"], stock: 12, ratings: 4.9, numReviews: 234, featured: true },
  { _id: "2", name: "Leica Q3 Camera", description: "Full-frame 60MP sensor. Summilux 28mm f/1.7 ASPH lens. The art of photography, perfected.", price: 5995, category: "Electronics", brand: "Leica", images: ["https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600"], stock: 5, ratings: 4.8, numReviews: 89, featured: true },
  { _id: "3", name: "Aesop Parsley Seed Serum", description: "Antioxidant-rich serum that visibly smooths and brightens. A daily ritual refined over decades.", price: 145, category: "Beauty", brand: "Aesop", images: ["https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600"], stock: 30, ratings: 4.7, numReviews: 512 },
  { _id: "4", name: "Herman Miller Aeron", description: "Engineered for ergonomic excellence. PostureFit SL, 8Z Pellicle mesh, fully adjustable.", price: 1795, discountPrice: 1499, category: "Furniture", brand: "Herman Miller", images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600"], stock: 8, ratings: 4.9, numReviews: 1203 },
  { _id: "5", name: "Lamy 2000 Fountain Pen", description: "Bauhaus design icon since 1966. Makrolon body, gold-plated nib, piston filler mechanism.", price: 185, category: "Stationery", brand: "Lamy", images: ["https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600"], stock: 25, ratings: 4.8, numReviews: 678 },
  { _id: "6", name: "Maison Margiela Replica", description: "Jazz Club — vetiver, Virginia cedar, pink pepper. A fragrance that tells a story.", price: 195, category: "Beauty", brand: "Maison Margiela", images: ["https://images.unsplash.com/photo-1541643600914-78b084683702?w=600"], stock: 18, ratings: 4.6, numReviews: 445 },
  { _id: "7", name: "Patagonia Nano Puff", description: "PrimaLoft insulation, recycled shell. Packable warmth that won't quit.", price: 249, discountPrice: 199, category: "Outerwear", brand: "Patagonia", images: ["https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=600"], stock: 22, ratings: 4.7, numReviews: 891 },
  { _id: "8", name: "Sonos Era 300", description: "Spatial audio. Dolby Atmos. Six drivers. The future of home listening arrived early.", price: 449, category: "Electronics", brand: "Sonos", images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600"], stock: 14, ratings: 4.5, numReviews: 334 },
];

const CATEGORIES = ["All", "Outerwear", "Electronics", "Beauty", "Furniture", "Stationery"];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const Stars = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <Star key={i} size={12} fill={i <= Math.round(rating) ? "#c9a84c" : "none"} stroke={i <= Math.round(rating) ? "#c9a84c" : "#aaa"} />
    ))}
  </div>
);

const API = import.meta.env.VITE_API_URL || "";

// ─── Pages ────────────────────────────────────────────────────────────────────

// HOME
function HomePage() {
  const { setPage, addToCart, wishlist, toggleWishlist } = useApp();
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = MOCK_PRODUCTS
    .filter(p => category === "All" || p.category === category)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "price-asc") return (a.discountPrice || a.price) - (b.discountPrice || b.price);
      if (sort === "price-desc") return (b.discountPrice || b.price) - (a.discountPrice || a.price);
      if (sort === "rating") return b.ratings - a.ratings;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden bg-stone-950 flex items-center">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600" alt="hero" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/60 to-transparent" />
        </div>
        <div className="relative container mx-auto px-6 md:px-12">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="text-amber-400 tracking-[0.3em] text-xs font-medium uppercase mb-4">Curated Excellence</p>
            <h1 className="font-serif text-5xl md:text-7xl text-white leading-tight mb-6">
              Objects Worth<br /><em className="not-italic text-amber-300">Owning</em>
            </h1>
            <p className="text-stone-300 text-lg max-w-md mb-8">Premium goods selected for longevity, beauty, and purpose. No noise — just things that matter.</p>
            <button onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-amber-400 text-stone-950 px-8 py-4 font-semibold tracking-wide hover:bg-amber-300 transition-colors flex items-center gap-2">
              Shop Now <ChevronRight size={18} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Trust bar */}
      <div className="bg-stone-900 border-y border-stone-800">
        <div className="container mx-auto px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Truck, label: "Free Shipping", sub: "Orders over $150" },
            { icon: Shield, label: "2-Year Warranty", sub: "On all products" },
            { icon: RefreshCw, label: "30-Day Returns", sub: "Hassle free" },
            { icon: Headphones, label: "Expert Support", sub: "7 days a week" },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon size={20} className="text-amber-400 shrink-0" />
              <div>
                <p className="text-white text-sm font-medium">{label}</p>
                <p className="text-stone-400 text-xs">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Products */}
      <section id="products" className="container mx-auto px-6 md:px-12 py-16">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products or brands..."
              className="w-full bg-stone-900 border border-stone-700 text-white pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 border border-stone-700 text-stone-300 px-4 py-3 text-sm hover:border-amber-400 transition-colors">
            <Filter size={15} /> Filters <ChevronDown size={14} className={transition-transform ${showFilters ? 'rotate-180' : ''}} />
          </button>
          <select value={sort} onChange={e => setSort(e.target.value)} className="bg-stone-900 border border-stone-700 text-stone-300 px-4 py-3 text-sm focus:outline-none focus:border-amber-400">
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-6">
              <div className="flex flex-wrap gap-2 py-2">
                {CATEGORIES.map(c => (
                  <button key={c} onClick={() => setCategory(c)}
                    className={px-4 py-2 text-sm border transition-colors ${category === c ? 'bg-amber-400 border-amber-400 text-stone-950 font-semibold' : 'border-stone-700 text-stone-400 hover:border-amber-400 hover:text-white'}}>
                    {c}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-stone-500 text-sm mb-6">{filtered.length} products</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product, i) => (
            <motion.div key={product._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="group bg-stone-900 border border-stone-800 hover:border-amber-400/40 transition-all duration-300">
              <div className="relative aspect-square overflow-hidden bg-stone-800 cursor-pointer" onClick={() => setPage('product', product)}>
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {product.discountPrice && (
                  <span className="absolute top-3 left-3 bg-amber-400 text-stone-950 text-xs font-bold px-2 py-1">
                    -{Math.round((1 - product.discountPrice / product.price) * 100)}%
                  </span>
                )}
                <button onClick={(e) => { e.stopPropagation(); toggleWishlist(product._id); }}
                  className="absolute top-3 right-3 p-2 bg-stone-950/80 backdrop-blur-sm hover:bg-stone-800 transition-colors">
                  <Heart size={15} fill={wishlist.includes(product._id) ? "#ef4444" : "none"} stroke={wishlist.includes(product._id) ? "#ef4444" : "white"} />
                </button>
                {product.stock <= 5 && <span className="absolute bottom-3 left-3 bg-red-500/90 text-white text-xs px-2 py-1">Only {product.stock} left</span>}
              </div>
              <div className="p-4">
                <p className="text-stone-500 text-xs tracking-widest uppercase mb-1">{product.brand}</p>
                <h3 className="text-white font-medium text-sm mb-2 cursor-pointer hover:text-amber-400 transition-colors" onClick={() => setPage('product', product)}>{product.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <Stars rating={product.ratings} />
                  <span className="text-stone-500 text-xs">({product.numReviews})</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-white font-semibold">${(product.discountPrice || product.price).toLocaleString()}</span>
                    {product.discountPrice && <span className="text-stone-500 text-xs line-through ml-2">${product.price.toLocaleString()}</span>}
                  </div>
                  <button onClick={() => addToCart(product)} className="bg-amber-400 text-stone-950 p-2 hover:bg-amber-300 transition-colors">
                    <Plus size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

// PRODUCT DETAIL
function ProductPage({ product }: { product: Product }) {
  const { setPage, addToCart, wishlist, toggleWishlist } = useApp();
  const [qty, setQty] = useState(1);
  const related = MOCK_PRODUCTS.filter(p => p.category === product.category && p._id !== product._id).slice(0, 3);

  return (
    <div className="container mx-auto px-6 md:px-12 py-12">
      <button onClick={() => setPage('home')} className="flex items-center gap-2 text-stone-400 hover:text-white mb-8 text-sm transition-colors">
        <ArrowLeft size={15} /> Back to products
      </button>
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="aspect-square bg-stone-900 overflow-hidden">
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col justify-center">
          <p className="text-amber-400 tracking-widest text-xs uppercase mb-2">{product.brand} · {product.category}</p>
          <h1 className="font-serif text-4xl text-white mb-4">{product.name}</h1>
          <div className="flex items-center gap-3 mb-4">
            <Stars rating={product.ratings} />
            <span className="text-stone-400 text-sm">{product.ratings} ({product.numReviews} reviews)</span>
          </div>
          <p className="text-stone-400 leading-relaxed mb-6">{product.description}</p>
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl text-white font-semibold">${(product.discountPrice || product.price).toLocaleString()}</span>
            {product.discountPrice && <span className="text-stone-500 text-xl line-through">${product.price.toLocaleString()}</span>}
            {product.discountPrice && <span className="bg-amber-400 text-stone-950 text-xs font-bold px-2 py-1">SAVE ${(product.price - product.discountPrice).toLocaleString()}</span>}
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-stone-700">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 text-white hover:text-amber-400 transition-colors"><Minus size={14} /></button>
              <span className="px-5 text-white font-medium">{qty}</span>
              <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="p-3 text-white hover:text-amber-400 transition-colors"><Plus size={14} /></button>
            </div>
            <span className="text-stone-500 text-sm">{product.stock} in stock</span>
          </div>
          <div className="flex gap-3">
            <button onClick={() => addToCart(product, qty)} className="flex-1 bg-amber-400 text-stone-950 py-4 font-semibold hover:bg-amber-300 transition-colors flex items-center justify-center gap-2">
              <ShoppingCart size={17} /> Add to Cart
            </button>
            <button onClick={() => toggleWishlist(product._id)} className="border border-stone-700 p-4 hover:border-amber-400 transition-colors">
              <Heart size={17} fill={wishlist.includes(product._id) ? "#ef4444" : "none"} stroke={wishlist.includes(product._id) ? "#ef4444" : "white"} />
            </button>
          </div>
          <div className="mt-6 pt-6 border-t border-stone-800 grid grid-cols-3 gap-4">
            {[{ icon: Truck, t: "Free Shipping" }, { icon: Shield, t: "2-Year Warranty" }, { icon: RefreshCw, t: "30-Day Returns" }].map(({ icon: Icon, t }) => (
              <div key={t} className="flex flex-col items-center gap-1 text-center">
                <Icon size={18} className="text-amber-400" />
                <span className="text-stone-400 text-xs">{t}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {related.length > 0 && (
        <div>
          <h2 className="font-serif text-2xl text-white mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map(p => (
              <div key={p._id} onClick={() => setPage('product', p)} className="group cursor-pointer bg-stone-900 border border-stone-800 hover:border-amber-400/40 transition-all">
                <div className="aspect-square overflow-hidden bg-stone-800">
                  <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <p className="text-stone-500 text-xs mb-1">{p.brand}</p>
                  <p className="text-white text-sm font-medium mb-1">{p.name}</p>
                  <p className="text-amber-400 font-semibold">${(p.discountPrice || p.price).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// CART
function CartPage() {
  const { cart, setPage, updateQty, removeFromCart } = useApp();
  const subtotal = cart.reduce((s: number, i: CartItem) => s + (i.discountPrice || i.price) * i.quantity, 0);
  const shipping = subtotal > 150 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (cart.length === 0) return (
    <div className="container mx-auto px-6 py-24 text-center">
      <ShoppingCart size={48} className="text-stone-600 mx-auto mb-4" />
      <h2 className="font-serif text-3xl text-white mb-3">Your cart is empty</h2>
      <p className="text-stone-400 mb-8">Looks like you haven't added anything yet.</p>
      <button onClick={() => setPage('home')} className="bg-amber-400 text-stone-950 px-8 py-4 font-semibold hover:bg-amber-300 transition-colors">Start Shopping</button>
    </div>
  );

  return (
    <div className="container mx-auto px-6 md:px-12 py-12">
      <h1 className="font-serif text-3xl text-white mb-8">Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item: CartItem) => (
            <motion.div key={item._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex gap-4 bg-stone-900 border border-stone-800 p-4">
              <img src={item.images[0]} alt={item.name} className="w-20 h-20 object-cover bg-stone-800 shrink-0" />
              <div className="flex-1">
                <p className="text-stone-400 text-xs mb-1">{item.brand}</p>
                <p className="text-white font-medium mb-1">{item.name}</p>
                <p className="text-amber-400 font-semibold">${(item.discountPrice || item.price).toLocaleString()}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button onClick={() => removeFromCart(item._id)} className="text-stone-500 hover:text-red-400 transition-colors">
                  <Trash2 size={15} />
                </button>
                <div className="flex items-center border border-stone-700">
                  <button onClick={() => updateQty(item._id, item.quantity - 1)} className="p-2 text-white hover:text-amber-400"><Minus size={12} /></button>
                  <span className="px-3 text-white text-sm">{item.quantity}</span>
                  <button onClick={() => updateQty(item._id, item.quantity + 1)} className="p-2 text-white hover:text-amber-400"><Plus size={12} /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="bg-stone-900 border border-stone-800 p-6 h-fit">
          <h2 className="font-serif text-xl text-white mb-6">Order Summary</h2>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-stone-400 text-sm"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-stone-400 text-sm"><span>Shipping</span><span>{shipping === 0 ? <span className="text-amber-400">Free</span> : $${shipping}}</span></div>
            <div className="flex justify-between text-stone-400 text-sm"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
            <div className="border-t border-stone-800 pt-3 flex justify-between text-white font-semibold"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>
          <button onClick={() => setPage('checkout')} className="w-full bg-amber-400 text-stone-950 py-4 font-semibold hover:bg-amber-300 transition-colors flex items-center justify-center gap-2">
            Proceed to Checkout <ChevronRight size={16} />
          </button>
          <button onClick={() => setPage('home')} className="w-full mt-3 border border-stone-700 text-stone-400 py-3 text-sm hover:border-amber-400 hover:text-white transition-colors">
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

// CHECKOUT
function CheckoutPage() {
  const { setPage, cart, clearCart } = useApp();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ fullName: "", email: "", address: "", city: "", state: "", postalCode: "", country: "US", cardNumber: "", expiry: "", cvv: "" });
  const [ordered, setOrdered] = useState(false);
  const total = cart.reduce((s: number, i: CartItem) => s + (i.discountPrice || i.price) * i.quantity, 0) * 1.08;

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  if (ordered) return (
    <div className="container mx-auto px-6 py-24 text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex">
        <CheckCircle size={64} className="text-amber-400 mx-auto mb-6" />
      </motion.div>
      <h2 className="font-serif text-4xl text-white mb-3">Order Confirmed</h2>
      <p className="text-stone-400 mb-2">Thank you for your purchase!</p>
      <p className="text-stone-500 text-sm mb-8">A confirmation email has been sent to {form.email}</p>
      <button onClick={() => { clearCart(); setPage('home'); }} className="bg-amber-400 text-stone-950 px-8 py-4 font-semibold hover:bg-amber-300 transition-colors">Back to Shopping</button>
    </div>
  );

  return (
    <div className="container mx-auto px-6 md:px-12 py-12 max-w-3xl">
      <h1 className="font-serif text-3xl text-white mb-8">Checkout</h1>

      {/* Steps */}
      <div className="flex items-center gap-4 mb-10">
        {[{ n: 1, label: "Shipping", icon: MapPin }, { n: 2, label: "Payment", icon: CreditCard }].map(({ n, label, icon: Icon }) => (
          <div key={n} className="flex items-center gap-2">
            <div className={w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= n ? 'bg-amber-400 text-stone-950' : 'bg-stone-800 text-stone-500'}}>{n}</div>
            <span className={text-sm ${step >= n ? 'text-white' : 'text-stone-500'}}>{label}</span>
            {n < 2 && <ChevronRight size={14} className="text-stone-600 ml-2" />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="shipping" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <h2 className="text-white font-medium flex items-center gap-2 mb-4"><MapPin size={16} className="text-amber-400" /> Shipping Address</h2>
            {[["fullName", "Full Name"], ["email", "Email Address"], ["address", "Street Address"], ["city", "City"], ["state", "State / Province"], ["postalCode", "Postal Code"]].map(([k, label]) => (
              <div key={k}>
                <label className="text-stone-400 text-xs mb-1 block">{label}</label>
                <input value={(form as any)[k]} onChange={e => set(k, e.target.value)} className="w-full bg-stone-900 border border-stone-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors" />
              </div>
            ))}
            <button onClick={() => setStep(2)} className="w-full bg-amber-400 text-stone-950 py-4 font-semibold hover:bg-amber-300 transition-colors mt-4">Continue to Payment</button>
          </motion.div>
        )}
        {step === 2 && (
          <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <h2 className="text-white font-medium flex items-center gap-2 mb-4"><CreditCard size={16} className="text-amber-400" /> Payment Details</h2>
            {[["cardNumber", "Card Number", "1234 5678 9012 3456"], ["expiry", "Expiry Date", "MM/YY"], ["cvv", "CVV", "123"]].map(([k, label, ph]) => (
              <div key={k}>
                <label className="text-stone-400 text-xs mb-1 block">{label}</label>
                <input value={(form as any)[k]} onChange={e => set(k, e.target.value)} placeholder={ph} className="w-full bg-stone-900 border border-stone-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors" />
              </div>
            ))}
            <div className="bg-stone-900 border border-stone-800 p-4 mt-4">
              <div className="flex justify-between text-stone-400 text-sm mb-2"><span>Items ({cart.length})</span><span>${(total / 1.08).toFixed(2)}</span></div>
              <div className="flex justify-between text-stone-400 text-sm mb-2"><span>Tax</span><span>${(total - total / 1.08).toFixed(2)}</span></div>
              <div className="flex justify-between text-white font-semibold border-t border-stone-800 pt-2"><span>Total</span><span>${total.toFixed(2)}</span></div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 border border-stone-700 text-stone-400 py-4 hover:border-amber-400 hover:text-white transition-colors">Back</button>
              <button onClick={() => setOrdered(true)} className="flex-1 bg-amber-400 text-stone-950 py-4 font-semibold hover:bg-amber-300 transition-colors">Place Order</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// AUTH
function AuthPage() {
  const { login, setPage } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    setError("");
    if (!form.email || !form.password) { setError("Please fill all fields."); return; }
    try {
      const endpoint = isLogin ? "/api/v1/auth/login" : "/api/v1/auth/register";
      const res = await fetch(${API}${endpoint}, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form), credentials: "include"
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");
      login(data.user || { name: form.name || form.email.split("@")[0], email: form.email, _id: "demo", role: "user" });
      setPage('home');
    } catch (e: any) {
      // Demo mode fallback
      login({ name: form.name || form.email.split("@")[0], email: form.email, _id: "demo", role: "user" });
      setPage('home');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl text-white mb-2">{isLogin ? "Welcome Back" : "Create Account"}</h1>
          <p className="text-stone-400 text-sm">{isLogin ? "Sign in to your ShopEase account" : "Join ShopEase for exclusive access"}</p>
        </div>
        <div className="bg-stone-900 border border-stone-800 p-8 space-y-4">
          {!isLogin && (
            <div>
              <label className="text-stone-400 text-xs mb-1 block">Full Name</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="John Doe"
                className="w-full bg-stone-950 border border-stone-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors" />
            </div>
          )}
          <div>
            <label className="text-stone-400 text-xs mb-1 block">Email</label>
            <input value={form.email} onChange={e => set('email', e.target.value)} type="email" placeholder="you@example.com"
              className="w-full bg-stone-950 border border-stone-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors" />
          </div>
          <div>
            <label className="text-stone-400 text-xs mb-1 block">Password</label>
            <div className="relative">
              <input value={form.password} onChange={e => set('password', e.target.value)} type={showPass ? "text" : "password"} placeholder="••••••••"
                className="w-full bg-stone-950 border border-stone-700 text-white px-4 py-3 pr-10 text-sm focus:outline-none focus:border-amber-400 transition-colors" />
              <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white">
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button onClick={submit} className="w-full bg-amber-400 text-stone-950 py-4 font-semibold hover:bg-amber-300 transition-colors mt-2">
            {isLogin ? "Sign In" : "Create Account"}
          </button>
          <p className="text-center text-stone-500 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-amber-400 hover:text-amber-300 transition-colors">
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// WISHLIST
function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart, setPage } = useApp();
  const items = MOCK_PRODUCTS.filter(p => wishlist.includes(p._id));

  if (items.length === 0) return (
    <div className="container mx-auto px-6 py-24 text-center">
      <Heart size={48} className="text-stone-600 mx-auto mb-4" />
      <h2 className="font-serif text-3xl text-white mb-3">Your wishlist is empty</h2>
      <p className="text-stone-400 mb-8">Save items you love for later.</p>
      <button onClick={() => setPage('home')} className="bg-amber-400 text-stone-950 px-8 py-4 font-semibold hover:bg-amber-300 transition-colors">Discover Products</button>
    </div>
  );

  return (
    <div className="container mx-auto px-6 md:px-12 py-12">
      <h1 className="font-serif text-3xl text-white mb-8">Wishlist ({items.length})</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(p => (
          <div key={p._id} className="bg-stone-900 border border-stone-800">
            <div className="aspect-square overflow-hidden bg-stone-800 cursor-pointer" onClick={() => setPage('product', p)}>
              <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-4">
              <p className="text-stone-500 text-xs mb-1">{p.brand}</p>
              <p className="text-white font-medium mb-2">{p.name}</p>
              <p className="text-amber-400 font-semibold mb-3">${(p.discountPrice || p.price).toLocaleString()}</p>
              <div className="flex gap-2">
                <button onClick={() => addToCart(p)} className="flex-1 bg-amber-400 text-stone-950 py-2 text-sm font-semibold hover:bg-amber-300 transition-colors">Add to Cart</button>
                <button onClick={() => toggleWishlist(p._id)} className="border border-stone-700 p-2 hover:border-red-400 transition-colors">
                  <Trash2 size={14} className="text-stone-400 hover:text-red-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────
function Navbar() {
  const { page, setPage, cart, user, logout, wishlist } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const cartCount = cart.reduce((s: number, i: CartItem) => s + i.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 bg-stone-950/95 backdrop-blur-sm border-b border-stone-800">
      <div className="container mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
        <button onClick={() => setPage('home')} className="font-serif text-xl text-white tracking-wide">
          Shop<span className="text-amber-400">Ease</span>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {["home", "wishlist"].map(p => (
            <button key={p} onClick={() => setPage(p)}
              className={text-sm capitalize transition-colors ${page === p ? 'text-amber-400' : 'text-stone-400 hover:text-white'}}>
              {p === 'home' ? 'Shop' : p}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => setPage('wishlist')} className="relative text-stone-400 hover:text-white transition-colors">
            <Heart size={20} />
            {wishlist.length > 0 && <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center">{wishlist.length}</span>}
          </button>
          <button onClick={() => setPage('cart')} className="relative text-stone-400 hover:text-white transition-colors">
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-stone-950 text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold">{cartCount}</span>}
          </button>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-stone-400 text-sm hidden md:block">{user.name}</span>
              <button onClick={logout} className="text-stone-400 hover:text-white transition-colors"><LogOut size={18} /></button>
            </div>
          ) : (
            <button onClick={() => setPage('auth')} className="text-stone-400 hover:text-white transition-colors"><User size={20} /></button>
          )}
          <button className="md:hidden text-stone-400" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden md:hidden border-t border-stone-800 bg-stone-950">
            <div className="px-6 py-4 space-y-3">
              {["home", "wishlist", "cart"].map(p => (
                <button key={p} onClick={() => { setPage(p); setMenuOpen(false); }} className="block text-stone-400 hover:text-white capitalize text-sm">{p === 'home' ? 'Shop' : p}</button>
              ))}
              {!user && <button onClick={() => { setPage('auth'); setMenuOpen(false); }} className="block text-stone-400 hover:text-white text-sm">Sign In</button>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-stone-950 border-t border-stone-800 mt-16 py-12">
      <div className="container mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <p className="font-serif text-xl text-white mb-3">Shop<span className="text-amber-400">Ease</span></p>
          <p className="text-stone-500 text-sm leading-relaxed">Curated goods for those who value quality over quantity.</p>
        </div>
        {[
          { title: "Shop", links: ["New Arrivals", "Featured", "Sale", "All Products"] },
          { title: "Support", links: ["Contact Us", "FAQs", "Shipping", "Returns"] },
          { title: "Company", links: ["About", "Careers", "Press", "Sustainability"] },
        ].map(col => (
          <div key={col.title}>
            <p className="text-white text-sm font-medium mb-3">{col.title}</p>
            <ul className="space-y-2">
              {col.links.map(l => <li key={l}><a href="#" className="text-stone-500 text-sm hover:text-amber-400 transition-colors">{l}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="container mx-auto px-6 md:px-12 mt-8 pt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center gap-2">
        <p className="text-stone-600 text-xs">© 2026 ShopEase. All rights reserved.</p>
        <p className="text-stone-600 text-xs">Privacy · Terms · Cookies</p>
      </div>
    </footer>
  );
}

// Toast notification
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 2500); return () => clearTimeout(t); }, []);
  return (
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-6 right-6 z-50 bg-stone-900 border border-amber-400/40 text-white px-5 py-3 text-sm flex items-center gap-3 shadow-xl">
      <CheckCircle size={15} className="text-amber-400" />
      {message}
    </motion.div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPageRaw] = useState<string>("home");
  const [pageData, setPageData] = useState<any>(null);
  const [cart, setCart] = useState<CartItem[]>(() => { try { return JSON.parse(localStorage.getItem('se_cart') || '[]'); } catch { return []; } });
  const [wishlist, setWishlist] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem('se_wl') || '[]'); } catch { return []; } });
  const [user, setUser] = useState<User | null>(() => { try { return JSON.parse(localStorage.getItem('se_user') || 'null'); } catch { return null; } });
  const [toast, setToast] = useState("");

  useEffect(() => { localStorage.setItem('se_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('se_wl', JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem('se_user', JSON.stringify(user)); }, [user]);

  const setPage = (p: string, data?: any) => { setPageRaw(p); setPageData(data || null); window.scrollTo(0, 0); };

  const addToCart = (product: Product, qty = 1) => {
    setCart(c => {
      const existing = c.find(i => i._id === product._id);
      if (existing) return c.map(i => i._id === product._id ? { ...i, quantity: i.quantity + qty } : i);
      return [...c, { ...product, quantity: qty }];
    });
    setToast(${product.name} added to cart);
  };

  const updateQty = (id: string, qty: number) => {
    if (qty < 1) return removeFromCart(id);
    setCart(c => c.map(i => i._id === id ? { ...i, quantity: qty } : i));
  };

  const removeFromCart = (id: string) => setCart(c => c.filter(i => i._id !== id));
  const clearCart = () => setCart([]);

  const toggleWishlist = (id: string) => {
    setWishlist(w => w.includes(id) ? w.filter(i => i !== id) : [...w, id]);
  };

  const login = (u: User) => setUser(u);
  const logout = () => { setUser(null); localStorage.removeItem('se_user'); };

  const ctx = { page, setPage, cart, addToCart, updateQty, removeFromCart, clearCart, wishlist, toggleWishlist, user, login, logout };

  return (
    <AppContext.Provider value={ctx}>
      <div className="min-h-screen bg-stone-950 font-sans">
        <Navbar />
        <main>
          <AnimatePresence mode="wait">
            {page === 'home' && <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><HomePage /></motion.div>}
            {page === 'product' && <motion.div key="product" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><ProductPage product={pageData} /></motion.div>}
            {page === 'cart' && <motion.div key="cart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><CartPage /></motion.div>}
            {page === 'checkout' && <motion.div key="checkout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><CheckoutPage /></motion.div>}
            {page === 'auth' && <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><AuthPage /></motion.div>}
            {page === 'wishlist' && <motion.div key="wishlist" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><WishlistPage /></motion.div>}
          </AnimatePresence>
        </main>
        <Footer />
        <AnimatePresence>
          {toast && <Toast key={toast} message={toast} onClose={() => setToast("")} />}
        </AnimatePresence>
      </div>
    </AppContext.Provider>
  );
}