import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FlightService } from '@/services/flight.service';
import { IFlightId } from '@/models/flight.model';
import { ErrorService } from '@/services/error.service';
import { useRouter } from 'next/router';
import auth from '@/services/auth.service';
import { IUser } from '@/models/user.model';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/components/ThemeProvider';
import { MoreInfoModal } from '@/components/modals/MoreInfo';
import { 
  Plane, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  MapPin,
  Clock,
  Users
} from 'lucide-react';

const MyCalendar = () => {
    const [flights, setFlights] = useState<IFlightId[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<IUser | null>(); 
    const [selectedFlight, setSelectedFlight] = useState<IFlightId | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
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

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        return { daysInMonth, startingDayOfWeek };
    };

    const getFlightsForDate = (date: Date) => {
        return flights.filter(flight => {
            const flightDate = new Date(flight.start_date);
            return flightDate.toDateString() === date.toDateString();
        });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
        });
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    const formatDuration = (duration: number) => {
        const hours = Math.floor(duration);
        const minutes = Math.round((duration - hours) * 100);
        
        if (hours === 0) {
            return `${minutes}m`;
        } else if (minutes === 0) {
            return `${hours}h00`;
        } else {
            return `${hours}h${minutes.toString().padStart(2, '0')}`;
        }
    };

    const getFlightStatus = (flight: IFlightId) => {
        const now = new Date();
        const flightDate = new Date(flight.start_date);
        const endDate = new Date(flight.end_date);

        if (now < flightDate) {
            return { status: 'upcoming', label: 'Upcoming', color: 'bg-blue-500' };
        } else if (now >= flightDate && now <= endDate) {
            return { status: 'in-progress', label: 'In Flight', color: 'bg-green-500' };
        } else {
            return { status: 'completed', label: 'Landed', color: 'bg-gray-500' };
        }
    };

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleFlightClick = (flight: IFlightId) => {
        setSelectedFlight(flight);
        setIsModalOpen(true);
    };

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

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
                                    <Calendar className="w-8 h-8 text-white" />
                                </motion.div>
                            </div>
                            <h1 className={`text-4xl font-bold text-center mb-2 ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                                My Flight Calendar ✈️
                            </h1>
                            <p className={`text-lg text-center ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                                Time to take off and explore your journey timeline!
                            </p>
                        </motion.div>

                        {/* Calendar Navigation */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mb-6"
                        >
                            <Card className={`shadow-xl border-2 ${
                                isDarkMode 
                                    ? 'bg-gray-800/90 backdrop-blur-sm border-gray-600' 
                                    : 'bg-white/95 backdrop-blur-sm border-gray-300'
                            }`}>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <Button
                                            variant="outline"
                                            onClick={previousMonth}
                                            className={`${
                                                isDarkMode 
                                                    ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
                                                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            <ChevronLeft className="w-4 h-4 mr-1" />
                                            Previous
                                        </Button>
                                        
                                        <CardTitle className={`text-2xl font-bold ${
                                            isDarkMode ? 'text-white' : 'text-gray-900'
                                        }`}>
                                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                                        </CardTitle>
                                        
                                        <Button
                                            variant="outline"
                                            onClick={nextMonth}
                                            className={`${
                                                isDarkMode 
                                                    ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
                                                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            Next
                                            <ChevronRight className="w-4 h-4 ml-1" />
                                        </Button>
                                    </div>
                                </CardHeader>
                            </Card>
                        </motion.div>

                        {/* Calendar Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Card className={`shadow-xl border-2 ${
                                isDarkMode 
                                    ? 'bg-gray-800/90 backdrop-blur-sm border-gray-600' 
                                    : 'bg-white/95 backdrop-blur-sm border-gray-300'
                            }`}>
                                <CardContent className="p-6">
                                    {/* Day Headers */}
                                    <div className="grid grid-cols-7 gap-2 mb-4">
                                        {dayNames.map((day, index) => (
                                            <div
                                                key={index}
                                                className={`text-center font-semibold py-2 ${
                                                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                                }`}
                                            >
                                                {day}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Calendar Days */}
                                    <div className="grid grid-cols-7 gap-2">
                                        {/* Empty cells for days before the first day of the month */}
                                        {Array.from({ length: startingDayOfWeek }, (_, index) => (
                                            <div key={`empty-${index}`} className="h-32"></div>
                                        ))}

                                        {/* Days of the month */}
                                        {Array.from({ length: daysInMonth }, (_, index) => {
                                            const dayNumber = index + 1;
                                            const currentDayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
                                            const dayFlights = getFlightsForDate(currentDayDate);
                                            const isToday = currentDayDate.toDateString() === new Date().toDateString();

                                            return (
                                                <div
                                                    key={dayNumber}
                                                    className={`h-32 border rounded-lg p-2 transition-all duration-200 ${
                                                        isToday
                                                            ? isDarkMode
                                                                ? 'bg-pink-500/20 border-pink-500'
                                                                : 'bg-pink-100 border-pink-300'
                                                            : isDarkMode
                                                                ? 'border-gray-600 hover:border-gray-500'
                                                                : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                >
                                                    <div className={`text-sm font-semibold mb-1 ${
                                                        isToday
                                                            ? isDarkMode ? 'text-pink-300' : 'text-pink-700'
                                                            : isDarkMode ? 'text-white' : 'text-gray-900'
                                                    }`}>
                                                        {dayNumber}
                                                    </div>
                                                    
                                                    {/* Flights for this day */}
                                                     <div className="space-y-1">
                                                         {dayFlights.map((flight, flightIndex) => {
                                                             const status = getFlightStatus(flight);
                                                             return (
                                                                 <div
                                                                     key={flight.id}
                                                                     onClick={() => handleFlightClick(flight)}
                                                                     className={`text-xs p-1 rounded cursor-pointer transition-all duration-200 ${
                                                                         isDarkMode 
                                                                             ? 'bg-gray-700/80 hover:bg-pink-500/30 hover:border-pink-400/50 border border-transparent' 
                                                                             : 'bg-gray-100 hover:bg-pink-100 hover:border-pink-300/50 border border-transparent'
                                                                     }`}
                                                                     title={`${flight.departureAirport?.short_form} → ${flight.arrivalAirport?.short_form} - ${formatTime(new Date(flight.start_date))}`}
                                                                 >
                                                                     <div className="flex items-center space-x-1">
                                                                         <Plane className="w-2 h-2" />
                                                                         <span className="truncate">
                                                                             {flight.departureAirport?.short_form} → {flight.arrivalAirport?.short_form}
                                                                         </span>
                                                                     </div>
                                                                     <div className="text-xs opacity-75">
                                                                         {formatTime(new Date(flight.start_date))}
                                                                     </div>
                                                                 </div>
                                                             );
                                                         })}
                                                     </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Flight Details Modal */}
                        {isModalOpen && selectedFlight && (
                            <MoreInfoModal
                                flight={selectedFlight}
                                onClose={() => setIsModalOpen(false)}
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

export default MyCalendar;
