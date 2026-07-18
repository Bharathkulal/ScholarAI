import React, { useState } from 'react';
import { PageTitle } from '../components/common/PageTitle';
import { Card } from '../components/ui/Card';
import { Toggle } from '../components/ui/Toggle';
import { Button } from '../components/ui/Button';
import { useTheme } from '../hooks/useTheme';
import { BellRing, ShieldAlert, Laptop, LockKeyhole } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [matchingAlerts, setMatchingAlerts] = useState(true);

  const handleSave = () => {
    toast.success('Configuration options updated successfully.');
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto select-none">
      <PageTitle
        title="Settings"
        description="Configure your notifications, security permissions, and visual appearances."
      />

      <div className="space-y-4">
        {/* Appearance Settings */}
        <Card className="space-y-4">
          <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Laptop className="w-4 h-4 text-primary-650" />
            Platform Appearance
          </h4>
          <div className="flex items-center justify-between py-2 border-t border-slate-100 dark:border-slate-750">
            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-205 block">Dark Mode</span>
              <span className="text-[10px] text-slate-400">Toggle dark visual mode</span>
            </div>
            <Toggle checked={theme === 'dark'} onChange={toggleTheme} />
          </div>
        </Card>

        {/* Notifications Preference */}
        <Card className="space-y-4">
          <h4 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <BellRing className="w-4 h-4 text-primary-655" />
            Communication Channels
          </h4>
          
          <div className="flex items-center justify-between py-2 border-t border-slate-100 dark:border-slate-750">
            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-205 block">Email Notifications</span>
              <span className="text-[10px] text-slate-400">Receive matched updates & deadline warnings via email</span>
            </div>
            <Toggle checked={emailAlerts} onChange={setEmailAlerts} />
          </div>

          <div className="flex items-center justify-between py-2 border-t border-slate-100 dark:border-slate-755">
            <div>
              <span className="text-xs font-bold text-slate-705 dark:text-slate-205 block">SMS Alerts</span>
              <span className="text-[10px] text-slate-400">Receive urgent warnings via SMS</span>
            </div>
            <Toggle checked={smsAlerts} onChange={setSmsAlerts} />
          </div>

          <div className="flex items-center justify-between py-2 border-t border-slate-100 dark:border-slate-755">
            <div>
              <span className="text-xs font-bold text-slate-705 dark:text-slate-205 block">AI Match Alerts</span>
              <span className="text-[10px] text-slate-400">Receive instant push notifications when matching confidence exceeds 90%</span>
            </div>
            <Toggle checked={matchingAlerts} onChange={setMatchingAlerts} />
          </div>
        </Card>

        {/* Security Mockup */}
        <Card className="space-y-4">
          <h4 className="text-sm font-bold text-slate-850 dark:text-white flex items-center gap-2">
            <LockKeyhole className="w-4 h-4 text-primary-655" />
            Account Security
          </h4>
          <div className="flex items-center justify-between py-2 border-t border-slate-100 dark:border-slate-755">
            <div>
              <span className="text-xs font-bold text-slate-705 dark:text-slate-205 block">Two-Factor Authentication</span>
              <span className="text-[10px] text-slate-405">Currently disabled</span>
            </div>
            <Button variant="secondary" className="!py-1.5 !text-xs">Configure 2FA</Button>
          </div>
        </Card>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="primary" onClick={handleSave}>
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
