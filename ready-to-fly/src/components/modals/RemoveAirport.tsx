import { RemoveAirportModalProps } from '@/interfaces/RemoveAirportModalProps';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ThemeProvider';
import { 
    Plane, 
    Trash2, 
    AlertTriangle, 
    X,
    RotateCcw
} from 'lucide-react';

const RemoveAirportModal: React.FC<RemoveAirportModalProps> = ({
    airports,
    airportToDelete,
    setAirportToDelete,
    handleDeleteAirport,
    closeModal
}) => {
    const { isDarkMode } = useTheme();

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
                onClick={closeModal}
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
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center">
                                        <Trash2 className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className={`text-2xl font-bold ${
                                            isDarkMode ? 'text-white' : 'text-gray-900'
                                        }`}>
                                            Remove Airport
                                        </CardTitle>
                                        <CardDescription className={
                                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                        }>
                                            Remove an airport from the database
                                        </CardDescription>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={closeModal}
                                    className={`hover:bg-gray-700/50 ${
                                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                    }`}
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleDeleteAirport} className="space-y-6">
                                {/* Warning */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className={`p-4 rounded-lg border ${
                                        isDarkMode 
                                            ? 'bg-red-500/10 border-red-500/20' 
                                            : 'bg-red-50 border-red-200'
                                    }`}
                                >
                                    <div className="flex items-center">
                                        <AlertTriangle className={`w-5 h-5 mr-2 ${
                                            isDarkMode ? 'text-red-400' : 'text-red-500'
                                        }`} />
                                        <span className={`font-medium ${
                                            isDarkMode ? 'text-red-300' : 'text-red-700'
                                        }`}>
                                            Warning
                                        </span>
                                    </div>
                                    <p className={`text-sm mt-2 ${
                                        isDarkMode ? 'text-red-200' : 'text-red-600'
                                    }`}>
                                        This action is irreversible. All flights associated with this airport will also be deleted.
                                    </p>
                                </motion.div>

                                {/* Airport Selection */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <label className={`block text-sm font-medium mb-2 ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                        <Plane className="w-4 h-4 inline mr-2" />
                                        Select an airport to remove
                                    </label>
                                    <select
                                        value={airportToDelete}
                                        onChange={(e) => setAirportToDelete(e.target.value)}
                                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
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

                                {/* Actions */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="flex justify-end space-x-3 pt-4"
                                >
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={closeModal}
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
                                        variant="destructive"
                                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Remove
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

export default RemoveAirportModal;
