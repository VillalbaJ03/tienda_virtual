import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Carrito } from './Carrito';
import { Cliente } from './Cliente';

@Entity('ventas')
export class Venta {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Carrito, { eager: true })
  @JoinColumn({ name: "carrito_id" })
  carrito!: Carrito;

  @ManyToOne(() => Cliente, { eager: true })
  @JoinColumn({ name: "usuario_id" })
  usuario!: Cliente;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  impuestos!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total!: number;

  @CreateDateColumn({ type: 'timestamp' })
  fecha!: Date;
}
