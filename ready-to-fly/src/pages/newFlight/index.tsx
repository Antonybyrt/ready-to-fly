import { useState } from 'react';
import { useRouter } from 'next/router';
import { FlightService } from '@/services/flight.service';
import { ErrorService } from '@/services/error.service';
import { ServiceErrorCode } from '@/services/service.result';

const NewFlight = () => {
    const [departureId, setDepartureId] = useState('');
    const [arrivalId, setArrivalId] = useState('');
    const [duration, setDuration] = useState('');
    const [startDate, setStartDate] = useState('');
    const [appreciation, setAppreciation] = useState('');
    const router = useRouter();

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
                ErrorService.successMessage('Flight created !', '')
            }
            router.push('/')
        } catch (err) {
            ErrorService.errorMessage('Creation failed', '' + err)
        }
        
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold text-center">Create New Flight</h1>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                    <label htmlFor="departureId" className="block text-sm font-medium text-gray-700">
                        Departure ID
                    </label>
                    <input
                        type="number"
                        id="departureId"
                        value={departureId}
                        onChange={(e) => setDepartureId(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="arrivalId" className="block text-sm font-medium text-gray-700">
                        Arrival ID
                    </label>
                    <input
                        type="number"
                        id="arrivalId"
                        value={arrivalId}
                        onChange={(e) => setArrivalId(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
                        required
                    />
                </div>

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

                <button type="submit" className="w-full p-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700">
                    Create Flight
                </button>
            </form>
        </div>
    );
};

export default NewFlight;
