import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const Security = () => {
  const [twoFA, setTwoFA] = useState(false);
  const [sessions] = useState([
    { id: 's1', device: 'Chrome on Windows', when: '2025-09-15 09:12' },
    { id: 's2', device: 'iPhone 14', when: '2025-09-14 18:45' }
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Change Password</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Current password" type="password" />
          <Input label="New password" type="password" />
          <Input label="Confirm new password" type="password" />
        </div>
        <div className="mt-4">
          <Button variant="default">Update Password</Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Two-Factor Authentication (2FA)</h3>
        <div className="flex items-center gap-4">
          <Checkbox checked={twoFA} onChange={(e) => setTwoFA(e?.target?.checked)} />
          <div>
            <div className="text-sm font-medium">Enable 2FA</div>
            <div className="text-xs text-muted-foreground">Use authenticator apps or SMS for additional security</div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Active Sessions</h3>
        <div className="space-y-2">
          {sessions.map(s => (
            <div key={s.id} className="flex items-center justify-between p-3 bg-muted rounded">
              <div>
                <div className="text-sm font-medium">{s.device}</div>
                <div className="text-xs text-muted-foreground">Last active: {s.when}</div>
              </div>
              <div>
                <Button variant="outline" size="sm">Sign out</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Security;
