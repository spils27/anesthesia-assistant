import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Shield, Pill, Plus, Trash2, Check, FileText } from 'lucide-react';
import { MedicationPrescriptions, PrescribedMedication, MedicationLogEntry } from '@/types/anesthesia';

const SectionHeader = ({
  children
}: {
  children: React.ReactNode;
}) => (
  <div className="bg-primary text-primary-foreground p-3 font-semibold text-base mb-4 mx-0 py-[6px] px-[15px]">
    {children}
  </div>
);

interface MedicationRxSectionProps {
  prescriptions: MedicationPrescriptions;
  onChange: (prescriptions: MedicationPrescriptions) => void;
}

const MedicationRxSection: React.FC<MedicationRxSectionProps> = ({ 
  prescriptions, 
  onChange 
}) => {
  const [localPrescriptions, setLocalPrescriptions] = useState<MedicationPrescriptions>(prescriptions);

  const updatePrescriptions = (updates: Partial<MedicationPrescriptions>) => {
    const updated = { ...localPrescriptions, ...updates };
    setLocalPrescriptions(updated);
    onChange(updated);
  };

  const updateMedication = (id: string, updates: Partial<PrescribedMedication>) => {
    const updatedMedications = localPrescriptions.draftMedications.map(med => 
      med.id === id ? { ...med, ...updates } : med
    );
    updatePrescriptions({ draftMedications: updatedMedications });
  };

  const addMedication = (category: 'antibiotic' | 'pain' | 'other') => {
    const medicationTemplates = {
      antibiotic: [
        { name: 'Amoxicillin 500mg # Ṫ PO TID until gone', defaultQuantity: 30 },
        { name: 'Keflex 500mg # Ṫ PO QID until gone', defaultQuantity: 28 },
        { name: 'Z-pak #1 Pack Take as Directed', defaultQuantity: 1 },
        { name: 'Clindamycin 300mg # Ṫ PO QID until gone', defaultQuantity: 28 },
        { name: 'Azithromycin 250mg # ṪṪ PO stat then Ṫ PO QID until gone', defaultQuantity: 6 },
        { name: 'Augmentin 500mg # Ṫ PO TID until gone', defaultQuantity: 30 },
        { name: 'Keflex Susp 250mg/5cc 2 teaspoons PO QID until gone # CC', defaultQuantity: 100 },
      ],
      pain: [
        { name: 'Norco 5/325mg Tab # 20 Ṫ-ṪṪ PO QID prn pain', defaultQuantity: 20 },
        { name: 'Norco 7.5/325mg Tab # Ṫ-ṪṪ PO QID prn pain', defaultQuantity: 20 },
        { name: 'Hydrocodone/Tylenol Susp 1-2 Tbsp PO QID prn pain 7.5mg/325mg/15mL CC', defaultQuantity: 120 },
        { name: 'Ultram 50mg Tab # Ṫ PO QID prn pain', defaultQuantity: 30 },
        { name: 'Tylenol #3 # Ṫ-ṪṪ PO QID prn pain', defaultQuantity: 30 },
        { name: 'Motrin 800mg Tab # 50 Ṫ PO TID prn pain', defaultQuantity: 50 },
      ],
      other: [
        { name: 'Peridex 0.12% Oral Rinse Rinse c T TBSP PO for one #473 CC min, then spit BID', defaultQuantity: 473 },
        { name: 'Zofran 8mg ODT # Dissolve Ṫ SL Q8° prn N/V', defaultQuantity: 10 },
        { name: 'Sudafed 120mg Tab # 14 Ṫ PO Q12° prn congestion', defaultQuantity: 14 },
        { name: 'Afrin Nasal Spray 2 sprays each nostril BID # 1 bottle x3-5 days prn congestion', defaultQuantity: 1 },
      ],
    };

    const templates = medicationTemplates[category];
    const newMedication: PrescribedMedication = {
      id: Date.now().toString(),
      name: templates[0].name, // Default to first option
      category,
      prescribed: true,
      quantity: templates[0].defaultQuantity,
      refills: 0,
    };

    const updatedMedications = [...localPrescriptions.draftMedications, newMedication];
    updatePrescriptions({ draftMedications: updatedMedications });
  };

  const removeMedication = (id: string) => {
    const updatedMedications = localPrescriptions.draftMedications.filter(med => med.id !== id);
    updatePrescriptions({ draftMedications: updatedMedications });
  };

  const submitMedication = (id: string) => {
    const medication = localPrescriptions.draftMedications.find(med => med.id === id);
    if (!medication) return;

    const logEntry: MedicationLogEntry = {
      id: Date.now().toString(),
      name: medication.name,
      category: medication.category,
      quantity: medication.quantity,
      refills: medication.refills,
      notes: medication.notes,
    };

    const updatedLog = [...localPrescriptions.medicationLog, logEntry];
    const updatedDrafts = localPrescriptions.draftMedications.filter(med => med.id !== id);
    
    updatePrescriptions({ 
      medicationLog: updatedLog,
      draftMedications: updatedDrafts
    });
  };

  const getMedicationsByCategory = (category: 'antibiotic' | 'pain' | 'other') => {
    return localPrescriptions.draftMedications.filter(med => med.category === category);
  };

  const getLogByCategory = (category: 'antibiotic' | 'pain' | 'other') => {
    return localPrescriptions.medicationLog.filter(med => med.category === category);
  };

  const getCategoryDisplayName = (category: 'antibiotic' | 'pain' | 'other') => {
    const names = {
      antibiotic: 'Antibiotics',
      pain: 'Pain Medications',
      other: 'Other Medications'
    };
    return names[category];
  };

  const getMedicationOptions = (category: 'antibiotic' | 'pain' | 'other') => {
    const options = {
      antibiotic: [
        { name: 'Amoxicillin 500mg # Ṫ PO TID until gone', defaultQuantity: 30 },
        { name: 'Keflex 500mg # Ṫ PO QID until gone', defaultQuantity: 28 },
        { name: 'Z-pak #1 Pack Take as Directed', defaultQuantity: 1 },
        { name: 'Clindamycin 300mg # Ṫ PO QID until gone', defaultQuantity: 28 },
        { name: 'Azithromycin 250mg # ṪṪ PO stat then Ṫ PO QID until gone', defaultQuantity: 6 },
        { name: 'Augmentin 500mg # Ṫ PO TID until gone', defaultQuantity: 30 },
        { name: 'Keflex Susp 250mg/5cc 2 teaspoons PO QID until gone # CC', defaultQuantity: 100 },
      ],
      pain: [
        { name: 'Norco 5/325mg Tab # 20 Ṫ-ṪṪ PO QID prn pain', defaultQuantity: 20 },
        { name: 'Norco 7.5/325mg Tab # Ṫ-ṪṪ PO QID prn pain', defaultQuantity: 20 },
        { name: 'Hydrocodone/Tylenol Susp 1-2 Tbsp PO QID prn pain 7.5mg/325mg/15mL CC', defaultQuantity: 120 },
        { name: 'Ultram 50mg Tab # Ṫ PO QID prn pain', defaultQuantity: 30 },
        { name: 'Tylenol #3 # Ṫ-ṪṪ PO QID prn pain', defaultQuantity: 30 },
        { name: 'Motrin 800mg Tab # 50 Ṫ PO TID prn pain', defaultQuantity: 50 },
      ],
      other: [
        { name: 'Peridex 0.12% Oral Rinse Rinse c T TBSP PO for one #473 CC min, then spit BID', defaultQuantity: 473 },
        { name: 'Zofran 8mg ODT # Dissolve Ṫ SL Q8° prn N/V', defaultQuantity: 10 },
        { name: 'Sudafed 120mg Tab # 14 Ṫ PO Q12° prn congestion', defaultQuantity: 14 },
        { name: 'Afrin Nasal Spray 2 sprays each nostril BID # 1 bottle x3-5 days prn congestion', defaultQuantity: 1 },
      ],
    };
    return options[category];
  };

  const handleMedicationSelect = (medicationId: string, selectedName: string) => {
    const category = localPrescriptions.draftMedications.find(med => med.id === medicationId)?.category;
    if (!category) return;

    const options = getMedicationOptions(category);
    const selectedOption = options.find(opt => opt.name === selectedName);
    
    if (selectedOption) {
      updateMedication(medicationId, {
        name: selectedName,
        quantity: selectedOption.defaultQuantity
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* PMP Report Verification */}
      <Card>
        <CardContent className="p-6">
          <SectionHeader>PMP Report Verification</SectionHeader>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="pmp-verified"
              checked={localPrescriptions.pmpReportVerified}
              onCheckedChange={(checked) => updatePrescriptions({ pmpReportVerified: !!checked })}
            />
            <Label htmlFor="pmp-verified" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              PMP Report Verified
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Category Selection and Add Buttons */}
      <Card>
        <CardContent className="p-6">
          <SectionHeader>Add Medications</SectionHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              onClick={() => addMedication('antibiotic')}
              className="h-16 flex flex-col items-center justify-center p-2"
            >
              <Pill className="h-5 w-5 mb-1" />
              <span className="font-semibold text-sm">Add Antibiotic</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => addMedication('pain')}
              className="h-16 flex flex-col items-center justify-center p-2"
            >
              <Pill className="h-5 w-5 mb-1" />
              <span className="font-semibold text-sm">Add Pain Med</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => addMedication('other')}
              className="h-16 flex flex-col items-center justify-center p-2"
            >
              <Pill className="h-5 w-5 mb-1" />
              <span className="font-semibold text-sm">Add Other</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Draft Medications */}
      {localPrescriptions.draftMedications.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <SectionHeader>
              <div className="flex items-center justify-between w-full">
                <span className="flex items-center gap-2">
                  <Pill className="h-4 w-4" />
                  Draft Medications ({localPrescriptions.draftMedications.length})
                </span>
              </div>
            </SectionHeader>
            
            <div className="space-y-4">
              {(['antibiotic', 'pain', 'other'] as const).map(category => {
                const categoryMedications = getMedicationsByCategory(category);
                if (categoryMedications.length === 0) return null;

                return (
                  <div key={category} className="space-y-3">
                    <h4 className="font-semibold text-lg flex items-center gap-2">
                      <Badge variant="secondary">{categoryMedications.length}</Badge>
                      {getCategoryDisplayName(category)}
                    </h4>
                    
                    <div className="space-y-3">
                      {categoryMedications.map((medication) => (
                        <div key={medication.id} className="p-4 border rounded-lg bg-muted/30">
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                            {/* Medication Selection */}
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Medication</Label>
                              <div className="space-y-2">
                                <Select
                                  value={medication.name}
                                  onValueChange={(value) => handleMedicationSelect(medication.id, value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {getMedicationOptions(category).map((option) => (
                                      <SelectItem key={option.name} value={option.name}>
                                        {option.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <Input
                                  value={medication.name}
                                  onChange={(e) => updateMedication(medication.id, { name: e.target.value })}
                                  placeholder="Or type custom prescription..."
                                  className="text-sm"
                                />
                              </div>
                            </div>

                            {/* Quantity */}
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Quantity</Label>
                              <Input
                                type="number"
                                min="1"
                                value={medication.quantity}
                                onChange={(e) => updateMedication(medication.id, { quantity: parseInt(e.target.value) || 1 })}
                                className="text-center"
                              />
                            </div>

                            {/* Refills */}
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Refills</Label>
                              <Input
                                type="number"
                                min="0"
                                value={medication.refills}
                                onChange={(e) => updateMedication(medication.id, { refills: parseInt(e.target.value) || 0 })}
                                className="text-center"
                              />
                            </div>

                            {/* Submit Button */}
                            <div className="space-y-2">
                              <Label className="text-sm font-medium opacity-0">Submit</Label>
                              <Button
                                onClick={() => submitMedication(medication.id)}
                                className="w-full"
                                size="sm"
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Submit
                              </Button>
                            </div>

                            {/* Remove Button */}
                            <div className="space-y-2">
                              <Label className="text-sm font-medium opacity-0">Actions</Label>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeMedication(medication.id)}
                                className="w-full"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Medication Log */}
      {localPrescriptions.medicationLog.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <SectionHeader>
              <div className="flex items-center justify-between w-full">
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Prescribed Medication Log ({localPrescriptions.medicationLog.length})
                </span>
              </div>
            </SectionHeader>
            
            <div className="space-y-4">
              {(['antibiotic', 'pain', 'other'] as const).map(category => {
                const categoryLog = getLogByCategory(category);
                if (categoryLog.length === 0) return null;

                return (
                  <div key={category} className="space-y-3">
                    <h4 className="font-semibold text-lg flex items-center gap-2">
                      <Badge variant="default">{categoryLog.length}</Badge>
                      {getCategoryDisplayName(category)}
                    </h4>
                    
                    <div className="space-y-2">
                      {categoryLog.map((logEntry) => (
                        <div key={logEntry.id} className="p-3 border rounded-lg bg-primary/5">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                            <div className="font-medium text-sm">
                              {logEntry.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Qty: {logEntry.quantity}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Refills: {logEntry.refills}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MedicationRxSection;
