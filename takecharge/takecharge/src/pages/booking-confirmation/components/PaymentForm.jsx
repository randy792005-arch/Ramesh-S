import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import { toINR } from '../../../utils/currency';

const PaymentForm = ({ totalAmount, onPaymentSubmit, isProcessing }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [upiId, setUpiId] = useState('');
  const [savePaymentMethod, setSavePaymentMethod] = useState(false);

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: 'CreditCard',
      description: 'Visa, Mastercard, American Express'
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: 'Smartphone',
      description: 'Google Pay, PhonePe, Paytm'
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: 'Wallet',
      description: 'Paytm, Amazon Pay, Mobikwik'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: 'Building2',
      description: 'All major banks supported'
    }
  ];

  const handleCardInputChange = (field, value) => {
    setCardDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePaymentSubmit = (e) => {
    e?.preventDefault();
    const paymentData = {
      method: selectedPaymentMethod,
      amount: totalAmount,
      ...(selectedPaymentMethod === 'card' && { cardDetails }),
      ...(selectedPaymentMethod === 'upi' && { upiId }),
      savePaymentMethod
    };
    onPaymentSubmit(paymentData);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-elevation-1">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Payment Details</h2>
        <div className="flex items-center space-x-2">
          <Icon name="Shield" size={16} className="text-success" />
          <span className="text-sm text-success font-medium">Secure Payment</span>
        </div>
      </div>
      <form onSubmit={handlePaymentSubmit} className="space-y-6">
        {/* Payment Method Selection */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-4">Select Payment Method</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {paymentMethods?.map((method) => (
              <button
                key={method?.id}
                type="button"
                onClick={() => setSelectedPaymentMethod(method?.id)}
                className={`p-4 rounded-lg border-2 text-left transition-all duration-200 hover-lift ${
                  selectedPaymentMethod === method?.id
                    ? 'border-primary bg-primary/5' :'border-border bg-card hover:border-muted-foreground/30'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon 
                    name={method?.icon} 
                    size={20} 
                    className={selectedPaymentMethod === method?.id ? 'text-primary' : 'text-muted-foreground'}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${
                      selectedPaymentMethod === method?.id ? 'text-primary' : 'text-foreground'
                    }`}>
                      {method?.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {method?.description}
                    </p>
                  </div>
                  {selectedPaymentMethod === method?.id && (
                    <Icon name="CheckCircle" size={16} className="text-primary" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Payment Form Fields */}
        {selectedPaymentMethod === 'card' && (
          <div className="space-y-4">
            <Input
              label="Card Number"
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardDetails?.number}
              onChange={(e) => handleCardInputChange('number', e?.target?.value)}
              required
              maxLength={19}
            />
            <Input
              label="Cardholder Name"
              type="text"
              placeholder="John Doe"
              value={cardDetails?.name}
              onChange={(e) => handleCardInputChange('name', e?.target?.value)}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Expiry Date"
                type="text"
                placeholder="MM/YY"
                value={cardDetails?.expiry}
                onChange={(e) => handleCardInputChange('expiry', e?.target?.value)}
                required
                maxLength={5}
              />
              <Input
                label="CVV"
                type="text"
                placeholder="123"
                value={cardDetails?.cvv}
                onChange={(e) => handleCardInputChange('cvv', e?.target?.value)}
                required
                maxLength={4}
              />
            </div>
          </div>
        )}

        {selectedPaymentMethod === 'upi' && (
          <div>
            <Input
              label="UPI ID"
              type="text"
              placeholder="yourname@paytm"
              value={upiId}
              onChange={(e) => setUpiId(e?.target?.value)}
              required
              description="Enter your UPI ID to proceed with payment"
            />
          </div>
        )}

        {selectedPaymentMethod === 'wallet' && (
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <Icon name="Wallet" size={20} className="text-primary" />
              <span className="text-sm font-medium text-foreground">Digital Wallet</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              You will be redirected to your selected wallet app to complete the payment.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">P</span>
                </div>
                <span className="text-sm">Paytm</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">A</span>
                </div>
                <span className="text-sm">Amazon Pay</span>
              </div>
            </div>
          </div>
        )}

        {selectedPaymentMethod === 'netbanking' && (
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <Icon name="Building2" size={20} className="text-primary" />
              <span className="text-sm font-medium text-foreground">Net Banking</span>
            </div>
            <p className="text-sm text-muted-foreground">
              You will be redirected to your bank's secure login page to complete the payment.
            </p>
          </div>
        )}

        {/* Save Payment Method */}
        <div className="flex items-center space-x-3">
          <Checkbox
            checked={savePaymentMethod}
            onChange={(e) => setSavePaymentMethod(e?.target?.checked)}
          />
          <label className="text-sm text-foreground">
            Save this payment method for future bookings
          </label>
        </div>

        {/* Payment Summary */}
        <div className="bg-primary/5 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Amount to Pay</span>
            <span className="text-2xl font-bold text-primary">{toINR(totalAmount)}</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Icon name="Shield" size={12} />
            <span>256-bit SSL encrypted payment</span>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          loading={isProcessing}
          iconName="CreditCard"
          iconPosition="left"
          className="mt-6"
        >
          {isProcessing ? 'Processing Payment...' : `Pay ${toINR(totalAmount)}`}
        </Button>

        {/* Security Notice */}
        <div className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
          <Icon name="Info" size={16} className="text-primary mt-0.5" />
          <div className="text-xs text-muted-foreground">
            <p className="mb-1">Your payment information is secure and encrypted.</p>
            <p>We do not store your card details on our servers.</p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;