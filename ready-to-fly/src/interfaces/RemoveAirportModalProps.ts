import { IAirportId } from "../models/airport.model";

export interface RemoveAirportModalProps {
    airports: IAirportId[];
    airportToDelete: string;
    setAirportToDelete: (value: string) => void;
    handleDeleteAirport: (e: React.FormEvent) => Promise<void>;
    closeModal: () => void;
}