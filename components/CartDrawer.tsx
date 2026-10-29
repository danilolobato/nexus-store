'use client';

import { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'sonner';

export default function CartDrawer() {
  const { cart, isCartOpen, toggleCart, removeFromCart, updateQuantity, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (!isCartOpen) return null;

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          total: totalPrice,
          customerName: 'Cliente Nexus',
          customerEmail: 'cliente@nexusstore.com',
          shippingAddress: 'Envío estándar - Argentina',
        }),
      });

      const data = await res.json();

      if (data.success) {
        const existingOrders = JSON.parse(localStorage.getItem('nexus_orders') || '[]');
        const newOrder = {
          id: data.orderId,
          date: new Date().toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
          total: totalPrice,
          itemsCount: cart.reduce((acc, item) => acc + item.quantity, 0),
        };
        localStorage.setItem('nexus_orders', JSON.stringify([newOrder, ...existingOrders]));

        clearCart();
        toggleCart();
        toast.success('¡Compra completada con éxito!', {
          description: `Orden #${data.orderId.slice(0, 8)} registrada. Podés rastrearla desde el menú.`,
          duration: 5000,
        });
      } else {
        toast.error('Error al procesar la compra: ' + (data.error || 'Desconocido'));
      }
    } catch (error) {
      console.error(error);
      toast.error('Error de conexión con el servidor.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end font-sans">
      <div className="w-full max-w-md bg-zinc-950 border-l border-zinc-800 text-zinc-100 flex flex-col h-full shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h2 className="font-extrabold text-lg text-white">Tu Carrito de Compras</h2>
          </div>
          <button onClick={toggleCart} className="text-zinc-400 hover:text-white p-1.5 rounded-xl transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lista de Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-24 text-zinc-500">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-20 text-emerald-400" />
              <p className="text-lg font-bold text-zinc-300">Tu carrito está vacío</p>
              <p className="text-xs mt-1 text-zinc-500">Agregá algunos productos para empezar.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-2xl flex gap-4 items-center shadow-md">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl bg-zinc-950 border border-zinc-800 shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm line-clamp-1 text-white">{item.name}</h4>
                  <p className="text-emerald-400 font-black text-sm mt-0.5">${item.price.toFixed(2)}</p>

                  <div className="flex items-center justify-between mt-2.5">
                    <div className="flex items-center border border-zinc-700 rounded-xl bg-zinc-950 overflow-hidden">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)} 
                        className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-white">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)} 
                        className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.id)} 
                      className="text-red-400 hover:text-red-300 p-1.5 rounded-xl hover:bg-red-500/10 transition cursor-pointer"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer y Checkout */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-zinc-800 bg-zinc-900/40 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400 text-sm font-semibold">Total a pagar:</span>
              <span className="text-2xl font-black text-white">${totalPrice.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black py-3.5 rounded-2xl transition shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Procesando Pedido...
                </>
              ) : (
                <>
                  Finalizar Pedido <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <button
              onClick={clearCart}
              className="w-full text-xs text-zinc-500 hover:text-red-400 transition py-1 font-semibold cursor-pointer"
            >
              Vaciar Carrito
            </button>
          </div>
        )}
      </div>
    </div>
  );
}