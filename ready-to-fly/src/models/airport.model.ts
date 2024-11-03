export interface IAirport {
    short_form: string;
    name: string;
}

export type IAirportId =IAirport & { id: number };