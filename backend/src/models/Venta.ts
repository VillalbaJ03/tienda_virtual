import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Carrito } from './Carrito';
import { Cliente } from './Cliente';

@Entity('ventas')
export class Venta {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Carrito, { eager: true })
  carrito!: Carrito;

  @ManyToOne(() => Cliente, { eager: true })
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
