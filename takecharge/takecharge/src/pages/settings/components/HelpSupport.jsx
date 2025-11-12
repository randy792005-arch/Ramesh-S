import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { useAuth } from '../../../contexts/AuthContext';

const HelpSupport = () => {
  const { user } = useAuth();
  const [reportData, setReportData] = useState({
    stationOrBookingId: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const supportEmail = 'paggeoyogiram@gmail.com';
  const supportPhone = '+91 6382415042';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    
    if (!reportData.stationOrBookingId || !reportData.description) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      // Create email subject and body
      const subject = `Issue Report - ${reportData.stationOrBookingId}`;
      const userEmail = user?.email || 'Not provided';
      const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
      
      const emailBody = `Issue Report from TakeCharge

User Information:
- Name: ${userName}
- Email: ${userEmail}
- User ID: ${user?.id || 'N/A'}

Issue Details:
- Station ID or Booking ID: ${reportData.stationOrBookingId}
- Description: ${reportData.description}

Reported on: ${new Date().toLocaleString()}
`;

      // Create mailto link
      const mailtoLink = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
      
      // Open email client
      window.location.href = mailtoLink;
      
      // Also copy to clipboard as backup (if available)
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(emailBody);
        }
      } catch (clipboardError) {
        // Clipboard API might not be available (e.g., not HTTPS or browser doesn't support it)
        console.log('Clipboard API not available:', clipboardError);
      }
      
      setSubmitSuccess(true);
      setReportData({ stationOrBookingId: '', description: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again or email directly to ' + supportEmail);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneClick = () => {
    window.location.href = `tel:${supportPhone}`;
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:${supportEmail}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">FAQs</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div>
            <div className="font-medium text-foreground">How do I change my booking?</div>
            <div>Go to Booking History and select Modify on the booking you want to change.</div>
          </div>
          <div>
            <div className="font-medium text-foreground">How are prices calculated?</div>
            <div>Prices are based on price per kWh set by station operators and platform fees.</div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Contact Support</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            className="bg-muted p-3 rounded cursor-pointer hover:bg-muted/80 transition-colors"
            onClick={handlePhoneClick}
            title="Click to call"
          >
            <div className="text-sm font-medium">Phone</div>
            <div className="text-xs text-muted-foreground">{supportPhone}</div>
          </div>
          <div 
            className="bg-muted p-3 rounded cursor-pointer hover:bg-muted/80 transition-colors"
            onClick={handleEmailClick}
            title="Click to email"
          >
            <div className="text-sm font-medium">Email</div>
            <div className="text-xs text-muted-foreground">{supportEmail}</div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Report an issue</h3>
        <form onSubmit={handleSubmitReport} className="space-y-4">
          <Input 
            label="Station ID or Booking ID" 
            name="stationOrBookingId"
            value={reportData.stationOrBookingId}
            onChange={handleInputChange}
            required
            placeholder="Enter Station ID or Booking ID"
          />
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={reportData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-3 py-2 rounded-md bg-background text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder="Please describe the issue in detail..."
            />
          </div>
          
          {submitSuccess && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-4 py-3 rounded-md text-sm">
              ✓ Report submitted! Your email client should open. If it doesn't, please email {supportEmail} directly.
            </div>
          )}
          
          <div className="pt-2">
            <Button 
              type="submit"
              variant="default"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Clicking "Submit Report" will open your email client with a pre-filled message to {supportEmail}
          </p>
        </form>
      </div>
    </div>
  );
};

export default HelpSupport;
