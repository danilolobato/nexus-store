'use client';

import { ProductItem, useCartStore } from '@/store/useCartStore';
import { ShoppingBag, Eye, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useState } from 'react';
import QuickViewModal from './QuickViewModal';

interface ProductCardProps {
  product: ProductItem;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (product.stock <= 0) {
      toast.error('Producto agotado');
      return;
    }
    addToCart(product);
    toast.success('¡Agregado al carrito!', {
      description: `${product.name} fue añadido correctamente.`,
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        onClick={() => setIsQuickViewOpen(true)}
        className="group bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-emerald-500/40 rounded-3xl overflow-hidden p-5 flex flex-col justify-between transition-all duration-300 shadow-lg hover:shadow-emerald-500/10 cursor-pointer relative"
      >
        <div>
          {/* Imagen y Badge */}
          <div className="relative h-48 bg-zinc-950 rounded-2xl overflow-hidden mb-4 border border-zinc-800/50">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            
            {product.badge && (
              <span className="absolute top-3 left-3 bg-emerald-500 text-zinc-950 font-black text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-xl shadow-md">
                {product.badge}
              </span>
            )}

            {/* Botón flotante de Vista Rápida */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 backdrop-blur-[2px]">
              <span className="bg-zinc-900/90 text-white font-bold text-xs px-4 py-2 rounded-xl border border-zinc-700 flex items-center gap-1.5 shadow-xl">
                <Eye className="w-4 h-4 text-emerald-400" /> Vista Rápida
              </span>
            </div>
          </div>

          {/* Categoría y Rating */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{product.rating?.toFixed(1) || '5.0'}</span>
            </div>
          </div>

          {/* Título */}
          <h3 className="font-extrabold text-white text-base mb-1 line-clamp-1 group-hover:text-emerald-400 transition">
            {product.name}
          </h3>

          {/* Descripción corta */}
          <p className="text-zinc-400 text-xs line-clamp-2 mb-4 leading-relaxed">
            {product.description || 'Hardware de alta gama y precisión extrema.'}
          </p>
        </div>

        {/* Precio y Botón Comprar */}
        <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between mt-auto">
          <div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Precio</span>
            <span className="text-lg font-black text-white">${product.price.toFixed(2)}</span>
          </div>

          <button
            onClick={handleAdd}
            disabled={product.stock <= 0}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition flex items-center gap-1.5 shadow-md cursor-pointer ${
              product.stock > 0
                ? 'bg-zinc-800 hover:bg-emerald-500 text-white hover:text-zinc-950 border border-zinc-700 hover:border-emerald-500'
                : 'bg-zinc-800/50 text-zinc-500 cursor-not-allowed border border-zinc-800'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {product.stock > 0 ? 'Comprar' : 'Agotado'}
          </button>
        </div>
      </motion.div>

      {/* Modal de Vista Rápida */}
      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
}