import { IFlightId } from "@/models/flight.model";

export const MoreInfoModal = ({ flight, onClose }: { flight: IFlightId; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-gray-800 p-6 rounded-md text-white w-96 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Flight Details</h2>
            <p className="break-words">
                <strong>Appreciation:</strong> {flight.appreciation || "No appreciation available."}
            </p>
            <button
                onClick={onClose}
                className="mt-4 bg-red-600 text-white py-2 px-4 rounded"
            >
                Close
            </button>
        </div>
    </div>
);
