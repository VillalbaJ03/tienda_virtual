import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("productos")
export class Producto {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    codigo!: string;

    @Column()
    nombre!: string;

    @Column()
    categoria!: string;

    @Column("decimal", { precision: 10, scale: 2 })
    precio!: number;

    @Column()
    stock!: number;

    @Column({ type: "enum", enum: ["alta", "media", "baja"] })
    temporada!: "alta" | "media" | "baja";

    @Column({ default: "disponible" })
    estado!: "disponible" | "agotado";

    @Column("decimal", { precision: 5, scale: 2, default: 0 })
    descuento!: number;

    @Column({ type: "varchar", length: 255, nullable: true })
    imagenUrl?: string;
}
