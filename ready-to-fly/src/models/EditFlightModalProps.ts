import { IFlightId } from "./flight.model";

export interface EditFlightModalProps {
    flight: IFlightId;
    onClose: () => void;
    onUpdate: (updatedFlight: IFlightId) => void;
}