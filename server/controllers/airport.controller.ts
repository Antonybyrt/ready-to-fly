import express, { Request, Response, Router } from 'express';
import { AirportService } from '../services';
import { ServiceResult, ServiceErrorCode } from '../services/service.result';
import { Airport } from '../models';
import { SessionMiddleware } from '../middleware/session.middleware';

const airportService = new AirportService();

export class AirportController {

    async createAirport(req: Request, res: Response) {
        try {
            const permission = await SessionMiddleware.getUserId(req);
            if (!permission) {
                return res.status(403).send("Forbidden");
            } else {
                const serviceResult: ServiceResult<Airport> = await airportService.createAirport(req.body);
                if (serviceResult.errorCode === ServiceErrorCode.success) {
                    return res.status(201).json(serviceResult.result);
                }
            }
        } catch (err) {
            return res.status(500).json({ message: 'Error creating airport' });
        }
    }

    async getAllAirports(req: Request, res: Response) {
        try {
            const permission = await SessionMiddleware.getUserId(req);
            if (!permission) {
                return res.status(403).send("Forbidden");
            } else {
                const serviceResult: ServiceResult<Airport[]> = await airportService.getAllAirports();
                if (serviceResult.errorCode === ServiceErrorCode.success) {
                    return res.status(200).json(serviceResult.result);
                }
            }
        } catch (err) {
            return res.status(500).json({ message: 'Error fetching airports' });
        }
    }

    async getAirportById(req: Request, res: Response) {
        try {
            const permission = await SessionMiddleware.getUserId(req);
            if (!permission) {
                return res.status(403).send("Forbidden");
            } else {
                const { id } = req.params;
                const serviceResult: ServiceResult<Airport> = await airportService.getAirportById(Number(id));
                if (serviceResult.errorCode === ServiceErrorCode.success) {
                    return res.status(200).json(serviceResult.result);
                } else if (serviceResult.errorCode === ServiceErrorCode.notFound) {
                    return res.status(404).json({ message: 'Airport not found' });
                }
            }
        } catch (err) {
            return res.status(500).json({ message: 'Error fetching airport' });
        }
    }

    async deleteAirport(req: Request, res: Response) {
        try {
            const permission = await SessionMiddleware.getUserId(req);
            if (!permission) {
                return res.status(403).send("Forbidden");
            } else {
                const { id } = req.params;
                const serviceResult: ServiceResult<void> = await airportService.deleteAirport(Number(id));
                if (serviceResult.errorCode === ServiceErrorCode.success) {
                    return res.status(204).send();
                } else if (serviceResult.errorCode === ServiceErrorCode.notFound) {
                    return res.status(404).json({ message: 'Airport not found' });
                }
            }
        } catch (err) {
            return res.status(500).json({ message: 'Error deleting airport' });
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.get('/', this.getAllAirports.bind(this));
        router.get('/:id', this.getAirportById.bind(this));
        router.post('/', this.createAirport.bind(this));
        router.delete('/:id', this.deleteAirport.bind(this));
        return router;
    }
}
