import { User } from '../models';
import { UserSession } from '../models'; 
import { ServiceResult } from './service.result';

export class UserService {

    static async getUserFromSession(token: string): Promise<ServiceResult<number | undefined>> {
        try {
            const userSession = await UserSession.findOne({
                where: { token },
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'firstName', 'lastName', 'email'] 
                    }
                ]
            });

            if (userSession && userSession.fk_user_id) {
                return ServiceResult.success(userSession.fk_user_id);
            }

            return ServiceResult.notFound();
        } catch (error) {
            return ServiceResult.failed();
        }
    }

}
