import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Limpiando y sembrando 50+ productos en la base de datos...');

  await prisma.orderItem.deleteMany();
  await prisma.product.deleteMany();

  const productsData = [
    // Audio
    { name: 'Quantum Noise-Canceling Headphones', category: 'Audio', price: 299.99, stock: 15, rating: 4.9, badge: 'Bestseller', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', description: 'Auriculares inalámbricos de alta fidelidad con cancelación de ruido activa.' },
    { name: 'SonicBlast Studio Monitors', category: 'Audio', price: 189.50, stock: 10, rating: 4.8, badge: 'Nuevo', image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80', description: 'Monitores de estudio para creadores y producción musical impecable.' },
    { name: 'HyperX Cloud III Wireless', category: 'Audio', price: 169.99, stock: 25, rating: 4.7, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80', description: 'Comodidad legendaria y audio espacial inmersivo para gaming.' },
    { name: 'Razer BlackShark V2 Pro', category: 'Audio', price: 199.99, stock: 12, rating: 4.6, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80', description: 'Micrófono de banda ancha USB Type-C y drivers de titanio.' },
    { name: 'SteelSeries Arctis Nova 7', category: 'Audio', price: 179.00, stock: 18, rating: 4.8, badge: 'Popular', image: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=800&q=80', description: 'Sistema acústico Nova con audio espacial paramétrico de 360°.' },
    { name: 'Sony WH-1000XM5', category: 'Audio', price: 399.00, stock: 8, rating: 5.0, badge: 'Top', image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80', description: 'Cancelación de ruido líder en la industria con dos procesadores.' },
    { name: 'JBL Quantum 810', category: 'Audio', price: 149.99, stock: 20, rating: 4.5, image: 'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800&q=80', description: 'Sonido DualSource inalámbrico de 2.4GHz con cancelación de ruido.' },
    { name: 'Audio-Technica ATH-M50x', category: 'Audio', price: 169.00, stock: 14, rating: 4.9, image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80', description: 'El estándar de oro para monitoreo de audio profesional y mezcla.' },

    // Periféricos
    { name: 'Pulse RGB Mechanical Keyboard', category: 'Periféricos', price: 149.50, stock: 8, rating: 4.7, badge: 'Nuevo', image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&q=80', description: 'Teclado mecánico ultra rápido con switches intercambiables e iluminación RGB.' },
    { name: 'Aura Wireless Gaming Mouse', category: 'Periféricos', price: 79.99, stock: 22, rating: 4.6, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80', description: 'Sensor óptico de 26,000 DPI con diseño ergonómico peso pluma.' },
    { name: 'Logitech G Pro X Superlight', category: 'Periféricos', price: 159.99, stock: 30, rating: 4.9, badge: 'Bestseller', image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80', description: 'Diseñado en colaboración con los mejores profesionales de esports.' },
    { name: 'Keychron K2 V2 Wireless', category: 'Periféricos', price: 99.00, stock: 16, rating: 4.7, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80', description: 'Teclado mecánico inalámbrico compacto 75% con switches Gateron.' },
    { name: 'Razer Huntsman V3 Pro', category: 'Periféricos', price: 249.99, stock: 9, rating: 4.8, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80', description: 'Switches analógicos ópticos Gen-2 con actuación ajustable.' },
    { name: 'Glorious Model O Wireless', category: 'Periféricos', price: 79.95, stock: 19, rating: 4.5, image: 'https://images.unsplash.com/photo-1626544827763-d516dce335e2?w=800&q=80', description: 'Mouse ultraligero con diseño de panal y sensor BAMF.' },
    { name: 'Stream Deck MK.2 Elgato', category: 'Periféricos', price: 149.99, stock: 11, rating: 4.9, badge: 'Pro', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80', description: '15 teclas LCD personalizables para controlar apps y plataformas.' },
    { name: 'Wooting 60HE Keyboard', category: 'Periféricos', price: 175.00, stock: 6, rating: 5.0, badge: 'Top', image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&q=80', description: 'El rey indiscutido del rendimiento analógico en gaming competitivo.' },

    // Computadoras y Laptops
    { name: 'AeroBook Pro M3 Laptop', category: 'Computadoras', price: 1299.00, stock: 5, rating: 5.0, badge: 'Premium', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80', description: 'Rendimiento sin límites para desarrolladores y creadores de contenido.' },
    { name: 'Apex Titan Gaming Rig RTX 4070', category: 'Computadoras', price: 1899.00, stock: 4, rating: 4.9, badge: 'Oferta', image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80', description: 'PC de escritorio armada con procesador Ryzen 7 y tarjeta gráfica RTX 4070.' },
    { name: 'MacBook Pro 16 M3 Max', category: 'Computadoras', price: 2499.00, stock: 3, rating: 5.0, badge: 'Elite', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80', description: 'Potencia extrema para edición de video 8K y desarrollo intensivo.' },
    { name: 'Lenovo Legion Pro 7i', category: 'Computadoras', price: 2199.00, stock: 7, rating: 4.8, image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80', description: 'Laptop gamer de alto rendimiento con inteligencia artificial integrada.' },
    { name: 'ASUS ROG Strix Scar 18', category: 'Computadoras', price: 2899.00, stock: 2, rating: 4.9, image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80', description: 'Pantalla Nebula HDR de 18 pulgadas y refrigeración por metal líquido.' },
    { name: 'MSI Katana 15 Gaming', category: 'Computadoras', price: 1099.00, stock: 12, rating: 4.5, image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80', description: 'Equilibrio perfecto entre potencia de juego y movilidad diaria.' },
    { name: 'HP Omen 45L Desktop', category: 'Computadoras', price: 1749.00, stock: 5, rating: 4.7, image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80', description: 'Cámara de refrigeración Cryo Chamber patentada para máxima estabilidad.' },
    { name: 'Dell XPS 13 Plus', category: 'Computadoras', price: 1399.00, stock: 8, rating: 4.6, image: 'https://images.unsplash.com/photo-1593642702821-c8da6775f0c9?w=800&q=80', description: 'Diseño minimalista futurista con teclado sin bordes de cristal.' },

    // Monitores
    { name: 'UltraCurved 34" 165Hz Gaming', category: 'Monitores', price: 549.99, stock: 7, rating: 4.8, badge: 'Popular', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80', description: 'Monitor ultra ancho curvo con resolución QHD y tasa de refresco de 165Hz.' },
    { name: 'LG UltraGear 27" 240Hz OLED', category: 'Monitores', price: 799.00, stock: 6, rating: 5.0, badge: 'Top', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80', description: 'Panel OLED ultrarrápido con tiempo de respuesta de 0.03ms.' },
    { name: 'Samsung Odyssey Ark 55"', category: 'Monitores', price: 1999.00, stock: 2, rating: 4.9, image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&q=80', description: 'Pantalla curva gigantesca con modo Cockpit y resolución 4K UHD.' },
    { name: 'ASUS ProArt 27" 4K Creator', category: 'Monitores', price: 499.00, stock: 10, rating: 4.7, image: 'https://images.unsplash.com/photo-1586210546761-042885942f74?w=800&q=80', description: 'Calibración de color profesional Delta E < 2 para diseñadores.' },
    { name: 'Gigabyte M27Q 170Hz', category: 'Monitores', price: 329.00, stock: 15, rating: 4.6, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80', description: 'Resolución QHD con función KVM integrada para múltiples PCs.' },
    { name: 'Dell UltraSharp 32" 4K', category: 'Monitores', price: 849.00, stock: 5, rating: 4.8, image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', description: 'Tecnología IPS Black para contrastes profundos y máxima nitidez.' },
    { name: 'BenQ Mobiuz 32" 144Hz', category: 'Monitores', price: 450.00, stock: 9, rating: 4.5, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80', description: 'HDRi trepidante con altavoces treVolo integrados de alta calidad.' },
    { name: 'Acer Predator X28', category: 'Monitores', price: 620.00, stock: 8, rating: 4.7, image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80', description: 'NVIDIA G-SYNC Esports con certificacion VESA DisplayHDR 400.' },

    // Sillas Gamer y Oficina
    { name: 'ErgoMaster Pro Chair', category: 'Sillas', price: 350.00, stock: 8, rating: 4.8, badge: 'Cómoda', image: 'https://images.unsplash.com/photo-1580481077494-e3299ac2505e?w=800&q=80', description: 'Silla ergonómica de malla transpirable con soporte lumbar dinámico.' },
    { name: 'Secretlab Titan Evo 2024', category: 'Sillas', price: 549.00, stock: 11, rating: 5.0, badge: 'Bestseller', image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800&q=80', description: 'La cúspide en ergonomía y diseño para largas jornadas de trabajo o juego.' },
    { name: 'Razer Iskur VX', category: 'Sillas', price: 420.00, stock: 7, rating: 4.6, image: 'https://images.unsplash.com/photo-1580481077494-e3299ac2505e?w=800&q=80', description: 'Soporte lumbar esculpido con cuero sintético multicapa de alta resistencia.' },
    { name: 'Herman Miller Embody Gaming', category: 'Sillas', price: 1795.00, stock: 2, rating: 5.0, badge: 'Elite', image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800&q=80', description: 'Diseñada con médicos para estimular la salud postural activa.' },
    { name: 'Corsair TC100 Relaxed', category: 'Sillas', price: 249.00, stock: 14, rating: 4.4, image: 'https://images.unsplash.com/photo-1580481077494-e3299ac2505e?w=800&q=80', description: 'Diseño relajado inspirado en asientos de carreras con tejido suave.' },
    { name: 'Noblechairs Epic Series', category: 'Sillas', price: 480.00, stock: 5, rating: 4.7, image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800&q=80', description: 'Elegancia alemana con materiales premium y costuras de precisión.' },

    // Accesorios y Streaming
    { name: 'Logitech C920 HD Pro Webcam', category: 'Accesorios', price: 79.99, stock: 25, rating: 4.8, badge: 'Popular', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80', description: 'Videollamadas y streaming en Full HD 1080p ultra nítidas.' },
    { name: 'Elgato Facecam Pro 4K', category: 'Accesorios', price: 299.99, stock: 8, rating: 4.9, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80', description: 'La primera webcam del mundo con capacidad de video 4K a 60fps sin comprimir.' },
    { name: 'Blue Yeti USB Microphone', category: 'Accesorios', price: 129.99, stock: 18, rating: 4.7, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80', description: 'Micrófono condensador multipatrón ideal para podcasts y transmisiones.' },
    { name: 'Loupedeck Live Controller', category: 'Accesorios', price: 269.00, stock: 6, rating: 4.8, image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80', description: 'Consola de edición y control total para creadores profesionales.' },
    { name: 'Nanoleaf Shapes Triangles Starter', category: 'Accesorios', price: 199.99, stock: 12, rating: 4.6, image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80', description: 'Paneles de luz LED modulares inteligentes con sincronización musical.' },
    { name: 'Philips Hue Play Lightbar', category: 'Accesorios', price: 149.99, stock: 15, rating: 4.7, image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80', description: 'Iluminación ambiental trasera para monitores y escritorios gaming.' },
    { name: 'HyperX QuadCast S', category: 'Accesorios', price: 159.99, stock: 14, rating: 4.9, badge: 'Bestseller', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80', description: 'Micrófono USB con soporte antivibraciones e impresionante iluminación RGB.' },
    { name: 'Anker 737 Power Bank 24K', category: 'Accesorios', price: 149.99, stock: 20, rating: 4.9, image: 'https://images.unsplash.com/photo-1609592807519-75f924987514?w=800&q=80', description: 'Batería portátil de carga ultrarrápida bidireccional de 140W.' }
  ];

  await prisma.product.createMany({
    data: productsData
  });

  console.log(`✅ ¡Se insertaron exitosamente ${productsData.length} productos en Neon!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });