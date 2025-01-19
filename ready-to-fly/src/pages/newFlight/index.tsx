import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FlightService } from '@/services/flight.service';
import { AirportService } from '@/services/airport.service';
import { ErrorService } from '@/services/error.service';
import { ServiceErrorCode } from '@/services/service.result';
import { IAirportId } from '@/models/airport.model';
import AddAirport from '@/components/modals/AddAirport';
import RemoveAirportModal from '@/components/modals/RemoveAirport';
import ReturnFlightModal from '@/components/modals/ReturnFlight';


const NewFlight = () => {
    const [airports, setAirports] = useState<IAirportId[]>([]);
    const [departureId, setDepartureId] = useState('');
    const [arrivalId, setArrivalId] = useState('');
    const [duration, setDuration] = useState('');
    const [startDate, setStartDate] = useState('');
    const [appreciation, setAppreciation] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [newAirportName, setNewAirportName] = useState('');
    const [newAirportShortForm, setNewAirportShortForm] = useState('');
    const [airportToDelete, setAirportToDelete] = useState('');
    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
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
    
        const startDateTime = new Date(startDate);
        
        const durationStr = duration.padStart(4, '0');
        const hours = Number(durationStr.slice(0, -2));
        const minutes = Number(durationStr.slice(-2));
    
        const endDate = new Date(startDateTime);
        endDate.setHours(startDateTime.getHours() + hours);
        endDate.setMinutes(startDateTime.getMinutes() + minutes);
    
        const flightData = {
            departure_id: Number(departureId),
            arrival_id: Number(arrivalId),
            duration: Number(duration),
            start_date: startDateTime,
            end_date: endDate,
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
                setAirports((prev) => [...prev, result.result as IAirportId]);
                ErrorService.successMessage('Airport added!', '');
                setIsAddModalOpen(false);
                setNewAirportName('');
                setNewAirportShortForm('');
            }
        } catch (err) {
            ErrorService.errorMessage('Failed to add airport', '' + err);
        }
    };

    const handleDeleteAirport = async (e: React.FormEvent) => {
        e.preventDefault();

        const isConfirmed = await ErrorService.confirmDelete();
        if (!isConfirmed) {
            return;
        }
        
        try {
            const result = await AirportService.deleteFlight(parseInt(airportToDelete));
            if (result.errorCode === ServiceErrorCode.success) {
                setAirports((prev) => prev.filter((airport) => airport.id !== parseInt(airportToDelete)));
                ErrorService.successMessage('Airport deleted!', '');
                setIsDeleteModalOpen(false);
                setAirportToDelete('');
            }
        } catch (err) {
            ErrorService.errorMessage('Failed to delete airport', '' + err);
        }
    };

    const handleReturnFlightSubmit = async (flightData: any) => {
        const startDateTime = new Date(flightData.start_date);
        
        const durationStr = flightData.duration.padStart(4, '0');
        const hours = Number(durationStr.slice(0, -2));
        const minutes = Number(durationStr.slice(-2));
    
        const endDate = new Date(startDateTime);
        endDate.setHours(startDateTime.getHours() + hours);
        endDate.setMinutes(startDateTime.getMinutes() + minutes);

        flightData.end_date = endDate;
        try {
            const result = await FlightService.createFlight(flightData);
            if (result.errorCode === ServiceErrorCode.success) {
                ErrorService.successMessage('Return flight created!', '');
                setIsReturnModalOpen(false);
            }
        } catch (err) {
            ErrorService.errorMessage('Failed to create return flight', '' + err);
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
                        Duration (HH.MM)
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
                    <textarea
                        id="appreciation"
                        value={appreciation}
                        onChange={(e) => setAppreciation(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
                        rows={4}
                        placeholder="Enter detailed appreciation here..."
                    />
                </div>

                {/* Submit Button */}
                <button type="submit" className="w-full p-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700">
                    Create Flight
                </button>
            </form>

            <div onClick={() => setIsAddModalOpen(true)} className="mt-2 text-sm inline-block bg-green-600 text-white py-1 px-2 rounded cursor-pointer">
                Add Airport
            </div>
            <div onClick={() => setIsDeleteModalOpen(true)} className="mt-2 ml-2 text-sm inline-block bg-red-600 text-white py-1 px-2 rounded cursor-pointer">
                Delete Airport
            </div>
            <div
                onClick={() => setIsReturnModalOpen(true)}
                className="mt-4 text-sm inline-block bg-indigo-600 text-white py-1 px-2 rounded cursor-pointer ml-2"
            >
                Vol retour ?
            </div>

            {isReturnModalOpen && (
                <ReturnFlightModal
                    departureId={departureId}
                    arrivalId={arrivalId}
                    firstStartDate={startDate}
                    airports={airports}
                    onClose={() => setIsReturnModalOpen(false)}
                    onSubmit={handleReturnFlightSubmit}
                />
            )}

            {/* Modals */}
            {isAddModalOpen && (
                <AddAirport
                    newAirportName={newAirportName}
                    newAirportShortForm={newAirportShortForm}
                    setNewAirportName={setNewAirportName}
                    setNewAirportShortForm={setNewAirportShortForm}
                    handleAddAirport={handleAddAirport}
                    closeModal={() => setIsAddModalOpen(false)}
                />
            )}

            {isDeleteModalOpen && (
                <RemoveAirportModal
                    airports={airports}
                    airportToDelete={airportToDelete}
                    setAirportToDelete={setAirportToDelete}
                    handleDeleteAirport={handleDeleteAirport}
                    closeModal={() => setIsDeleteModalOpen(false)}
                />
            )}
        </div>
    );
};

export default NewFlight;
