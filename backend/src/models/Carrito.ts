import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Cliente } from "./Cliente";
import { ItemCarrito } from "./ItemCarrito";

@Entity("carritos")
export class Carrito {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ default: "activo" })
    estado!: "activo" | "completado" | "abandonado";

    @ManyToOne(() => Cliente, cliente => cliente.carritos)
    @JoinColumn({ name: "usuario_id" })
    cliente!: Cliente;

    @OneToMany(() => ItemCarrito, item => item.carrito)
    items!: ItemCarrito[];
}
