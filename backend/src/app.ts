import express from "express";
import { AppDataSource } from "./config/data-source";
import clienteRoutes from "./routes/clienteRoutes";
import productoRoutes from "./routes/productoRoutes";
import authRoutes from "./routes/authRoutes";
import carritoRoutes from "./routes/carritoRoutes";
import checkoutRoutes from "./routes/checkoutRoutes";
import facturaRoutes from "./routes/facturaRoutes";
import adminRoutes from "./routes/adminRoutes";
import morgan from "morgan";
import { crearUsuario } from './controllers/usuarioController';
import carritoGetRoutes from "./routes/carritoGetRoutes";
import ventasRoutes from "./routes/ventasRoutes";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(morgan('dev'));

// Log personalizado para cada petición
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - Body:`, req.body);
  next();
});

// DEBUG: Log para ver el token recibido en cada petición protegida
app.use((req, res, next) => {
  const authHeader = req.header('Authorization');
  console.log('🔒 Authorization header:', authHeader);
  next();
});

// Ruta raíz para evitar 'Cannot GET /'
app.get('/', (_req, res) => {
  res.send('API Tienda Virtual funcionando');
});

// Conexión a PostgreSQL
AppDataSource.initialize()
    .then(() => {
        console.log("✅ Base de datos conectada");
        
        // Rutas
        app.use("/api/productos", productoRoutes);
        app.use("/api/auth", authRoutes);
        app.use("/api/carritos", carritoRoutes);
        app.use("/api/checkout", checkoutRoutes);
        app.use("/api/facturas", facturaRoutes);
        app.use("/api/admin", adminRoutes);
        app.use('/api/clientes', clienteRoutes);
        app.use("/api/carrito", carritoRoutes); // Soporta POST /api/carrito y /api/carrito/items
        app.use("/api/carrito", carritoGetRoutes); // Soporta GET /api/carrito
        app.use("/api/ventas", ventasRoutes);

        app.listen(PORT, () => {
            console.log(`🚀 Servidor en http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("❌ Error de conexión a la BD:", error);
    });
