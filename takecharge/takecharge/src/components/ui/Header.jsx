import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { useAuth } from '../../contexts/AuthContext';
import { signOut } from '../../services/authService';

const Header = ({ className = '' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const navigationItems = [
    { path: '/main-dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/station-details', label: 'Stations', icon: 'MapPin' },
    { path: '/booking-history', label: 'Bookings', icon: 'History' },
    { path: '/booking-confirmation', label: 'Active', icon: 'Zap' },
  ];

  const secondaryItems = [
    { path: '/settings', label: 'Settings', icon: 'Settings' },
    { path: '/help', label: 'Help', icon: 'HelpCircle' },
  ];

  const isActivePath = (path) => location?.pathname === path;

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
      // Still navigate to login even if signOut fails
      navigate('/login');
      setIsMenuOpen(false);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-elevation-1 ${className}`}>
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
            <Icon name="Zap" size={24} color="white" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-foreground tracking-tight">
              TakeCharge
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              EV Charging Network
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navigationItems?.map((item) => (
            <Button
              key={item?.path}
              variant={isActivePath(item?.path) ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleNavigation(item?.path)}
              iconName={item?.icon}
              iconPosition="left"
              iconSize={18}
              className="min-w-touch"
            >
              {item?.label}
            </Button>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center space-x-2">
          {/* More Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              iconName="MoreHorizontal"
              iconSize={18}
              className="min-w-touch"
            >
              More
            </Button>
            
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-lg shadow-elevation-3 py-2 z-50">
                {secondaryItems?.map((item) => (
                  <button
                    key={item?.path}
                    onClick={() => handleNavigation(item?.path)}
                    className="flex items-center w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors duration-200"
                  >
                    <Icon name={item?.icon} size={16} className="mr-3" />
                    {item?.label}
                  </button>
                ))}
                
                <div className="border-t border-border my-2"></div>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors duration-200"
                >
                  <Icon name="LogOut" size={16} className="mr-3" />
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-3 pl-3 border-l border-border">
            <div className="flex items-center justify-center w-8 h-8 bg-secondary rounded-full">
              <Icon name="User" size={16} color="white" />
            </div>
            <div className="hidden xl:block">
              <p className="text-sm font-medium text-foreground">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-xs text-muted-foreground">
                {isAuthenticated ? 'Member' : 'Guest'}
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          iconName={isMenuOpen ? "X" : "Menu"}
          iconSize={20}
          className="lg:hidden min-w-touch"
        />
      </div>
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden bg-card border-t border-border shadow-elevation-2">
          <nav className="px-4 py-4 space-y-2">
            {navigationItems?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`flex items-center w-full px-3 py-3 rounded-lg text-left transition-colors duration-200 min-h-touch ${
                  isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item?.icon} size={20} className="mr-3" />
                <span className="font-medium">{item?.label}</span>
              </button>
            ))}
            
            <div className="border-t border-border my-4"></div>
            
            {secondaryItems?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className="flex items-center w-full px-3 py-3 rounded-lg text-foreground hover:bg-muted transition-colors duration-200 min-h-touch"
              >
                <Icon name={item?.icon} size={20} className="mr-3" />
                <span className="font-medium">{item?.label}</span>
              </button>
            ))}
            
            <div className="border-t border-border my-4"></div>
            
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-3 rounded-lg text-destructive hover:bg-muted transition-colors duration-200 min-h-touch"
            >
              <Icon name="LogOut" size={20} className="mr-3" />
              <span className="font-medium">Sign Out</span>
            </button>
            
            {/* Mobile User Info */}
            {isAuthenticated && (
              <div className="flex items-center space-x-3 px-3 py-4 mt-4 bg-muted rounded-lg">
                <div className="flex items-center justify-center w-10 h-10 bg-secondary rounded-full">
                  <Icon name="User" size={20} color="white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
            )}
          </nav>
        </div>
      )}
      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-25 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;