import {ServiceErrorCode} from '../services';
import { UserService } from '../services/user.service';
import { Request } from "express";

export class SessionMiddleware {

    static async isLogged(req: Request): Promise<boolean> {

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return false;
        }
        const token = authHeader.split(' ')[1];

        try {
            const user = await UserService.getUserFromSession(token);
            if (user.errorCode === ServiceErrorCode.success) {
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error checking user permissions:", error);
            return false;
        }
    }
}