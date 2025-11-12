import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const RegistrationForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    evModel: '',
    connectorTypes: [],
    preferredLocation: '',
    agreeToTerms: false,
    subscribeNewsletter: false
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  const evModels = [
    { value: 'tesla-model-3', label: 'Tesla Model 3' },
    { value: 'tesla-model-s', label: 'Tesla Model S' },
    { value: 'tesla-model-x', label: 'Tesla Model X' },
    { value: 'tesla-model-y', label: 'Tesla Model Y' },
    { value: 'nissan-leaf', label: 'Nissan Leaf' },
    { value: 'chevrolet-bolt', label: 'Chevrolet Bolt EV' },
    { value: 'bmw-i3', label: 'BMW i3' },
    { value: 'audi-etron', label: 'Audi e-tron' },
    { value: 'hyundai-kona', label: 'Hyundai Kona Electric' },
    { value: 'volkswagen-id4', label: 'Volkswagen ID.4' },
    { value: 'ford-mustang-mach-e', label: 'Ford Mustang Mach-E' },
    { value: 'other', label: 'Other' }
  ];

  const connectorOptions = [
    { value: 'type1', label: 'Type 1 (J1772)', description: 'Standard AC charging in North America' },
    { value: 'type2', label: 'Type 2 (Mennekes)', description: 'Standard AC charging in Europe' },
    { value: 'ccs1', label: 'CCS1 (Combo 1)', description: 'DC fast charging in North America' },
    { value: 'ccs2', label: 'CCS2 (Combo 2)', description: 'DC fast charging in Europe' },
    { value: 'chademo', label: 'CHAdeMO', description: 'DC fast charging standard' },
    { value: 'tesla', label: 'Tesla Supercharger', description: 'Tesla proprietary connector' }
  ];

  const locationOptions = [
    { value: 'home', label: 'Home/Residential' },
    { value: 'work', label: 'Workplace' },
    { value: 'shopping', label: 'Shopping Centers' },
    { value: 'highway', label: 'Highway/Travel Routes' },
    { value: 'public', label: 'Public Parking' }
  ];

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password?.length >= 8) strength += 25;
    if (/[A-Z]/?.test(password)) strength += 25;
    if (/[0-9]/?.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/?.test(password)) strength += 25;
    return strength;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/?.test(formData?.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData?.evModel) {
      newErrors.evModel = 'Please select your EV model';
    }

    if (formData?.connectorTypes?.length === 0) {
      newErrors.connectorTypes = 'Please select at least one connector type';
    }

    if (!formData?.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'password') {
      let strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);
    }

    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return 'bg-destructive';
    if (passwordStrength < 50) return 'bg-warning';
    if (passwordStrength < 75) return 'bg-secondary';
    return 'bg-success';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'Weak';
    if (passwordStrength < 50) return 'Fair';
    if (passwordStrength < 75) return 'Good';
    return 'Strong';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <Icon name="User" size={20} className="mr-2" />
          Personal Information
        </h3>
        
        <Input
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          value={formData?.fullName}
          onChange={(e) => handleInputChange('fullName', e?.target?.value)}
          error={errors?.fullName}
          required
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email address"
          value={formData?.email}
          onChange={(e) => handleInputChange('email', e?.target?.value)}
          error={errors?.email}
          description="We'll use this for account verification and notifications"
          required
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="+1 (555) 123-4567"
          value={formData?.phone}
          onChange={(e) => handleInputChange('phone', e?.target?.value)}
          error={errors?.phone}
          description="For booking confirmations and emergency contact"
          required
        />
      </div>
      {/* Password Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <Icon name="Lock" size={20} className="mr-2" />
          Account Security
        </h3>

        <div className="space-y-2">
          <Input
            label="Password"
            type="password"
            placeholder="Create a strong password"
            value={formData?.password}
            onChange={(e) => handleInputChange('password', e?.target?.value)}
            error={errors?.password}
            required
          />
          
          {formData?.password && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Password Strength:</span>
                <span className={`font-medium ${
                  passwordStrength < 50 ? 'text-destructive' : 
                  passwordStrength < 75 ? 'text-warning' : 'text-success'
                }`}>
                  {getPasswordStrengthText()}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                  style={{ width: `${passwordStrength}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          value={formData?.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e?.target?.value)}
          error={errors?.confirmPassword}
          required
        />
      </div>
      {/* EV Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <Icon name="Car" size={20} className="mr-2" />
          Vehicle Information
        </h3>

        <Select
          label="EV Model"
          placeholder="Select your electric vehicle model"
          options={evModels}
          value={formData?.evModel}
          onChange={(value) => handleInputChange('evModel', value)}
          error={errors?.evModel}
          description="This helps us recommend compatible charging stations"
          searchable
          required
        />

        <Select
          label="Connector Types"
          placeholder="Select compatible connector types"
          options={connectorOptions}
          value={formData?.connectorTypes}
          onChange={(value) => handleInputChange('connectorTypes', value)}
          error={errors?.connectorTypes}
          description="Choose all connector types your vehicle supports"
          multiple
          searchable
          required
        />

        <Select
          label="Preferred Charging Locations"
          placeholder="Select your preferred charging locations"
          options={locationOptions}
          value={formData?.preferredLocation}
          onChange={(value) => handleInputChange('preferredLocation', value)}
          description="We'll prioritize these types of locations in recommendations"
          multiple
        />
      </div>
      {/* Terms and Conditions */}
      <div className="space-y-4">
        <div className="border-t border-border pt-4">
          <Checkbox
            label="I agree to the Terms of Service and Privacy Policy"
            checked={formData?.agreeToTerms}
            onChange={(e) => handleInputChange('agreeToTerms', e?.target?.checked)}
            error={errors?.agreeToTerms}
            description="By creating an account, you agree to our terms and privacy policy"
            required
          />

          <Checkbox
            label="Subscribe to newsletter and updates"
            checked={formData?.subscribeNewsletter}
            onChange={(e) => handleInputChange('subscribeNewsletter', e?.target?.checked)}
            description="Get the latest news about new charging stations and platform updates"
            className="mt-3"
          />
        </div>
      </div>
      {/* Submit Button */}
      <Button
        type="submit"
        variant="default"
        size="lg"
        fullWidth
        loading={isLoading}
        iconName="UserPlus"
        iconPosition="left"
        className="mt-8"
      >
        Create Account
      </Button>
    </form>
  );
};

export default RegistrationForm;