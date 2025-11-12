import React from 'react';
import { toINR } from '../../../utils/currency';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const FilterControls = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  onExportData,
  totalBookings,
  filteredCount 
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'completed', label: 'Completed' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'active', label: 'Active' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const sortOptions = [
    { value: 'date-desc', label: 'Latest First' },
    { value: 'date-asc', label: 'Oldest First' },
    { value: 'cost-desc', label: 'Highest Cost' },
    { value: 'cost-asc', label: 'Lowest Cost' },
    { value: 'station-name', label: 'Station Name' }
  ];

  const paymentMethodOptions = [
    { value: 'all', label: 'All Payment Methods' },
    { value: 'credit-card', label: 'Credit Card' },
    { value: 'debit-card', label: 'Debit Card' },
    { value: 'upi', label: 'UPI' },
    { value: 'wallet', label: 'Digital Wallet' }
  ];

  const handleInputChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 lg:p-6 mb-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Filter Bookings</h2>
          <p className="text-sm text-muted-foreground">
            Showing {filteredCount} of {totalBookings} bookings
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            iconName="X"
            iconPosition="left"
            iconSize={16}
          >
            Clear Filters
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onExportData}
            iconName="Download"
            iconPosition="left"
            iconSize={16}
          >
            Export Data
          </Button>
        </div>
      </div>
      {/* Search */}
      <div className="mb-6">
        <Input
          type="search"
          placeholder="Search by station name, location, or booking ID..."
          value={filters?.search}
          onChange={(e) => handleInputChange('search', e?.target?.value)}
          className="w-full"
        />
      </div>
      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Status Filter */}
        <Select
          label="Status"
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => handleInputChange('status', value)}
        />

        {/* Sort By */}
        <Select
          label="Sort By"
          options={sortOptions}
          value={filters?.sortBy}
          onChange={(value) => handleInputChange('sortBy', value)}
        />

        {/* Payment Method */}
        <Select
          label="Payment Method"
          options={paymentMethodOptions}
          value={filters?.paymentMethod}
          onChange={(value) => handleInputChange('paymentMethod', value)}
        />

        {/* Date Range Quick Select */}
        <Select
          label="Date Range"
          options={[
            { value: 'all', label: 'All Time' },
            { value: 'today', label: 'Today' },
            { value: 'week', label: 'This Week' },
            { value: 'month', label: 'This Month' },
            { value: 'quarter', label: 'This Quarter' },
            { value: 'year', label: 'This Year' },
            { value: 'custom', label: 'Custom Range' }
          ]}
          value={filters?.dateRange}
          onChange={(value) => handleInputChange('dateRange', value)}
        />
      </div>
      {/* Custom Date Range */}
      {filters?.dateRange === 'custom' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input
            type="date"
            label="From Date"
            value={filters?.startDate}
            onChange={(e) => handleInputChange('startDate', e?.target?.value)}
          />
          <Input
            type="date"
            label="To Date"
            value={filters?.endDate}
            onChange={(e) => handleInputChange('endDate', e?.target?.value)}
          />
        </div>
      )}
      {/* Cost Range Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="number"
          label={`Min Cost (${toINR(0)})`}
          placeholder={toINR(0)}
          value={filters?.minCost}
          onChange={(e) => handleInputChange('minCost', e?.target?.value)}
          min="0"
          step="0.01"
        />
        <Input
          type="number"
          label={`Max Cost (${toINR(999.99)})`}
          placeholder={toINR(999.99)}
          value={filters?.maxCost}
          onChange={(e) => handleInputChange('maxCost', e?.target?.value)}
          min="0"
          step="0.01"
        />
      </div>
      {/* Active Filters Display */}
      {(filters?.search || filters?.status !== 'all' || filters?.paymentMethod !== 'all' || 
        filters?.dateRange !== 'all' || filters?.minCost || filters?.maxCost) && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-foreground">Active Filters:</span>
            
            {filters?.search && (
              <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-md flex items-center gap-1">
                Search: "{filters?.search}"
                <button onClick={() => handleInputChange('search', '')}>
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            
            {filters?.status !== 'all' && (
              <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-md flex items-center gap-1">
                Status: {statusOptions?.find(opt => opt?.value === filters?.status)?.label}
                <button onClick={() => handleInputChange('status', 'all')}>
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            
            {filters?.paymentMethod !== 'all' && (
              <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-md flex items-center gap-1">
                Payment: {paymentMethodOptions?.find(opt => opt?.value === filters?.paymentMethod)?.label}
                <button onClick={() => handleInputChange('paymentMethod', 'all')}>
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            
            {filters?.dateRange !== 'all' && (
              <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-md flex items-center gap-1">
                Date: {filters?.dateRange === 'custom' ? 'Custom Range' : 
                  filters?.dateRange?.charAt(0)?.toUpperCase() + filters?.dateRange?.slice(1)}
                <button onClick={() => handleInputChange('dateRange', 'all')}>
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterControls;