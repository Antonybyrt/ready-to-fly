import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { FlightService } from '@/services/flight.service';
import { AirportService } from '@/services/airport.service';
import { ErrorService } from '@/services/error.service';
import { ServiceErrorCode } from '@/services/service.result';
import { IAirportId } from '@/models/airport.model';
import AddAirport from '@/components/modals/AddAirport';
import RemoveAirportModal from '@/components/modals/RemoveAirport';
import ReturnFlightModal from '@/components/modals/ReturnFlight';
import { CalendarPromptModal } from '@/components/modals/CalendarPrompt';
import auth from '@/services/auth.service';
import { IUser } from '@/models/user.model';
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
  Plus, 
  Trash2, 
  RotateCcw,
  Users
} from 'lucide-react';

const NewFlight = () => {
    const [airports, setAirports] = useState<IAirportId[]>([]);
    const [departureId, setDepartureId] = useState('');
    const [arrivalId, setArrivalId] = useState('');
    const [duration, setDuration] = useState('');
    const [startDate, setStartDate] = useState('');
    const [appreciation, setAppreciation] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [newAirportName, setNewAirportName] = useState('');
    const [newAirportShortForm, setNewAirportShortForm] = useState('');
    const [airportToDelete, setAirportToDelete] = useState('');
    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showCalendarPrompt, setShowCalendarPrompt] = useState(false);
    const [createdFlight, setCreatedFlight] = useState<any>(null);
    const router = useRouter();
    const [user, setUser] = useState<IUser | null>(); 
    const { isDarkMode } = useTheme();
    
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
        const fetchAirports = async () => {
            if (!user) return;
            const result = await AirportService.getAllAirports();
            if (result.errorCode === ServiceErrorCode.success && result.result) {
                setAirports(result.result);
            } else {
                ErrorService.errorMessage('Failed to load airports', '');
            }
        };
        fetchAirports();
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
    
        const startDateTime = new Date(startDate);
        
        const durationValue = parseFloat(duration);
        if (isNaN(durationValue)) {
            ErrorService.errorMessage('Invalid duration format', 'Please use format HH.MM (ex: 1.50 for 1h50)');
            setIsLoading(false);
            return;
        }

        const endDate = new Date(startDateTime);
        const hours = Math.floor(durationValue);
        const minutes = Math.round((durationValue - hours) * 100);
        endDate.setTime(startDateTime.getTime() + (hours * 60 + minutes) * 60 * 1000);
    
        const flightData = {
            departure_id: Number(departureId),
            arrival_id: Number(arrivalId),
            duration: durationValue,
            start_date: startDateTime,
            end_date: endDate,
            appreciation,
        };
    
        try {
            const result = await FlightService.createFlight(flightData);
            if (result.errorCode === ServiceErrorCode.success) {
                ErrorService.successMessage('Flight created!', '');
                
                const departureAirport = airports.find(a => a.id === Number(departureId));
                const arrivalAirport = airports.find(a => a.id === Number(arrivalId));
                
                setCreatedFlight({
                    ...flightData,
                    departureAirport,
                    arrivalAirport
                });
                setShowCalendarPrompt(true);
            }
        } catch (err) {
            ErrorService.errorMessage('Creation failed', '' + err);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleAddAirport = async (e: React.FormEvent) => {
        e.preventDefault();
        const airportData = {
            name: newAirportName,
            short_form: newAirportShortForm,
        };

        try {
            const result = await AirportService.createAirport(airportData);
            if (result.errorCode === ServiceErrorCode.success) {
                setAirports((prev) => [...prev, result.result as IAirportId]);
                ErrorService.successMessage('Airport added!', '');
                setIsAddModalOpen(false);
                setNewAirportName('');
                setNewAirportShortForm('');
            }
        } catch (err) {
            ErrorService.errorMessage('Failed to add airport', '' + err);
        }
    };

    const handleDeleteAirport = async (e: React.FormEvent) => {
        e.preventDefault();

        const isConfirmed = await ErrorService.confirmDelete();
        if (!isConfirmed) {
            return;
        }
        
        try {
            const result = await AirportService.deleteFlight(parseInt(airportToDelete));
            if (result.errorCode === ServiceErrorCode.success) {
                setAirports((prev) => prev.filter((airport) => airport.id !== parseInt(airportToDelete)));
                ErrorService.successMessage('Airport deleted!', '');
                setIsDeleteModalOpen(false);
                setAirportToDelete('');
            }
        } catch (err) {
            ErrorService.errorMessage('Failed to delete airport', '' + err);
        }
    };

    const handleReturnFlightSubmit = async (flightData: any) => {
        const startDateTime = new Date(flightData.start_date);
        
        const durationValue = parseFloat(flightData.duration);
        if (isNaN(durationValue)) {
            ErrorService.errorMessage('Invalid duration format', 'Please use format HH.MM (ex: 1.50 for 1h50)');
            return;
        }

        const endDate = new Date(startDateTime);
        const hours = Math.floor(durationValue);
        const minutes = Math.round((durationValue - hours) * 100);
        endDate.setTime(startDateTime.getTime() + (hours * 60 + minutes) * 60 * 1000);

        flightData.end_date = endDate;
        flightData.duration = durationValue;
        
        try {
            const result = await FlightService.createFlight(flightData);
            if (result.errorCode === ServiceErrorCode.success) {
                ErrorService.successMessage('Return flight created!', '');
                setIsReturnModalOpen(false);
            }
        } catch (err) {
            ErrorService.errorMessage('Failed to create return flight', '' + err);
        }
    };

    const addToGoogleCalendar = (flight: any, departureAirport: any, arrivalAirport: any) => {
        const startDate = new Date(flight.start_date);
        const endDate = new Date(flight.end_date);
        
        const formatDateForGoogle = (date: Date) => {
            return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };
        
        const title = encodeURIComponent(`Flight: ${departureAirport?.short_form} → ${arrivalAirport?.short_form}`);
        const description = encodeURIComponent(`Flight from ${departureAirport?.name} to ${arrivalAirport?.name}\nDuration: ${formatDuration(flight.duration)}`);
        const location = encodeURIComponent(`${departureAirport?.name} → ${arrivalAirport?.name}`);
        const startTime = formatDateForGoogle(startDate);
        const endTime = formatDateForGoogle(endDate);
        
        const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${description}&location=${location}&dates=${startTime}/${endTime}`;
        
        window.open(googleCalendarUrl, '_blank');
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
                            className="mb-8 text-center"
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
                            <h1 className={`text-4xl font-bold mb-2 ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                                Ready to Take Off! 🛫
                            </h1>
                            <p className={`text-lg ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                                Create a new flight and explore new horizons
                            </p>
                        </motion.div>

                        {/* Form Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="max-w-2xl mx-auto"
                        >
                            <Card className={`shadow-lg border-0 ${
                                isDarkMode 
                                    ? 'bg-gray-800/50 backdrop-blur-sm border-gray-700' 
                                    : 'bg-white/80 backdrop-blur-sm border-gray-200'
                            }`}>
                                <CardHeader>
                                    <CardTitle className={`text-2xl font-bold ${
                                        isDarkMode ? 'text-white' : 'text-gray-900'
                                    }`}>
                                        Flight Details
                                    </CardTitle>
                                    <CardDescription className={
                                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                    }>
                                        Fill in the information to create your new flight
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Departure Airport */}
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 }}
                                        >
                                            <label htmlFor="departureId" className={`block text-sm font-medium mb-2 ${
                                                isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                            }`}>
                                                <MapPin className="w-4 h-4 inline mr-2" />
                                                Departure Airport
                                            </label>
                                            <select
                                                id="departureId"
                                                value={departureId}
                                                onChange={(e) => setDepartureId(e.target.value)}
                                                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors ${
                                                    isDarkMode 
                                                        ? 'bg-gray-700 border-gray-600 text-white' 
                                                        : 'bg-white border-gray-300 text-gray-900'
                                                }`}
                                                required
                                            >
                                                <option value="">Select an airport</option>
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
                                            transition={{ delay: 0.5 }}
                                        >
                                            <label htmlFor="arrivalId" className={`block text-sm font-medium mb-2 ${
                                                isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                            }`}>
                                                <MapPin className="w-4 h-4 inline mr-2" />
                                                Arrival Airport
                                            </label>
                                            <select
                                                id="arrivalId"
                                                value={arrivalId}
                                                onChange={(e) => setArrivalId(e.target.value)}
                                                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors ${
                                                    isDarkMode 
                                                        ? 'bg-gray-700 border-gray-600 text-white' 
                                                        : 'bg-white border-gray-300 text-gray-900'
                                                }`}
                                                required
                                            >
                                                <option value="">Select an airport</option>
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
                                            transition={{ delay: 0.6 }}
                                        >
                                            <label htmlFor="duration" className={`block text-sm font-medium mb-2 ${
                                                isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                            }`}>
                                                <Clock className="w-4 h-4 inline mr-2" />
                                                Duration (HH.MM)
                                            </label>
                                            <Input
                                                type="text"
                                                id="duration"
                                                value={duration}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (/^\d*\.?\d*$/.test(value) || value === '') {
                                                        setDuration(value);
                                                    }
                                                }}
                                                className={`${
                                                    isDarkMode 
                                                        ? 'bg-gray-700 border-gray-600 text-white' 
                                                        : 'bg-white border-gray-300 text-gray-900'
                                                }`}
                                                placeholder="1.50 (1h50)"
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
                                            transition={{ delay: 0.7 }}
                                        >
                                            <label htmlFor="startDate" className={`block text-sm font-medium mb-2 ${
                                                isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                            }`}>
                                                <Calendar className="w-4 h-4 inline mr-2" />
                                                Departure Date and Time
                                            </label>
                                            <Input
                                                type="datetime-local"
                                                id="startDate"
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
                                            transition={{ delay: 0.8 }}
                                        >
                                            <label htmlFor="appreciation" className={`block text-sm font-medium mb-2 ${
                                                isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                            }`}>
                                                <MessageSquare className="w-4 h-4 inline mr-2" />
                                                Appreciation
                                            </label>
                                            <textarea
                                                id="appreciation"
                                                value={appreciation}
                                                onChange={(e) => setAppreciation(e.target.value)}
                                                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors resize-none ${
                                                    isDarkMode 
                                                        ? 'bg-gray-700 border-gray-600 text-white' 
                                                        : 'bg-white border-gray-300 text-gray-900'
                                                }`}
                                                rows={4}
                                                placeholder="Enter your detailed appreciation here..."
                                            />
                                        </motion.div>

                                        {/* Submit Button */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.9 }}
                                        >
                                            <Button
                                                type="submit"
                                                className="w-full bg-gradient-to-r from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700 text-white font-medium py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                                                disabled={isLoading}
                                            >
                                                {isLoading ? (
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                                                    />
                                                ) : (
                                                    <>
                                                        <Plane className="w-4 h-4 mr-2" />
                                                        Create Flight
                                                    </>
                                                )}
                                            </Button>
                                        </motion.div>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                            className="max-w-2xl mx-auto mt-6 flex flex-wrap gap-3 justify-center"
                        >
                            <Button
                                variant="outline"
                                onClick={() => setIsAddModalOpen(true)}
                                className={`${
                                    isDarkMode 
                                        ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
                                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                } transition-colors`}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Airport
                            </Button>
                            
                            <Button
                                variant="outline"
                                onClick={() => setIsDeleteModalOpen(true)}
                                className={`${
                                    isDarkMode 
                                        ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
                                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                } transition-colors`}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Remove Airport
                            </Button>
                            
                            <Button
                                variant="outline"
                                onClick={() => setIsReturnModalOpen(true)}
                                className={`${
                                    isDarkMode 
                                        ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
                                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                                } transition-colors`}
                            >
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Return Flight
                            </Button>
                        </motion.div>

                        {/* Modals */}
                        {isReturnModalOpen && (
                            <ReturnFlightModal
                                departureId={departureId}
                                arrivalId={arrivalId}
                                firstStartDate={startDate}
                                airports={airports}
                                onClose={() => setIsReturnModalOpen(false)}
                                onSubmit={handleReturnFlightSubmit}
                            />
                        )}

                        {isAddModalOpen && (
                            <AddAirport
                                newAirportName={newAirportName}
                                newAirportShortForm={newAirportShortForm}
                                setNewAirportName={setNewAirportName}
                                setNewAirportShortForm={setNewAirportShortForm}
                                handleAddAirport={handleAddAirport}
                                closeModal={() => setIsAddModalOpen(false)}
                            />
                        )}

                        {isDeleteModalOpen && (
                            <RemoveAirportModal
                                airports={airports}
                                airportToDelete={airportToDelete}
                                setAirportToDelete={setAirportToDelete}
                                handleDeleteAirport={handleDeleteAirport}
                                closeModal={() => setIsDeleteModalOpen(false)}
                            />
                        )}

                        {/* Calendar Prompt Modal */}
                        {showCalendarPrompt && createdFlight && (
                            <CalendarPromptModal
                                flight={createdFlight}
                                onClose={() => setShowCalendarPrompt(false)}
                                onAddToCalendar={() => {
                                    addToGoogleCalendar(
                                        createdFlight,
                                        createdFlight.departureAirport,
                                        createdFlight.arrivalAirport
                                    );
                                    setShowCalendarPrompt(false);
                                    router.push('/dashboard');
                                }}
                                onSkip={() => {
                                    setShowCalendarPrompt(false);
                                    router.push('/dashboard');
                                }}
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

export default NewFlight;