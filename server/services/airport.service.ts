import { Airport } from '../models';
import { ServiceResult } from './service.result';
import { Optional } from 'sequelize';

export class AirportService {
    async createAirport(data: Optional<Airport, 'id'>): Promise<ServiceResult<Airport>> {
        try {
            const airport = await Airport.create(data);
            return ServiceResult.success(airport);
        } catch (error) {
            console.error('Error creating airport:', error);
            return ServiceResult.failed();
        }
    }

    async getAllAirports(): Promise<ServiceResult<Airport[]>> {
        try {
            const airports = await Airport.findAll();
            return ServiceResult.success(airports);
        } catch (error) {
            console.error('Error fetching airports:', error);
            return ServiceResult.failed();
        }
    }

    async getAirportById(id: number): Promise<ServiceResult<Airport>> {
        try {
            const airport = await Airport.findByPk(id);
            if (airport) {
                return ServiceResult.success(airport);
            } else {
                return ServiceResult.notFound();
            }
        } catch (error) {
            console.error('Error fetching airport:', error);
            return ServiceResult.failed();
        }
    }

    async deleteAirport(id: number): Promise<ServiceResult<void>> {
        try {
            const airport = await Airport.findByPk(id);
            if (airport) {
                const deletedAirport = await airport.destroy();
                return ServiceResult.success(deletedAirport);
            } else {
                return ServiceResult.notFound();
            }
        } catch (error) {
            console.error('Error deleting airport:', error);
            return ServiceResult.failed();
        }
    }
}
