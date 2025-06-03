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
import carritoGetRoutes from "./routes/carritoGetRoutes";
import ventasRoutes from "./routes/ventasRoutes";

// Listeners globales para errores no capturados
process.on('unhandledRejection', (reason, promise) => {
    console.error('🌋 Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
    console.error('🌋 Uncaught Exception thrown:', err);
});

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
        console.log('Registrando rutas...');
        app.use("/api/productos", productoRoutes); console.log('✔ /api/productos');
        app.use("/api/auth", authRoutes); console.log('✔ /api/auth');
        app.use("/api/carrito", carritoGetRoutes); console.log('✔ /api/carrito (GET)');
        app.use("/api/carrito", carritoRoutes); console.log('✔ /api/carrito (POST/PUT/DELETE)');
        app.use("/api/checkout", checkoutRoutes); console.log('✔ /api/checkout');
        app.use("/api/facturas", facturaRoutes); console.log('✔ /api/facturas');
        app.use("/api/admin", adminRoutes); console.log('✔ /api/admin');
        app.use('/api/clientes', clienteRoutes); console.log('✔ /api/clientes');
        app.use("/api/ventas", ventasRoutes); console.log('✔ /api/ventas');

        // Servir archivos estáticos de la carpeta public
        app.use('/imagenes', express.static(__dirname + '/../public/imagenes'));

        // Middleware global de manejo de errores
        app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
            console.error('🌋 Error global Express:', err);
            if (err instanceof Error) {
                console.error('Stack:', err.stack);
            }
            res.status(500).json({ error: err.message || 'Error interno del servidor (middleware global)' });
        });

        // Ruta de test directa para aislar problemas de ruteo
        app.get('/api/test', (_req, res) => {
            console.log('✔ /api/test ejecutada');
            res.json({ ok: true, msg: 'Ruta directa en app.ts activa' });
        });

        console.log('Antes de app.listen');
        app.listen(PORT, () => {
            console.log(`🚀 Servidor en http://localhost:${PORT}`);
        });
        console.log('Después de app.listen');
    })
    .catch((error) => {
        console.error("❌ Error de conexión a la BD:", error);
    });
