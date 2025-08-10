import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';
import { IFlight } from '@/models/flight.model';
import { useTheme } from '@/components/ThemeProvider';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface DestinationsPieChartProps {
  flights: IFlight[];
}

const DestinationsPieChart: React.FC<DestinationsPieChartProps> = ({ flights }) => {
  const { isDarkMode } = useTheme();

  const processDestinationsData = () => {
    const destinationCounts = new Map<string, number>();
    
    flights.forEach(flight => {
      if (flight.arrivalAirport?.name) {
        const destination = flight.arrivalAirport.name;
        destinationCounts.set(destination, (destinationCounts.get(destination) || 0) + 1);
      }
    });

    const sortedDestinations = Array.from(destinationCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    if (sortedDestinations.length < destinationCounts.size) {
      const otherCount = Array.from(destinationCounts.values())
        .slice(5)
        .reduce((sum, count) => sum + count, 0);
      
      if (otherCount > 0) {
        sortedDestinations.push(['Autres', otherCount]);
      }
    }

    return sortedDestinations;
  };

  const destinationsData = processDestinationsData();

  const colors = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
    '#FFEAA7',
    '#DDA0DD',
  ];

  const chartData = {
    labels: destinationsData.map(([destination]) => destination),
    datasets: [
      {
        data: destinationsData.map(([, count]) => count),
        backgroundColor: colors.slice(0, destinationsData.length),
        borderColor: isDarkMode ? '#374151' : '#ffffff',
        borderWidth: 2,
        hoverBorderColor: isDarkMode ? '#6B7280' : '#E5E7EB',
        hoverBorderWidth: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: isDarkMode ? '#D1D5DB' : '#374151',
          font: {
            size: 12,
          },
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: isDarkMode ? '#1F2937' : '#ffffff',
        titleColor: isDarkMode ? '#F9FAFB' : '#111827',
        bodyColor: isDarkMode ? '#D1D5DB' : '#374151',
        borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} vol${value > 1 ? 's' : ''} (${percentage}%)`;
          },
        },
      },
      title: {
        display: true,
        text: 'Top Destinations',
        color: isDarkMode ? '#F9FAFB' : '#111827',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
    },
  };

  if (destinationsData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>Aucune destination disponible</p>
      </div>
    );
  }

  return (
    <div className="h-80 w-full">
      <Pie data={chartData} options={chartOptions} />
    </div>
  );
};

export default DestinationsPieChart; 