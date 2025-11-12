import React, { useState, useEffect } from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  getUserNotificationPreferences, 
  saveUserNotificationPreferences
} from '../../../services/notificationService';

const Notifications = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState({
    email_enabled: true,
    email_confirmation: true,
    email_reminders: true,
    email_updates: true,
    email_promotions: false
  });

  // Load user preferences
  useEffect(() => {
    const loadPreferences = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await getUserNotificationPreferences(user.id);
        if (data) {
          setPreferences({
            email_enabled: data.email_enabled !== false,
            email_confirmation: data.email_confirmation !== false,
            email_reminders: data.email_reminders !== false,
            email_updates: data.email_updates !== false,
            email_promotions: data.email_promotions === true
          });
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [user?.id]);

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    if (!user?.id) return;

    setSaving(true);
    try {
      const { error } = await saveUserNotificationPreferences(user.id, preferences);

      if (error) throw error;

      alert('Notification preferences saved successfully!');
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('Failed to save notification preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Icon name="Mail" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Email Notifications</h3>
        </div>
        
        <div className="space-y-4 ml-8">
          <div className="flex items-center gap-4">
            <Checkbox 
              checked={preferences.email_enabled} 
              onChange={(e) => handlePreferenceChange('email_enabled', e.target.checked)} 
            />
            <div>
              <div className="text-sm font-medium">Enable email notifications</div>
              <div className="text-xs text-muted-foreground">Receive notifications via email</div>
            </div>
          </div>

          {preferences.email_enabled && (
            <div className="ml-6 space-y-3">
              <div className="flex items-center gap-4">
                <Checkbox 
                  checked={preferences.email_confirmation} 
                  onChange={(e) => handlePreferenceChange('email_confirmation', e.target.checked)}
                  disabled={!preferences.email_enabled}
                />
                <div>
                  <div className="text-sm font-medium">Booking confirmations</div>
                  <div className="text-xs text-muted-foreground">Receive confirmation emails when booking is successful</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Checkbox 
                  checked={preferences.email_reminders} 
                  onChange={(e) => handlePreferenceChange('email_reminders', e.target.checked)}
                  disabled={!preferences.email_enabled}
                />
                <div>
                  <div className="text-sm font-medium">Booking reminders</div>
                  <div className="text-xs text-muted-foreground">Get reminded before your scheduled charging time</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Checkbox 
                  checked={preferences.email_updates} 
                  onChange={(e) => handlePreferenceChange('email_updates', e.target.checked)}
                  disabled={!preferences.email_enabled}
                />
                <div>
                  <div className="text-sm font-medium">Status updates</div>
                  <div className="text-xs text-muted-foreground">Updates about your booking or station changes</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Checkbox 
                  checked={preferences.email_promotions} 
                  onChange={(e) => handlePreferenceChange('email_promotions', e.target.checked)}
                  disabled={!preferences.email_enabled}
                />
                <div>
                  <div className="text-sm font-medium">Promotions & offers</div>
                  <div className="text-xs text-muted-foreground">Special deals and promotional offers</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Push Notifications */}
      <div className="pt-6 border-t border-border">
        <div className="flex items-center gap-3 mb-4">
          <Icon name="Bell" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Push Notifications</h3>
        </div>
        <div className="flex items-center gap-4 ml-8">
          <Checkbox checked={true} disabled />
          <div>
            <div className="text-sm font-medium">Browser push notifications</div>
            <div className="text-xs text-muted-foreground">Receive real-time updates in your browser</div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-muted/50 rounded-lg p-4 border border-border">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={16} className="text-primary mt-0.5" />
          <div className="text-sm">
            <p className="text-foreground font-medium mb-1">Email Notifications</p>
            <p className="text-muted-foreground">
              All booking confirmations and reminders will be sent to your registered email address: 
              <span className="font-medium text-foreground ml-1">{user?.email || 'Not set'}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-6 border-t border-border">
        <Button 
          variant="default" 
          onClick={handleSave}
          disabled={saving}
          iconName={saving ? "Loader2" : "Check"}
          iconPosition="left"
        >
          {saving ? 'Saving...' : 'Save Notification Settings'}
        </Button>
      </div>
    </div>
  );
};

export default Notifications;
