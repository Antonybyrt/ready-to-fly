import express, { Request, Response, Router } from 'express';
import { FlightService } from '../services';
import { ServiceResult, ServiceErrorCode } from '../services/service.result';
import { Flight } from '../models';
import { SessionMiddleware } from '../middleware/session.middleware';

const flightService = new FlightService();

export class FlightController {

    async createFlight(req: Request, res: Response) {
        try {
            const userId = await SessionMiddleware.getUserId(req);
            if (!userId) {
                return res.status(403).send("Forbidden");
            } else {
                const serviceResult: ServiceResult<Flight> = await flightService.createFlight(req.body, userId);
                if (serviceResult.errorCode === ServiceErrorCode.success) {
                    return res.status(201).json(serviceResult.result);
                }
            }
        } catch (err) {
            return res.status(500).json({ message: 'Error creating flight' });
        }
    }

    async getAllFlights(req: Request, res: Response) {
        try {
            const permission = await SessionMiddleware.getUserId(req);
            if (!permission) {
                return res.status(403).send("Forbidden");
            } else {
                const serviceResult: ServiceResult<Flight[]> = await flightService.getAllFlights();
                if (serviceResult.errorCode === ServiceErrorCode.success) {
                    return res.status(200).json(serviceResult.result);
                }
            }
        } catch (err) {
            return res.status(500).json({ message: 'Error fetching flights' });
        }
    }

    async getFlightByUser(req: Request, res: Response) {
        try {
            const permission = await SessionMiddleware.getUserId(req);
            if (!permission) {
                return res.status(403).send("Forbidden");
            } else {
                const { userId } = req.params;
                const serviceResult: ServiceResult<Flight[]> = await flightService.getFlightByUser(Number(userId));
                if (serviceResult.errorCode === ServiceErrorCode.success) {
                    return res.status(200).json(serviceResult.result);
                }
            }
        } catch (err) {
            return res.status(500).json({ message: 'Error fetching flights' });
        }
    }

    async getFlightById(req: Request, res: Response) {
        try {
            const permission = await SessionMiddleware.getUserId(req);
            if (!permission) {
                return res.status(403).send("Forbidden");
            } else {
                const { id } = req.params;
                const serviceResult: ServiceResult<Flight> = await flightService.getFlightById(Number(id));
                if (serviceResult.errorCode === ServiceErrorCode.success) {
                    return res.status(200).json(serviceResult.result);
                } else if (serviceResult.errorCode === ServiceErrorCode.notFound) {
                    return res.status(404).json({ message: 'Flight not found' });
                }
            }
        } catch (err) {
            return res.status(500).json({ message: 'Error fetching flight' });
        }
    }

    async updateFlight(req: Request, res: Response) {
        try {
            const userId = await SessionMiddleware.getUserId(req);
            if (!userId) {
                return res.status(403).send("Forbidden");
            } else {
                const { id } = req.params;
                const serviceResult: ServiceResult<Flight> = await flightService.updateFlight(Number(id), req.body, userId);
                if (serviceResult.errorCode === ServiceErrorCode.success) {
                    return res.status(200).json(serviceResult.result);
                } else if (serviceResult.errorCode === ServiceErrorCode.notFound) {
                    return res.status(404).json({ message: 'Flight not found' });
                }
            }
        } catch (err) {
            return res.status(500).json({ message: 'Error updating flight' });
        }
    }

    async deleteFlight(req: Request, res: Response) {
        try {
            const userId = await SessionMiddleware.getUserId(req);
            if (!userId) {
                return res.status(403).send("Forbidden");
            } else {
                const { id } = req.params;
                const serviceResult: ServiceResult<void> = await flightService.deleteFlight(Number(id), userId);
                if (serviceResult.errorCode === ServiceErrorCode.success) {
                    return res.status(204).send();
                } else if (serviceResult.errorCode === ServiceErrorCode.notFound) {
                    return res.status(404).json({ message: 'Flight not found' });
                }
            }
        } catch (err) {
            return res.status(500).json({ message: 'Error deleting flight' });
        }
    }

    async countFlights(req: Request, res: Response) {
        try {
            const permission = await SessionMiddleware.getUserId(req);
            if (!permission) {
                return res.status(403).send("Forbidden");
            } else {
                const { userId } = req.params
                const serviceResult = await flightService.countFlights(Number(userId));
                if (serviceResult.errorCode === ServiceErrorCode.success) {
                    return res.status(200).json({ count: serviceResult.result });
                }
            }
        } catch (err) {
            return res.status(500).json({ message: 'Error counting flights' });
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.get('/', this.getAllFlights.bind(this));
        router.get('/count/:userId', this.countFlights.bind(this));
        router.get('/:id', this.getFlightById.bind(this));
        router.get('/user/:userId', this.getFlightByUser.bind(this));
        router.post('/', express.json(), this.createFlight.bind(this));
        router.put('/:id', express.json(), this.updateFlight.bind(this));
        router.delete('/:id', this.deleteFlight.bind(this));
        return router;
    }
}
