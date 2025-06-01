import { Producto } from "../models/Producto";
import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";

export class ProductoRepository {
    private repo: Repository<Producto>;

    constructor() {
        this.repo = AppDataSource.getRepository(Producto);
    }

    async findAll(): Promise<Producto[]> {
        return this.repo.find();
    }

    async create(productoData: Partial<Producto>): Promise<Producto> {
        const producto = this.repo.create(productoData);
        return this.repo.save(producto);
    }
}
