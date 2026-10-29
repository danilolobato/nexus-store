'use client';

import { useState, useEffect } from 'react';
import { getProducts } from '@/app/actions';
import { ProductItem } from '@/store/useCartStore';
import { Plus, Trash2, Edit2, ArrowLeft, Save, X, Lock, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

{/* Clave simple para el panel de administración */}

const ADMIN_PIN = 'admin123';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  {/* Campos del formulario */}

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  const fetchProducts = async () => {
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleOpenModal = (product?: ProductItem) => {
    if (product) {
      setEditingId(product.id);
      setName(product.name);
      setCategory(product.category);
      setPrice(product.price.toString());
      setStock(product.stock.toString());
      setImage(product.image);
      setDescription(product.description || '');
    } else {
      setEditingId(null);
      setName('');
      setCategory('');
      setPrice('');
      setStock('');
      setImage('');
      setDescription('');
    }
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/products', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingId,
          name,
          category,
          price: parseFloat(price),
          stock: parseInt(stock),
          image,
          description,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchProducts();
      } else {
        alert('Error al guardar el producto');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchProducts();
      } else {
        alert('Error al eliminar');
      }
    } catch (error) {
      console.error(error);
    }
  };

  {/* Pantalla de Autenticación de Administrador */}

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4 font-sans">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 mb-4">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-white">Acceso Administrador</h1>
            <p className="text-xs text-zinc-400 mt-1">Ingresá la clave de acceso para gestionar inventario.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Clave / PIN</label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Pista: admin123"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 text-sm text-center font-mono tracking-widest text-white focus:outline-none focus:border-emerald-500 transition"
              />
              {pinError && (
                <p className="text-xs text-red-400 font-semibold mt-2 text-center">Clave incorrecta. Intentá con: admin123</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black py-3 rounded-2xl transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-5 h-5" /> Ingresar al Panel
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300 transition">
              ← Volver a la Tienda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  {/* Panel Principal de Administración */}

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Cabecera */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-zinc-800">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm font-semibold mb-2 transition">
              <ArrowLeft className="w-4 h-4" /> Volver a la Tienda
            </Link>
            <h1 className="text-3xl font-black tracking-tight text-white">
              Panel de Administración
            </h1>
            <p className="text-zinc-400 text-sm mt-1">Control total de inventario, precios y stock en tiempo real.</p>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black px-5 py-3 rounded-2xl transition flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            <Plus className="w-5 h-5" /> Nuevo Producto
          </button>
        </div>

        {/* Tabla de Productos */}
        {loading ? (
          <div className="text-center py-24 text-zinc-500 font-medium">Cargando panel de control...</div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-950/60 border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                    <th className="p-4 sm:p-5">Producto</th>
                    <th className="p-4 sm:p-5">Categoría</th>
                    <th className="p-4 sm:p-5">Precio</th>
                    <th className="p-4 sm:p-5">Stock</th>
                    <th className="p-4 sm:p-5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-sm">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-zinc-800/40 transition">
                      <td className="p-4 sm:p-5 flex items-center gap-4">
                        <img src={product.image} alt={product.name} className="w-12 h-12 rounded-xl object-cover bg-zinc-950 border border-zinc-800" />
                        <div>
                          <span className="font-bold text-white block line-clamp-1">{product.name}</span>
                          <span className="text-xs text-zinc-400 line-clamp-1">{product.description || 'Sin descripción'}</span>
                        </div>
                      </td>
                      <td className="p-4 sm:p-5">
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-xl text-xs font-bold">
                          {product.category}
                        </span>
                      </td>
                      <td className="p-4 sm:p-5 font-black text-white">${product.price.toFixed(2)}</td>
                      <td className="p-4 sm:p-5">
                        <span className={`px-3 py-1 rounded-xl text-xs font-bold ${
                          product.stock > 10 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          product.stock > 0 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
                        </span>
                      </td>
                      <td className="p-4 sm:p-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal(product)}
                            className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-xl transition border border-zinc-700 cursor-pointer"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition border border-red-500/20 cursor-pointer"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal de Crear / Editar */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-xl p-6 sm:p-8 shadow-2xl relative text-white">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-zinc-800">
                <h2 className="text-xl font-black">{editingId ? 'Editar Producto' : 'Crear Nuevo Producto'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white p-1 rounded-xl transition cursor-pointer">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Nombre del Producto</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Teclado Mecánico RGB"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Categoría</label>
                    <input
                      type="text"
                      required
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="Ej. Periféricos"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Precio ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="149.99"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Stock Disponible</label>
                    <input
                      type="number"
                      required
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="15"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">URL de Imagen</label>
                    <input
                      type="url"
                      required
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Descripción</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detalles y especificaciones..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-sm font-bold transition cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-sm font-black transition flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
                  >
                    <Save className="w-4 h-4" /> Guardar Producto
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}