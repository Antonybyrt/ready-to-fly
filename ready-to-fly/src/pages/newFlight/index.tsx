import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FlightService } from '@/services/flight.service';
import { AirportService } from '@/services/airport.service';
import { ErrorService } from '@/services/error.service';
import { ServiceErrorCode } from '@/services/service.result';
import { IAirport, IAirportId } from '@/models/airport.model';

const NewFlight = () => {
    const [airports, setAirports] = useState<IAirportId[]>([]);
    const [departureId, setDepartureId] = useState('');
    const [arrivalId, setArrivalId] = useState('');
    const [duration, setDuration] = useState('');
    const [startDate, setStartDate] = useState('');
    const [appreciation, setAppreciation] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newAirportName, setNewAirportName] = useState('');
    const [newAirportShortForm, setNewAirportShortForm] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchAirports = async () => {
            const result = await AirportService.getAllAirports();
            if (result.errorCode === ServiceErrorCode.success && result.result) {
                setAirports(result.result);
            } else {
                ErrorService.errorMessage('Failed to load airports', '');
            }
        };
        fetchAirports();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const flightData = {
            departure_id: Number(departureId),
            arrival_id: Number(arrivalId),
            duration: Number(duration),
            start_date: new Date(startDate),
            end_date: new Date(new Date(startDate).getTime() + Number(duration) * 60 * 60 * 1000),
            appreciation,
        };

        try {
            const result = await FlightService.createFlight(flightData);
            if (result.errorCode === ServiceErrorCode.success) {
                ErrorService.successMessage('Flight created!', '');
                router.push('/');
            }
        } catch (err) {
            ErrorService.errorMessage('Creation failed', '' + err);
        }
    };

    const handleAddAirport = async (e: React.FormEvent) => {
        e.preventDefault();
        const airportData = {
            name: newAirportName,
            short_form: newAirportShortForm,
        };

        try {
            const result = await AirportService.createAirport(airportData);
            if (result.errorCode === ServiceErrorCode.success) {
                setAirports((prev) => [...prev, result.result]); // Ajoute le nouvel aéroport à la liste
                ErrorService.successMessage('Airport added!', '');
                setIsModalOpen(false); // Ferme la modale
                setNewAirportName(''); // Réinitialise le champ
                setNewAirportShortForm(''); // Réinitialise le champ
            }
        } catch (err) {
            ErrorService.errorMessage('Failed to add airport', '' + err);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold text-center">Create a New Flight</h1>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {/* Departure Airport Select Box */}
                <div>
                    <label htmlFor="departureId" className="block text-sm font-medium text-gray-700">
                        Departure Airport
                    </label>
                    <select
                        id="departureId"
                        value={departureId}
                        onChange={(e) => setDepartureId(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
                        required
                    >
                        <option value="">Select an airport</option>
                        {airports.map((airport) => (
                            <option key={airport.id} value={airport.id}>
                                {airport.name} ({airport.short_form})
                            </option>
                        ))}
                    </select>
                    {/* Badge to open modal */}
                    <div
                        onClick={() => setIsModalOpen(true)}
                        className="mt-2 inline-block bg-blue-600 text-white py-1 px-2 rounded cursor-pointer"
                    >
                        Add Airport
                    </div>
                </div>

                {/* Arrival Airport Select Box */}
                <div>
                    <label htmlFor="arrivalId" className="block text-sm font-medium text-gray-700">
                        Arrival Airport
                    </label>
                    <select
                        id="arrivalId"
                        value={arrivalId}
                        onChange={(e) => setArrivalId(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
                        required
                    >
                        <option value="">Select an airport</option>
                        {airports.map((airport) => (
                            <option key={airport.id} value={airport.id}>
                                {airport.name} ({airport.short_form})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Duration Field */}
                <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                        Duration (in hours)
                    </label>
                    <input
                        type="number"
                        id="duration"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
                        required
                    />
                </div>

                {/* Start Date and Time Field */}
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                        Start Date and Time
                    </label>
                    <input
                        type="datetime-local"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
                        required
                    />
                </div>

                {/* Appreciation Field */}
                <div>
                    <label htmlFor="appreciation" className="block text-sm font-medium text-gray-700">
                        Appreciation
                    </label>
                    <input
                        type="text"
                        id="appreciation"
                        value={appreciation}
                        onChange={(e) => setAppreciation(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
                    />
                </div>

                {/* Submit Button */}
                <button type="submit" className="w-full p-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700">
                    Create Flight
                </button>
            </form>

            {/* Modal for Adding Airport */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-md shadow-md">
                        <h2 className="text-xl font-bold mb-4">Add Airport</h2>
                        <form onSubmit={handleAddAirport} className="space-y-4">
                            <div>
                                <label htmlFor="newAirportName" className="block text-sm font-medium text-gray-700">
                                    Airport Name
                                </label>
                                <input
                                    type="text"
                                    id="newAirportName"
                                    value={newAirportName}
                                    onChange={(e) => setNewAirportName(e.target.value)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="newAirportShortForm" className="block text-sm font-medium text-gray-700">
                                    Short Form
                                </label>
                                <input
                                    type="text"
                                    id="newAirportShortForm"
                                    value={newAirportShortForm}
                                    onChange={(e) => setNewAirportShortForm(e.target.value)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded-md">
                                    Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
                                    Add Airport
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewFlight;
