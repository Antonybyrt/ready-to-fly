import { Airport, Flight } from '../models';
import { ServiceResult } from './service.result';
import { Optional } from 'sequelize';

export class FlightService {
    async createFlight(data: Optional<Flight, 'id'>, userId: number): Promise<ServiceResult<Flight>> {
        try {
            const flight = await Flight.create({...data, user_id: userId});
            return ServiceResult.success(flight);
        } catch (error) {
            console.error('Error creating flight:', error);
            return ServiceResult.failed();
        }
    }

    async getAllFlights(): Promise<ServiceResult<Flight[]>> {
        try {
            const flights = await Flight.findAll({
                include: [
                    {
                        model: Airport,
                        as: 'departureAirport',
                        attributes: ['name', 'short_form']
                    },
                    {
                        model: Airport,
                        as: 'arrivalAirport',
                        attributes: ['name', 'short_form']
                    }
                ]
            });
            return ServiceResult.success(flights);
        } catch (error) {
            console.error('Error fetching flights:', error);
            return ServiceResult.failed();
        }
    }

    async getFlightById(id: number): Promise<ServiceResult<Flight>> {
        try {
            const flight = await Flight.findByPk(id, {
                include: [
                    {
                        model: Airport,
                        as: 'departureAirport',
                        attributes: ['name', 'short_form']
                    },
                    {
                        model: Airport,
                        as: 'arrivalAirport',
                        attributes: ['name', 'short_form']
                    }
                ]
            });
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

    async getFlightByUser(userId: number): Promise<ServiceResult<Flight[]>>{
        try {
            const flights = await Flight.findAll({
                where: { user_id: userId },
                include: [
                    {
                        model: Airport,
                        as: 'departureAirport',
                        attributes: ['name', 'short_form'],
                    },
                    {
                        model: Airport,
                        as: 'arrivalAirport',
                        attributes: ['name', 'short_form'],
                    },
                ],
            });

            return ServiceResult.success(flights);
        } catch (error) {
            console.error('Error fetching user flights:', error);
            return ServiceResult.failed();
        }
    }

    async updateFlight(id: number, data: Optional<Flight, 'id'>, userId: number): Promise<ServiceResult<Flight>> {
        try {
            const flight = await Flight.findOne({ where: { id, user_id: userId } });
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

    async deleteFlight(id: number, userId: number): Promise<ServiceResult<void>> {
        try {
            const flight = await Flight.findOne({ where: { id, user_id: userId } });
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

    async countFlights(userId: number): Promise<ServiceResult<number>> {
        try {
            const count = await Flight.count({ where: { user_id: userId } });
            return ServiceResult.success(count);
        } catch (error) {
            console.error('Error counting flights:', error);
            return ServiceResult.failed();
        }
    }
}
