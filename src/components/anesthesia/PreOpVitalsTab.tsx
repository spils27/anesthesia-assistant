import React from 'react';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PreOpVitals, PreOpInstructions } from '@/types/anesthesia';

const SectionHeader = ({
  children
}: {
  children: React.ReactNode;
}) => (
  <div className="bg-primary text-primary-foreground p-3 font-semibold text-base mb-4 mx-0 py-[6px] px-[15px]">
    {children}
  </div>
);

interface PreOpVitalsTabProps {
  data: PreOpVitals;
  onChange: (data: PreOpVitals) => void;
  instructions?: PreOpInstructions;
  onChangeInstructions?: (data: PreOpInstructions) => void;
}

const PreOpVitalsTab: React.FC<PreOpVitalsTabProps> = ({ data, onChange, instructions, onChangeInstructions }) => {
  const updateField = (field: keyof PreOpVitals, value: any) => {
    onChange({ ...data, [field]: value });
  };

  // Hydrate height/weight from Patient Info stored in localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('patientInfo');
      if (stored) {
        const patient = JSON.parse(stored) as { height: number; weight: number; age: number };
        const heightDisplay = patient.height ? String(Math.round(patient.height)) : data.height;
        const weightLbsDisplay = patient.weight ? String(Math.round(patient.weight * 2.20462)) : data.weightLbs;
        const weightKgDisplay = patient.weight ? String(patient.weight) : data.weightKg;
        const next = {
          ...data,
          height: heightDisplay,
          weightLbs: weightLbsDisplay,
          weightKg: weightKgDisplay
        };
        if (next.height !== data.height || next.weightLbs !== data.weightLbs || next.weightKg !== data.weightKg) {
          onChange(next);
        }
      }
    } catch {}
  // run once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Local UI state to mirror Patient Info formatting
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('lbs');
  const [heightUnit, setHeightUnit] = useState<'inches' | 'cm'>('inches');
  const [heightFeet, setHeightFeet] = useState<number>(0);
  const [heightInches, setHeightInches] = useState<number>(0);

  // Initialize feet/inches from patient height (in inches) if available
  useEffect(() => {
    try {
      const stored = localStorage.getItem('patientInfo');
      if (stored) {
        const patient = JSON.parse(stored) as { height: number; weight: number };
        if (patient.height && patient.height > 0) {
          const totalIn = Math.round(patient.height);
          setHeightFeet(Math.floor(totalIn / 12));
          setHeightInches(totalIn % 12);
        }
      }
    } catch {}
  }, []);

  // Handlers mirroring Patient Info logic
  const handleWeightChange = (value: string, unit: 'kg' | 'lbs') => {
    const num = parseFloat(value) || 0;
    // Update display fields in this tab for visibility
    if (unit === 'kg') {
      updateField('weightKg', value);
      updateField('weightLbs', String(Math.round(num * 2.20462)));
    } else {
      updateField('weightLbs', value);
      updateField('weightKg', String(Math.round((num / 2.20462) * 10) / 10));
    }
    // Persist to patient info for global consistency
    try {
      const stored = localStorage.getItem('patientInfo');
      const patient = stored ? JSON.parse(stored) : {};
      const weightKg = unit === 'kg' ? num : (num / 2.20462);
      const merged = { ...patient, weight: Math.max(0, Math.round(weightKg * 10) / 10) };
      localStorage.setItem('patientInfo', JSON.stringify(merged));
    } catch {}
  };

  const handleHeightChange = (value: string, unit: 'inches' | 'cm') => {
    const num = parseFloat(value) || 0;
    const inches = unit === 'inches' ? num : (num / 2.54);
    updateField('height', String(Math.round(inches)));
    try {
      const stored = localStorage.getItem('patientInfo');
      const patient = stored ? JSON.parse(stored) : {};
      const merged = { ...patient, height: Math.max(0, Math.round(inches)) };
      localStorage.setItem('patientInfo', JSON.stringify(merged));
    } catch {}
  };

  const handleFeetInchesChange = (feet: number, inches: number) => {
    const total = feet * 12 + inches;
    setHeightFeet(feet);
    setHeightInches(inches);
    updateField('height', String(total));
    try {
      const stored = localStorage.getItem('patientInfo');
      const patient = stored ? JSON.parse(stored) : {};
      const merged = { ...patient, height: total };
      localStorage.setItem('patientInfo', JSON.stringify(merged));
    } catch {}
  };

  return (
    <div className="space-y-6">
      {/* Surgery Info */}
      <Card>
        <CardContent className="p-6">
          <SectionHeader>Surgery Info</SectionHeader>
          
          <div className="space-y-4">
            {/* Surgeon name and Sedation by Surgeon first */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <Label className="text-sm font-medium">Surgeon Name:</Label>
                <Input
                  value={data.surgeonName}
                  onChange={(e) => updateField('surgeonName', e.target.value)}
                  className="w-48 h-8"
                  placeholder=""
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sedation-by-surgeon"
                  checked={data.sedationBySurgeon}
                  onCheckedChange={(checked) => updateField('sedationBySurgeon', checked)}
                />
                <Label htmlFor="sedation-by-surgeon" className="text-sm">
                  Sedation administered by Surgeon.
                </Label>
              </div>
            </div>

            {/* Time-out verification after */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="timeout-verification"
                checked={data.timeoutVerification}
                onCheckedChange={(checked) => updateField('timeoutVerification', checked)}
              />
              <Label htmlFor="timeout-verification" className="text-sm">
                Time-out w/ verification of correct Pt ID (full name/DOB) & correct procedure completed
              </Label>
            </div>

            {/* In Advance of Surgery instructions (moved here per request) */}
            <div className="mt-4">
              <div className="text-base font-semibold mb-2">In Advance of Surgery, the Patient was given Written & Verbal</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="preop-instructions"
                  checked={Boolean(instructions?.preOpInstructions)}
                  onCheckedChange={(checked) =>
                    onChangeInstructions?.({
                      preOpInstructions: Boolean(checked),
                      postOpInstructions: Boolean(instructions?.postOpInstructions),
                      additionalNotes: instructions?.additionalNotes || ''
                    })
                  }
                />
                <Label htmlFor="preop-instructions" className="text-sm">Pre-Op Instructions</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="postop-instructions"
                  checked={Boolean(instructions?.postOpInstructions)}
                  onCheckedChange={(checked) =>
                    onChangeInstructions?.({
                      preOpInstructions: Boolean(instructions?.preOpInstructions),
                      postOpInstructions: Boolean(checked),
                      additionalNotes: instructions?.additionalNotes || ''
                    })
                  }
                />
                <Label htmlFor="postop-instructions" className="text-sm">Post-Op Instructions</Label>
              </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Level of Sedation */}
      <Card>
        <CardContent className="p-6">
          <SectionHeader>Level of Sedation</SectionHeader>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sedation-nitrous"
                checked={data.sedationLevel === 'nitrous'}
                onCheckedChange={(checked) => updateField('sedationLevel', checked ? 'nitrous' : '')}
              />
              <Label htmlFor="sedation-nitrous" className="text-sm">Nitrous Oxide</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sedation-level1"
                checked={data.sedationLevel === 'level1'}
                onCheckedChange={(checked) => updateField('sedationLevel', checked ? 'level1' : '')}
              />
              <Label htmlFor="sedation-level1" className="text-sm">Level 1: Minimal Sedation</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sedation-level2"
                checked={data.sedationLevel === 'level2'}
                onCheckedChange={(checked) => updateField('sedationLevel', checked ? 'level2' : '')}
              />
              <Label htmlFor="sedation-level2" className="text-sm">Level 2: Moderate Enteral</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sedation-level3"
                checked={data.sedationLevel === 'level3'}
                onCheckedChange={(checked) => updateField('sedationLevel', checked ? 'level3' : '')}
              />
              <Label htmlFor="sedation-level3" className="text-sm">Level 3: Moderate Parenteral</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pre-Operative Vitals */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <SectionHeader>Pre-Operative Vitals</SectionHeader>
            <div className="flex items-center space-x-2 ml-4">
              <Checkbox
                id="taken-day-of-procedure"
                checked={Boolean(data.takenDayOfProcedure)}
                onCheckedChange={(checked) => {
                  updateField('takenDayOfProcedure', checked);
                  try {
                    const snapshot = {
                      bloodPressure: data.bloodPressure,
                      pulse: data.pulse,
                      spo2: data.spo2,
                      respiratoryRate: data.respiratoryRate
                    };
                    if (checked) {
                      localStorage.setItem('preOpVitalsSnapshot', JSON.stringify(snapshot));
                    } else {
                      localStorage.removeItem('preOpVitalsSnapshot');
                    }
                  } catch {}
                }}
              />
              <Label htmlFor="taken-day-of-procedure" className="text-sm">Taken day of procedure</Label>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Height</Label>
              {heightUnit === 'inches' ? (
                <div className="flex gap-2">
                  <Input
                    value={String(heightFeet)}
                    onChange={(e) => handleFeetInchesChange(parseInt(e.target.value) || 0, heightInches)}
                    placeholder="ft"
                    className="h-8 w-16"
                    type="number"
                    min={0}
                    max={8}
                  />
                  <Input
                    value={String(heightInches)}
                    onChange={(e) => handleFeetInchesChange(heightFeet, parseInt(e.target.value) || 0)}
                    placeholder="in"
                    className="h-8 w-16"
                    type="number"
                    min={0}
                    max={11}
                  />
                  <Select value={heightUnit} onValueChange={(v: 'inches' | 'cm') => setHeightUnit(v)}>
                    <SelectTrigger className="w-20 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inches">ft/in</SelectItem>
                      <SelectItem value="cm">cm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    value={String(Math.round((parseFloat(data.height || '0') || 0) * 2.54))}
                    onChange={(e) => handleHeightChange(e.target.value, 'cm')}
                    placeholder="cm"
                    className="h-8"
                    type="number"
                    min={0}
                  />
                  <Select value={heightUnit} onValueChange={(v: 'inches' | 'cm') => setHeightUnit(v)}>
                    <SelectTrigger className="w-20 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inches">ft/in</SelectItem>
                      <SelectItem value="cm">cm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Weight</Label>
              <div className="flex gap-2">
                <Input
                  value={weightUnit === 'kg' ? (data.weightKg || '') : (data.weightLbs || '')}
                  onChange={(e) => handleWeightChange(e.target.value, weightUnit)}
                  placeholder={weightUnit === 'kg' ? 'kg' : 'lbs'}
                  className="h-8"
                  type="number"
                  min={0}
                  step={0.1}
                />
                <Select value={weightUnit} onValueChange={(v: 'kg' | 'lbs') => setWeightUnit(v)}>
                  <SelectTrigger className="w-20 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="lbs">lbs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Blood Pressure</Label>
              <Input
                value={data.bloodPressure}
                onChange={(e) => updateField('bloodPressure', e.target.value)}
                placeholder=""
                className="h-8"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Pulse</Label>
              <Input
                value={data.pulse}
                onChange={(e) => updateField('pulse', e.target.value)}
                placeholder=""
                className="h-8"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">SpO2</Label>
              <Input
                value={data.spo2}
                onChange={(e) => updateField('spo2', e.target.value)}
                placeholder=""
                className="h-8"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">RR (Obs)</Label>
              <Input
                value={data.respiratoryRate}
                onChange={(e) => updateField('respiratoryRate', e.target.value)}
                placeholder=""
                className="h-8"
              />
            </div>
            
            
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">FSBG (mg/dl)</Label>
              <Input
                value={data.fsbg}
                onChange={(e) => updateField('fsbg', e.target.value)}
                placeholder=""
                className="h-8"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Time (24hr format)</Label>
              <Input
                value={data.time}
                onChange={(e) => updateField('time', e.target.value)}
                placeholder=""
                className="h-8"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Equipment Readiness Check */}
      <Card>
        <CardContent className="p-6">
          <SectionHeader>Pre-Procedure Equipment Readiness Check</SectionHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Date</Label>
              <Input
                value={data.equipmentDate}
                onChange={(e) => updateField('equipmentDate', e.target.value)}
                placeholder=""
                className="h-8"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Completed By:</Label>
              <Input
                value={data.equipmentCompletedBy}
                onChange={(e) => updateField('equipmentCompletedBy', e.target.value)}
                placeholder=""
                className="h-8"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Notes:</Label>
              <Textarea
                value={data.equipmentNotes}
                onChange={(e) => updateField('equipmentNotes', e.target.value)}
                placeholder=""
                className="min-h-[60px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PreOpVitalsTab;
