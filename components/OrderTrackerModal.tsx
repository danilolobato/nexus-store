'use client';

import { useState, useEffect } from 'react';
import { X, Search, PackageCheck, Truck, CheckCircle2, Clock, Loader2, History, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderId?: string;
}

interface LocalOrder {
  id: string;
  date: string;
  total: number;
  itemsCount: number;
}

export default function OrderTrackerModal({ isOpen, onClose, initialOrderId = '' }: OrderTrackerModalProps) {
  const [orderId, setOrderId] = useState(initialOrderId);
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [localOrders, setLocalOrders] = useState<LocalOrder[]>([]);

  // Cargar historial de localStorage al abrir el modal
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('nexus_orders');
      if (saved) {
        try {
          setLocalOrders(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const fetchOrderDetails = async (idToSearch: string) => {
    const cleanId = idToSearch?.trim().replace(/:[0-9]+$/, '');
    
    if (!cleanId) {
      setError('Por favor ingresá un ID de orden válido.');
      return;
    }

    setLoading(true);
    setError('');
    setOrderData(null);

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(cleanId)}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setOrderData(data.order);
      } else {
        setError(data.error || 'No encontramos ninguna orden con ese ID.');
      }
    } catch (err) {
      setError('Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrderDetails(orderId);
  };

  const handleSelectFromHistory = (id: string) => {
    setOrderId(id);
    fetchOrderDetails(id);
  };

  const steps = [
    { key: 'pending', label: 'Recibido', icon: Clock },
    { key: 'completed', label: 'Procesado', icon: PackageCheck },
    { key: 'shipped', label: 'En Camino', icon: Truck },
    { key: 'delivered', label: 'Entregado', icon: CheckCircle2 },
  ];

  const getCurrentStepIndex = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'delivered') return 3;
    if (s === 'shipped') return 2;
    if (s === 'completed') return 1;
    return 0; // pending
  };

  const currentStep = orderData ? getCurrentStepIndex(orderData.status) : 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-xl p-6 sm:p-8 shadow-2xl relative text-zinc-100 max-h-[90vh] overflow-y-auto no-scrollbar"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Rastrear Pedido</h2>
                <p className="text-xs text-zinc-400">Consulta el estado de tu compra en tiempo real</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white rounded-xl transition cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Formulario de búsqueda por ID */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Pegá o buscá por ID de Orden..."
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition font-mono"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black px-5 rounded-2xl transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </button>
          </form>

          {/* Historial Local de Compras */}
          {localOrders.length > 0 && !orderData && (
            <div className="mb-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <History className="w-4 h-4" /> Mis Compras Recientes
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
                {localOrders.map((ord) => (
                  <div
                    key={ord.id}
                    onClick={() => handleSelectFromHistory(ord.id)}
                    className="bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 hover:border-emerald-500/40 p-3 rounded-xl flex items-center justify-between cursor-pointer transition group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white">
                          #{ord.id ? ord.id.slice(0, 8) : '--------'}...
                        </span>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-500/20 font-bold">
                          {ord.itemsCount} {ord.itemsCount === 1 ? 'ítem' : 'ítems'}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-500 mt-0.5 block">{ord.date}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-black text-sm text-emerald-400">${ord.total ? ord.total.toFixed(2) : '0.00'}</span>
                      <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold text-center mb-4">
              {error}
            </div>
          )}

          {/* Resultado Detallado del Pedido */}
          {orderData && (
            <div className="space-y-6 pt-2 border-t border-zinc-800/80">
              {/* Botón para Volver al Historial */}
              <button
                onClick={() => setOrderData(null)}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1 cursor-pointer"
              >
                ← Ver historial de compras
              </button>

              {/* Info General */}
              <div className="bg-zinc-900/60 border border-zinc-800/80 p-4 rounded-2xl flex justify-between items-center text-xs">
                <div>
                  <p className="text-zinc-500 font-bold uppercase text-[10px]">ID de Orden</p>
                  <p className="font-mono font-bold text-white text-xs mt-0.5">{orderData.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-zinc-500 font-bold uppercase text-[10px]">Total Pagado</p>
                  <p className="font-black text-emerald-400 text-sm mt-0.5">${orderData.totalAmount ? orderData.totalAmount.toFixed(2) : '0.00'}</p>
                </div>
              </div>

              {/* Línea de Tiempo de Estado */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4 text-center">Estado del Envío</p>
                <div className="grid grid-cols-4 gap-2 relative">
                  {steps.map((step, idx) => {
                    const Icon = step.icon;
                    const isPassed = idx <= currentStep;
                    return (
                      <div key={step.key} className="flex flex-col items-center text-center">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                            isPassed
                              ? 'bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/20 font-bold'
                              : 'bg-zinc-900 border border-zinc-800 text-zinc-600'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className={`text-[10px] font-bold mt-2 ${isPassed ? 'text-white' : 'text-zinc-600'}`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Lista de Ítems */}
              <div className="border-t border-zinc-800/80 pt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">Detalle del Pedido</p>
                <div className="space-y-2 max-h-40 overflow-y-auto no-scrollbar">
                  {orderData.items && orderData.items.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between bg-zinc-900/40 p-2.5 rounded-xl text-xs border border-zinc-800/50">
                      <span className="font-bold text-white">{item.product?.name || 'Producto'}</span>
                      <span className="text-zinc-400">
                        {item.quantity}x — <strong className="text-emerald-400">${item.unitPrice ? item.unitPrice.toFixed(2) : '0.00'}</strong>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}