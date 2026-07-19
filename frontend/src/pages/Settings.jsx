import React, { useState } from 'react';
import { PageTitle } from '../components/common/PageTitle';
import { Card } from '../components/ui/Card';
import { Toggle } from '../components/ui/Toggle';
import { Button } from '../components/ui/Button';
import { BellRing, Laptop, LockKeyhole } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [matchingAlerts, setMatchingAlerts] = useState(true);

  const handleSave = () => {
    toast.success('Configuration options updated successfully.');
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto select-none">
      <PageTitle
        title="System Settings"
        description="Configure your notifications, security permissions, and communication preferences."
      />

      <div className="space-y-6">
        
        {/* Notifications Preference */}
        <Card className="p-8 space-y-6">
          <h4 className="text-base font-extrabold font-heading text-[#111111] flex items-center gap-2">
            <BellRing className="w-5 h-5 text-[#CD0000]" />
            Communication Channels & Alerts
          </h4>
          
          <div className="flex items-center justify-between py-3 border-t border-[#EEEEEE]">
            <div>
              <span className="text-xs font-bold font-heading uppercase text-[#111111] block">Email Match Digest</span>
              <span className="text-[10px] text-[#666666]">Receive new matched scholarship updates & deadline alerts</span>
            </div>
            <Toggle checked={emailAlerts} onChange={setEmailAlerts} />
          </div>

          <div className="flex items-center justify-between py-3 border-t border-[#EEEEEE]">
            <div>
              <span className="text-xs font-bold font-heading uppercase text-[#111111] block">SMS Urgent Notifications</span>
              <span className="text-[10px] text-[#666666]">Receive instant deadline warnings via SMS</span>
            </div>
            <Toggle checked={smsAlerts} onChange={setSmsAlerts} />
          </div>

          <div className="flex items-center justify-between py-3 border-t border-[#EEEEEE]">
            <div>
              <span className="text-xs font-bold font-heading uppercase text-[#111111] block">AI High-Score Push Alerts</span>
              <span className="text-[10px] text-[#666666]">Receive push alerts when AI match index exceeds 95%</span>
            </div>
            <Toggle checked={matchingAlerts} onChange={setMatchingAlerts} />
          </div>
        </Card>

        {/* Security Mockup */}
        <Card className="p-8 space-y-6">
          <h4 className="text-base font-extrabold font-heading text-[#111111] flex items-center gap-2">
            <LockKeyhole className="w-5 h-5 text-[#CD0000]" />
            Vault Security Controls
          </h4>
          <div className="flex items-center justify-between py-3 border-t border-[#EEEEEE]">
            <div>
              <span className="text-xs font-bold font-heading uppercase text-[#111111] block">Two-Factor Authentication</span>
              <span className="text-[10px] text-[#666666]">Add extra layer of security to your document vault</span>
            </div>
            <Button variant="secondary" className="!py-2 !px-4 text-xs font-heading uppercase tracking-wider">
              Enable 2FA
            </Button>
          </div>
        </Card>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="primary" onClick={handleSave} className="!py-3 !px-6 text-xs uppercase font-heading tracking-wider">
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
