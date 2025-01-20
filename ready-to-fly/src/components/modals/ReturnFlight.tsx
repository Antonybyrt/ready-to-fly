import { IAirportId } from '@/models/airport.model';
import { ErrorService } from '@/services/error.service';
import React, { useEffect, useState } from 'react';

interface ReturnFlightModalProps {
    departureId: string;
    arrivalId: string;
    airports: IAirportId[];
    firstStartDate: string;
    onClose: () => void;
    onSubmit: (flightData: {
        departure_id: number;
        arrival_id: number;
        duration: string;
        start_date: string;
        appreciation: string;
    }) => void;
}

const ReturnFlightModal: React.FC<ReturnFlightModalProps> = ({
    departureId,
    arrivalId,
    airports,
    firstStartDate,
    onClose,
    onSubmit,
}) => {
    const [returnDepartureId, setReturnDepartureId] = useState(arrivalId); // Inverse
    const [returnArrivalId, setReturnArrivalId] = useState(departureId);   // Inverse
    const [duration, setDuration] = useState('');
    const [startDate, setStartDate] = useState('');
    const [appreciation, setAppreciation] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (new Date(startDate) <= new Date(firstStartDate)) {
            ErrorService.errorMessage('Flight return', 'Your return flight must be later than your first flight !')
            return;
        }

        const flightData = {
            departure_id: Number(returnDepartureId),
            arrival_id: Number(returnArrivalId),
            duration,
            start_date: startDate,
            appreciation,
        };

        onSubmit(flightData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-gray-800 p-6 rounded-md shadow-md w-80">
                <h2 className="text-xl text-pink-300 font-bold mb-4">Create Return Flight</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Departure Airport</label>
                        <select
                            value={returnDepartureId}
                            onChange={(e) => setReturnDepartureId(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
                            required
                        >
                            {airports.map((airport) => (
                                <option key={airport.id} value={airport.id}>
                                    {airport.name} ({airport.short_form})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Arrival Airport</label>
                        <select
                            value={returnArrivalId}
                            onChange={(e) => setReturnArrivalId(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
                            required
                        >
                            {airports.map((airport) => (
                                <option key={airport.id} value={airport.id}>
                                    {airport.name} ({airport.short_form})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Duration (HH.MM)</label>
                        <input
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
                            placeholder='00:00'
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Start Date and Time</label>
                        <input
                            type="datetime-local"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Appreciation</label>
                        <textarea
                            id="appreciation"
                            value={appreciation}
                            rows={4}
                            onChange={(e) => setAppreciation(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
                            placeholder="Enter detailed appreciation here..."
                        />
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-pink-500 text-white rounded-md"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-purple-500 text-white rounded-md"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReturnFlightModal;
