import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Cliente } from "./Cliente";
import { ItemCarrito } from "./ItemCarrito";

@Entity("carritos")
export class Carrito {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ default: "activo" })
    estado!: "activo" | "completado" | "abandonado";

    @ManyToOne(() => Cliente, cliente => cliente.carritos)
    cliente!: Cliente;

    @OneToMany(() => ItemCarrito, item => item.carrito)
    items!: ItemCarrito[];
}
