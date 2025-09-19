import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SurgicalProcedure, LocalAnesthetic, FluidManagement, AirwayProtection, TimeSummary } from '@/types/anesthesia';
import IntraOpMedicationTracker from './IntraOpMedicationTracker';

const SectionHeader = ({
  children
}: {
  children: React.ReactNode;
}) => (
  <div className="bg-primary text-primary-foreground p-3 font-semibold text-base mb-4 mx-0 py-[6px] px-[15px]">
    {children}
  </div>
);

interface IntraOpSectionProps {
  surgicalProcedure: SurgicalProcedure;
  localAnesthetic: LocalAnesthetic;
  fluidManagement: FluidManagement;
  airwayProtection: AirwayProtection;
  timeSummary: TimeSummary;
  onChange: (section: string, data: any) => void;
}

const IntraOpSection: React.FC<IntraOpSectionProps> = ({ 
  surgicalProcedure, 
  localAnesthetic, 
  fluidManagement, 
  airwayProtection, 
  timeSummary, 
  onChange 
}) => {
  const [medications, setMedications] = useState<any[]>([]);
  const [gases, setGases] = useState<any[]>([]);
  const [consciousnessLevels, setConsciousnessLevels] = useState<any[]>([]);

  const handleSurgicalProcedureChange = (field: keyof SurgicalProcedure, value: any) => {
    onChange('surgicalProcedure', { [field]: value });
  };

  const handleLocalAnestheticChange = (field: keyof LocalAnesthetic, value: any) => {
    onChange('localAnesthetic', { [field]: value });
  };

  const handleFluidManagementChange = (field: keyof FluidManagement, value: any) => {
    onChange('fluidManagement', { [field]: value });
  };

  const handleAirwayProtectionChange = (field: keyof AirwayProtection, value: boolean) => {
    onChange('airwayProtection', { [field]: value });
  };

  const handleTimeSummaryChange = (field: keyof TimeSummary, value: any) => {
    onChange('timeSummary', { [field]: value });
  };

  const handleMedicationsChange = (newMedications: any[]) => {
    setMedications(newMedications);
    onChange('medications', newMedications);
  };

  const handleGasesChange = (newGases: any[]) => {
    setGases(newGases);
    onChange('gases', newGases);
  };

  const handleConsciousnessChange = (newLevels: any[]) => {
    setConsciousnessLevels(newLevels);
    onChange('consciousnessLevels', newLevels);
  };

  return (
    <div className="space-y-6">
      {/* Intraoperative Medication & Gas Tracking */}
      <IntraOpMedicationTracker
        onMedicationsChange={handleMedicationsChange}
        onGasesChange={handleGasesChange}
        onConsciousnessChange={handleConsciousnessChange}
      />

      {/* Surgical Procedure */}
      <SectionHeader>Surgical Procedure</SectionHeader>
      
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="procedure">Procedure</Label>
              <Input
                id="procedure"
                value={surgicalProcedure.procedure}
                onChange={(e) => handleSurgicalProcedureChange('procedure', e.target.value)}
                placeholder="Describe the surgical procedure"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="teeth">Teeth Involved</Label>
              <Input
                id="teeth"
                value={surgicalProcedure.teeth.join(', ')}
                onChange={(e) => handleSurgicalProcedureChange('teeth', e.target.value.split(',').map(t => t.trim()).filter(t => t))}
                placeholder="e.g., 1, 2, 3 (comma-separated)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="technique">Technique</Label>
              <Input
                id="technique"
                value={surgicalProcedure.technique.join(', ')}
                onChange={(e) => handleSurgicalProcedureChange('technique', e.target.value.split(',').map(t => t.trim()).filter(t => t))}
                placeholder="e.g., Extraction, Implant (comma-separated)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="complications">Complications</Label>
              <Textarea
                id="complications"
                value={surgicalProcedure.complications}
                onChange={(e) => handleSurgicalProcedureChange('complications', e.target.value)}
                placeholder="Describe any complications"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={surgicalProcedure.notes}
                onChange={(e) => handleSurgicalProcedureChange('notes', e.target.value)}
                placeholder="Additional procedure notes"
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Local Anesthetic */}
      <SectionHeader>Local Anesthetic</SectionHeader>
      
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="articaine"
                  checked={localAnesthetic.articaine}
                  onCheckedChange={(checked) => handleLocalAnestheticChange('articaine', checked)}
                />
                <Label htmlFor="articaine">Articaine</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="bupivicaine"
                  checked={localAnesthetic.bupivicaine}
                  onCheckedChange={(checked) => handleLocalAnestheticChange('bupivicaine', checked)}
                />
                <Label htmlFor="bupivicaine">Bupivicaine</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="mepivicaine"
                  checked={localAnesthetic.mepivicaine}
                  onCheckedChange={(checked) => handleLocalAnestheticChange('mepivicaine', checked)}
                />
                <Label htmlFor="mepivicaine">Mepivicaine</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="lidocaine"
                  checked={localAnesthetic.lidocaine}
                  onCheckedChange={(checked) => handleLocalAnestheticChange('lidocaine', checked)}
                />
                <Label htmlFor="lidocaine">Lidocaine</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="carpules">Number of Carpules</Label>
              <Input
                id="carpules"
                type="number"
                value={localAnesthetic.carpules}
                onChange={(e) => handleLocalAnestheticChange('carpules', parseFloat(e.target.value) || 0)}
                placeholder="Total carpules used"
                min="0"
                step="0.5"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fluid Management */}
      <SectionHeader>Fluid Management</SectionHeader>
      
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="lactatedRinger">Lactated Ringer (mL)</Label>
              <Input
                id="lactatedRinger"
                type="number"
                value={fluidManagement.lactatedRinger}
                onChange={(e) => handleFluidManagementChange('lactatedRinger', parseFloat(e.target.value) || 0)}
                placeholder="Volume"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="normalSaline">Normal Saline (mL)</Label>
              <Input
                id="normalSaline"
                type="number"
                value={fluidManagement.normalSaline}
                onChange={(e) => handleFluidManagementChange('normalSaline', parseFloat(e.target.value) || 0)}
                placeholder="Volume"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dextrose5">D5W (mL)</Label>
              <Input
                id="dextrose5"
                type="number"
                value={fluidManagement.dextrose5}
                onChange={(e) => handleFluidManagementChange('dextrose5', parseFloat(e.target.value) || 0)}
                placeholder="Volume"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ebl">Estimated Blood Loss (mL)</Label>
              <Input
                id="ebl"
                type="number"
                value={fluidManagement.ebl}
                onChange={(e) => handleFluidManagementChange('ebl', parseFloat(e.target.value) || 0)}
                placeholder="EBL"
                min="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Airway Protection */}
      <SectionHeader>Airway Protection</SectionHeader>
      
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="oropharyngealDrape"
                checked={airwayProtection.oropharyngealDrape}
                onCheckedChange={(checked) => handleAirwayProtectionChange('oropharyngealDrape', checked)}
              />
              <Label htmlFor="oropharyngealDrape">Oropharyngeal Drape</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="gauzePack"
                checked={airwayProtection.gauzePack}
                onCheckedChange={(checked) => handleAirwayProtectionChange('gauzePack', checked)}
              />
              <Label htmlFor="gauzePack">Gauze Pack</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="biteBlock"
                checked={airwayProtection.biteBlock}
                onCheckedChange={(checked) => handleAirwayProtectionChange('biteBlock', checked)}
              />
              <Label htmlFor="biteBlock">Bite Block</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="tmjStabilization"
                checked={airwayProtection.tmjStabilization}
                onCheckedChange={(checked) => handleAirwayProtectionChange('tmjStabilization', checked)}
              />
              <Label htmlFor="tmjStabilization">TMJ Stabilization</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Summary */}
      <SectionHeader>Time Summary</SectionHeader>
      
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="anesthesiaStart">Anesthesia Start</Label>
              <Input
                id="anesthesiaStart"
                type="time"
                value={timeSummary.anesthesiaStart}
                onChange={(e) => handleTimeSummaryChange('anesthesiaStart', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="anesthesiaEnd">Anesthesia End</Label>
              <Input
                id="anesthesiaEnd"
                type="time"
                value={timeSummary.anesthesiaEnd}
                onChange={(e) => handleTimeSummaryChange('anesthesiaEnd', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="operationStart">Operation Start</Label>
              <Input
                id="operationStart"
                type="time"
                value={timeSummary.operationStart}
                onChange={(e) => handleTimeSummaryChange('operationStart', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="operationEnd">Operation End</Label>
              <Input
                id="operationEnd"
                type="time"
                value={timeSummary.operationEnd}
                onChange={(e) => handleTimeSummaryChange('operationEnd', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="airwayMaintenance">Airway Maintenance</Label>
              <Input
                id="airwayMaintenance"
                type="time"
                value={timeSummary.airwayMaintenance}
                onChange={(e) => handleTimeSummaryChange('airwayMaintenance', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntraOpSection;
