import express, { Request, Response, Router } from 'express';
import { FlightService } from '../services';
import { ServiceResult, ServiceErrorCode } from '../services/service.result';
import { Flight } from '../models';

const flightService = new FlightService();

export class FlightController {
    async createFlight(req: Request, res: Response) {
        const serviceResult: ServiceResult<Flight> = await flightService.createFlight(req.body);
        if (serviceResult.errorCode === ServiceErrorCode.success) {
            return res.status(201).json(serviceResult.result);
        }
        return res.status(500).json({ message: 'Error creating flight' });
    }

    async getAllFlights(req: Request, res: Response) {
        const serviceResult: ServiceResult<Flight[]> = await flightService.getAllFlights();
        if (serviceResult.errorCode === ServiceErrorCode.success) {
            return res.status(200).json(serviceResult.result);
        }
        return res.status(500).json({ message: 'Error fetching flights' });
    }

    async getFlightById(req: Request, res: Response) {
        const { id } = req.params;
        const serviceResult: ServiceResult<Flight> = await flightService.getFlightById(Number(id));
        if (serviceResult.errorCode === ServiceErrorCode.success) {
            return res.status(200).json(serviceResult.result);
        } else if (serviceResult.errorCode === ServiceErrorCode.notFound) {
            return res.status(404).json({ message: 'Flight not found' });
        }
        return res.status(500).json({ message: 'Error fetching flight' });
    }

    async updateFlight(req: Request, res: Response) {
        const { id } = req.params;
        const serviceResult: ServiceResult<Flight> = await flightService.updateFlight(Number(id), req.body);
        if (serviceResult.errorCode === ServiceErrorCode.success) {
            return res.status(200).json(serviceResult.result);
        } else if (serviceResult.errorCode === ServiceErrorCode.notFound) {
            return res.status(404).json({ message: 'Flight not found' });
        }
        return res.status(500).json({ message: 'Error updating flight' });
    }

    async deleteFlight(req: Request, res: Response) {
        const { id } = req.params;
        const serviceResult: ServiceResult<void> = await flightService.deleteFlight(Number(id));
        if (serviceResult.errorCode === ServiceErrorCode.success) {
            return res.status(204).send();
        } else if (serviceResult.errorCode === ServiceErrorCode.notFound) {
            return res.status(404).json({ message: 'Flight not found' });
        }
        return res.status(500).json({ message: 'Error deleting flight' });
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.get('/', this.getAllFlights.bind(this));
        router.get('/:id', this.getFlightById.bind(this));
        router.post('/', express.json(), this.createFlight.bind(this));
        router.put('/:id', express.json(), this.updateFlight.bind(this));
        return router;
    }
}
