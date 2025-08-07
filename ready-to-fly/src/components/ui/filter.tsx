import { motion, AnimatePresence } from 'framer-motion';
import { Filter as FilterIcon, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from './button';
import { Badge } from './badge';
import { cn } from '@/lib/utils';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterProps {
  options: FilterOption[];
  selectedValues: string[];
  onFilterChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
  multiple?: boolean;
}

export function Filter({ 
  options, 
  selectedValues, 
  onFilterChange, 
  placeholder = "Filtrer...",
  className,
  multiple = true 
}: FilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (value: string) => {
    if (multiple) {
      const newValues = selectedValues.includes(value)
        ? selectedValues.filter(v => v !== value)
        : [...selectedValues, value];
      onFilterChange(newValues);
    } else {
      onFilterChange([value]);
      setIsOpen(false);
    }
  };

  const clearFilters = () => {
    onFilterChange([]);
  };

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center space-x-2",
          selectedValues.length > 0 && "bg-pink-50 border-pink-200 text-pink-700"
        )}
      >
        <FilterIcon className="w-4 h-4" />
        <span>{placeholder}</span>
        {selectedValues.length > 0 && (
          <Badge variant="secondary" className="ml-2">
            {selectedValues.length}
          </Badge>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-900">Filtres</h3>
                {selectedValues.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Effacer
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                {options.map((option) => (
                  <motion.div
                    key={option.value}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <button
                      onClick={() => handleOptionClick(option.value)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                        selectedValues.includes(option.value)
                          ? "bg-pink-100 text-pink-700"
                          : "hover:bg-gray-50 text-gray-700"
                      )}
                    >
                      {option.label}
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected filters display */}
      {selectedValues.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2 mt-2"
        >
          {selectedValues.map((value) => {
            const option = options.find(opt => opt.value === value);
            return (
              <Badge
                key={value}
                variant="secondary"
                className="bg-pink-100 text-pink-700 hover:bg-pink-200"
              >
                {option?.label}
                <button
                  onClick={() => handleOptionClick(value)}
                  className="ml-1 hover:text-pink-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            );
          })}
        </motion.div>
      )}
    </div>
  );
} 