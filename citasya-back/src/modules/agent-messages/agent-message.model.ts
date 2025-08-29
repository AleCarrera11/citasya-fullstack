import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Client } from "../clients/client.model.js";

/**
 * Entidad para almacenar el historial de mensajes entre el agente (bot)
 * y los clientes. Sirve como "memoria" de la conversación.
 */
@Entity("agent_messages") 
export class AgentMessage {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "text" })
    message!: string;

    @Column({ type: "varchar" })
    role!: string; // puede ser: "agent", "client"

    @CreateDateColumn({ type: "timestamp with time zone" })
    createdAt!: Date;

    @Column({ type: "int" })
    client_id!: number;

    @ManyToOne(() => Client, (client: Client) => client.messages, { onDelete: "CASCADE" })
    client!: Client;
}
