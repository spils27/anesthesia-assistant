import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Trash2, Clock, Calculator, AlertCircle, CheckCircle } from 'lucide-react';
import { PDFLogic } from '@/lib/calculations';

const SectionHeader = ({
  children
}: {
  children: React.ReactNode;
}) => (
  <div className="bg-primary text-primary-foreground p-3 font-semibold text-base mb-4 mx-0 py-[6px] px-[15px]">
    {children}
  </div>
);

interface DrugEntry {
  id: string;
  name: string;
  time: string;
  dose: string;
  unit: string;
  used: boolean;
  wasted: boolean;
  witness: string;
  initials: string;
  total: string;
  isValid: boolean;
  validationMessage?: string;
}

interface EnhancedDrugLogProps {
  onDrugsChange: (drugs: DrugEntry[]) => void;
  initialDrugs?: DrugEntry[];
}

const EnhancedDrugLog: React.FC<EnhancedDrugLogProps> = ({ onDrugsChange, initialDrugs = [] }) => {
  const [drugs, setDrugs] = useState<DrugEntry[]>(initialDrugs);
  const [totals, setTotals] = useState({ totalUsed: 0, totalWasted: 0, totalDispensed: 0 });

  // Calculate totals whenever drugs change (matches PDF total/waste logic)
  useEffect(() => {
    const drugEntries = drugs.map(drug => ({
      used: drug.used,
      wasted: drug.wasted,
      dose: parseFloat(drug.dose) || 0
    }));
    
    const calculatedTotals = PDFLogic.calculateDrugTotals(drugEntries);
    setTotals(calculatedTotals);
    onDrugsChange(drugs);
  }, [drugs, onDrugsChange]);

  // Validate drug dose (matches PDF Mid-T1 ValidateAction logic)
  const validateDrugEntry = (drug: DrugEntry): DrugEntry => {
    const validation = PDFLogic.validateDrugDose(drug.name, drug.dose, drug.unit);
    
    return {
      ...drug,
      isValid: validation.isValid,
      validationMessage: validation.error,
      time: validation.timestamp
    };
  };

  const addDrug = () => {
    const newDrug: DrugEntry = {
      id: Date.now().toString(),
      name: '',
      time: PDFLogic.formatTime.toHHMM(new Date()),
      dose: '',
      unit: 'mg',
      used: false,
      wasted: false,
      witness: '',
      initials: '',
      total: '',
      isValid: false
    };
    
    setDrugs([...drugs, newDrug]);
  };

  const updateDrug = (id: string, field: keyof DrugEntry, value: any) => {
    setDrugs(drugs.map(drug => {
      if (drug.id === id) {
        const updatedDrug = { ...drug, [field]: value };
        
        // Auto-validate when dose changes
        if (field === 'dose' || field === 'name') {
          return validateDrugEntry(updatedDrug);
        }
        
        return updatedDrug;
      }
      return drug;
    }));
  };

  const removeDrug = (id: string) => {
    setDrugs(drugs.filter(drug => drug.id !== id));
  };

  const getStatusIcon = (drug: DrugEntry) => {
    if (!drug.isValid && drug.dose) return <AlertCircle className="h-4 w-4 text-destructive" />;
    if (drug.isValid && drug.dose) return <CheckCircle className="h-4 w-4 text-green-600" />;
    return <Clock className="h-4 w-4 text-muted-foreground" />;
  };

  const getStatusColor = (drug: DrugEntry) => {
    if (!drug.isValid && drug.dose) return 'border-destructive';
    if (drug.isValid && drug.dose) return 'border-green-600';
    return '';
  };

  return (
    <div className="space-y-6">
      <SectionHeader>Controlled Substance Drug Log</SectionHeader>
      
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Header with Add Button */}
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-lg font-medium">Drug Entries</h4>
                <p className="text-sm text-muted-foreground">
                  All controlled substances must be logged with witness verification
                </p>
              </div>
              <Button onClick={addDrug} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Drug
              </Button>
            </div>

            {/* Drug Entries */}
            {drugs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No drugs logged yet. Click "Add Drug" to start.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {drugs.map((drug) => (
                  <div key={drug.id} className={`border rounded-lg p-4 space-y-4 ${getStatusColor(drug)}`}>
                    {/* Drug Header */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(drug)}
                        <h5 className="font-medium">Drug Entry #{drugs.indexOf(drug) + 1}</h5>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeDrug(drug.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Drug Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label>Drug Name *</Label>
                        <Input
                          value={drug.name}
                          onChange={(e) => updateDrug(drug.id, 'name', e.target.value)}
                          placeholder="e.g., Midazolam"
                          className={!drug.isValid && drug.name ? 'border-destructive' : ''}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Dose *</Label>
                        <Input
                          value={drug.dose}
                          onChange={(e) => updateDrug(drug.id, 'dose', e.target.value)}
                          placeholder="e.g., 2"
                          type="number"
                          step="0.1"
                          className={!drug.isValid && drug.dose ? 'border-destructive' : ''}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Unit</Label>
                        <Input
                          value={drug.unit}
                          onChange={(e) => updateDrug(drug.id, 'unit', e.target.value)}
                          placeholder="mg, ml, etc."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Time</Label>
                        <Input
                          value={drug.time}
                          readOnly
                          className="bg-muted"
                          placeholder="Auto-timestamped"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Witness</Label>
                        <Input
                          value={drug.witness}
                          onChange={(e) => updateDrug(drug.id, 'witness', e.target.value)}
                          placeholder="Witness name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Initials</Label>
                        <Input
                          value={drug.initials}
                          onChange={(e) => updateDrug(drug.id, 'initials', e.target.value)}
                          placeholder="Provider initials"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Total Amount</Label>
                        <Input
                          value={drug.total}
                          onChange={(e) => updateDrug(drug.id, 'total', e.target.value)}
                          placeholder="Total dispensed"
                        />
                      </div>
                    </div>

                    {/* Usage Checkboxes */}
                    <div className="flex space-x-6">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`used-${drug.id}`}
                          checked={drug.used}
                          onCheckedChange={(checked) => updateDrug(drug.id, 'used', checked)}
                        />
                        <Label htmlFor={`used-${drug.id}`}>Used</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`wasted-${drug.id}`}
                          checked={drug.wasted}
                          onCheckedChange={(checked) => updateDrug(drug.id, 'wasted', checked)}
                        />
                        <Label htmlFor={`wasted-${drug.id}`}>Wasted</Label>
                      </div>
                    </div>

                    {/* Validation Messages */}
                    {!drug.isValid && drug.validationMessage && (
                      <Alert variant="destructive" className="py-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          {drug.validationMessage}
                        </AlertDescription>
                      </Alert>
                    )}

                    {drug.isValid && drug.dose && (
                      <Alert className="py-2 border-green-600 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-sm text-green-800">
                          Drug entry validated: {drug.time} - {drug.dose} {drug.unit}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Totals Summary */}
            {drugs.length > 0 && (
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Calculator className="h-5 w-5" />
                    <h4 className="font-medium">Drug Totals</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{totals.totalUsed}</div>
                      <div className="text-sm text-muted-foreground">Total Used</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{totals.totalWasted}</div>
                      <div className="text-sm text-muted-foreground">Total Wasted</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{totals.totalDispensed}</div>
                      <div className="text-sm text-muted-foreground">Total Dispensed</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Compliance Notice */}
            <Alert className="border-blue-600 bg-blue-50">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-sm text-blue-800">
                <strong>Compliance Notice:</strong> All controlled substance entries must be witnessed and 
                properly documented per DEA requirements. Ensure all fields are completed accurately.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedDrugLog;
