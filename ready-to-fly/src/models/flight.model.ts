export interface IFlight {
    departure_id: number;
    arrival_id: number;
    duration: number;
    start_date: Date;
    end_date: Date;
    appreciation?: string;
}

export type IFlightId = IFlight & { id: number };