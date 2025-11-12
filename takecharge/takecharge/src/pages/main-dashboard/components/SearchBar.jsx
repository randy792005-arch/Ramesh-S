import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const SearchBar = ({ onSearch, onLocationSelect, className = '' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);

  // Mock location suggestions
  const mockSuggestions = [
    { id: 1, name: "Downtown San Francisco", address: "Market St, San Francisco, CA", type: "area" },
    { id: 2, name: "Tesla Supercharger - Union Square", address: "333 Post St, San Francisco, CA", type: "station" },
    { id: 3, name: "ChargePoint Station - Pier 39", address: "Pier 39, San Francisco, CA", type: "station" },
    { id: 4, name: "Mission District", address: "Mission St, San Francisco, CA", type: "area" },
    { id: 5, name: "Financial District", address: "Montgomery St, San Francisco, CA", type: "area" },
    { id: 6, name: "EVgo Fast Charging - Westfield", address: "865 Market St, San Francisco, CA", type: "station" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef?.current && !searchRef?.current?.contains(event?.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    const value = e?.target?.value;
    setSearchQuery(value);
    
    if (value?.length > 0) {
      const filtered = mockSuggestions?.filter(item =>
        item?.name?.toLowerCase()?.includes(value?.toLowerCase()) ||
        item?.address?.toLowerCase()?.includes(value?.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    
    onSearch(value);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion?.name);
    setShowSuggestions(false);
    onLocationSelect(suggestion);
  };

  const handleSearch = () => {
    if (searchQuery?.trim()) {
      setIsSearching(true);
      setTimeout(() => {
        setIsSearching(false);
        onSearch(searchQuery);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    onSearch('');
  };

  const getSuggestionIcon = (type) => {
    return type === 'station' ? 'Zap' : 'MapPin';
  };

  return (
    <div ref={searchRef} className={`relative w-full ${className}`}>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
          <Icon name="Search" size={20} className="text-muted-foreground" />
        </div>
        
        <Input
          type="text"
          placeholder="Search for charging stations or locations..."
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyPress={handleKeyPress}
          className="pl-10 pr-20 h-12 text-base"
        />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              iconName="X"
              iconSize={16}
              className="h-8 w-8 p-0"
            />
          )}
          
          <Button
            variant="default"
            size="sm"
            onClick={handleSearch}
            loading={isSearching}
            iconName="Search"
            iconSize={16}
            className="h-8 px-3"
          >
            Search
          </Button>
        </div>
      </div>
      {/* Search Suggestions */}
      {showSuggestions && suggestions?.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-elevation-3 z-50 max-h-80 overflow-y-auto">
          <div className="p-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
              Suggestions
            </h4>
            
            {suggestions?.map((suggestion) => (
              <button
                key={suggestion?.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-muted transition-colors duration-200 text-left min-h-touch"
              >
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-lg
                  ${suggestion?.type === 'station' ? 'bg-primary' : 'bg-secondary'}
                `}>
                  <Icon 
                    name={getSuggestionIcon(suggestion?.type)} 
                    size={16} 
                    color="white" 
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {suggestion?.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {suggestion?.address}
                  </p>
                </div>
                
                <div className="flex-shrink-0">
                  <div className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${suggestion?.type === 'station' ?'bg-primary/10 text-primary' :'bg-secondary/10 text-secondary'
                    }
                  `}>
                    {suggestion?.type === 'station' ? 'Station' : 'Area'}
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          {/* Quick Actions */}
          <div className="border-t border-border p-2">
            <button
              onClick={() => handleSuggestionClick({ name: "Current Location", type: "location" })}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors duration-200 text-left"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent">
                <Icon name="Navigation" size={16} color="white" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Use Current Location</p>
                <p className="text-xs text-muted-foreground">Find stations near you</p>
              </div>
            </button>
          </div>
        </div>
      )}
      {/* No Results */}
      {showSuggestions && searchQuery && suggestions?.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-elevation-3 z-50">
          <div className="p-6 text-center">
            <Icon name="Search" size={32} className="text-muted-foreground mx-auto mb-3" />
            <h4 className="text-sm font-medium text-foreground mb-1">No results found</h4>
            <p className="text-xs text-muted-foreground">
              Try searching for a different location or station name
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;