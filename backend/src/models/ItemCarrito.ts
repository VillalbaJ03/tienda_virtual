import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Carrito } from "./Carrito";
import { Producto } from "./Producto";

@Entity("carrito_items")
export class ItemCarrito {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Carrito, carrito => carrito.items)
    @JoinColumn({ name: "carrito_id" })
    carrito!: Carrito;

    @ManyToOne(() => Producto)
    @JoinColumn({ name: "producto_id" })
    producto!: Producto;

    @Column()
    cantidad!: number;

    @Column({ name: 'precio_unitario', type: 'numeric' })
    precio_unitario!: number;
}
