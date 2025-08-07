import { IAirportId } from '@/models/airport.model';
import { ErrorService } from '@/services/error.service';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/components/ThemeProvider';
import { 
    Plane, 
    MapPin, 
    Clock, 
    Calendar, 
    MessageSquare, 
    X,
    Save,
    RotateCcw,
    ArrowLeftRight
} from 'lucide-react';

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
    const [returnDepartureId, setReturnDepartureId] = useState(arrivalId);
    const [returnArrivalId, setReturnArrivalId] = useState(departureId);
    const [duration, setDuration] = useState('');
    const [startDate, setStartDate] = useState('');
    const [appreciation, setAppreciation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { isDarkMode } = useTheme();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (new Date(startDate) <= new Date(firstStartDate)) {
            ErrorService.errorMessage('Flight return', 'Your return flight must be later than your first flight !')
            setIsLoading(false);
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
        setIsLoading(false);
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
                                        <ArrowLeftRight className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className={`text-2xl font-bold ${
                                            isDarkMode ? 'text-white' : 'text-gray-900'
                                        }`}>
                                            Create Return Flight
                                        </CardTitle>
                                        <CardDescription className={
                                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                        }>
                                            Automatically create a return flight
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
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Departure Airport */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <label className={`block text-sm font-medium mb-2 ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                        <MapPin className="w-4 h-4 inline mr-2" />
                                        Departure Airport
                                    </label>
                                    <select
                                        value={returnDepartureId}
                                        onChange={(e) => setReturnDepartureId(e.target.value)}
                                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors ${
                                            isDarkMode 
                                                ? 'bg-gray-700 border-gray-600 text-white' 
                                                : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                        required
                                    >
                                        {airports.map((airport) => (
                                            <option key={airport.id} value={airport.id}>
                                                {airport.name} ({airport.short_form})
                                            </option>
                                        ))}
                                    </select>
                                </motion.div>

                                {/* Arrival Airport */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <label className={`block text-sm font-medium mb-2 ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                        <MapPin className="w-4 h-4 inline mr-2" />
                                        Arrival Airport
                                    </label>
                                    <select
                                        value={returnArrivalId}
                                        onChange={(e) => setReturnArrivalId(e.target.value)}
                                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors ${
                                            isDarkMode 
                                                ? 'bg-gray-700 border-gray-600 text-white' 
                                                : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                        required
                                    >
                                        {airports.map((airport) => (
                                            <option key={airport.id} value={airport.id}>
                                                {airport.name} ({airport.short_form})
                                            </option>
                                        ))}
                                    </select>
                                </motion.div>

                                {/* Duration */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <label className={`block text-sm font-medium mb-2 ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                        <Clock className="w-4 h-4 inline mr-2" />
                                        Duration (HH.MM)
                                    </label>
                                    <Input
                                        type="text"
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        placeholder="00.00"
                                        className={`${
                                            isDarkMode 
                                                ? 'bg-gray-700 border-gray-600 text-white' 
                                                : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                        required
                                    />
                                </motion.div>

                                {/* Start Date and Time */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <label className={`block text-sm font-medium mb-2 ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                        <Calendar className="w-4 h-4 inline mr-2" />
                                        Departure Date and Time
                                    </label>
                                    <Input
                                        type="datetime-local"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className={`${
                                            isDarkMode 
                                                ? 'bg-gray-700 border-gray-600 text-white' 
                                                : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                        required
                                    />
                                </motion.div>

                                {/* Appreciation */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <label className={`block text-sm font-medium mb-2 ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                        <MessageSquare className="w-4 h-4 inline mr-2" />
                                        Appreciation
                                    </label>
                                    <textarea
                                        value={appreciation}
                                        rows={4}
                                        onChange={(e) => setAppreciation(e.target.value)}
                                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors resize-none ${
                                            isDarkMode 
                                                ? 'bg-gray-700 border-gray-600 text-white' 
                                                : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                        placeholder="Enter your detailed appreciation here..."
                                    />
                                </motion.div>

                                {/* Actions */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="flex justify-end space-x-3 pt-4"
                                >
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={onClose}
                                        className={`${
                                            isDarkMode 
                                                ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <RotateCcw className="w-4 h-4 mr-2" />
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white"
                                    >
                                        {isLoading ? (
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                                            />
                                        ) : (
                                            <Save className="w-4 h-4 mr-2" />
                                        )}
                                        {isLoading ? 'Creating...' : 'Create Return Flight'}
                                    </Button>
                                </motion.div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ReturnFlightModal;
