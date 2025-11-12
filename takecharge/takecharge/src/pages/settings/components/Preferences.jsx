import React, { useState, useEffect } from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const Preferences = () => {
  const [radius, setRadius] = useState(10);
  const [chargerType, setChargerType] = useState('any');
  const [language, setLanguage] = useState('en');
  const [themeDark, setThemeDark] = useState(false);

  useEffect(() => {
    // Initialize theme from localStorage or prefers-color-scheme
    const stored = window.localStorage?.getItem('takecharge_theme');
    if (stored === 'dark') {
      setThemeDark(true);
      document.documentElement?.setAttribute('data-theme', 'dark');
    } else if (stored === 'light') {
      setThemeDark(false);
      document.documentElement?.removeAttribute('data-theme');
    } else {
      // fallback to system preference
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)')?.matches;
      if (prefersDark) {
        setThemeDark(true);
        document.documentElement?.setAttribute('data-theme', 'dark');
      }
    }
  }, []);

  const applyTheme = (dark) => {
    if (dark) {
      document.documentElement?.setAttribute('data-theme', 'dark');
      window.localStorage?.setItem('takecharge_theme', 'dark');
    } else {
      document.documentElement?.removeAttribute('data-theme');
      window.localStorage?.setItem('takecharge_theme', 'light');
    }
    setThemeDark(dark);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Default search radius (km)" type="number" value={radius} onChange={e => setRadius(e?.target?.value)} />
        <Select
          label="Preferred charger type"
          options={[{value:'any', label:'Any'},{value:'ac',label:'AC'},{value:'dc',label:'DC'},{value:'fast',label:'Fast'}]}
          value={chargerType}
          onChange={setChargerType}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Language"
          options={[{value:'en',label:'English'},{value:'hi',label:'Hindi'},{value:'mr',label:'Marathi'},{value:'ta',label:'Tamil'}]}
          value={language}
          onChange={setLanguage}
        />
        <div>
          <label className="text-sm font-medium text-foreground">Theme</label>
          <div className="mt-2 flex items-center gap-4">
            <Checkbox checked={!themeDark} onChange={() => applyTheme(false)} />
            <span>Light</span>
            <Checkbox checked={themeDark} onChange={() => applyTheme(true)} />
            <span>Dark</span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">Save Preferences</button>
      </div>
    </div>
  );
};

export default Preferences;
