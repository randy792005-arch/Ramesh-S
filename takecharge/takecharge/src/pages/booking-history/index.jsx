import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import BookingCard from './components/BookingCard';
import FilterControls from './components/FilterControls';
import BookingStats from './components/BookingStats';
import QRCodeModal from './components/QRCodeModal';
import EmptyState from './components/EmptyState';
import { toINR } from '../../utils/currency';
import { generateInvoice } from '../../services/invoiceService';
import { getUserBookings } from '../../services/bookingService';
import { useAuth } from '../../contexts/AuthContext';

const BookingHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    sortBy: 'date-desc',
    paymentMethod: 'all',
    dateRange: 'all',
    startDate: '',
    endDate: '',
    minCost: '',
    maxCost: ''
  });

  // Transform database booking format to component format
  const transformBooking = (dbBooking) => {
    return {
      id: dbBooking.id,
      bookingId: dbBooking.booking_id || `TC-${dbBooking.id?.slice(0, 8)}`,
      stationId: dbBooking.station_id,
      stationName: dbBooking.station_name || 'Unknown Station',
      stationImage: dbBooking.station_image || '/assets/images/ev_station.svg',
      location: dbBooking.station_address || 'Address not available',
      date: dbBooking.scheduled_date || dbBooking.start_time?.split('T')[0],
      startTime: dbBooking.start_time,
      endTime: dbBooking.end_time,
      duration: dbBooking.duration_minutes || 0,
      actualDuration: dbBooking.actual_duration_minutes || null,
      status: dbBooking.status || 'pending',
      connectorType: dbBooking.connector_type || 'Unknown',
      chargingSpeed: dbBooking.charging_speed || 'N/A',
      energyDelivered: dbBooking.energy_delivered_kwh || null,
      baseCost: dbBooking.charging_cost || 0,
      taxes: dbBooking.taxes || 0,
      totalCost: dbBooking.total_cost || 0,
      paymentMethod: dbBooking.payment_method || 'Unknown',
      amenities: [], // Amenities not stored in booking table
      latitude: dbBooking.latitude,
      longitude: dbBooking.longitude,
      qrCode: dbBooking.qr_code,
      createdAt: dbBooking.created_at,
      updatedAt: dbBooking.updated_at,
      completedAt: dbBooking.completed_at
    };
  };

  // Fetch bookings from database
  const fetchBookings = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await getUserBookings(user.id);

      if (fetchError) {
        console.error('Error fetching bookings:', fetchError);
        setError(fetchError.message || 'Failed to fetch bookings');
        setBookings([]);
      } else if (data && Array.isArray(data)) {
        // Transform database bookings to component format
        const transformedBookings = data.map(transformBooking);
        setBookings(transformedBookings);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error('Unexpected error fetching bookings:', err);
      setError(err.message || 'An unexpected error occurred');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and refresh on user change
  useEffect(() => {
    fetchBookings();
  }, [user?.id]);

  // Refresh bookings when page becomes visible (e.g., after creating a booking)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && user?.id) {
        fetchBookings();
      }
    };

    const handleFocus = () => {
      if (user?.id) {
        fetchBookings();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [user?.id]);

  // Mock booking data (fallback if no bookings found)
  const mockBookings = [
    {
      id: 1,
      bookingId: 'TC-2024-001',
      stationId: 'ST-001',
      stationName: 'Downtown EV Hub',
      stationImage: 'https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=400',
      location: '123 Main Street, Downtown',
      date: '2024-09-15',
      startTime: '2024-09-15T14:00:00',
      endTime: '2024-09-15T15:30:00',
      duration: 90,
      actualDuration: 85,
      status: 'completed',
      connectorType: 'CCS Type 2',
      chargingSpeed: '150 kW',
      energyDelivered: 45.2,
      baseCost: 18.50,
      taxes: 1.85,
      totalCost: 20.35,
      paymentMethod: 'Credit Card',
      amenities: ['WiFi', 'Restroom', 'Cafe', 'Parking'],
      latitude: 40.7128,
      longitude: -74.0060
    },
    {
      id: 2,
      bookingId: 'TC-2024-002',
      stationId: 'ST-002',
      stationName: 'Mall Charging Plaza',
      stationImage: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400',
      location: '456 Shopping Blvd, Westside',
      date: '2024-09-18',
      startTime: '2024-09-18T10:30:00',
      endTime: '2024-09-18T12:00:00',
      duration: 90,
      status: 'upcoming',
      connectorType: 'Tesla Supercharger',
      chargingSpeed: '250 kW',
      baseCost: 25.00,
      taxes: 2.50,
      totalCost: 27.50,
      paymentMethod: 'UPI',
      amenities: ['Shopping', 'Food Court', 'Parking', 'Security'],
      latitude: 40.7589,
      longitude: -73.9851
    },
    {
      id: 3,
      bookingId: 'TC-2024-003',
      stationId: 'ST-003',
      stationName: 'Highway Rest Stop',
      stationImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      location: '789 Highway 101, Mile Marker 45',
      date: '2024-09-12',
      startTime: '2024-09-12T16:15:00',
      endTime: '2024-09-12T17:45:00',
      duration: 90,
      actualDuration: 92,
      status: 'completed',
      connectorType: 'CHAdeMO',
      chargingSpeed: '100 kW',
      energyDelivered: 38.7,
      baseCost: 15.75,
      taxes: 1.58,
      totalCost: 17.33,
      paymentMethod: 'Debit Card',
      amenities: ['Restroom', 'Vending', 'Parking'],
      latitude: 37.7749,
      longitude: -122.4194
    },
    {
      id: 4,
      bookingId: 'TC-2024-004',
      stationId: 'ST-004',
      stationName: 'Airport Charging Hub',
      stationImage: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400',
      location: 'Terminal 2, International Airport',
      date: '2024-09-10',
      startTime: '2024-09-10T08:00:00',
      endTime: '2024-09-10T09:30:00',
      duration: 90,
      status: 'cancelled',
      connectorType: 'CCS Type 2',
      chargingSpeed: '150 kW',
      baseCost: 22.00,
      taxes: 2.20,
      totalCost: 24.20,
      paymentMethod: 'Digital Wallet',
      amenities: ['WiFi', 'Lounge', 'Parking', 'Security'],
      latitude: 40.6892,
      longitude: -74.1745
    },
    {
      id: 5,
      bookingId: 'TC-2024-005',
      stationId: 'ST-005',
      stationName: 'City Center Fast Charge',
      stationImage: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400',
      location: '321 Business District, City Center',
      date: '2024-09-16',
      startTime: '2024-09-16T11:00:00',
      endTime: '2024-09-16T11:45:00',
      duration: 45,
      status: 'active',
      connectorType: 'CCS Type 2',
      chargingSpeed: '200 kW',
      baseCost: 12.50,
      taxes: 1.25,
      totalCost: 13.75,
      paymentMethod: 'Credit Card',
      amenities: ['WiFi', 'Cafe', 'Parking'],
      latitude: 40.7505,
      longitude: -73.9934
    }
  ];

  // Filter and sort bookings
  const filteredBookings = useMemo(() => {
    // Use real bookings if available, otherwise use mock data
    const bookingsToFilter = bookings.length > 0 ? bookings : mockBookings;
    let filtered = [...bookingsToFilter];

    // Search filter
    if (filters?.search) {
      const searchTerm = filters?.search?.toLowerCase();
      filtered = filtered?.filter(booking =>
        booking?.stationName?.toLowerCase()?.includes(searchTerm) ||
        booking?.location?.toLowerCase()?.includes(searchTerm) ||
        booking?.bookingId?.toLowerCase()?.includes(searchTerm)
      );
    }

    // Status filter
    if (filters?.status !== 'all') {
      filtered = filtered?.filter(booking => booking?.status === filters?.status);
    }

    // Payment method filter
    if (filters?.paymentMethod !== 'all') {
      filtered = filtered?.filter(booking => 
        booking?.paymentMethod?.toLowerCase()?.replace(/\s+/g, '-') === filters?.paymentMethod
      );
    }

    // Date range filter
    if (filters?.dateRange !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered?.filter(booking => {
        const bookingDate = new Date(booking.date);
        
        switch (filters?.dateRange) {
          case 'today':
            return bookingDate >= today;
          case 'week':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return bookingDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
            return bookingDate >= monthAgo;
          case 'quarter':
            const quarterAgo = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
            return bookingDate >= quarterAgo;
          case 'year':
            const yearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
            return bookingDate >= yearAgo;
          case 'custom':
            if (filters?.startDate && filters?.endDate) {
              const startDate = new Date(filters.startDate);
              const endDate = new Date(filters.endDate);
              return bookingDate >= startDate && bookingDate <= endDate;
            }
            return true;
          default:
            return true;
        }
      });
    }

    // Cost range filter
    if (filters?.minCost) {
      filtered = filtered?.filter(booking => booking?.totalCost >= parseFloat(filters?.minCost));
    }
    if (filters?.maxCost) {
      filtered = filtered?.filter(booking => booking?.totalCost <= parseFloat(filters?.maxCost));
    }

    // Sort bookings
    filtered?.sort((a, b) => {
      switch (filters?.sortBy) {
        case 'date-desc':
          return new Date(b.date) - new Date(a.date);
        case 'date-asc':
          return new Date(a.date) - new Date(b.date);
        case 'cost-desc':
          return b?.totalCost - a?.totalCost;
        case 'cost-asc':
          return a?.totalCost - b?.totalCost;
        case 'station-name':
          return a?.stationName?.localeCompare(b?.stationName);
        default:
          return 0;
      }
    });

    return filtered;
  }, [bookings, filters]);

  // Calculate stats
  const stats = useMemo(() => {
    const bookingsToUse = bookings.length > 0 ? bookings : mockBookings;
    const completedBookings = bookingsToUse?.filter(b => b?.status === 'completed');
    return {
      totalBookings: bookingsToUse?.length || 0,
      completedBookings: completedBookings?.length || 0,
      totalSpent: bookingsToUse?.reduce((sum, booking) => sum + (booking?.totalCost || 0), 0) || 0,
      totalEnergy: completedBookings?.reduce((sum, booking) => sum + (booking?.energyDelivered || 0), 0) || 0
    };
  }, [bookings]);

  const handleModifyBooking = (booking) => {
    // Navigate to booking modification page
    navigate('/booking-confirmation', { state: { bookingId: booking?.bookingId, mode: 'modify' } });
  };

  const handleCancelBooking = (booking) => {
    // Handle booking cancellation
    if (window.confirm(`Are you sure you want to cancel booking ${booking?.bookingId}?`)) {
      console.log('Cancelling booking:', booking?.bookingId);
      // In real app, make API call to cancel booking
    }
  };

  const handleDownloadInvoice = async (booking) => {
    setIsGeneratingInvoice(true);
    try {
      await generateInvoice(booking, user);
    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('Failed to generate invoice. Please try again.');
    } finally {
      setIsGeneratingInvoice(false);
    }
  };

  const handleViewQR = (booking) => {
    setSelectedBooking(booking);
    setShowQRModal(true);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      sortBy: 'date-desc',
      paymentMethod: 'all',
      dateRange: 'all',
      startDate: '',
      endDate: '',
      minCost: '',
      maxCost: ''
    });
  };

  const handleExportData = () => {
    // Export booking data as CSV
    const csvData = filteredBookings?.map(booking => ({
      'Booking ID': booking?.bookingId,
      'Station Name': booking?.stationName,
      'Location': booking?.location,
      'Date': booking?.date,
      'Start Time': new Date(booking.startTime)?.toLocaleTimeString(),
      'Duration': `${booking?.duration} mins`,
      'Status': booking?.status,
      'Total Cost': `${toINR(booking?.totalCost)}`,
      'Payment Method': booking?.paymentMethod
    }));

    const csvContent = [
      Object.keys(csvData?.[0])?.join(','),
      ...csvData?.map(row => Object.values(row)?.join(','))
    ]?.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `booking-history-${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
    link?.click();
    window.URL?.revokeObjectURL(url);
  };

  const hasActiveFilters = filters?.search || filters?.status !== 'all' || 
    filters?.paymentMethod !== 'all' || filters?.dateRange !== 'all' || 
    filters?.minCost || filters?.maxCost;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-6 lg:py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <Icon name="History" size={28} className="text-primary" />
                <h1 className="text-3xl font-bold text-foreground">Booking History</h1>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchBookings}
                disabled={loading}
                iconName={loading ? "Loader2" : "RefreshCw"}
                iconPosition="left"
                className="flex-shrink-0"
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
            <p className="text-muted-foreground">
              Track your charging sessions and manage upcoming bookings
            </p>
          </div>

          {/* Stats */}
          <BookingStats stats={stats} />

          {/* Filter Controls */}
          <FilterControls
            filters={filters}
            onFilterChange={setFilters}
            onClearFilters={handleClearFilters}
            onExportData={handleExportData}
            totalBookings={bookings.length > 0 ? bookings.length : mockBookings.length}
            filteredCount={filteredBookings?.length}
          />

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">Loading bookings...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                ⚠️ {error}. {bookings.length === 0 ? 'Showing sample data.' : 'Some bookings may not be displayed.'}
              </p>
            </div>
          )}

          {/* Bookings List */}
          {!loading && filteredBookings?.length === 0 ? (
            <EmptyState 
              hasFilters={hasActiveFilters}
              onClearFilters={handleClearFilters}
            />
          ) : !loading ? (
            <div className="space-y-4">
              {filteredBookings?.map((booking) => (
                <BookingCard
                  key={booking?.id}
                  booking={booking}
                  onModify={handleModifyBooking}
                  onCancel={handleCancelBooking}
                  onDownloadInvoice={handleDownloadInvoice}
                  onViewQR={handleViewQR}
                />
              ))}
            </div>
          ) : null}

          {/* Load More Button (for pagination in real app) */}
          {filteredBookings?.length > 0 && filteredBookings?.length >= 10 && (
            <div className="text-center mt-8">
              <button className="px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors duration-200">
                Load More Bookings
              </button>
            </div>
          )}
        </div>
      </main>
      {/* QR Code Modal */}
      <QRCodeModal
        booking={selectedBooking}
        isOpen={showQRModal}
        onClose={() => {
          setShowQRModal(false);
          setSelectedBooking(null);
        }}
      />
    </div>
  );
};

export default BookingHistory;