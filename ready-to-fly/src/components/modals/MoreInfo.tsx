import { motion, AnimatePresence } from 'framer-motion';
import { IFlightId } from "@/models/flight.model";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ThemeProvider';
import { 
    Plane, 
    MapPin, 
    Clock, 
    Calendar, 
    MessageSquare, 
    X,
    Info
} from 'lucide-react';

export const MoreInfoModal = ({ flight, onClose }: { flight: IFlightId; onClose: () => void }) => {
    const { isDarkMode } = useTheme();

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

    const formatDateUTC = (date: Date | string) => {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        const year = dateObj.getUTCFullYear();
        const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getUTCDate()).padStart(2, '0');
        const hours = String(dateObj.getUTCHours()).padStart(2, '0');
        const minutes = String(dateObj.getUTCMinutes()).padStart(2, '0');
        
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

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
                    transition={{ type: "spring", duration: 0.3 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-2xl"
                >
                    <Card className={`shadow-2xl border-0 ${
                        isDarkMode 
                            ? 'bg-gray-800/95 backdrop-blur-md border-gray-700' 
                            : 'bg-white/95 backdrop-blur-md border-gray-200'
                    }`}>
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
                                        <Info className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className={`text-2xl font-bold ${
                                            isDarkMode ? 'text-white' : 'text-gray-900'
                                        }`}>
                                            Flight Details
                                        </CardTitle>
                                        <CardDescription className={
                                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                        }>
                                            Complete information about your flight
                                        </CardDescription>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onClose}
                                    className={`hover:bg-gray-700/50 ${
                                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                    }`}
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Flight Route */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg p-4"
                            >
                                <h3 className={`text-lg font-semibold mb-3 ${
                                    isDarkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                    <Plane className="w-5 h-5 inline mr-2" />
                                    Route
                                </h3>
                                <div className="flex items-center justify-between">
                                    <div className="text-center flex-1">
                                        <p className={`font-bold text-xl ${
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
                                        <div className="w-12 h-1 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full"></div>
                                        <Plane className="w-5 h-5 text-pink-500 mx-2 transform rotate-45" />
                                    </div>
                                    <div className="text-center flex-1">
                                        <p className={`font-bold text-xl ${
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
                            </motion.div>

                            {/* Flight Details */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                                <div className={`p-4 rounded-lg border ${
                                    isDarkMode 
                                        ? 'bg-gray-700/50 border-gray-600' 
                                        : 'bg-gray-50 border-gray-200'
                                }`}>
                                    <div className="flex items-center mb-2">
                                        <Calendar className={`w-4 h-4 mr-2 ${
                                            isDarkMode ? 'text-pink-400' : 'text-pink-500'
                                        }`} />
                                        <span className={`font-medium ${
                                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                        }`}>
                                            Departure Date
                                        </span>
                                    </div>
                                    <p className={`font-semibold ${
                                        isDarkMode ? 'text-white' : 'text-gray-900'
                                    }`}>
                                        {formatDateUTC(flight.start_date)}
                                    </p>
                                </div>

                                <div className={`p-4 rounded-lg border ${
                                    isDarkMode 
                                        ? 'bg-gray-700/50 border-gray-600' 
                                        : 'bg-gray-50 border-gray-200'
                                }`}>
                                    <div className="flex items-center mb-2">
                                        <Clock className={`w-4 h-4 mr-2 ${
                                            isDarkMode ? 'text-pink-400' : 'text-pink-500'
                                        }`} />
                                        <span className={`font-medium ${
                                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                        }`}>
                                            Duration
                                        </span>
                                    </div>
                                    <p className={`font-semibold ${
                                        isDarkMode ? 'text-white' : 'text-gray-900'
                                    }`}>
                                        {formatDuration(flight.duration)}
                                    </p>
                                </div>
                            </motion.div>

                            {/* Appreciation */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <div className={`p-4 rounded-lg border ${
                                    isDarkMode 
                                        ? 'bg-gray-700/50 border-gray-600' 
                                        : 'bg-gray-50 border-gray-200'
                                }`}>
                                    <div className="flex items-center mb-3">
                                        <MessageSquare className={`w-4 h-4 mr-2 ${
                                            isDarkMode ? 'text-pink-400' : 'text-pink-500'
                                        }`} />
                                        <span className={`font-medium ${
                                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                        }`}>
                                            Appreciation
                                        </span>
                                    </div>
                                    <p className={`${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                    } leading-relaxed`}>
                                        {flight.appreciation || "No appreciation available for this flight."}
                                    </p>
                                </div>
                            </motion.div>

                            {/* Actions */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="flex justify-end pt-4"
                            >
                                <Button
                                    onClick={onClose}
                                    className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white"
                                >
                                    Close
                                </Button>
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
