import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import WelcomeHeader from './components/WelcomeHeader';
import ProgressIndicator from './components/ProgressIndicator';
import RegistrationForm from './components/RegistrationForm';
import SocialAuthSection from './components/SocialAuthSection';
import LoginPrompt from './components/LoginPrompt';
import BenefitsSection from './components/BenefitsSection';
import Icon from '../../components/AppIcon';
import { signUp, signInWithGoogle } from '../../services/authService';

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleFormSubmit = async (formData) => {
    setIsLoading(true);
    
    try {
      // Sign up with Supabase Auth
      const { data, error } = await signUp(
        formData.email,
        formData.password,
        {
          fullName: formData.fullName,
          phone: formData.phone,
          evModel: formData.evModel,
          connectorTypes: formData.connectorTypes,
          preferredLocation: formData.preferredLocation,
        }
      );
      
      if (error) {
        alert('Registration failed: ' + error.message);
        setIsLoading(false);
        return;
      }
      
      // Check if email confirmation is required
      if (data?.user && !data?.session) {
        // Email confirmation required
        alert('Please check your email to confirm your account before signing in.');
        navigate('/login', {
          state: {
            message: 'Account created! Please check your email to confirm your account.',
          },
        });
      } else {
        // Auto-signed in
        navigate('/main-dashboard', {
          state: {
            message: 'Account created successfully! Welcome to TakeCharge.',
            newUser: true,
          },
        });
      }
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed: ' + (error.message || 'Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await signInWithGoogle();
      
      if (error) {
        alert('Google sign-up failed: ' + error.message);
        setIsLoading(false);
      }
      // If successful, user will be redirected by Supabase OAuth
    } catch (error) {
      console.error('Google sign up failed:', error);
      alert('Google sign-up failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign Up - TakeCharge EV Charging Network</title>
        <meta name="description" content="Create your TakeCharge account to find, book, and pay for EV charging stations. Join thousands of EV owners charging smarter." />
        <meta name="keywords" content="EV charging, electric vehicle, charging station, sign up, register, account" />
      </Helmet>
      <div className="min-h-screen bg-background">
        {/* Header Navigation */}
        <header className="border-b border-border bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                  <Icon name="Zap" size={18} color="white" strokeWidth={2.5} />
                </div>
                <div>
                  <span className="text-lg font-semibold text-foreground">TakeCharge</span>
                </div>
              </div>
              
              <nav className="hidden md:flex items-center space-x-6">
                <button 
                  onClick={() => navigate('/login')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => navigate('/main-dashboard')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Find Stations
                </button>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              
              {/* Left Column - Registration Form */}
              <div className="order-2 lg:order-1">
                <div className="max-w-md mx-auto lg:mx-0">
                  <WelcomeHeader />
                  
                  <div className="bg-card rounded-xl shadow-elevation-2 p-6 border border-border">
                    <ProgressIndicator currentStep={currentStep} />
                    
                    <RegistrationForm 
                      onSubmit={handleFormSubmit}
                      isLoading={isLoading}
                    />
                    
                    <div className="mt-8">
                      <SocialAuthSection
                        onGoogleSignUp={handleGoogleSignUp}
                        isLoading={isLoading}
                      />
                    </div>
                    
                    <LoginPrompt />
                  </div>
                </div>
              </div>

              {/* Right Column - Benefits */}
              <div className="order-1 lg:order-2">
                <div className="sticky top-8">
                  <BenefitsSection />
                  
                  {/* Trust Indicators */}
                  <div className="mt-8 text-center">
                    <div className="flex items-center justify-center space-x-6 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Icon name="Shield" size={16} className="text-success" />
                        <span>SSL Secured</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Icon name="Users" size={16} className="text-primary" />
                        <span>50K+ Users</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Icon name="Star" size={16} className="text-warning" />
                        <span>4.9 Rating</span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      Trusted by EV owners nationwide since 2020
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border bg-card mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <div className="flex items-center justify-center w-6 h-6 bg-primary rounded">
                  <Icon name="Zap" size={14} color="white" />
                </div>
                <span className="text-sm font-medium text-foreground">TakeCharge</span>
              </div>
              
              <div className="flex items-center space-x-6 text-xs text-muted-foreground">
                <button className="hover:text-foreground transition-colors">Privacy Policy</button>
                <button className="hover:text-foreground transition-colors">Terms of Service</button>
                <button className="hover:text-foreground transition-colors">Support</button>
                <span>© {new Date()?.getFullYear()} TakeCharge. All rights reserved.</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Register;