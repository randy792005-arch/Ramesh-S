import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const Integrations = () => {
  const [calendarEnabled, setCalendarEnabled] = useState(false);

  const handleExport = () => {
    // placeholder export
    const csv = 'Booking ID,Station,Date,Amount\nTC-001,Sample Station,2025-09-15,1658';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'bookings-export.csv'; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Google Calendar</h3>
        <div className="flex items-center gap-4">
          <Checkbox checked={calendarEnabled} onChange={(e) => setCalendarEnabled(e?.target?.checked)} />
          <div>
            <div className="text-sm font-medium">Auto-add bookings to Google Calendar</div>
            <div className="text-xs text-muted-foreground">Authorize Google to add events</div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Export Data</h3>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleExport}>Export CSV</Button>
          <Button variant="outline">Export Excel</Button>
        </div>
      </div>
    </div>
  );
};

export default Integrations;
