import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, total, customerName, customerEmail, shippingAddress } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Carrito vacío' }, { status: 400 });
    }

    const numericTotal = parseFloat(total) || 0;

    { /*Transacción en Prisma / Neon */}

    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          customerName: customerName || 'Cliente Nexus',
          customerEmail: customerEmail || 'cliente@nexusstore.com',
          shippingAddress: shippingAddress || 'Envío estándar - Argentina',
          totalAmount: numericTotal,
          status: 'completed',
          items: {
            create: items.map((item: any) => ({
              productId: String(item.id),
              quantity: parseInt(item.quantity),
              unitPrice: parseFloat(item.price),
            })),
          },
        },
      });

      for (const item of items) {
        await tx.product.update({
          where: { id: item.id },
          data: {
            stock: {
              decrement: parseInt(item.quantity),
            },
          },
        });
      }

      return order;
    });

    return NextResponse.json({ 
      success: true, 
      orderId: result.id 
    });

  } catch (error: any) {
    console.error('Error detallado en checkout:', error);
    return NextResponse.json({ success: false, error: error.message || 'Error procesando la orden' }, { status: 500 });
  }
}