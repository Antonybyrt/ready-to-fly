import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ThemeProvider';
import { CalendarDays } from 'lucide-react';

interface CalendarPromptProps {
    flight: any;
    onClose: () => void;
    onAddToCalendar: () => void;
    onSkip: () => void;
}

export const CalendarPromptModal = ({ flight, onClose, onAddToCalendar, onSkip }: CalendarPromptProps) => {
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

    return (
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
                className="w-full max-w-md"
            >
                <Card className={`shadow-2xl border-0 ${
                    isDarkMode 
                        ? 'bg-gray-800/95 backdrop-blur-md border-gray-700' 
                        : 'bg-white/95 backdrop-blur-md border-gray-200'
                }`}>
                    <CardHeader className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CalendarDays className="w-6 h-6 text-white" />
                        </div>
                        <CardTitle className={`text-xl font-bold ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                            Add to Google Calendar?
                        </CardTitle>
                        <CardDescription className={
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }>
                            Would you like to add this flight to your Google Calendar? This will open Google Calendar in a new tab with the event pre-filled.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className={`p-3 rounded-lg border ${
                            isDarkMode 
                                ? 'bg-gray-700/50 border-gray-600' 
                                : 'bg-gray-50 border-gray-200'
                        }`}>
                            <p className={`text-sm font-medium ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                Flight Details:
                            </p>
                            <p className={`font-semibold ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                                {flight.departureAirport?.short_form} → {flight.arrivalAirport?.short_form}
                            </p>
                            <p className={`text-sm ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                                {new Date(flight.start_date).toLocaleDateString()} at {new Date(flight.start_date).toLocaleTimeString()}
                            </p>
                            <p className={`text-sm ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                                Duration: {formatDuration(flight.duration)}
                            </p>
                        </div>
                        
                        <div className="flex space-x-3">
                            <Button
                                variant="outline"
                                onClick={onSkip}
                                className="flex-1"
                            >
                                Skip
                            </Button>
                            <Button
                                onClick={onAddToCalendar}
                                className="flex-1 bg-gradient-to-r from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700 text-white"
                            >
                                <CalendarDays className="w-4 h-4 mr-2" />
                                Add to Calendar
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
};
