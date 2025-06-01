import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Carrito } from "./Carrito";

@Entity("usuarios")
export class Cliente {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @Column()
    nombre!: string;

    @Column({ nullable: true })
    direccion?: string;

    @Column({ nullable: true })
    telefono?: string;

    @Column({ type: 'varchar', default: 'cliente' })
    rol!: 'admin' | 'cliente';

    @Column({ type: 'timestamp', name: 'fecha_registro', default: () => 'CURRENT_TIMESTAMP' })
    fecha_registro!: Date;

    // Personalización: método para mostrar nombre y fecha de registro de forma amigable
    get displayName(): string {
        return `👤 ${this.nombre} <${this.email}>`;
    }

    get fechaRegistroFormateada(): string {
        if (!this.fecha_registro) return '';
        // Ejemplo: "31 de mayo de 2025, 14:30"
        return this.fecha_registro.toLocaleString('es-MX', {
            day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    }

    @OneToMany(() => Carrito, carrito => carrito.cliente)
    carritos!: Carrito[];
}
