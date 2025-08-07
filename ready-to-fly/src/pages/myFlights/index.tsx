import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlightService } from '@/services/flight.service';
import { IFlight, IFlightId } from '@/models/flight.model';
import { ErrorService } from '@/services/error.service';
import EditFlightModal from '@/components/modals/EditFlight';
import { ServiceErrorCode } from '@/services/service.result';
import { MoreInfoModal } from '@/components/modals/MoreInfo';
import { useRouter } from 'next/router';
import auth from '@/services/auth.service';
import { IUser } from '@/models/user.model';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/components/ThemeProvider';
import { 
  Plane, 
  MapPin, 
  Clock, 
  Calendar, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Info, 
  Users,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  CalendarDays
} from 'lucide-react';

const MyFlights = () => {
    const [flights, setFlights] = useState<IFlightId[]>([]);
    const [filteredFlights, setFilteredFlights] = useState<IFlightId[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 6;
    const [searchDeparture, setSearchDeparture] = useState<string>('');
    const [searchArrival, setSearchArrival] = useState<string>('');
    const [searchDate, setSearchDate] = useState<string>('');
    const [selectedFlight, setSelectedFlight] = useState<IFlightId | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isMoreInfoModalOpen, setIsMoreInfoModalOpen] = useState(false);
    const [user, setUser] = useState<IUser | null>(); 
    const { isDarkMode } = useTheme();
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const user = await auth.getUser();
            if (user) {
                setUser(user);
            } else {
                router.push('../auth/logout');
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const fetchFlights = async () => {
            if (!user) return;
            try {
                const result = await FlightService.getFlightsByUser(user?.id as number);
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
    }, [user]);

    const handleEdit = (flight: IFlightId) => {
        setSelectedFlight(flight);
        setIsEditModalOpen(true);
    };

    const handleMoreInfo = (flight: IFlightId) => {
        setSelectedFlight(flight);
        setIsMoreInfoModalOpen(true);
    };

    const handleDelete = async (flightId: number) => {
        const isConfirmed = await ErrorService.confirmDelete();
        if (!isConfirmed) {
            return;
        }
        
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
                const isMonthMatch = selectedMonth ? flightDate.getMonth() + 1 === selectedMonth : true;
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

    const formatDuration = (duration: number) => {
        const hours = Math.floor(duration / 100);
        const minutes = duration % 100;
        return `${hours}h${minutes.toString().padStart(2, '0')}`;
    };

    const getFlightStatus = (flight: IFlightId) => {
        const now = new Date();
        const flightDate = new Date(flight.start_date);
        const endDate = new Date(flight.end_date);

        if (now < flightDate) {
            return { status: 'upcoming', label: 'Upcoming', color: 'bg-blue-500' };
        } else if (now >= flightDate && now <= endDate) {
            return { status: 'in-progress', label: 'In Progress', color: 'bg-green-500' };
        } else {
            return { status: 'completed', label: 'Completed', color: 'bg-gray-500' };
        }
    };

    const years = Array.from({ length: 6 }, (_, i) => (new Date().getFullYear() - 1) + i);
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

    if (loading) {
        return (
            <div className={`min-h-screen transition-colors duration-300 ${
                isDarkMode 
                    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' 
                    : 'bg-gradient-to-br from-slate-50 to-slate-100 text-gray-900'
            } pt-20`}>
                <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-center items-center h-64">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full"
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-colors duration-300 ${
            isDarkMode 
                ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' 
                : 'bg-gradient-to-br from-slate-50 to-slate-100 text-gray-900'
        } pt-20`}>
            <div className="container mx-auto px-4 py-8">
                {user ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="mb-8"
                        >
                            <div className="flex items-center justify-center mb-4">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                    className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center shadow-lg mr-4"
                                >
                                    <Plane className="w-8 h-8 text-white" />
                                </motion.div>
                            </div>
                            <h1 className={`text-4xl font-bold text-center mb-2 ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                                My Flights
                            </h1>
                            <p className={`text-lg text-center ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                                Manage and view all your flights
                            </p>
                        </motion.div>

                        {/* Filters */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mb-8"
                        >
                            <Card className={`shadow-lg border-0 ${
                                isDarkMode 
                                    ? 'bg-gray-800/50 backdrop-blur-sm border-gray-700' 
                                    : 'bg-white/80 backdrop-blur-sm border-gray-200'
                            }`}>
                                <CardHeader>
                                    <CardTitle className={`text-xl font-bold ${
                                        isDarkMode ? 'text-white' : 'text-gray-900'
                                    }`}>
                                        <Filter className="w-5 h-5 inline mr-2" />
                                        Filters
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {/* Year Filter */}
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${
                                                isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                            }`}>
                                                Year
                                            </label>
                                            <select
                                                value={selectedYear ?? ""}
                                                onChange={(e) => setSelectedYear(e.target.value ? Number(e.target.value) : null)}
                                                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors ${
                                                    isDarkMode 
                                                        ? 'bg-gray-700 border-gray-600 text-white' 
                                                        : 'bg-white border-gray-300 text-gray-900'
                                                }`}
                                            >
                                                <option value="">All Years</option>
                                                {years.map(year => (
                                                    <option key={year} value={year}>{year}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Month Filter */}
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${
                                                isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                            }`}>
                                                Month
                                            </label>
                                            <select
                                                value={selectedMonth ?? ""}
                                                onChange={(e) => setSelectedMonth(e.target.value ? Number(e.target.value) : null)}
                                                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors ${
                                                    isDarkMode 
                                                        ? 'bg-gray-700 border-gray-600 text-white' 
                                                        : 'bg-white border-gray-300 text-gray-900'
                                                }`}
                                            >
                                                <option value="">All Months</option>
                                                {months.map(month => (
                                                    <option key={month.value} value={month.value}>{month.label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Departure Search */}
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${
                                                isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                            }`}>
                                                <Search className="w-4 h-4 inline mr-2" />
                                                Departure
                                            </label>
                                            <Input
                                                type="text"
                                                value={searchDeparture}
                                                onChange={(e) => setSearchDeparture(e.target.value)}
                                                placeholder="Search by departure airport..."
                                                className={`${
                                                    isDarkMode 
                                                        ? 'bg-gray-700 border-gray-600 text-white' 
                                                        : 'bg-white border-gray-300 text-gray-900'
                                                }`}
                                            />
                                        </div>

                                        {/* Arrival Search */}
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${
                                                isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                            }`}>
                                                <Search className="w-4 h-4 inline mr-2" />
                                                Arrival
                                            </label>
                                            <Input
                                                type="text"
                                                value={searchArrival}
                                                onChange={(e) => setSearchArrival(e.target.value)}
                                                placeholder="Search by arrival airport..."
                                                className={`${
                                                    isDarkMode 
                                                        ? 'bg-gray-700 border-gray-600 text-white' 
                                                        : 'bg-white border-gray-300 text-gray-900'
                                                }`}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Flight Cards */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            {filteredFlights.length === 0 ? (
                                <Card className={`shadow-lg border-0 text-center py-12 ${
                                    isDarkMode 
                                        ? 'bg-gray-800/50 backdrop-blur-sm border-gray-700' 
                                        : 'bg-white/80 backdrop-blur-sm border-gray-200'
                                }`}>
                                    <CardContent>
                                        <Plane className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                        <p className={`text-lg ${
                                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                        }`}>
                                            No flights found for the selected filters.
                                        </p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <AnimatePresence>
                                        {filteredFlights
                                            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                            .map((flight, index) => {
                                                const status = getFlightStatus(flight);
                                                return (
                                                    <motion.div
                                                        key={flight.id}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.1 * index }}
                                                        whileHover={{ y: -5 }}
                                                    >
                                                        <Card className={`h-full shadow-lg border-0 hover:shadow-xl transition-all duration-300 ${
                                                            isDarkMode 
                                                                ? 'bg-gray-800/50 backdrop-blur-sm border-gray-700' 
                                                                : 'bg-white/80 backdrop-blur-sm border-gray-200'
                                                        }`}>
                                                            <CardHeader className="pb-4">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center space-x-2">
                                                                        <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
                                                                            <Plane className="w-4 h-4 text-white" />
                                                                        </div>
                                                                        <Badge className={status.color}>
                                                                            {status.label}
                                                                        </Badge>
                                                                    </div>
                                                                    <CalendarDays className={`w-5 h-5 ${
                                                                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                                                    }`} />
                                                                </div>
                                                            </CardHeader>
                                                            <CardContent>
                                                                {/* Flight Route */}
                                                                <div className="flex items-center justify-between mb-4">
                                                                    <div className="text-center flex-1">
                                                                        <p className={`font-bold text-lg ${
                                                                            isDarkMode ? 'text-white' : 'text-gray-900'
                                                                        }`}>
                                                                            {flight.departureAirport?.short_form}
                                                                        </p>
                                                                        <p className={`text-sm ${
                                                                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                                                        }`}>
                                                                            {flight.departureAirport?.name}
                                                                        </p>
                                                                    </div>
                                                                    <div className="flex items-center mx-4">
                                                                        <div className="w-8 h-1 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full"></div>
                                                                        <ArrowRight className="w-4 h-4 text-pink-500 mx-1" />
                                                                    </div>
                                                                    <div className="text-center flex-1">
                                                                        <p className={`font-bold text-lg ${
                                                                            isDarkMode ? 'text-white' : 'text-gray-900'
                                                                        }`}>
                                                                            {flight.arrivalAirport?.short_form}
                                                                        </p>
                                                                        <p className={`text-sm ${
                                                                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                                                        }`}>
                                                                            {flight.arrivalAirport?.name}
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                {/* Flight Details */}
                                                                <div className="space-y-2 mb-4">
                                                                    <div className="flex items-center justify-between">
                                                                        <span className={`text-sm ${
                                                                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                                                        }`}>
                                                                            <Calendar className="w-4 h-4 inline mr-1" />
                                                                            Departure
                                                                        </span>
                                                                        <span className={`font-medium ${
                                                                            isDarkMode ? 'text-white' : 'text-gray-900'
                                                                        }`}>
                                                                            {new Date(flight.start_date).toLocaleDateString('fr-FR', {
                                                                                day: '2-digit',
                                                                                month: '2-digit',
                                                                                year: 'numeric',
                                                                                hour: '2-digit',
                                                                                minute: '2-digit'
                                                                            })}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center justify-between">
                                                                        <span className={`text-sm ${
                                                                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                                                        }`}>
                                                                            <Clock className="w-4 h-4 inline mr-1" />
                                                                            Duration
                                                                        </span>
                                                                        <span className={`font-medium ${
                                                                            isDarkMode ? 'text-white' : 'text-gray-900'
                                                                        }`}>
                                                                            {formatDuration(flight.duration)}
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                {/* Actions */}
                                                                <div className="flex space-x-2">
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => handleEdit(flight)}
                                                                        className="flex-1"
                                                                    >
                                                                        <Edit className="w-4 h-4 mr-1" />
                                                                        Edit
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => handleMoreInfo(flight)}
                                                                        className="flex-1"
                                                                    >
                                                                        <Info className="w-4 h-4 mr-1" />
                                                                        Details
                                                                    </Button>
                                                                    <Button
                                                                        variant="destructive"
                                                                        size="sm"
                                                                        onClick={() => handleDelete(flight.id)}
                                                                        className="flex-1"
                                                                    >
                                                                        <Trash2 className="w-4 h-4 mr-1" />
                                                                        Delete
                                                                    </Button>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    </motion.div>
                                                );
                                            })}
                                    </AnimatePresence>
                                </div>
                            )}
                        </motion.div>

                        {/* Pagination */}
                        {filteredFlights.length > itemsPerPage && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="mt-8 flex items-center justify-center space-x-4"
                            >
                                <Button
                                    variant="outline"
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 1}
                                    className={`${
                                        isDarkMode 
                                            ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    Previous
                                </Button>
                                
                                <span className={`font-medium ${
                                    isDarkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                    Page {currentPage} of {Math.ceil(filteredFlights.length / itemsPerPage)}
                                </span>
                                
                                <Button
                                    variant="outline"
                                    onClick={handleNextPage}
                                    disabled={currentPage === Math.ceil(filteredFlights.length / itemsPerPage)}
                                    className={`${
                                        isDarkMode 
                                            ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </motion.div>
                        )}

                        {/* Modals */}
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
                    </motion.div>
                ) : (
                    <div className="text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                                isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                            }`}>
                                <Users className={`w-8 h-8 ${
                                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`} />
                            </div>
                            <h2 className={`text-xl font-semibold mb-2 ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                                Login Required
                            </h2>
                            <p className={
                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }>
                                Please log in to your account to continue...
                            </p>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyFlights;
