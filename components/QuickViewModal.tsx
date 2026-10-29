'use client';

import { X, ShoppingBag, Star, ShieldCheck, Truck, Check } from 'lucide-react';
import { ProductItem, useCartStore } from '@/store/useCartStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'sonner';

interface QuickViewModalProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { addToCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success('¡Producto agregado!', {
      description: `${quantity}x ${product.name} añadido al carrito.`,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl relative text-zinc-100 flex flex-col md:flex-row"
        >
          {/* Botón Cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-2xl transition cursor-pointer border border-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Imagen del Producto */}
          <div className="md:w-1/2 bg-zinc-900/60 p-8 flex items-center justify-center relative border-b md:border-b-0 md:border-r border-zinc-800">
            <div className="absolute inset-0 bg-emerald-500/5 blur-3xl pointer-events-none" />
            <img
              src={product.image}
              alt={product.name}
              className="max-h-72 w-full object-cover rounded-2xl shadow-xl border border-zinc-800/80 relative z-10"
            />
          </div>

          {/* Información y Acciones */}
          <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{product.rating?.toFixed(1) || '5.0'}</span>
                </div>
              </div>

              <h2 className="text-2xl font-black text-white mb-2">{product.name}</h2>
              <p className="text-2xl font-black text-emerald-400 mb-4">${product.price.toFixed(2)}</p>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                {product.description || 'Equipamiento de alto rendimiento seleccionado para creadores y entusiastas exigentes.'}
              </p>

              <div className="space-y-2 mb-6 text-xs text-zinc-300 font-semibold border-t border-zinc-800/80 pt-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Garantía Oficial de Fábrica
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-400" /> Stock disponible: <span className="text-white font-bold">{product.stock} unidades</span>
                </div>
              </div>
            </div>

            {/* Selector de cantidad y Botón */}
            <div className="space-y-4 pt-4 border-t border-zinc-800/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Cantidad:</span>
                <div className="flex items-center border border-zinc-700 rounded-2xl bg-zinc-900 overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 text-sm font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black py-3.5 rounded-2xl transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <ShoppingBag className="w-5 h-5" /> Agregar al Carrito
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}