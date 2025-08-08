import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IFlightId } from '@/models/flight.model';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ThemeProvider';
import { 
    X, 
    Calendar, 
    MapPin, 
    Clock,
    Plane
} from 'lucide-react';

interface FlightCalendarModalProps {
    flight: IFlightId | null;
    onClose: () => void;
}

const FlightCalendarModal: React.FC<FlightCalendarModalProps> = ({ flight, onClose }) => {
    const { isDarkMode } = useTheme();
    const flightDate = new Date(flight?.start_date || new Date());
    const [currentDate, setCurrentDate] = useState(flightDate);

    if (!flight) return null;

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const firstDayWeekday = firstDayOfMonth.getDay();

    const days = [];
    for (let i = 0; i < firstDayWeekday; i++) {
        days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    const isFlightDay = (day: number) => {
        return day === flightDate.getDate() && 
               currentMonth === flightDate.getMonth() && 
               currentYear === flightDate.getFullYear();
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className={`w-full max-w-md max-h-[90vh] overflow-y-auto ${
                        isDarkMode 
                            ? 'bg-gray-800 border-gray-700' 
                            : 'bg-white border-gray-200'
                    } rounded-lg shadow-xl border`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <Card className="border-0 shadow-none">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className={`text-xl font-bold ${
                                        isDarkMode ? 'text-white' : 'text-gray-900'
                                    }`}>
                                        <Calendar className="w-5 h-5 inline mr-2" />
                                        Flight Calendar
                                    </CardTitle>
                                    <CardDescription className={
                                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                    }>
                                        {flight.departureAirport?.short_form} → {flight.arrivalAirport?.short_form}
                                    </CardDescription>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onClose}
                                    className={`hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                    }`}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {/* Flight Info */}
                            <div className={`p-4 rounded-lg ${
                                isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                            }`}>
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
                                        <Plane className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className={`font-semibold ${
                                            isDarkMode ? 'text-white' : 'text-gray-900'
                                        }`}>
                                            {flight.departureAirport?.short_form} → {flight.arrivalAirport?.short_form}
                                        </h3>
                                        <p className={`text-sm ${
                                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                        }`}>
                                            {flight.departureAirport?.name} to {flight.arrivalAirport?.name}
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-2">
                                        <Clock className={`w-4 h-4 ${
                                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                        }`} />
                                        <span className={`text-sm ${
                                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                        }`}>
                                            {formatTime(flightDate)}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <MapPin className={`w-4 h-4 ${
                                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                        }`} />
                                        <span className={`text-sm ${
                                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                        }`}>
                                            {flightDate.toLocaleDateString('fr-FR', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Calendar Navigation */}
                            <div className="flex items-center justify-between">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentDate(new Date(currentYear, currentMonth - 1))}
                                    className={`${
                                        isDarkMode 
                                            ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    ←
                                </Button>
                                <h2 className={`text-lg font-semibold ${
                                    isDarkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                    {monthNames[currentMonth]} {currentYear}
                                </h2>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentDate(new Date(currentYear, currentMonth + 1))}
                                    className={`${
                                        isDarkMode 
                                            ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    →
                                </Button>
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-1">
                                {/* Week days header */}
                                {weekDays.map((day) => (
                                    <div
                                        key={day}
                                        className={`text-center text-xs font-medium p-2 ${
                                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                        }`}
                                    >
                                        {day}
                                    </div>
                                ))}

                                {/* Calendar days */}
                                {days.map((day, index) => (
                                    <div
                                        key={index}
                                        className={`text-center p-2 text-sm relative ${
                                            day === null
                                                ? 'text-transparent'
                                                : isFlightDay(day!)
                                                ? 'bg-pink-500 text-white rounded-full font-semibold'
                                                : isDarkMode
                                                ? 'text-gray-300 hover:bg-gray-700'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        {day}
                                        {day !== null && isFlightDay(day) && (
                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-600 rounded-full animate-pulse"></div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Flight Day Indicator */}
                            {isFlightDay(flightDate.getDate()) && currentMonth === flightDate.getMonth() && currentYear === flightDate.getFullYear() && (
                                <div className={`p-3 rounded-lg ${
                                    isDarkMode ? 'bg-pink-500/20' : 'bg-pink-50'
                                } border border-pink-200`}>
                                    <p className={`text-sm font-medium ${
                                        isDarkMode ? 'text-pink-300' : 'text-pink-700'
                                    }`}>
                                        ✈️ Flight departs this day at {formatTime(flightDate)}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default FlightCalendarModal; 