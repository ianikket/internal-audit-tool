import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
// import { User } from './User'; // Uncomment if you want to link to User

@Entity()
export class Assessment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  product!: string;

  @Column()
  filename!: string;

  @Column({ type: 'text' })
  summary!: string;

  @Column({ type: 'jsonb' })
  controls!: any;

  @Column({ type: 'jsonb' })
  risks!: any;

  @CreateDateColumn()
  createdAt!: Date;

  // @ManyToOne(() => User, user => user.assessments)
  // user: User;
} 