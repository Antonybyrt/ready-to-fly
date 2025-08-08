import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IFlightId } from '@/models/flight.model';
import { FlightService } from '@/services/flight.service';
import { AirportService } from '@/services/airport.service';
import { ErrorService } from '@/services/error.service';
import { ServiceErrorCode } from '@/services/service.result';
import { EditFlightModalProps } from '@/interfaces/EditFlightModalProps';
import { IAirportId, IAirport } from '@/models/airport.model';
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
    RotateCcw
} from 'lucide-react';

const EditFlightModal: React.FC<EditFlightModalProps> = ({ flight, onClose, onUpdate }) => {
    const [airports, setAirports] = useState<IAirport[]>([]);
    const [departureId, setDepartureId] = useState(flight.departure_id || '');
    const [arrivalId, setArrivalId] = useState(flight.arrival_id || '');
    const [duration, setDuration] = useState(() => {
        // Convertir la durée en heures décimales vers le format HH.MM
        const durationValue = flight.duration;
        const hours = Math.floor(durationValue);
        const minutes = Math.round((durationValue - hours) * 60);
        return `${hours}.${minutes.toString().padStart(2, '0')}`;
    });
    const [startDate, setStartDate] = useState(new Date(flight.start_date).toISOString().slice(0, 16));
    const [appreciation, setAppreciation] = useState(flight.appreciation);
    const [isLoading, setIsLoading] = useState(false);
    const { isDarkMode } = useTheme();

    useEffect(() => {
        const fetchAirports = async () => {
            try {
                const result = await AirportService.getAllAirports();
                if (result.errorCode === ServiceErrorCode.success) {
                    setAirports(result.result as IAirportId[]);
                } else {
                    ErrorService.errorMessage('Fetching airports', 'Error while fetching airports');
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchAirports();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const startDateTime = new Date(startDate);

        // Convertir la durée du format HH.MM en heures décimales
        const durationValue = parseFloat(duration);
        if (isNaN(durationValue)) {
            ErrorService.errorMessage('Invalid duration format', 'Please use format HH.MM (ex: 1.50 for 1h50)');
            setIsLoading(false);
            return;
        }
    
        // Calculer la date de fin en ajoutant la durée
        const endDate = new Date(startDateTime);
        const hours = Math.floor(durationValue);
        const minutes = Math.round((durationValue - hours) * 60);
        endDate.setHours(startDateTime.getHours() + hours);
        endDate.setMinutes(startDateTime.getMinutes() + minutes);

        const updatedFlightData = {
            ...flight,
            departure_id: Number(departureId),
            arrival_id: Number(arrivalId),
            duration: durationValue, // Stocker directement en heures décimales
            start_date: startDateTime,
            end_date: endDate,
            appreciation,
        };

        try {
            const result = await FlightService.updateFlight(flight.id, updatedFlightData);
            if (result.errorCode === ServiceErrorCode.success) {
                ErrorService.successMessage('Flight updated successfully!', '');
                onUpdate(result.result as IFlightId);
            }
            else {
                ErrorService.errorMessage('Failed to update flight', 'Message too long')
            }
        } catch (err) {
            ErrorService.errorMessage('Failed to update flight', '' + err);
        } finally {
            setIsLoading(false);
        }
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
                                        <Plane className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className={`text-2xl font-bold ${
                                            isDarkMode ? 'text-white' : 'text-gray-900'
                                        }`}>
                                            Edit Flight
                                        </CardTitle>
                                        <CardDescription className={
                                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                        }>
                                            Update your flight details
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
                                        value={departureId}
                                        onChange={(e) => setDepartureId(e.target.value)}
                                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors ${
                                            isDarkMode 
                                                ? 'bg-gray-700 border-gray-600 text-white' 
                                                : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                        required
                                    >
                                        <option value="" disabled>Select a departure airport</option>
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
                                        value={arrivalId}
                                        onChange={(e) => setArrivalId(e.target.value)}
                                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors ${
                                            isDarkMode 
                                                ? 'bg-gray-700 border-gray-600 text-white' 
                                                : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                        required
                                    >
                                        <option value="" disabled>Select an arrival airport</option>
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
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            // Permettre seulement les chiffres et le point
                                            if (/^\d*\.?\d*$/.test(value) || value === '') {
                                                setDuration(value);
                                            }
                                        }}
                                        placeholder="1.50 (1h50)"
                                        className={`${
                                            isDarkMode 
                                                ? 'bg-gray-700 border-gray-600 text-white' 
                                                : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                        required
                                    />
                                    <p className={`text-xs mt-1 ${
                                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                    }`}>
                                        Format: HH.MM (ex: 1.50 = 1h50, 2.30 = 2h30)
                                    </p>
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
                                        {isLoading ? 'Saving...' : 'Save'}
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

export default EditFlightModal;