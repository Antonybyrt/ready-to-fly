import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { FlightService } from '@/services/flight.service';
import { IFlight } from '@/models/flight.model';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { ServiceErrorCode } from '@/services/service.result';
import { ErrorService } from '@/services/error.service';
import { config } from 'dotenv';
config();

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const Dashboard = () => {
  const [flightCount, setFlightCount] = useState<number>(0);
  const [nextFlight, setNextFlight] = useState<IFlight | null>(null);
  const [mostPopularDestination, setMostPopularDestination] = useState<string>('');
  const [monthlyFlightData, setMonthlyFlightData] = useState<any>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear()); // Année sélectionnée

  useEffect(() => {
    console.log('URLLLLLL', process.env.NEXT_PUBLIC_URL)
    const fetchStatistics = async () => {
      const flightCountResult = await FlightService.countFlights();
      const flightsResult = await FlightService.getAllFlights();

      if (flightCountResult.errorCode === ServiceErrorCode.success) {
        setFlightCount(flightCountResult.result?.count ?? 0);
      } else {
        ErrorService.errorMessage('Counting flights', 'error while counting flights');
      }

      if (flightsResult.errorCode === ServiceErrorCode.success) {
        const flights = flightsResult.result as IFlight[];

        const upcomingFlights = flights.filter(flight => new Date(flight.start_date) > new Date());
        if (upcomingFlights.length > 0) {
          const next = upcomingFlights.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())[0];
          setNextFlight(next);
        }

        const destinationCounts: { [key: string]: number } = {};
        flights.forEach(flight => {
          destinationCounts[flight.arrivalAirport?.name + ` (${flight.arrivalAirport?.short_form})`] = (destinationCounts[flight.arrivalAirport?.name as string] || 0) + 1;
        });
        const mostPopularDest = Object.keys(destinationCounts).reduce((a, b) => destinationCounts[a] > destinationCounts[b] ? a : b, '');
        setMostPopularDestination(mostPopularDest);

        const monthlyData = new Array(12).fill(0);
        flights.forEach(flight => {
          const flightDate = new Date(flight.start_date);
          if (flightDate.getFullYear() === selectedYear) {
            const month = flightDate.getMonth();
            monthlyData[month]++;
          }
        });
        
        setMonthlyFlightData({
          labels: Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('default', { month: 'short' })),
          datasets: [{
            label: `Flight(s) in ${selectedYear}`,
            data: monthlyData,
            fill: false,
            borderColor: '#4CAF50',
            tension: 0.1,
          }]
        });
      } else {
        ErrorService.errorMessage('Fetching flights', 'error while fetching flights');
      }
    };

    fetchStatistics();
  }, [selectedYear]);

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-500 p-4 rounded shadow">
          <h2 className="text-lg font-bold">Total Flights</h2>
          <div className="bg-green-500 text-white p-4 rounded text-center">
            <p className="text-xl">{flightCount}</p>
          </div>
        </div>
        <div className="bg-blue-500 p-4 rounded shadow">
          <h2 className="text-lg font-bold">Next Flight</h2>
          <div className="bg-blue-500 text-white p-4 rounded text-center">
            {nextFlight ? (
              <p className="text-xl">{nextFlight.arrivalAirport?.name} ({nextFlight.arrivalAirport?.short_form}) at {new Date(nextFlight.start_date).toLocaleString()}</p>
            ) : (
              <p className="text-xl">No upcoming flights</p>
            )}
          </div>
        </div>
        <div className="bg-orange-500 p-4 rounded shadow">
          <h2 className="text-lg font-bold">Most Popular Destination</h2>
          <div className="bg-orange-500 text-white p-4 rounded text-center">
            <p className="text-xl">{mostPopularDestination}</p>
          </div>
        </div>
      </div>

      <br />

      <h2 className="text-lg font-bold">Monthly Flights</h2>

      {monthlyFlightData && (
        <div>
          <Line
            data={monthlyFlightData} 
            options={{
              maintainAspectRatio: false,
              elements: {
                line: {
                  borderWidth: 2,
                  borderColor: '#4CAF50',
                  tension: 0.4,
                },
                point: {
                  radius: 4,
                  backgroundColor: '#4CAF50',
                  borderColor: '#ffffff',
                  borderWidth: 2,
                },
              },
              plugins: {
                legend: {
                  display: true,
                  position: 'top',
                },
                tooltip: {
                  enabled: true, 
                },
              },
            }} 
          />
        </div>
      )}
      <br></br>
      <div className="mb-4">
        {/* Sélecteur d'année */}
        <select
          id="yearSelect"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="p-2 border rounded text-black"
        >
          {/* Créez une plage d'années pour le sélecteur */}
          {Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() -1) + i).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Dashboard;
