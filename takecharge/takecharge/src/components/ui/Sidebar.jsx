import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { useAuth } from '../../contexts/AuthContext';
import { signOut } from '../../services/authService';

const Sidebar = ({ isCollapsed = false, onToggleCollapse, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const navigationItems = [
    { 
      path: '/main-dashboard', 
      label: 'Dashboard', 
      icon: 'LayoutDashboard',
      description: 'Overview & Analytics'
    },
    { 
      path: '/station-details', 
      label: 'Stations', 
      icon: 'MapPin',
      description: 'Find & Manage Stations'
    },
    { 
      path: '/booking-history', 
      label: 'Bookings', 
      icon: 'History',
      description: 'Booking History'
    },
    { 
      path: '/booking-confirmation', 
      label: 'Active Sessions', 
      icon: 'Zap',
      description: 'Current Charging'
    },
  ];

  const secondaryItems = [
    { path: '/settings', label: 'Settings', icon: 'Settings' },
    { path: '/help', label: 'Help & Support', icon: 'HelpCircle' },
    { path: '/profile', label: 'Profile', icon: 'User' },
  ];

  const isActivePath = (path) => location?.pathname === path;

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
      setIsOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
      // Still navigate to login even if signOut fails
      navigate('/login');
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        iconName="Menu"
        iconSize={20}
        className="lg:hidden fixed top-20 left-4 z-30 bg-card shadow-elevation-2 min-w-touch"
      />
      {/* Sidebar */}
      <aside className={`
        fixed top-16 left-0 bottom-0 z-50 bg-card border-r border-border shadow-elevation-2
        transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        ${isCollapsed ? 'w-16' : 'w-64'}
        ${className}
      `}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                  <Icon name="Zap" size={18} color="white" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">TakeCharge</h2>
                  <p className="text-xs text-muted-foreground">EV Network</p>
                </div>
              </div>
            )}
            
            {/* Collapse Toggle - Desktop Only */}
            {onToggleCollapse && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleCollapse}
                iconName={isCollapsed ? "ChevronRight" : "ChevronLeft"}
                iconSize={16}
                className="hidden lg:flex min-w-touch"
              />
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {/* Primary Navigation */}
            <div className="space-y-1">
              {!isCollapsed && (
                <h3 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Navigation
                </h3>
              )}
              
              {navigationItems?.map((item) => {
                const isActive = isActivePath(item?.path);
                return (
                  <button
                    key={item?.path}
                    onClick={() => handleNavigation(item?.path)}
                    className={`
                      group flex items-center w-full px-3 py-3 rounded-lg text-left 
                      transition-all duration-200 hover-lift min-h-touch
                      ${isActive 
                        ? 'bg-primary text-primary-foreground shadow-elevation-1' 
                        : 'text-foreground hover:bg-muted hover:text-foreground'
                      }
                    `}
                    title={isCollapsed ? item?.label : ''}
                  >
                    <Icon 
                      name={item?.icon} 
                      size={20} 
                      className={`flex-shrink-0 ${isCollapsed ? 'mx-auto' : 'mr-3'}`}
                    />
                    {!isCollapsed && (
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item?.label}</p>
                        <p className="text-xs opacity-75 truncate">{item?.description}</p>
                      </div>
                    )}
                    {!isCollapsed && isActive && (
                      <div className="w-2 h-2 bg-primary-foreground rounded-full opacity-75" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Divider */}
            <div className="border-t border-border my-6" />

            {/* Secondary Navigation */}
            <div className="space-y-1">
              {!isCollapsed && (
                <h3 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Account
                </h3>
              )}
              
              {secondaryItems?.map((item) => (
                <button
                  key={item?.path}
                  onClick={() => handleNavigation(item?.path)}
                  className={`
                    group flex items-center w-full px-3 py-3 rounded-lg text-left
                    transition-all duration-200 hover-lift min-h-touch
                    text-foreground hover:bg-muted hover:text-foreground
                  `}
                  title={isCollapsed ? item?.label : ''}
                >
                  <Icon 
                    name={item?.icon} 
                    size={20} 
                    className={`flex-shrink-0 ${isCollapsed ? 'mx-auto' : 'mr-3'}`}
                  />
                  
                  {!isCollapsed && (
                    <span className="text-sm font-medium truncate">{item?.label}</span>
                  )}
                </button>
              ))}
            </div>
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-border">
            {!isCollapsed ? (
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted">
                <div className="flex items-center justify-center w-10 h-10 bg-secondary rounded-full flex-shrink-0">
                  <Icon name="User" size={20} color="white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {isAuthenticated ? (user?.email || 'Member') : 'Guest'}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  iconName="LogOut"
                  iconSize={16}
                  className="flex-shrink-0"
                  title="Sign Out"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <div className="flex items-center justify-center w-10 h-10 bg-secondary rounded-full">
                  <Icon name="User" size={20} color="white" />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  iconName="LogOut"
                  iconSize={16}
                  title="Sign Out"
                />
              </div>
            )}
          </div>

          {/* Status Indicator */}
          <div className={`p-4 ${isCollapsed ? 'flex justify-center' : ''}`}>
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'}`}>
              <div className="w-2 h-2 bg-success rounded-full animate-pulse-status" />
              {!isCollapsed && (
                <span className="text-xs text-muted-foreground font-mono">
                  System Online
                </span>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;