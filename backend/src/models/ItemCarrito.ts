import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Carrito } from "./Carrito";
import { Producto } from "./Producto";

@Entity("carrito_items")
export class ItemCarrito {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Carrito, carrito => carrito.items)
    carrito!: Carrito;

    @ManyToOne(() => Producto)
    producto!: Producto;

    @Column()
    cantidad!: number;
}
