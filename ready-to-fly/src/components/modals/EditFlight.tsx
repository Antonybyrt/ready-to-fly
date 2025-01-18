import { useEffect, useState } from 'react';
import { IFlightId } from '@/models/flight.model';
import { FlightService } from '@/services/flight.service';
import { AirportService } from '@/services/airport.service';
import { ErrorService } from '@/services/error.service';
import { ServiceErrorCode } from '@/services/service.result';
import { EditFlightModalProps } from '@/models/EditFlightModalProps';
import { IAirportId, IAirport } from '@/models/airport.model';

const EditFlightModal: React.FC<EditFlightModalProps> = ({ flight, onClose, onUpdate }) => {
    const [airports, setAirports] = useState<IAirport[]>([]);
    const [departureId, setDepartureId] = useState(flight.departure_id || '');
    const [arrivalId, setArrivalId] = useState(flight.arrival_id || '');
    const [duration, setDuration] = useState(flight.duration.toString());
    const [startDate, setStartDate] = useState(new Date(flight.start_date).toISOString().slice(0, 16));
    const [appreciation, setAppreciation] = useState(flight.appreciation);

    useEffect(() => {
        console.log(flight)
        const fetchAirports = async () => {
            try {
                const result = await AirportService.getAllAirports();
                if (result.errorCode === ServiceErrorCode.success) {
                    setAirports(result.result as IAirportId[]);
                } else {
                    ErrorService.errorMessage('Fetching airports', 'Error while fetching airports');
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchAirports();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const startDateTime = new Date(startDate);

        const durationStr = duration.padStart(4, '0');
        const hours = Number(durationStr.slice(0, -2));
        const minutes = Number(durationStr.slice(-2));
    
        const endDate = new Date(startDateTime);
        endDate.setHours(startDateTime.getHours() + hours);
        endDate.setMinutes(startDateTime.getMinutes() + minutes);

        const updatedFlightData = {
            ...flight,
            departure_id: Number(departureId),
            arrival_id: Number(arrivalId),
            duration: Number(duration),
            start_date: startDateTime,
            end_date: endDate,
            appreciation,
        };

        try {
            const result = await FlightService.updateFlight(flight.id, updatedFlightData);
            if (result.errorCode === ServiceErrorCode.success) {
                ErrorService.successMessage('Flight updated successfully!', '');
                onUpdate(result.result as IFlightId);
            }
            else {
                ErrorService.errorMessage('Failed to update flight', 'Message too long')
            }
        } catch (err) {
            ErrorService.errorMessage('Failed to update flight', '' + err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-md shadow-md w-80">
                <h2 className="text-xl text-black font-bold mb-4">Edit Flight</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Departure Airport</label>
                        <select
                            value={departureId}
                            onChange={(e) => setDepartureId(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
                            required
                        >
                            <option value="" disabled>Select Departure Airport</option>
                            {airports.map((airport) => (
                                <option key={airport.id} value={airport.id}>
                                    {airport.name} ({airport.short_form})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Arrival Airport</label>
                        <select
                            value={arrivalId}
                            onChange={(e) => setArrivalId(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
                            required
                        >
                            <option value="" disabled>Select Arrival Airport</option>
                            {airports.map((airport) => (
                                <option key={airport.id} value={airport.id}>
                                    {airport.name} ({airport.short_form})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Duration (in hours)</label>
                        <input
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Start Date and Time</label>
                        <input
                            type="datetime-local"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Appreciation</label>
                        <textarea
                            id="appreciation"
                            value={appreciation}
                            rows={4}
                            onChange={(e) => setAppreciation(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
                        />
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-red-600 text-white rounded-md">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditFlightModal;