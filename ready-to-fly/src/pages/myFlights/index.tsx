import { useEffect, useState } from 'react';
import { FlightService } from '@/services/flight.service';
import { IFlight, IFlightId } from '@/models/flight.model';
import { ErrorService } from '@/services/error.service';
import EditFlightModal from '@/components/modals/EditFlight';
import { ServiceErrorCode } from '@/services/service.result';
import { MoreInfoModal } from '@/components/modals/MoreInfo';

const MyFlights = () => {
    const [flights, setFlights] = useState<IFlightId[]>([]);
    const [filteredFlights, setFilteredFlights] = useState<IFlightId[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 10;
    const [searchDeparture, setSearchDeparture] = useState<string>('');
    const [searchArrival, setSearchArrival] = useState<string>('');
    const [searchDate, setSearchDate] = useState<string>('');
    const [selectedFlight, setSelectedFlight] = useState<IFlightId | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isMoreInfoModalOpen, setIsMoreInfoModalOpen] = useState(false);

    useEffect(() => {
        const fetchFlights = async () => {
            try {
                const result = await FlightService.getAllFlights();
                if (result && result.result) {
                    setFlights(result.result as IFlightId[]);
                } else {
                    ErrorService.errorMessage('Fetching flights', 'Error while fetching flights')
                }
            } catch (err) {
                console.log(err);
                setError("An error occurred while fetching flights.");
            } finally {
                setLoading(false);
            }
        };

        fetchFlights();
    }, []);

    const handleEdit = (flight: IFlightId) => {
        setSelectedFlight(flight);
        setIsEditModalOpen(true);
    };

    const handleMoreInfo = (flight: IFlightId) => {
        setSelectedFlight(flight);
        setIsMoreInfoModalOpen(true);
    };

    const handleDelete = async (flightId: number) => {
        try {
            const result = await FlightService.deleteFlight(flightId);
            if (result.errorCode === ServiceErrorCode.success) {
                setFlights((prev) => prev.filter((flight) => flight.id !== flightId));
                ErrorService.successMessage('Flight deleted successfully!', '');
            } else {
                ErrorService.errorMessage('Error deleting flight', '');
            }
        } catch (err) {
            ErrorService.errorMessage('Failed to delete flight', '' + err);
        }
    };

    useEffect(() => {
        const filterFlights = () => {
            const filtered = flights.filter((flight) => {
                const flightDate = new Date(flight.start_date);
                const isYearMatch = selectedYear ? flightDate.getFullYear() === selectedYear : true;
                const isMonthMatch = selectedMonth ? flightDate.getMonth() + 1 === selectedMonth : true; // Adjust for 0-based month
                const isDepartureMatch = flight.departureAirport?.name.toLowerCase().includes(searchDeparture.toLowerCase());
                const isArrivalMatch = flight.arrivalAirport?.name.toLowerCase().includes(searchArrival.toLowerCase());

                const flightDateString = flightDate.toISOString().split('T')[0];
                const isDateMatch = searchDate ? flightDateString === searchDate : true;

                return isYearMatch && isMonthMatch && isDepartureMatch && isArrivalMatch && isDateMatch;
            });

            filtered.sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());
            setFilteredFlights(filtered);
        };

        filterFlights();
    }, [flights, selectedYear, selectedMonth, searchDeparture, searchArrival, searchDate]);

    const handleNextPage = () => {
        if (currentPage < Math.ceil(filteredFlights.length / itemsPerPage)) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><div className="loader"></div></div>;
    }

    const years = Array.from({ length: 6 }, (_, i) => (new Date().getFullYear() -1) + i);
    const months = [
        { value: 1, label: 'January' },
        { value: 2, label: 'February' },
        { value: 3, label: 'March' },
        { value: 4, label: 'April' },
        { value: 5, label: 'May' },
        { value: 6, label: 'June' },
        { value: 7, label: 'July' },
        { value: 8, label: 'August' },
        { value: 9, label: 'September' },
        { value: 10, label: 'October' },
        { value: 11, label: 'November' },
        { value: 12, label: 'December' },
    ];

    return (
        <div className="p-4 text-white">
            <h1 className="text-2xl font-bold mb-4">My Flights</h1>

            <div className="mb-4">
                <label htmlFor="yearSelect" className="mr-2">Select Year:</label>
                <select
                    id="yearSelect"
                    value={selectedYear ?? ""}
                    onChange={(e) => setSelectedYear(e.target.value ? Number(e.target.value) : null)}
                    className="p-2 border border-gray-600 bg-gray-800 text-white"
                >
                    <option value="">All</option>
                    {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>

                <label htmlFor="monthSelect" className="ml-4 mr-2">Select Month:</label>
                <select
                    id="monthSelect"
                    value={selectedMonth ?? ""}
                    onChange={(e) => setSelectedMonth(e.target.value ? Number(e.target.value) : null)}
                    className="p-2 border border-gray-600 bg-gray-800 text-white"
                >
                    <option value="">All</option>
                    {months.map(month => (
                        <option key={month.value} value={month.value}>{month.label}</option>
                    ))}
                </select>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800 border border-gray-700">
                    <thead>
                        <tr className="bg-gray-700">
                            <th className="py-2 px-4 border-b text-left text-gray-300">
                                Departure Airport
                                <input
                                    type="text"
                                    value={searchDeparture}
                                    onChange={(e) => setSearchDeparture(e.target.value)}
                                    className="mt-1 p-1 border border-gray-600 bg-gray-800 text-white"
                                    placeholder="Search..."
                                />
                            </th>
                            <th className="py-2 px-4 border-b text-left text-gray-300">
                                Arrival Airport
                                <input
                                    type="text"
                                    value={searchArrival}
                                    onChange={(e) => setSearchArrival(e.target.value)}
                                    className="mt-1 p-1 border border-gray-600 bg-gray-800 text-white"
                                    placeholder="Search..."
                                />
                            </th>
                            <th className="py-2 px-4 border-b text-left text-gray-300">
                                Departure Date
                            </th>
                            <th className="py-2 px-4 border-b text-left text-gray-300">
                                Arrival Date
                            </th>
                            <th className="py-2 px-4 border-b text-left text-gray-300">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredFlights
                            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                            .map((flight) => (
                                <tr key={flight.id} className="hover:bg-gray-600">
                                    <td className="py-2 px-4 border-b border-gray-700">{flight.departureAirport?.name} ({flight.departureAirport?.short_form})</td>
                                    <td className="py-2 px-4 border-b border-gray-700">{flight.arrivalAirport?.name} ({flight.arrivalAirport?.short_form})</td>
                                    <td className="py-2 px-4 border-b border-gray-700">{new Date(flight.start_date).toLocaleString()}</td>
                                    <td className="py-2 px-4 border-b border-gray-700">{new Date(flight.end_date).toLocaleString()}</td>
                                    <td className="py-2 px-4 border-b border-gray-700">
                                        <button
                                            onClick={() => handleEdit(flight)}
                                            className="bg-blue-600 text-white py-1 px-4 rounded mr-2"
                                        >
                                            Edit Flight
                                        </button>
                                        <button
                                            onClick={() => handleDelete(flight.id)}
                                            className="bg-red-600 text-white py-1 px-4 rounded"
                                        >
                                            Delete Flight
                                        </button>
                                        <button
                                            onClick={() => handleMoreInfo(flight)}
                                            className="bg-green-600 text-white py-1 px-4 rounded ml-2"
                                        >
                                            More Info
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="flex justify-between mt-4">
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="bg-gray-600 text-white py-1 px-4 rounded mr-3"
                    >
                        <p>&lt;&lt;</p>
                    </button>
                    <span className="text-gray-300">
                        Page {currentPage} of {Math.ceil(filteredFlights.length / itemsPerPage)}
                    </span>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === Math.ceil(filteredFlights.length / itemsPerPage)}
                        className="bg-gray-600 text-white py-1 px-4 rounded"
                    >
                        <p>&gt;&gt;</p>
                    </button>
                </div>
            </div>

            {filteredFlights.length === 0 && (
                <div className="text-gray-400">No flights found for the selected filters.</div>
            )}

            {/* Edit Flight Modal */}
            {isEditModalOpen && selectedFlight && (
                <EditFlightModal
                    flight={selectedFlight}
                    onClose={() => setIsEditModalOpen(false)}
                    onUpdate={(updatedFlight) => {
                        setFlights((prev) => prev.map((f) => f.id === updatedFlight.id ? updatedFlight : f));
                        setIsEditModalOpen(false);
                    }}
                />
            )}

            {isMoreInfoModalOpen && selectedFlight && (
                <MoreInfoModal
                    flight={selectedFlight}
                    onClose={() => setIsMoreInfoModalOpen(false)}
                />
            )}
        </div>
    );
};

export default MyFlights;
