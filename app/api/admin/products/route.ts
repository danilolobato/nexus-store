import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, category, price, stock, image, description } = body;

    const newProduct = await prisma.product.create({
      data: {
        name,
        category,
        price: parseFloat(price),
        stock: parseInt(stock),
        image,
        description,
      },
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error('Error al crear producto:', error);
    return NextResponse.json({ success: false, error: 'Error al crear producto' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, category, price, stock, image, description } = body;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        category,
        price: parseFloat(price),
        stock: parseInt(stock),
        image,
        description,
      },
    });

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    return NextResponse.json({ success: false, error: 'Error al actualizar producto' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID no proporcionado' }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return NextResponse.json({ success: false, error: 'Error al eliminar producto' }, { status: 500 });
  }
}