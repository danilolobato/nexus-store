'use client';

import { useState, useEffect } from 'react';
import { getProducts } from '@/app/actions';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import ProductSkeleton from '@/components/ProductSkeleton';
import CartDrawer from '@/components/CartDrawer';
import CustomCursor from '@/components/CustomCursor';
import { ProductItem } from '@/store/useCartStore';
import { Flame, ShieldCheck, Truck, Headphones, ArrowUpDown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  {/* Filtrado */}

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  {/* Ordenamiento dinámico */}

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; 
  });

  const categories = ['Todos', ...Array.from(new Set(products.map((p) => p.category)))];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-emerald-500 selection:text-zinc-950 font-sans">
      <CustomCursor />
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <CartDrawer />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 rounded-3xl p-8 sm:p-12 mb-10 overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-extrabold text-xs tracking-wider uppercase mb-4">
              <Flame className="w-4 h-4 text-emerald-400" /> Catálogo Oficial
            </span>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-4 leading-none">
              Equipamiento <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Sin Compromisos
              </span>
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-6">
              Hardware de alto rendimiento, periféricos de precisión y tecnología seleccionada para creadores y jugadores exigentes.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-800/80 text-xs font-semibold text-zinc-300">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-400" /> Envío a todo el país
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Garantía Oficial
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-emerald-400" /> Soporte 24/7
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filtros de Categorías & Selector de Ordenamiento */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          
          {/* Categorías con Scroll Limpio */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar max-w-full">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider transition shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/20'
                    : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800'
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>

          {/* Selector de Ordenamiento Limpio */}
          <div className="flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 rounded-2xl px-4 py-2.5 text-xs text-zinc-300 shrink-0 self-start lg:self-auto shadow-inner">
            <ArrowUpDown className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-semibold text-zinc-400">Ordenar:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer pr-1"
            >
              <option value="featured" className="bg-zinc-900 text-white">Destacados</option>
              <option value="price-asc" className="bg-zinc-900 text-white">Menor Precio</option>
              <option value="price-desc" className="bg-zinc-900 text-white">Mayor Precio</option>
              <option value="price-desc" className="bg-zinc-900 text-white">Mejor Valorados</option>
            </select>
          </div>

        </div>

        {/* Grilla de Productos o Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-24 bg-zinc-900/40 border border-zinc-800 rounded-3xl">
            <p className="text-lg font-bold text-zinc-300">No se encontraron productos</p>
            <p className="text-sm text-zinc-500 mt-1">Intentá cambiar los filtros o los términos de búsqueda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 py-8 bg-zinc-950 text-center text-xs text-zinc-500 font-medium">
        <p>Nexus Store &copy; {new Date().getFullYear()} — Plataforma de Comercio Electrónico.</p>
      </footer>
    </div>
  );
}