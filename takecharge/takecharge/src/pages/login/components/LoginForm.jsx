import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import { signIn, signInWithGoogle } from '../../../services/authService';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors)?.length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      // Sign in with Supabase Auth
      const { data, error } = await signIn(formData.email, formData.password);
      
      if (error) {
        setErrors({
          general: error.message || 'Invalid email or password. Please try again.'
        });
        return;
      }
      
      // Success - navigate to dashboard
      navigate('/main-dashboard', {
        state: {
          message: 'Welcome back!',
        },
      });
    } catch (error) {
      setErrors({
        general: 'Authentication failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrors({});
    
    try {
      const { data, error } = await signInWithGoogle();
      
      if (error) {
        setErrors({
          general: error.message || 'Google sign-in failed. Please try again.'
        });
        setIsLoading(false);
      }
      // If successful, user will be redirected by Supabase OAuth
    } catch (error) {
      setErrors({
        general: 'Google sign-in failed. Please try again.'
      });
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    alert('Password reset link would be sent to your email');
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Input */}
        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData?.email}
          onChange={handleInputChange}
          error={errors?.email}
          required
          className="w-full"
        />

        {/* Password Input */}
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Enter your password"
            value={formData?.password}
            onChange={handleInputChange}
            error={errors?.password}
            required
            className="w-full pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
          </button>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <Checkbox
            label="Remember me"
            name="rememberMe"
            checked={formData?.rememberMe}
            onChange={handleInputChange}
            size="sm"
          />
          
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-primary hover:text-primary/80 transition-colors duration-200"
          >
            Forgot password?
          </button>
        </div>

        {/* General Error */}
        {errors?.general && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{errors?.general}</p>
          </div>
        )}

        {/* Sign In Button */}
        <Button
          type="submit"
          variant="default"
          size="lg"
          loading={isLoading}
          fullWidth
          className="h-12 rounded-lg"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-card text-muted-foreground">Or continue with</span>
          </div>
        </div>

        {/* Alternative Sign In Options */}
        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handleGoogleSignIn}
            iconName="Chrome"
            iconPosition="left"
            iconSize={20}
            fullWidth
            disabled={isLoading}
            className="h-12"
          >
            Continue with Google
          </Button>
        </div>

        {/* Create Account Link */}
        <div className="text-center pt-3">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-primary hover:text-primary/80 font-medium transition-colors duration-200"
            >
              Create Account
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;