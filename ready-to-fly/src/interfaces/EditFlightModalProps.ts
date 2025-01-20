import { IFlightId } from "../models/flight.model";

export interface EditFlightModalProps {
    flight: IFlightId;
    onClose: () => void;
    onUpdate: (updatedFlight: IFlightId) => void;
}