import React from 'react';
import { AddAirportModalProps } from '@/models/AddAirportModalProps';

const AddAirportModal: React.FC<AddAirportModalProps> = ({
    newAirportName,
    newAirportShortForm,
    setNewAirportName,
    setNewAirportShortForm,
    handleAddAirport,
    closeModal
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-gray-800 p-6 rounded-md shadow-md">
                <h2 className="text-xl text-white font-bold mb-4">Add Airport</h2>
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
                        <button type="button" onClick={closeModal} className="px-4 py-2 bg-red-600 rounded-md">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
                            Add Airport
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAirportModal;
