export interface AddAirportModalProps {
    newAirportName: string;
    newAirportShortForm: string;
    setNewAirportName: (value: string) => void;
    setNewAirportShortForm: (value: string) => void;
    handleAddAirport: (e: React.FormEvent) => Promise<void>;
    closeModal: () => void;
}