import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import { toINR } from '../../utils/currency';
import Icon from '../../components/AppIcon';
import StationHeader from './components/StationHeader';
import ChargingSlots from './components/ChargingSlots';
import StationAmenities from './components/StationAmenities';
import ReviewsSection from './components/ReviewsSection';
import CostCalculator from './components/CostCalculator';
import BookingSection from './components/BookingSection';

const StationDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock station data
  const stationData = {
    id: "ST001",
    name: "TakeCharge Downtown Hub",
    address: "123 Electric Avenue, Downtown District, New York, NY 10001",
    operatingHours: "24/7",
    isOpen: true,
    distance: 2.3,
    eta: 8,
    rating: 4.6,
    reviewCount: 69,
    images: [
      "https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=600&fit=crop"
    ]
  };

  const chargingSlots = [
    {
      id: "A1",
      connectorType: "CCS",
      power: 150,
      pricePerKwh: 0.35,
      status: "available",
      estimatedTime: null
    },
    {
      id: "A2",
      connectorType: "CCS",
      power: 150,
      pricePerKwh: 0.35,
      status: "occupied",
      availableAt: "14:30",
      estimatedTime: "45 min"
    },
    {
      id: "A3",
      connectorType: "CHAdeMO",
      power: 50,
      pricePerKwh: 0.32,
      status: "available",
      estimatedTime: null
    },
    {
      id: "B1",
      connectorType: "Type 2",
      power: 22,
      pricePerKwh: 0.28,
      status: "reserved",
      availableAt: "15:00",
      estimatedTime: null
    },
    {
      id: "B2",
      connectorType: "Type 2",
      power: 22,
      pricePerKwh: 0.28,
      status: "available",
      estimatedTime: null
    },
    {
      id: "C1",
      connectorType: "CCS",
      power: 350,
      pricePerKwh: 0.42,
      status: "maintenance",
      estimatedTime: null
    }
  ];

  const amenities = [
    {
      name: "Starbucks Coffee",
      type: "coffee",
      category: "Coffee Shop",
      distance: 50,
      rating: 4.5,
      openNow: true
    },
    {
      name: "McDonald\'s",
      type: "restaurant",
      category: "Fast Food",
      distance: 120,
      rating: 4.2,
      openNow: true
    },
    {
      name: "CVS Pharmacy",
      type: "pharmacy",
      category: "Pharmacy",
      distance: 80,
      rating: 4.1,
      openNow: true
    },
    {
      name: "Shell Gas Station",
      type: "gas_station",
      category: "Gas Station",
      distance: 200,
      rating: 3.9,
      openNow: true
    },
    {
      name: "Public Restrooms",
      type: "restroom",
      category: "Facilities",
      distance: 25,
      openNow: true
    },
    {
      name: "Free WiFi Zone",
      type: "wifi",
      category: "Internet",
      distance: 0,
      openNow: true
    }
  ];

  const reviews = [
    {
      id: 1,
      userName: "Sarah Johnson",
      rating: 5,
      date: "2025-01-10",
      comment: "Excellent charging station! Fast 150kW charging and very clean facilities. The location is perfect with plenty of amenities nearby. Staff was helpful when I had questions about the connector.",
      verified: true,
      helpfulCount: 12,
      photos: [
        "https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=200&h=200&fit=crop"
      ]
    },
    {
      id: 2,
      userName: "Mike Chen",
      rating: 4,
      date: "2025-01-08",
      comment: "Good charging speeds and reliable service. The only downside is that it can get busy during peak hours. I recommend booking in advance, especially on weekends.",
      verified: true,
      helpfulCount: 8,
      photos: []
    },
    {
      id: 3,
      userName: "Emily Rodriguez",
      rating: 5,
      date: "2025-01-05",
      comment: "Love this station! The app integration works perfectly and the pricing is very competitive. The 24/7 availability is a huge plus for my work schedule.",
      verified: false,
      helpfulCount: 15,
      photos: []
    },
    {
      id: 4,
      userName: "David Thompson",
      rating: 4,
      date: "2025-01-03",
      comment: "Solid charging experience. The 350kW ultra-fast charger was unfortunately under maintenance when I visited, but the 150kW CCS worked great. Good location with shopping nearby.",
      verified: true,
      helpfulCount: 6,
      photos: []
    },
    {
      id: 5,
      userName: "Lisa Wang",
      rating: 5,
      date: "2024-12-28",
      comment: "Best charging station in the downtown area! Clean, well-lit, and secure. The cost calculator feature in the app helped me plan my charging session perfectly.",
      verified: true,
      helpfulCount: 9,
      photos: []
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Info' },
    { id: 'slots', label: 'Charging Slots', icon: 'Zap' },
    { id: 'amenities', label: 'Amenities', icon: 'MapPin' },
    { id: 'reviews', label: 'Reviews', icon: 'Star' },
    { id: 'calculator', label: 'Cost Calculator', icon: 'Calculator' },
    { id: 'booking', label: 'Book Slot', icon: 'Calendar' }
  ];

  const handleSlotBooking = (slot) => {
    setSelectedSlot(slot);
    setActiveTab('booking');
  };

  const handleBackNavigation = () => {
    navigate('/main-dashboard');
  };

  useEffect(() => {
    // Check if a specific slot was selected from the dashboard
    const searchParams = new URLSearchParams(location.search);
    const slotId = searchParams?.get('slot');
    if (slotId) {
      const slot = chargingSlots?.find(s => s?.id === slotId);
      if (slot && slot?.status === 'available') {
        setSelectedSlot(slot);
        setActiveTab('booking');
      }
    }
  }, [location?.search]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <StationHeader station={stationData} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChargingSlots slots={chargingSlots?.slice(0, 3)} onBookSlot={handleSlotBooking} />
              <StationAmenities amenities={amenities?.slice(0, 6)} />
            </div>
          </div>
        );
      case 'slots':
        return <ChargingSlots slots={chargingSlots} onBookSlot={handleSlotBooking} />;
      case 'amenities':
        return <StationAmenities amenities={amenities} />;
      case 'reviews':
        return <ReviewsSection reviews={reviews} overallRating={4.6} totalReviews={69} />;
      case 'calculator':
        return <CostCalculator pricePerKwh={0.35} />;
      case 'booking':
        return <BookingSection station={stationData} selectedSlot={selectedSlot} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Breadcrumb Navigation */}
        <div className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm">
                <button
                  onClick={handleBackNavigation}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  <Icon name="ArrowLeft" size={16} />
                  <span>Back to Dashboard</span>
                </button>
                <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
                <span className="text-foreground font-medium">Station Details</span>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                  <Icon name="Share" size={16} />
                  <span>Share</span>
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                  <Icon name="Bookmark" size={16} />
                  <span>Save</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-card border-b border-border sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex overflow-x-auto scrollbar-hide">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-4 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-200 ${
                    activeTab === tab?.id
                      ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label}</span>
                  {tab?.id === 'booking' && selectedSlot && (
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderTabContent()}
        </div>

        {/* Floating Action Button - Mobile */}
        <div className="lg:hidden fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setActiveTab('booking')}
            className="flex items-center justify-center w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-elevation-3 hover:bg-primary/90 transition-all duration-200 hover-lift"
          >
            <Icon name="Calendar" size={24} />
          </button>
        </div>

        {/* Quick Stats Bar - Mobile */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-muted-foreground">
                  {chargingSlots?.filter(s => s?.status === 'available')?.length} Available
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Icon name="Star" size={14} className="text-warning fill-current" />
                <span className="font-medium text-foreground">{stationData?.rating}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">From</p>
              <p className="font-medium text-foreground">{toINR(0.28)}/kWh</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StationDetails;