import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const PaymentBilling = () => {
  const [methods] = useState([
    { id: 'upi-1', type: 'UPI', label: 'randy@upi' },
    { id: 'card-1', type: 'Card', label: '**** **** **** 4242' }
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Saved Payment Methods</h3>
        <div className="space-y-2">
          {methods.map(m => (
            <div key={m.id} className="flex items-center justify-between p-3 bg-muted rounded">
              <div>
                <div className="text-sm font-medium">{m.type}</div>
                <div className="text-xs text-muted-foreground">{m.label}</div>
              </div>
              <div className="space-x-2">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="destructive" size="sm">Remove</Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Billing Address & GST</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Company / Name" />
          <Input label="GSTIN (optional)" />
          <Input label="Address Line 1" />
          <Input label="City, State, PIN" />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Invoices</h3>
        <p className="text-sm text-muted-foreground mb-2">View or download past invoices</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-muted rounded">
            <div>
              <div className="text-sm font-medium">Invoice - 2025-09-15</div>
              <div className="text-xs text-muted-foreground">Amount: ₹1,658.00</div>
            </div>
            <div className="space-x-2">
              <Button variant="outline" size="sm">View</Button>
              <Button variant="default" size="sm">Download</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <Button variant="default">Save Billing Info</Button>
      </div>
    </div>
  );
};

export default PaymentBilling;
