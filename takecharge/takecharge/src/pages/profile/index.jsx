import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { getUserBookings } from '../../services/bookingService';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [stats, setStats] = useState({
    totalBookings: 0,
    completedBookings: 0,
    totalSpent: 0,
    totalEnergy: 0
  });

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  // Get user's full name from metadata or split from email
  const fullName = user?.user_metadata?.full_name || '';
  const userEmail = user?.email || '';

  // Fetch user stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return;

      try {
        const { data: bookings } = await getUserBookings(user.id);
        if (bookings && Array.isArray(bookings)) {
          const completedBookings = bookings.filter(b => b.status === 'completed');
          setStats({
            totalBookings: bookings.length,
            completedBookings: completedBookings.length,
            totalSpent: bookings.reduce((sum, b) => sum + (parseFloat(b.total_cost) || 0), 0),
            totalEnergy: completedBookings.reduce((sum, b) => sum + (parseFloat(b.energy_delivered_kwh) || 0), 0)
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [user?.id]);

  // Initialize form data
  useEffect(() => {
    if (user) {
      const firstName = fullName.split(' ')[0] || '';
      const lastName = fullName.split(' ').slice(1).join(' ') || '';
      
      setFormData({
        firstName,
        lastName,
        email: userEmail,
        phone: user?.user_metadata?.phone || '',
        address: user?.user_metadata?.address || '',
        city: user?.user_metadata?.city || '',
        state: user?.user_metadata?.state || '',
        zipCode: user?.user_metadata?.zip_code || ''
      });
    }
  }, [user, fullName, userEmail]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      // Update user metadata in Supabase
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: `${formData.firstName} ${formData.lastName}`.trim(),
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zipCode
        }
      });

      if (error) throw error;

      // Refresh user data
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    // Reset form data
    const firstName = fullName.split(' ')[0] || '';
    const lastName = fullName.split(' ').slice(1).join(' ') || '';
    
    setFormData({
      firstName,
      lastName,
      email: userEmail,
      phone: user?.user_metadata?.phone || '',
      address: user?.user_metadata?.address || '',
      city: user?.user_metadata?.city || '',
      state: user?.user_metadata?.state || '',
      zipCode: user?.user_metadata?.zip_code || ''
    });
    setIsEditing(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <Icon name="User" size={48} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">Please sign in to view your profile.</p>
            <Button onClick={() => navigate('/login')}>
              Sign In
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const displayName = fullName || userEmail.split('@')[0] || 'User';
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || userEmail.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <Icon name="User" size={28} className="text-primary" />
              <h1 className="text-3xl font-bold text-foreground">Profile</h1>
            </div>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                iconName="Edit"
                iconPosition="left"
              >
                Edit Profile
              </Button>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            View and manage your personal information and account settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
              <div className="flex items-start gap-6 mb-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-elevation-2">
                    <span className="text-2xl font-semibold text-white">
                      {initials}
                    </span>
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-elevation-2 hover:bg-primary/90 transition-colors">
                      <Icon name="Camera" size={16} />
                    </button>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-foreground mb-1">
                    {displayName}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-2">{userEmail}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Icon name="Shield" size={14} />
                    <span>Account verified</span>
                  </div>
                </div>
              </div>

              {/* Profile Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    disabled={!isEditing}
                    required
                  />
                  <Input
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    disabled={!isEditing}
                    required
                  />
                </div>

                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  disabled
                  description="Email cannot be changed"
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing}
                  placeholder="+1 (555) 000-0000"
                />

                <Input
                  label="Address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Street address"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="City"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    disabled={!isEditing}
                    placeholder="City"
                  />
                  <Input
                    label="State"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    disabled={!isEditing}
                    placeholder="State"
                  />
                  <Input
                    label="Zip Code"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    disabled={!isEditing}
                    placeholder="12345"
                  />
                </div>

                {isEditing && (
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      iconName={isSaving ? "Loader2" : "Check"}
                      iconPosition="left"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Account Statistics */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Icon name="BarChart" size={20} className="text-primary" />
                Account Statistics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {stats.totalBookings}
                  </div>
                  <div className="text-xs text-muted-foreground">Total Bookings</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {stats.completedBookings}
                  </div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-foreground mb-1">
                    ${stats.totalSpent.toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground">Total Spent</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {stats.totalEnergy.toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">kWh Charged</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/booking-history')}
                  iconName="History"
                  iconPosition="left"
                >
                  View Bookings
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/settings')}
                  iconName="Settings"
                  iconPosition="left"
                >
                  Settings
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/main-dashboard')}
                  iconName="MapPin"
                  iconPosition="left"
                >
                  Find Stations
                </Button>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
              <h3 className="text-lg font-semibold text-foreground mb-4">Account Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Member Since</span>
                  <span className="text-foreground font-medium">
                    {user?.created_at 
                      ? new Date(user.created_at).toLocaleDateString('en-US', { 
                          month: 'short', 
                          year: 'numeric' 
                        })
                      : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account Status</span>
                  <span className="text-success font-medium flex items-center gap-1">
                    <Icon name="CheckCircle" size={14} />
                    Active
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email Verified</span>
                  <span className="text-success font-medium flex items-center gap-1">
                    <Icon name="CheckCircle" size={14} />
                    Verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
