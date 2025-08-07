import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
import { useRouter } from 'next/router';
import auth from '@/services/auth.service';
import { IUser } from '@/models/user.model';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plane, Clock, MapPin, TrendingUp, Calendar, Users, Zap } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

config();

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const Dashboard = () => {
  const [flightCount, setFlightCount] = useState<number>(0);
  const [nextFlight, setNextFlight] = useState<IFlight | null>(null);
  const [mostPopularDestination, setMostPopularDestination] = useState<string>('');
  const [monthlyFlightData, setMonthlyFlightData] = useState<any>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [totalHoursInAir, setTotalHoursInAir] = useState<number>(0);
  const [user, setUser] = useState<IUser | null>(); 
  const { isDarkMode } = useTheme();
  const router = useRouter();

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
    const fetchStatistics = async () => {
      if (!user) return;
      
      const flightCountResult = await FlightService.countFlights(user?.id as number);
      const flightsResult = await FlightService.getFlightsByUser(user?.id as number);

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
          const arrivalAirport = flight.arrivalAirport;
          if (arrivalAirport?.short_form !== 'ORY') {
            const destinationKey = `${arrivalAirport?.name} (${arrivalAirport?.short_form})`;
            destinationCounts[destinationKey] = (destinationCounts[destinationKey] || 0) + 1;
          }
        });

        const mostPopularDest = Object.keys(destinationCounts).reduce((a, b) => 
          destinationCounts[a] > destinationCounts[b] ? a : b, 
          ''
        );
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
            label: `Vols en ${selectedYear}`,
            data: monthlyData,
            fill: false,
            borderColor: '#ec4899',
            backgroundColor: 'rgba(236, 72, 153, 0.1)',
            tension: 0.4,
            pointBackgroundColor: '#ec4899',
            pointBorderColor: isDarkMode ? '#1f2937' : '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 6,
          }]
        });

        const totalHours = flights.reduce((acc, flight) => acc + flight.duration, 0);
        setTotalHoursInAir(totalHours);
      } else {
        ErrorService.errorMessage('Fetching flights', 'error while fetching flights');
      }
    };

    fetchStatistics();
  }, [selectedYear, user, isDarkMode]);

  const statsCards = [
    {
      title: "Total Flights",
      value: flightCount,
      description: "Your flight count",
      icon: Plane,
      bgColor: "bg-gradient-to-br from-pink-400 to-pink-600",
      textColor: "text-white"
    },
    {
      title: "Next Flight",
      value: nextFlight ? `${nextFlight.arrivalAirport?.name} (${nextFlight.arrivalAirport?.short_form})` : "No upcoming flights",
      description: "Your next destination",
      icon: Calendar,
      bgColor: "bg-gradient-to-br from-blue-400 to-blue-600",
      textColor: "text-white"
    },
    {
      title: "Favorite Destination",
      value: mostPopularDestination || "No data",
      description: "Your favorite destination",
      icon: MapPin,
      bgColor: "bg-gradient-to-br from-green-400 to-green-600",
      textColor: "text-white"
    },
    {
      title: "Total Hours",
      value: `${totalHoursInAir}h`,
      description: "Time in the air",
      icon: Clock,
      bgColor: "bg-gradient-to-br from-purple-400 to-purple-600",
      textColor: "text-white"
    }
  ];

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
            {/* Welcome Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
            >
                <h1 className={`text-4xl font-bold mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                    Welcome, {user.email?.split('@')[0]}! ✈️
                </h1>
                <p className={`text-lg ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                    Here's your flight statistics overview
                </p>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statsCards.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className={`h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md ${
                      isDarkMode 
                        ? 'bg-gray-800/50 backdrop-blur-sm border-gray-700' 
                        : 'bg-white/80 backdrop-blur-sm border-gray-200'
                    }`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className={`p-3 rounded-full ${stat.bgColor}`}>
                            <Icon className={`w-6 h-6 ${stat.textColor}`} />
                          </div>
                        </div>
                        <CardTitle className={`text-lg font-semibold ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {stat.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className={`text-2xl font-bold mb-1 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {stat.value}
                        </div>
                        <CardDescription className={`text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {stat.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Chart Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className={`shadow-lg border-0 ${
                isDarkMode 
                  ? 'bg-gray-800/50 backdrop-blur-sm border-gray-700' 
                  : 'bg-white/80 backdrop-blur-sm border-gray-200'
              }`}>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className={`text-2xl font-bold ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                                Monthly Flights
                            </CardTitle>
                            <CardDescription className={
                                isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }>
                                Your flight evolution throughout {selectedYear}
                            </CardDescription>
                        </div>
                    <div className="flex items-center space-x-2">
                      <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        {Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - 1) + i).map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {monthlyFlightData && (
                    <div className="h-[400px] relative">
                      <Line
                        data={monthlyFlightData}
                        options={{
                          maintainAspectRatio: false,
                          responsive: true,
                          plugins: {
                            legend: {
                              display: true,
                              position: 'top',
                              labels: {
                                usePointStyle: true,
                                padding: 20,
                                font: {
                                  size: 12,
                                  weight: 'bold'
                                },
                                color: isDarkMode ? '#f3f4f6' : '#374151'
                              }
                            },
                            tooltip: {
                              backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(0, 0, 0, 0.8)',
                              titleColor: 'white',
                              bodyColor: 'white',
                              borderColor: '#ec4899',
                              borderWidth: 1,
                              cornerRadius: 8,
                              displayColors: false
                            }
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              grid: {
                                color: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(0, 0, 0, 0.1)'
                              },
                              ticks: {
                                stepSize: 1,
                                color: isDarkMode ? '#f3f4f6' : '#374151'
                              }
                            },
                            x: {
                              grid: {
                                color: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(0, 0, 0, 0.1)'
                              },
                              ticks: {
                                color: isDarkMode ? '#f3f4f6' : '#374151'
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Footer Note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-6 text-center"
            >
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                * Toutes les heures sont en TU (Temps Universel)
              </p>
            </motion.div>
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

export default Dashboard;