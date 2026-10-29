'use client';

export default function ProductSkeleton() {
  return (
    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-3xl overflow-hidden p-5 flex flex-col justify-between animate-pulse">
      <div>
        {/* Skeleton Imagen */}
        <div className="h-48 bg-zinc-800/80 rounded-2xl w-full mb-4" />
        
        {/* Skeleton Categoría */}
        <div className="h-3 bg-zinc-800/80 rounded w-1/3 mb-3" />
        
        {/* Skeleton Título */}
        <div className="h-5 bg-zinc-800/80 rounded w-3/4 mb-2" />
        
        {/* Skeleton Descripción */}
        <div className="h-3 bg-zinc-800/80 rounded w-full mb-1" />
        <div className="h-3 bg-zinc-800/80 rounded w-2/3 mb-4" />
      </div>

      {/* Skeleton Precio y Botón */}
      <div className="pt-3 border-t border-zinc-800/50 flex items-center justify-between">
        <div className="space-y-1">
          <div className="h-2 bg-zinc-800/80 rounded w-12" />
          <div className="h-6 bg-zinc-800/80 rounded w-20" />
        </div>
        <div className="h-10 bg-zinc-800/80 rounded-2xl w-28" />
      </div>
    </div>
  );
}