export interface IAirport {
    id?: number;
    short_form: string;
    name: string;
}

export type IAirportId =IAirport & { id: number };