⚡ Nexus Store — Hardware & Tech E-commerce

Una plataforma de comercio electrónico de alta gama desarrollada como proyecto de portafolio full-stack, diseñada con una estética "Carbon & Emerald", micro-interacciones fluidas y gestión en tiempo real.

🚀 Características Principales

🛒 E-commerce Core & Transacciones Atómicas: Carrito de compras reactivo con sincronización de stock en tiempo real mediante transacciones ACID de Prisma/PostgreSQL.

📦 Sistema de Rastreo de Envíos (Order Tracker): Permite consultar el estado del pedido en tiempo real (Recibido → Procesado → En Camino → Entregado) mediante UUIDs únicos generados por la base de datos.

🕒 Historial de Compras Local: Persistencia inteligente en localStorage vinculada al historial de compras del cliente para un acceso sin fricciones al rastreador.

🔍 Modal de Vista Rápida (QuickView): Experiencia inmersiva con detalles de productos, control de stock y selectores de cantidad animados.

🔒 Panel de Administración (/admin): Dashboard protegido para la gestión CRUD completa de inventario y control de estados de pedidos.

✨ UI/UX de Alta Gama: Diseño moderno en modo oscuro con estética "Carbon & Emerald", glassmorphism, notificaciones toast interactivas (Sonner) y animaciones fluidas con Framer Motion.

🛠️ Stack Tecnológico

Frontend: Next.js 15 (App Router), React, TypeScript, Tailwind CSS, Framer Motion, Zustand, Lucide React, Sonner.

Backend: Next.js API Routes (Serverless).

Base de Datos & ORM: Neon PostgreSQL, Prisma ORM.

📂 Arquitectura del Proyecto

├── app/
│   ├── api/             # Endpoints REST (Checkout, Productos, Órdenes)
│   ├── admin/           # Panel de administración protegido
│   └── page.tsx         # Página principal de la tienda
├── components/          # Componentes modulares (CartDrawer, QuickViewModal, OrderTracker, Navbar)
├── store/               # Gestión de estado global con Zustand
├── prisma/              # Esquema de base de datos y migraciones
└── public/              # Assets estáticos


⚙️ Instalación y Configuración Local

Cloná el repositorio:

git clone https://github.com/tu-usuario/nexus-store.git
cd nexus-store


Instalá las dependencias:

npm install


Configurá las variables de entorno:
Crea un archivo .env en la raíz del proyecto y agregá tu conexión a Neon PostgreSQL:

DATABASE_URL="postgresql://usuario:password@host:port/neondb?sslmode=require"


Ejecutá las migraciones de Prisma:

npx prisma db push


Iniciá el servidor de desarrollo:

npm run dev


Abrí http://localhost:3000 en tu navegador para ver la aplicación funcionando.

👨‍💻 Autor

Desarrollado por Danilo Lobato.