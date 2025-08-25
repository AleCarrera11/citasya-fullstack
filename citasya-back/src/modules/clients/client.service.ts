import { AppDataSource } from "../../data-source.js";
import { Client } from "./client.model.js";
import { Appointment } from "../appointments/appointment.model.js";

/**
 * Clase de servicio para manejar la lógica de negocio de los clientes.
 */
export class ClientService {
    private clientRepository = AppDataSource.getRepository(Client);
    private appointmentRepository = AppDataSource.getRepository(Appointment);

    /**
     * Obtiene todos los clientes.
     */
    public async findAllClients(): Promise<Client[]> {
        return this.clientRepository.find();
    }

    /**
     * Busca un cliente por ID, incluyendo su historial de citas.
     */
    public async findClientById(id: number): Promise<Client | null> {
        return this.clientRepository.findOne({
            where: { id },
            relations: ["appointments"]
        });
    }

    /**
     * Busca un cliente por su número de documento.
     */
    public async findClientByDocumentId(documentId: string): Promise<Client | null> {
        return this.clientRepository.findOne({
            where: { documentId },
            relations: ["appointments"] 
        });
    }

    /**
     * Crea un nuevo cliente en la base de datos.
     */
    public async createClient(clientData: Partial<Client>): Promise<Client> {
        const newClient = this.clientRepository.create(clientData);
        return this.clientRepository.save(newClient);
    }

    /**
     * Actualiza un cliente existente.
     */
    public async updateClient(id: number, clientData: Partial<Client>): Promise<Client | null> {
        const client = await this.clientRepository.findOneBy({ id });
        if (!client) {
            return null;
        }

        this.clientRepository.merge(client, clientData);
        return this.clientRepository.save(client);
    }

    /**
     * Elimina un cliente.
     */
    public async deleteClient(id: number): Promise<boolean> {
        const result = await this.clientRepository.delete(id);
        return result.affected !== 0;
    }
}
