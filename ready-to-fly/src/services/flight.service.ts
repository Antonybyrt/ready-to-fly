import { ApiService } from "./api.service";
import { IFlight, IFlightId } from "@/models/flight.model";
import axios from 'axios';
import { ServiceResult } from "./service.result";

export class FlightService {

    static async createFlight(input: IFlight): Promise<ServiceResult<IFlightId>> {
        try {
            console.log(input);
            const res = await axios.post(`${ApiService.baseURL}/flights`, input);
            if (res.status === 201) {
                return ServiceResult.success<IFlightId>(res.data);
            }
            return ServiceResult.failed();
        } catch(err) {
            console.log(err);
            return ServiceResult.failed();
        }
    }

    static async getAllFlights(): Promise<ServiceResult<IFlight[] | undefined>> {
        try {
            const res = await axios.get(`${ApiService.baseURL}/flights`);
            if (res.status === 200) {
                return ServiceResult.success(res.data);
            }
            return ServiceResult.failed();
        } catch(err) {
            console.log(err);
            return ServiceResult.failed();
        }
    }

    static async getFlightById(id: number): Promise<ServiceResult<IFlight>> {
        try {
            const res = await axios.get(`${ApiService.baseURL}/flights/${id}`);
            if (res.status === 200) {
                return ServiceResult.success(res.data);
            }
            return ServiceResult.failed();
        } catch(err) {
            console.log(err);
            return ServiceResult.failed();
        }
    }

    static async updateFlight(id: number, input: IFlight): Promise<ServiceResult<IFlightId>> {
        try {
            const res = await axios.put(`${ApiService.baseURL}/flights/${id}`, input);
            if (res.status === 200) {
                return ServiceResult.success(res.data);
            }
            return ServiceResult.failed();
        } catch(err) {
            console.log(err)
            return ServiceResult.failed();
        }
    }

    static async deleteFlight(id: number): Promise<ServiceResult<IFlightId>> {
        try {
            const res = await axios.delete(`${ApiService.baseURL}/flights/${id}`);
            if (res.status === 204) {
                return ServiceResult.success(res.data);
            }
            return ServiceResult.failed();
        } catch(err) {
            console.log(err)
            return ServiceResult.failed();
        }
    }

    static async countFlights(): Promise<ServiceResult<number>> {
        try {
            const res = await axios.get(`${ApiService.baseURL}/flights/count`);
            if (res.status === 200) {
                return ServiceResult.success(res.data)
            }
            return ServiceResult.failed();
        } catch (err) {
            console.log(err)
            return ServiceResult.failed();
        }
    }



}