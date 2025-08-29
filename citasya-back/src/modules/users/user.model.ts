import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

/**
 * Enum para los roles de usuario.
 */
export enum UserRole {
    Admin = "Admin",
    Coordinator = "Coordinator"
}

/**
 * Entidad de TypeORM para la tabla 'users'.
 * Representa el modelo de datos para un usuario en la base de datos.
 */
@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar" })
    name!: string;

    @Column({ type: "varchar", unique: true })
    email!: string;

    @Column({ type: "varchar", nullable: true })
    phone!: string;

    @Column({ type: "varchar" })
    password_hash!: string;

    @Column({ type: "boolean", default: true })
    is_active!: boolean;

    @Column({
        type: "enum",
        enum: UserRole
    })
    role!: UserRole;
}
