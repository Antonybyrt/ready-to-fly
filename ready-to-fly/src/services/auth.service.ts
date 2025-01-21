import axios from "axios";
import { ServiceResult } from "./service.result";
import { IUser } from "@/models/user.model";
import { ApiService } from "./api.service";

export default class auth {

    static async login(email: string, pw: string): Promise<{sessionToken: string} | null> {
        try {
            const res = await axios.post(`${ApiService.baseURL}/auth/login`, {
                    "email": email,
                    "pw": pw
            });
            if(res.status === 200) {
                const date = new Date();
                date.setTime(date.getTime() + (24 * 60 * 60 * 1000));
                const expires = `expires=${date.toUTCString()}`;
                localStorage.setItem("Token", res.data.sessionToken);
                return res.data
            }
            return null;
        } catch(err) {
            return null;
        }
    }

    static async isLogged(): Promise<ServiceResult<IUser>>{
        try {
            let token = localStorage.getItem("Token")
            if(token != null){
                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
               const res = await axios.get(`${ApiService.baseURL}/user/${token}`);
               if(res.status === 200) {
                   return ServiceResult.success(res.data);
               } else {
                   return ServiceResult.notFound();
               }
            } else {
               return ServiceResult.notFound();
            }
        } catch (err) {
            return ServiceResult.failed();
        }
    }

    static async getUser(): Promise<IUser | undefined> {
        const user = await auth.isLogged();

        if(user) {
            return user.result
        } else {
            document.location.href=`${ApiService.baseURL}/auth/login`;
            return undefined;
        }
    }

    static async logout() {
        localStorage.removeItem("Token");
    }

}