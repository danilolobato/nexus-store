'use client';

import { useState } from 'react';
import { ShoppingCart, Store, Search, Truck, Lock } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import OrderTrackerModal from './OrderTrackerModal';

interface NavbarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function Navbar({ searchTerm, setSearchTerm }: NavbarProps) {
  const { cart, toggleCart } = useCartStore();
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/80 text-white shadow-2xl font-sans"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo Comercial con Glow */}
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-40 group-hover:opacity-100 transition duration-500" />
                <div className="relative bg-zinc-900 p-2.5 rounded-2xl border border-zinc-700/80 text-emerald-400">
                  <Store className="w-6 h-6" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-black text-2xl tracking-tight text-white flex items-center gap-1">
                  NEXUS <span className="text-emerald-400">STORE</span>
                </span>
                <span className="text-[10px] tracking-widest text-zinc-400 font-bold uppercase -mt-1">
                  Hardware & Tech
                </span>
              </div>
            </motion.div>
          </Link>

          {/* Buscador Interactivo */}
          <div className="flex-1 max-w-md relative hidden md:block">
            <motion.div whileFocus={{ scale: 1.02 }} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Buscar entre +50 productos de tecnología..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl pl-11 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner"
              />
            </motion.div>
          </div>

          {/* Acciones del Navbar */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Botón de Rastrear Pedido */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsTrackerOpen(true)}
              className="bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 hover:border-emerald-500/50 px-3.5 py-2.5 rounded-2xl transition duration-300 flex items-center gap-2 group shadow-lg cursor-pointer text-xs font-bold text-zinc-300 hover:text-white"
            >
              <Truck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition" />
              <span className="hidden sm:inline">Rastrear Pedido</span>
            </motion.button>

            {/* Acceso Directo Admin */}
            <Link href="/admin">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 hover:border-emerald-500/50 p-2.5 rounded-2xl transition duration-300 flex items-center justify-center text-zinc-400 hover:text-emerald-400 shadow-lg cursor-pointer"
                title="Panel de Administración"
              >
                <Lock className="w-4.5 h-4.5" />
              </motion.button>
            </Link>

            {/* Botón de Carrito con Micro-Animaciones */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleCart}
              className="relative bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 hover:border-emerald-500/50 p-2.5 sm:px-4 sm:py-2.5 rounded-2xl transition duration-300 flex items-center gap-3 group shadow-lg cursor-pointer"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-zinc-300 group-hover:text-emerald-400 transition" />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-3 -right-3 bg-gradient-to-r from-emerald-500 to-teal-400 text-zinc-950 font-black text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/40"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <span className="hidden sm:inline text-sm font-bold text-zinc-200 group-hover:text-white">
                Mi Carrito
              </span>
            </motion.button>

          </div>

        </div>
      </motion.header>

      {/* Modal de Rastreo de Envíos */}
      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
      />
    </>
  );
}