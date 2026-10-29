'use server';

import { prisma } from '@/lib/prisma';

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return products;
  } catch (error) {
    console.error("Error al obtener productos de la base de datos:", error);
    return [];
  }
}