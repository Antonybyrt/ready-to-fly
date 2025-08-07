import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AddAirportModalProps } from '@/interfaces/AddAirportModalProps';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/components/ThemeProvider';
import { 
    Plane, 
    MapPin, 
    Building2, 
    Hash, 
    X,
    Plus,
    RotateCcw
} from 'lucide-react';

const AddAirportModal: React.FC<AddAirportModalProps> = ({
    newAirportName,
    newAirportShortForm,
    setNewAirportName,
    setNewAirportShortForm,
    handleAddAirport,
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
                                    <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
                                        <Plane className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className={`text-2xl font-bold ${
                                            isDarkMode ? 'text-white' : 'text-gray-900'
                                        }`}>
                                            Add Airport
                                        </CardTitle>
                                        <CardDescription className={
                                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                        }>
                                            Create a new airport in the database
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
                            <form onSubmit={handleAddAirport} className="space-y-6">
                                {/* Airport Name */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <label className={`block text-sm font-medium mb-2 ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                        <Building2 className="w-4 h-4 inline mr-2" />
                                        Airport Name
                                    </label>
                                    <Input
                                        type="text"
                                        value={newAirportName}
                                        onChange={(e) => setNewAirportName(e.target.value)}
                                        placeholder="Ex: Aéroport Charles de Gaulle"
                                        className={`${
                                            isDarkMode 
                                                ? 'bg-gray-700 border-gray-600 text-white' 
                                                : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                        required
                                    />
                                </motion.div>

                                {/* Short Form */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <label className={`block text-sm font-medium mb-2 ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                        <Hash className="w-4 h-4 inline mr-2" />
                                        IATA Code
                                    </label>
                                    <Input
                                        type="text"
                                        value={newAirportShortForm}
                                        onChange={(e) => setNewAirportShortForm(e.target.value)}
                                        placeholder="Ex: CDG"
                                        maxLength={3}
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
                                        3-letter IATA code (e.g., CDG, JFK, LHR)
                                    </p>
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
                                        className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add
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

export default AddAirportModal;
