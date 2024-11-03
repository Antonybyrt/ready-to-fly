import { ApiService } from "./api.service";
import { IAirport, IAirportId } from "@/models/airport.model";
import axios from 'axios';
import { ServiceResult } from "./service.result";

export class AirportService {

    static async createAirport(input: IAirport): Promise<ServiceResult<IAirportId>> {
        try {
            console.log(input);
            const res = await axios.post(`${ApiService.baseURL}/airports`, input);
            if (res.status === 201) {
                return ServiceResult.success<IAirportId>(res.data);
            }
            return ServiceResult.failed();
        } catch(err) {
            console.log(err);
            return ServiceResult.failed();
        }
    }

    static async getAllAirports(): Promise<ServiceResult<IAirportId[] | undefined>> {
        try {
            const res = await axios.get(`${ApiService.baseURL}/airports`);
            if (res.status === 200) {
                return ServiceResult.success(res.data);
            }
            return ServiceResult.failed();
        } catch(err) {
            console.log(err);
            return ServiceResult.failed();
        }
    }

    static async getAirportById(id: number): Promise<ServiceResult<IAirport>> {
        try {
            const res = await axios.get(`${ApiService.baseURL}/airports/${id}`);
            if (res.status === 200) {
                return ServiceResult.success(res.data);
            }
            return ServiceResult.failed();
        } catch(err) {
            console.log(err);
            return ServiceResult.failed();
        }
    }

    static async deleteFlight(id: number): Promise<ServiceResult<IAirportId>> {
        try {
            const res = await axios.delete(`${ApiService.baseURL}/airports/${id}`);
            if (res.status === 204) {
                return ServiceResult.success(res.data);
            }
            return ServiceResult.failed();
        } catch(err) {
            console.log(err)
            return ServiceResult.failed();
        }
    }


}