import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { Medications } from '@/types/anesthesia';

const SectionHeader = ({
  children
}: {
  children: React.ReactNode;
}) => (
  <div className="bg-primary text-primary-foreground p-3 font-semibold text-base mb-4 mx-0 py-[6px] px-[15px]">
    {children}
  </div>
);

interface MedicationsSectionProps {
  medications: Medications;
  onChange: (data: Medications) => void;
}

const MedicationsSection: React.FC<MedicationsSectionProps> = ({ medications, onChange }) => {
  const handlePreSedMedsChange = (field: keyof typeof medications.preSedMeds, value: any) => {
    onChange({
      ...medications,
      preSedMeds: {
        ...medications.preSedMeds,
        [field]: value
      }
    });
  };

  const handleAntiemeticsChange = (field: keyof typeof medications.antiemetics, value: any) => {
    onChange({
      ...medications,
      antiemetics: {
        ...medications.antiemetics,
        [field]: value
      }
    });
  };

  const handleOxygenChange = (field: keyof typeof medications.oxygen, value: any) => {
    onChange({
      ...medications,
      oxygen: {
        ...medications.oxygen,
        [field]: value
      }
    });
  };

  const addDrugLog = () => {
    const newDrug = {
      name: '',
      time: '',
      dose: '',
      used: false,
      wasted: false,
      witness: '',
      initials: '',
      total: ''
    };
    
    onChange({
      ...medications,
      loggedDrugs: [...medications.loggedDrugs, newDrug]
    });
  };

  const updateDrugLog = (index: number, field: string, value: any) => {
    const updatedDrugs = medications.loggedDrugs.map((drug, i) => 
      i === index ? { ...drug, [field]: value } : drug
    );
    
    onChange({
      ...medications,
      loggedDrugs: updatedDrugs
    });
  };

  const removeDrugLog = (index: number) => {
    const updatedDrugs = medications.loggedDrugs.filter((_, i) => i !== index);
    onChange({
      ...medications,
      loggedDrugs: updatedDrugs
    });
  };

  return (
    <div className="space-y-6">
      {/* Pre-Sedation Medications */}
      <SectionHeader>Pre-Sedation Medications</SectionHeader>
      
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="halcion"
                checked={medications.preSedMeds.halcion}
                onCheckedChange={(checked) => handlePreSedMedsChange('halcion', checked)}
              />
              <Label htmlFor="halcion">Halcion</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preSedDose">Dose</Label>
              <Input
                id="preSedDose"
                value={medications.preSedMeds.dose}
                onChange={(e) => handlePreSedMedsChange('dose', e.target.value)}
                placeholder="e.g., 0.25mg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preSedTime">Time Given</Label>
              <Input
                id="preSedTime"
                type="time"
                value={medications.preSedMeds.time}
                onChange={(e) => handlePreSedMedsChange('time', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Antiemetics */}
      <SectionHeader>Antiemetics</SectionHeader>
      
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="zofran"
                checked={medications.antiemetics.zofran}
                onCheckedChange={(checked) => handleAntiemeticsChange('zofran', checked)}
              />
              <Label htmlFor="zofran">Zofran</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="antiemetic1">Other 1</Label>
              <Input
                id="antiemetic1"
                value={medications.antiemetics.other1}
                onChange={(e) => handleAntiemeticsChange('other1', e.target.value)}
                placeholder="Medication name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="antiemetic2">Other 2</Label>
              <Input
                id="antiemetic2"
                value={medications.antiemetics.other2}
                onChange={(e) => handleAntiemeticsChange('other2', e.target.value)}
                placeholder="Medication name"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Oxygen */}
      <SectionHeader>Oxygen</SectionHeader>
      
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="oxygenRate">Oxygen Rate (L/min)</Label>
              <Select 
                value={medications.oxygen.rate} 
                onValueChange={(value) => handleOxygenChange('rate', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select rate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3.0">3.0 L/min</SelectItem>
                  <SelectItem value="5.0">5.0 L/min</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {medications.oxygen.rate === 'Other' && (
              <div className="space-y-2">
                <Label htmlFor="oxygenOther">Specify Rate</Label>
                <Input
                  id="oxygenOther"
                  value={medications.oxygen.other}
                  onChange={(e) => handleOxygenChange('other', e.target.value)}
                  placeholder="Enter rate"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Drug Log */}
      <SectionHeader>Drug Log</SectionHeader>
      
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-medium">Controlled Substances</h4>
              <Button onClick={addDrugLog} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Drug
              </Button>
            </div>

            {medications.loggedDrugs.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No drugs logged yet. Click "Add Drug" to start.
              </p>
            ) : (
              <div className="space-y-4">
                {medications.loggedDrugs.map((drug, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h5 className="font-medium">Drug #{index + 1}</h5>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeDrugLog(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label>Drug Name</Label>
                        <Input
                          value={drug.name}
                          onChange={(e) => updateDrugLog(index, 'name', e.target.value)}
                          placeholder="Drug name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Time</Label>
                        <Input
                          type="time"
                          value={drug.time}
                          onChange={(e) => updateDrugLog(index, 'time', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Dose</Label>
                        <Input
                          value={drug.dose}
                          onChange={(e) => updateDrugLog(index, 'dose', e.target.value)}
                          placeholder="Dose amount"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Total</Label>
                        <Input
                          value={drug.total}
                          onChange={(e) => updateDrugLog(index, 'total', e.target.value)}
                          placeholder="Total amount"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Witness</Label>
                        <Input
                          value={drug.witness}
                          onChange={(e) => updateDrugLog(index, 'witness', e.target.value)}
                          placeholder="Witness name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Initials</Label>
                        <Input
                          value={drug.initials}
                          onChange={(e) => updateDrugLog(index, 'initials', e.target.value)}
                          placeholder="Provider initials"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`used-${index}`}
                          checked={drug.used}
                          onCheckedChange={(checked) => updateDrugLog(index, 'used', checked)}
                        />
                        <Label htmlFor={`used-${index}`}>Used</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`wasted-${index}`}
                          checked={drug.wasted}
                          onCheckedChange={(checked) => updateDrugLog(index, 'wasted', checked)}
                        />
                        <Label htmlFor={`wasted-${index}`}>Wasted</Label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicationsSection;
