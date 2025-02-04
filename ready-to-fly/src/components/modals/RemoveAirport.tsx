import { RemoveAirportModalProps } from '@/interfaces/RemoveAirportModalProps';
import React from 'react';


const RemoveAirportModal: React.FC<RemoveAirportModalProps> = ({
    airports,
    airportToDelete,
    setAirportToDelete,
    handleDeleteAirport,
    closeModal
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-gray-800 p-6 rounded-md shadow-md">
                <h2 className="text-xl text-pink-300 font-bold mb-4">Delete Airport</h2>
                <form onSubmit={handleDeleteAirport} className="space-y-4">
                    <div>
                        <label htmlFor="airportToDelete" className="block text-sm font-medium text-gray-600">
                            Select Airport to Delete
                        </label>
                        <select
                            id="airportToDelete"
                            value={airportToDelete}
                            onChange={(e) => setAirportToDelete(e.target.value)}
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
                    <div className="flex justify-end space-x-2">
                        <button type="submit" className="px-4 py-2 bg-pink-500 text-white rounded-md">
                            Delete Airport
                        </button>
                        <button type="button" onClick={closeModal} className="px-4 py-2 bg-purple-500 rounded-md">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RemoveAirportModal;
