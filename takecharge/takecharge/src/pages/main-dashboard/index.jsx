import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import MapContainer from './components/MapContainer';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import StationList from './components/StationList';
import QuickActions from './components/QuickActions';
import StatsOverview from './components/StatsOverview';
import { getStationsNearLocation } from '../../services/openChargeService';

import Button from '../../components/ui/Button';

const MainDashboard = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showMobileStations, setShowMobileStations] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [filters, setFilters] = useState({
    connectorType: '',
    chargingSpeed: '',
    priceRange: '',
    distance: '',
    amenities: [],
    availableOnly: false
  });
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock charging stations data (fallback if API is not configured)
  const mockStations = [
    {
      id: 1,
      name: "Tesla Supercharger - Anna Salai",
      address: "Anna Salai, Chennai, TN",
      image: "https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=400&h=300&fit=crop",
      lat: 13.0623,
      lng: 80.2492,
      distance: 0.8,
      pricePerKwh: 0.28,
      maxPower: 250,
      totalSlots: 8,
      availableSlots: 3,
      status: 'available',
      connectors: ['Tesla', 'CCS'],
      rating: 4.8,
      amenities: ['parking', 'restroom', 'food', 'wifi']
    },
    {
      id: 2,
      name: "ChargePoint Station - T. Nagar",
      address: "Ranganathan St, T. Nagar, Chennai",
      image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop",
      lat: 13.0416,
      lng: 80.2376,
      distance: 1.2,
      pricePerKwh: 0.32,
      maxPower: 150,
      totalSlots: 6,
      availableSlots: 0,
      status: 'occupied',
      connectors: ['CCS', 'CHAdeMO', 'Type2'],
      rating: 4.5,
      amenities: ['parking', 'shopping', 'wifi']
    },
    {
      id: 3,
      name: "EVgo Fast Charging - Marina",
      address: "Marina Beach Rd, Chennai",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      lat: 13.0480,
      lng: 80.2820,
      distance: 2.1,
      pricePerKwh: 0.35,
      maxPower: 100,
      totalSlots: 4,
      availableSlots: 2,
      status: 'available',
      connectors: ['CCS', 'CHAdeMO'],
      rating: 4.2,
      amenities: ['parking', 'food', 'restroom', '24hours']
    },
    {
      id: 4,
      name: "Electrify - Velachery",
      address: "Velachery Main Rd, Chennai",
      image: "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=400&h=300&fit=crop",
      lat: 13.0166,
      lng: 80.2250,
      distance: 3.5,
      pricePerKwh: 0.31,
      maxPower: 350,
      totalSlots: 10,
      availableSlots: 1,
      status: 'reserved',
      connectors: ['CCS', 'CHAdeMO'],
      rating: 4.6,
      amenities: ['parking', 'restroom', 'wifi', '24hours']
    },
    {
      id: 5,
      name: "Shell Recharge - Guindy",
      address: "Guindy Industrial Estate, Chennai",
      image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop",
      lat: 13.0233,
      lng: 80.2210,
      distance: 1.8,
      pricePerKwh: 0.29,
      maxPower: 175,
      totalSlots: 6,
      availableSlots: 4,
      status: 'available',
      connectors: ['CCS', 'Type2'],
      rating: 4.4,
      amenities: ['parking', 'food', 'wifi']
    },
    {
      id: 6,
      name: "Blink Charging - Mylapore",
      address: "Mylapore High Rd, Chennai",
      image: "https://images.unsplash.com/photo-1593941707874-ef2d9d4c0e6c?w=400&h=300&fit=crop",
      lat: 13.0340,
      lng: 80.2730,
      distance: 2.3,
      pricePerKwh: 0.33,
      maxPower: 50,
      totalSlots: 4,
      availableSlots: 2,
      status: 'available',
      connectors: ['Type1', 'Type2'],
      rating: 4.0,
      amenities: ['parking', 'food']
    }
  ];

  // Fetch user location
  useEffect(() => {
    const fetchUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            setUserLocation(location);
          },
          (error) => {
            // Silently fallback to default location if geolocation fails
            // This is expected behavior when user denies permission or location is unavailable
            setUserLocation({
              lat: 13.0827,
              lng: 80.2707
            });
          },
          {
            timeout: 5000,
            enableHighAccuracy: false,
            maximumAge: 300000 // 5 minutes
          }
        );
      } else {
        // Fallback to default location if geolocation is not supported
        setUserLocation({
          lat: 13.0827,
          lng: 80.2707
        });
      }
    };

    fetchUserLocation();
  }, []);

  // Fetch charging stations when user location is available
  useEffect(() => {
    const fetchStations = async () => {
      if (!userLocation) return;

      setLoading(true);
      setError(null);

      try {
        const { data, error: apiError } = await getStationsNearLocation(
          userLocation.lat,
          userLocation.lng,
          20, // 20km radius
          50  // max 50 results
        );

        if (apiError) {
          // Only log actual API errors, not missing API key (which is expected)
          if (!apiError.message?.includes('API key not configured')) {
            console.error('Error fetching stations:', apiError);
            setError(apiError.message || 'Failed to fetch charging stations');
          }
          // Fallback to mock data if API fails
          setStations(mockStations);
        } else if (data && data.length > 0) {
          setStations(data);
        } else {
          // If no stations found or API key not configured, use mock data as fallback
          setStations(mockStations);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError(err.message || 'An unexpected error occurred');
        // Fallback to mock data
        setStations(mockStations);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, [userLocation]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleLocationSelect = (location) => {
    console.log('Location selected:', location);
    // Handle location selection logic
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleFiltersReset = () => {
    setFilters({
      connectorType: '',
      chargingSpeed: '',
      priceRange: '',
      distance: '',
      amenities: [],
      availableOnly: false
    });
  };

  const handleStationSelect = (station) => {
    setSelectedStation(station);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggleCollapse={toggleSidebar}
      />
      
      <main className={`
        pt-16 transition-all duration-300 ease-in-out
        ${sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'}
      `}>
        <div className="p-4 lg:p-6 space-y-6">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                Find Charging Stations
              </h1>
              <p className="text-muted-foreground mt-1">
                Discover nearby EV charging stations and book your slot
              </p>
            </div>
            
            {/* Mobile Action Buttons */}
            <div className="flex lg:hidden space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMobileFilters(true)}
                iconName="Filter"
                iconPosition="left"
                className="flex-1"
              >
                Filters
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMobileStations(true)}
                iconName="List"
                iconPosition="left"
                className="flex-1"
              >
                Stations
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <SearchBar
            onSearch={handleSearch}
            onLocationSelect={handleLocationSelect}
            className="w-full"
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar - Filters & Quick Actions */}
            <div className="lg:col-span-3 space-y-6">
              {/* Filters - Hidden on mobile, shown in modal */}
              <div className="hidden lg:block">
                <FilterPanel
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onReset={handleFiltersReset}
                />
              </div>
              
              {/* Quick Actions */}
              <QuickActions className="hidden lg:block" />
              
              {/* Stats Overview - Mobile */}
              <StatsOverview className="lg:hidden" />
            </div>

            {/* Center - Map */}
            <div className="lg:col-span-6">
              <div className="h-96 lg:h-[600px] rounded-lg overflow-hidden relative">
                {loading && (
                  <div className="absolute inset-0 bg-muted/50 flex items-center justify-center z-10 rounded-lg">
                    <div className="text-center">
                      <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground">Loading charging stations...</p>
                    </div>
                  </div>
                )}
                {error && !loading && (
                  <div className="absolute top-4 left-4 right-4 z-10 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      ⚠️ {error}. Using fallback data.
                    </p>
                  </div>
                )}
                <MapContainer
                  stations={stations.length > 0 ? stations : mockStations}
                  selectedStation={selectedStation}
                  onStationSelect={handleStationSelect}
                  userLocation={userLocation}
                  filters={filters}
                  searchQuery={searchQuery}
                  onLocationSearch={handleLocationSelect}
                />
              </div>
            </div>

            {/* Right Sidebar - Station List */}
            <div className="lg:col-span-3">
              <div className="hidden lg:block h-[600px]">
                <StationList
                  stations={stations.length > 0 ? stations : mockStations}
                  selectedStation={selectedStation}
                  onStationSelect={handleStationSelect}
                  filters={filters}
                  searchQuery={searchQuery}
                  className="h-full"
                />
              </div>
              
              {/* Stats Overview - Desktop */}
              <StatsOverview className="hidden lg:block mt-6" />
            </div>
          </div>

          {/* Mobile Bottom Actions */}
          <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40">
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={() => navigate('/booking-history')}
                iconName="History"
                iconPosition="left"
                className="flex-1 shadow-elevation-3"
              >
                History
              </Button>
              <Button
                variant="default"
                onClick={() => navigate('/booking-confirmation')}
                iconName="Zap"
                iconPosition="left"
                className="flex-1 shadow-elevation-3"
              >
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="absolute inset-x-0 bottom-0 bg-card rounded-t-xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Filters</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileFilters(false)}
                iconName="X"
                iconSize={20}
              />
            </div>
            <FilterPanel
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onReset={handleFiltersReset}
              className="border-0 shadow-none"
            />
          </div>
        </div>
      )}

      {/* Mobile Stations Modal */}
      {showMobileStations && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="absolute inset-x-0 bottom-0 bg-card rounded-t-xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Stations</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileStations(false)}
                iconName="X"
                iconSize={20}
              />
            </div>
            <StationList
              stations={stations.length > 0 ? stations : mockStations}
              selectedStation={selectedStation}
              onStationSelect={handleStationSelect}
              filters={filters}
              searchQuery={searchQuery}
              className="border-0 shadow-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MainDashboard;