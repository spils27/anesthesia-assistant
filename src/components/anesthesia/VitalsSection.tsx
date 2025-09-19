import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Vitals, Monitoring } from '@/types/anesthesia';

const SectionHeader = ({
  children
}: {
  children: React.ReactNode;
}) => (
  <div className="bg-primary text-primary-foreground p-3 font-semibold text-base mb-4 mx-0 py-[6px] px-[15px]">
    {children}
  </div>
);

interface VitalsSectionProps {
  vitals: Vitals;
  monitoring: Monitoring;
  onChange: (section: string, data: any) => void;
}

const VitalsSection: React.FC<VitalsSectionProps> = ({ vitals, monitoring, onChange }) => {
  const handleVitalsChange = (field: keyof Vitals, value: any) => {
    onChange('vitals', { [field]: value });
  };

  const handleMonitoringChange = (field: keyof Monitoring, value: boolean) => {
    onChange('monitoring', { [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Vital Signs */}
      <SectionHeader>Vital Signs</SectionHeader>
      
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Blood Pressure */}
            <div className="space-y-2">
              <Label htmlFor="bloodPressure">Blood Pressure</Label>
              <Input
                id="bloodPressure"
                value={vitals.bloodPressure}
                onChange={(e) => handleVitalsChange('bloodPressure', e.target.value)}
                placeholder="e.g., 120/80"
              />
            </div>

            {/* Pulse */}
            <div className="space-y-2">
              <Label htmlFor="pulse">Pulse (BPM)</Label>
              <Input
                id="pulse"
                type="number"
                value={vitals.pulse}
                onChange={(e) => handleVitalsChange('pulse', parseFloat(e.target.value) || 0)}
                placeholder="Heart rate"
              />
            </div>

            

            {/* SpO2 */}
            <div className="space-y-2">
              <Label htmlFor="spo2">SpO2 (%)</Label>
              <Input
                id="spo2"
                type="number"
                value={vitals.spo2}
                onChange={(e) => handleVitalsChange('spo2', parseFloat(e.target.value) || 0)}
                placeholder="Oxygen saturation"
                min="0"
                max="100"
              />
            </div>

            {/* Respiration */}
            <div className="space-y-2">
              <Label htmlFor="respiration">Respiration (RPM)</Label>
              <Input
                id="respiration"
                type="number"
                value={vitals.respiration}
                onChange={(e) => handleVitalsChange('respiration', parseFloat(e.target.value) || 0)}
                placeholder="Breathing rate"
              />
            </div>

            {/* EtCO2 */}
            <div className="space-y-2">
              <Label htmlFor="etco2">EtCO2 (mmHg)</Label>
              <Input
                id="etco2"
                type="number"
                value={vitals.etco2 || ''}
                onChange={(e) => handleVitalsChange('etco2', parseFloat(e.target.value) || undefined)}
                placeholder="End-tidal CO2"
                step="0.1"
              />
            </div>

            {/* Fasting Blood Glucose */}
            <div className="space-y-2">
              <Label htmlFor="fbg">Fasting Blood Glucose (mg/dL)</Label>
              <Input
                id="fbg"
                type="number"
                value={vitals.fbg || ''}
                onChange={(e) => handleVitalsChange('fbg', parseFloat(e.target.value) || undefined)}
                placeholder="Blood glucose level"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monitoring Equipment */}
      <SectionHeader>Monitoring Equipment</SectionHeader>
      
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="bloodPressureCuff"
                checked={monitoring.bloodPressureCuff}
                onCheckedChange={(checked) => handleMonitoringChange('bloodPressureCuff', checked)}
              />
              <Label htmlFor="bloodPressureCuff">Blood Pressure Cuff</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="ecg"
                checked={monitoring.ecg}
                onCheckedChange={(checked) => handleMonitoringChange('ecg', checked)}
              />
              <Label htmlFor="ecg">ECG</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="pulseOximetry"
                checked={monitoring.pulseOximetry}
                onCheckedChange={(checked) => handleMonitoringChange('pulseOximetry', checked)}
              />
              <Label htmlFor="pulseOximetry">Pulse Oximetry</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="respirationMonitor"
                checked={monitoring.respiration}
                onCheckedChange={(checked) => handleMonitoringChange('respiration', checked)}
              />
              <Label htmlFor="respirationMonitor">Respiration Monitor</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="etco2Monitor"
                checked={monitoring.etco2}
                onCheckedChange={(checked) => handleMonitoringChange('etco2', checked)}
              />
              <Label htmlFor="etco2Monitor">EtCO2 Monitor</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      
    </div>
  );
};

export default VitalsSection;
