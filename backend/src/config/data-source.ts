import { DataSource } from "typeorm";
import { Cliente } from "../models/Cliente";
import { Producto } from "../models/Producto";
import { Carrito } from "../models/Carrito";
import { ItemCarrito } from "../models/ItemCarrito";
import { Venta } from "../models/Venta";
import * as dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "tu_password",
    database: process.env.DB_NAME || "tienda_virtual_db",
    synchronize: false,  // ¡OJO! Solo en desarrollo (crea/modifica tablas automáticamente)
    logging: true,      // Muestra logs de SQL en consola
    entities: [Cliente, Producto, Carrito, ItemCarrito, Venta],
    migrations: [],     // Opcional: para migraciones futuras
    subscribers: [],
});
