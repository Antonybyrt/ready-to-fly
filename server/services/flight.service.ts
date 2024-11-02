import { Flight } from '../models';
import { ServiceResult } from './service.result';
import { Optional } from 'sequelize';

export class FlightService {
    async createFlight(data: Optional<Flight, 'id'>): Promise<ServiceResult<Flight>> {
        try {
            const flight = await Flight.create(data);
            return ServiceResult.success(flight);
        } catch (error) {
            console.error('Error creating flight:', error);
            return ServiceResult.failed();
        }
    }

    async getAllFlights(): Promise<ServiceResult<Flight[]>> {
        try {
            const flights = await Flight.findAll();
            return ServiceResult.success(flights);
        } catch (error) {
            console.error('Error fetching flights:', error);
            return ServiceResult.failed();
        }
    }

    async getFlightById(id: number): Promise<ServiceResult<Flight>> {
        try {
            const flight = await Flight.findByPk(id);
            if (flight) {
                return ServiceResult.success(flight);
            } else {
                return ServiceResult.notFound();
            }
        } catch (error) {
            console.error('Error fetching flight:', error);
            return ServiceResult.failed();
        }
    }

    async updateFlight(id: number, data: Optional<Flight, 'id'>): Promise<ServiceResult<Flight>> {
        try {
            const flight = await Flight.findByPk(id);
            if (flight) {
                const updatedFlight = await flight.update(data);
                return ServiceResult.success(updatedFlight);
            } else {
                return ServiceResult.notFound();
            }
        } catch (error) {
            console.error('Error updating flight:', error);
            return ServiceResult.failed();
        }
    }

    async deleteFlight(id: number): Promise<ServiceResult<void>> {
        try {
            const flight = await Flight.findByPk(id);
            if (flight) {
                const deletedFlight = await flight.destroy();
                return ServiceResult.success(deletedFlight);
            } else {
                return ServiceResult.notFound();
            }
        } catch (error) {
            console.error('Error deleting flight:', error);
            return ServiceResult.failed();
        }
    }
}
