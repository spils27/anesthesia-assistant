import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Clock, Pill, Syringe, AlertTriangle, CheckCircle, Trash2, Plus, Minus, User, AlertCircle } from 'lucide-react';
import { PDFLogic } from '@/lib/calculations';
import { LocalAnesthetic } from '@/types/anesthesia';

interface MedicationEntry {
  id: string;
  time: string;
  dose: number;
  unit: string;
  route: string;
  used?: string;
  wasted?: string;
  total?: string;
  witness?: string;
  notes?: string;
}

interface GasEntry {
  id: string;
  time: string;
  type: 'nitrous' | 'oxygen';
  concentration: number;
  flowRate?: number;
  duration?: number;
  startTime?: string;
  endTime?: string;
  induction?: string;
  maintenance?: string;
  recovery?: boolean;
}

interface ConsciousnessLevel {
  id: string;
  time: string;
  score: number; // 1-5 scale
  description: string;
  response: string;
}

interface IntraOpMedicationTrackerProps {
  onMedicationsChange?: (medications: MedicationEntry[]) => void;
  onGasesChange?: (gases: GasEntry[]) => void;
  onConsciousnessChange?: (levels: ConsciousnessLevel[]) => void;
}

const IntraOpMedicationTracker: React.FC<IntraOpMedicationTrackerProps> = ({
  onMedicationsChange,
  onGasesChange,
  onConsciousnessChange
}) => {
  const [medications, setMedications] = useState<MedicationEntry[]>([]);
  const [gases, setGases] = useState<{
    oxygen?: { flowRate?: number };
    nitrous?: { 
      startTime?: string; 
      endTime?: string; 
      induction?: string; 
      maintenance?: string; 
      recovery?: boolean; 
    };
  }>({});
  const [consciousnessLevels, setConsciousnessLevels] = useState<ConsciousnessLevel[]>([]);
  const [localAnesthetics, setLocalAnesthetics] = useState<LocalAnesthetic[]>([]);
  const [manualOverride, setManualOverride] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Format time as HHMM like PDF
  const formatTime = (date: Date) => {
    try {
      return date.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      }).replace(':', '');
    } catch (error) {
      console.error('Error formatting time:', error);
      return new Date().toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      }).replace(':', '');
    }
  };

  // Add new medication entry
  const addMedication = (dose: number, unit: string, route: string = 'IV') => {
    try {
      console.log('Adding medication:', { dose, unit, route });
      
      const newEntry: MedicationEntry = {
        id: Date.now().toString(),
        time: formatTime(currentTime),
        dose,
        unit,
        route,
        used: dose.toString(), // Auto-calculate used as the dose
        wasted: '0', // Default waste to 0
        total: dose.toString(), // Auto-calculate total as used + wasted
        witness: '',
        notes: ''
      };

      console.log('New entry created:', newEntry);
      
      const updated = [...medications, newEntry];
      console.log('Updated medications array:', updated);
      
      setMedications(updated);
      onMedicationsChange?.(updated);
      
      console.log('Medication added successfully');
    } catch (error) {
      console.error('Error adding medication:', error);
    }
  };

  // Update medication entry
  const updateMedication = (id: string, updates: Partial<MedicationEntry>) => {
    try {
      const updatedMedications = medications.map(med => {
        if (med.id === id) {
          const updated = { ...med, ...updates };
          
          // Auto-calculate total when used or wasted changes
          if (updates.used !== undefined || updates.wasted !== undefined) {
            const used = parseFloat(updated.used || '0');
            const wasted = parseFloat(updated.wasted || '0');
            updated.total = (used + wasted).toString();
          }
          
          return updated;
        }
        return med;
      });
      setMedications(updatedMedications);
      onMedicationsChange?.(updatedMedications);
    } catch (error) {
      console.error('Error updating medication:', error);
    }
  };

  const updateGas = (type: 'oxygen' | 'nitrous', updates: any) => {
    try {
      const updatedGases = {
        ...gases,
        [type]: {
          ...gases[type],
          ...updates
        }
      };
      setGases(updatedGases);
      onGasesChange?.(updatedGases);
    } catch (error) {
      console.error('Error updating gas:', error);
    }
  };


  // Add consciousness level
  const addConsciousnessLevel = (score: number, description: string, response: string) => {
    const newEntry: ConsciousnessLevel = {
      id: Date.now().toString(),
      time: formatTime(currentTime),
      score,
      description,
      response
    };

    const updated = [...consciousnessLevels, newEntry];
    setConsciousnessLevels(updated);
    onConsciousnessChange?.(updated);
  };

  // Add local anesthetic
  const addLocalAnesthetic = (type: LocalAnesthetic['type'], concentration: string, epinephrine: string, carpules: number) => {
    const carpuleVolume = getCarpuleVolume(type);
    
    const newEntry: LocalAnesthetic = {
      id: Date.now().toString(),
      time: formatTime(currentTime),
      type,
      concentration,
      epinephrine,
      carpules,
      totalVolume: carpules * carpuleVolume,
      notes: ''
    };

    const updated = [...localAnesthetics, newEntry];
    setLocalAnesthetics(updated);
  };

  // Update local anesthetic
  const updateLocalAnesthetic = (id: string, updates: Partial<LocalAnesthetic>) => {
    const updatedAnesthetics = localAnesthetics.map(anesthetic => {
      if (anesthetic.id === id) {
        const updated = { ...anesthetic, ...updates };
        // Recalculate total volume if carpules changed
        if (updates.carpules !== undefined) {
          const carpuleVolume = getCarpuleVolume(updated.type);
          updated.totalVolume = updated.carpules * carpuleVolume;
        }
        return updated;
      }
      return anesthetic;
    });
    setLocalAnesthetics(updatedAnesthetics);
  };

  // Remove entry
  const removeEntry = (type: 'medication' | 'consciousness' | 'localAnesthetic', id: string) => {
    switch (type) {
      case 'medication':
        const updatedMeds = medications.filter(m => m.id !== id);
        setMedications(updatedMeds);
        onMedicationsChange?.(updatedMeds);
        break;
      case 'consciousness':
        const updatedConsciousness = consciousnessLevels.filter(c => c.id !== id);
        setConsciousnessLevels(updatedConsciousness);
        onConsciousnessChange?.(updatedConsciousness);
        break;
      case 'localAnesthetic':
        const updatedAnesthetics = localAnesthetics.filter(a => a.id !== id);
        setLocalAnesthetics(updatedAnesthetics);
        break;
    }
  };

  // Clear all entries
  const clearAll = () => {
    setMedications([]);
    setGases({});
    setConsciousnessLevels([]);
    setLocalAnesthetics([]);
    onMedicationsChange?.([]);
    onGasesChange?.({});
    onConsciousnessChange?.([]);
  };

  // Get consciousness level description
  const getConsciousnessDescription = (score: number) => {
    const levels = {
      1: 'Unresponsive',
      2: 'Responds to pain',
      3: 'Responds to voice',
      4: 'Alert but confused',
      5: 'Fully alert'
    };
    return levels[score as keyof typeof levels] || 'Unknown';
  };

  // Get consciousness level response
  const getConsciousnessResponse = (score: number) => {
    const responses = {
      1: 'No response to stimuli',
      2: 'Withdraws from painful stimuli',
      3: 'Opens eyes to voice',
      4: 'Awakens easily, follows commands',
      5: 'Alert, oriented, follows commands'
    };
    return responses[score as keyof typeof responses] || 'Unknown response';
  };

  // Get carpule volume for each anesthetic type
  const getCarpuleVolume = (type: LocalAnesthetic['type']) => {
    const volumes = {
      articaine: 1.7,
      bupivicaine: 1.7, // Update this when you provide the correct volume
      mepivicaine: 1.7,
      lidocaine: 1.7
    };
    return volumes[type];
  };

  // Get local anesthetic display name
  const getLocalAnestheticDisplayName = (type: LocalAnesthetic['type'], concentration: string, epinephrine: string) => {
    const typeNames = {
      articaine: 'Articaine',
      bupivicaine: 'Bupivicaine',
      mepivicaine: 'Mepivicaine',
      lidocaine: 'Lidocaine'
    };
    
    const epiText = epinephrine === 'none' ? 'c w/o Epi' : `c w/ ${epinephrine}`;
    return `${typeNames[type]} ${concentration} ${epiText}`;
  };

  // Get medication name based on dose and unit
  const getMedicationName = (dose: number, unit: string) => {
    try {
      // Common medication patterns based on dose ranges and units
      if (unit === 'mg') {
        if (dose >= 0.5 && dose <= 10) return 'Midazolam';
        if (dose >= 10 && dose <= 200) return 'Propofol';
        if (dose >= 2 && dose <= 8) return 'Ondansetron';
        if (dose >= 1 && dose <= 5) return 'Lorazepam';
        if (dose >= 5 && dose <= 20) return 'Diazepam';
      }
      if (unit === 'mcg') {
        if (dose >= 25 && dose <= 200) return 'Fentanyl';
        if (dose >= 0.1 && dose <= 2) return 'Dexmedetomidine';
      }
      if (unit === 'units') {
        return 'Heparin';
      }
      if (unit === 'g') {
        return 'Antibiotic';
      }
      
      // Default fallback
      return `Medication (${dose} ${unit})`;
    } catch (error) {
      console.error('Error getting medication name:', error);
      return 'Unknown Medication';
    }
  };

  // Get medication totals grouped by medication name
  const getMedicationTotals = () => {
    try {
      const totals: { [key: string]: { medication: string; unit: string; used: number; wasted: number; grandTotal: number } } = {};
      
      medications.forEach(med => {
        const medicationName = getMedicationName(med.dose, med.unit);
        const key = `${medicationName}_${med.unit}`;
        
        if (!totals[key]) {
          totals[key] = {
            medication: medicationName,
            unit: med.unit,
            used: 0,
            wasted: 0,
            grandTotal: 0
          };
        }
        
        totals[key].used += parseFloat(med.used || '0');
        totals[key].wasted += parseFloat(med.wasted || '0');
        totals[key].grandTotal += parseFloat(med.total || med.dose.toString());
      });
      
      return Object.values(totals);
    } catch (error) {
      console.error('Error calculating medication totals:', error);
      return [];
    }
  };

  // Safety check to prevent crashes
  if (!medications || !Array.isArray(medications)) {
    console.error('Medications array is invalid:', medications);
    return (
      <div className="space-y-6">
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive">Error: Invalid medications data. Please refresh the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with current time and controls */}
      <div className="flex items-center justify-between p-4 bg-primary text-primary-foreground rounded-lg">
        <div className="flex items-center gap-4">
          <Clock className="h-5 w-5" />
          <span className="font-semibold">Intraoperative Medication & Gas Tracking</span>
          <Badge variant="secondary" className="bg-primary-foreground text-primary">
            {currentTime.toLocaleTimeString()}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="manual-override"
            checked={manualOverride}
            onCheckedChange={setManualOverride}
          />
          <Label htmlFor="manual-override" className="text-sm">
            Manual Entry Mode
          </Label>
          <Button
            variant="destructive"
            size="sm"
            onClick={clearAll}
            className="ml-4"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Quick Medication Entry */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Pill className="h-5 w-5" />
            Quick Medication Entry
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Midazolam */}
            <div className="space-y-2">
              <Label>Midazolam (mg)</Label>
              <div className="flex gap-1">
                <Input
                  type="number"
                  placeholder="Dose"
                  min="0.5"
                  max="10"
                  step="0.5"
                  id="midazolam-dose"
                />
                <Button
                  size="sm"
                  onClick={() => {
                    const input = document.getElementById('midazolam-dose') as HTMLInputElement;
                    const dose = parseFloat(input.value);
                    if (dose > 0) {
                      addMedication(dose, 'mg', 'IV');
                      input.value = '';
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Fentanyl */}
            <div className="space-y-2">
              <Label>Fentanyl (mcg)</Label>
              <div className="flex gap-1">
                <Input
                  type="number"
                  placeholder="Dose"
                  min="25"
                  max="200"
                  step="25"
                  id="fentanyl-dose"
                />
                <Button
                  size="sm"
                  onClick={() => {
                    const input = document.getElementById('fentanyl-dose') as HTMLInputElement;
                    const dose = parseFloat(input.value);
                    if (dose > 0) {
                      addMedication(dose, 'mcg', 'IV');
                      input.value = '';
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Propofol */}
            <div className="space-y-2">
              <Label>Propofol (mg)</Label>
              <div className="flex gap-1">
                <Input
                  type="number"
                  placeholder="Dose"
                  min="10"
                  max="200"
                  step="10"
                  id="propofol-dose"
                />
                <Button
                  size="sm"
                  onClick={() => {
                    const input = document.getElementById('propofol-dose') as HTMLInputElement;
                    const dose = parseFloat(input.value);
                    if (dose > 0) {
                      addMedication(dose, 'mg', 'IV');
                      input.value = '';
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Ondansetron */}
            <div className="space-y-2">
              <Label>Ondansetron (mg)</Label>
              <div className="flex gap-1">
                <Input
                  type="number"
                  placeholder="Dose"
                  min="2"
                  max="8"
                  step="2"
                  id="ondansetron-dose"
                />
                <Button
                  size="sm"
                  onClick={() => {
                    const input = document.getElementById('ondansetron-dose') as HTMLInputElement;
                    const dose = parseFloat(input.value);
                    if (dose > 0) {
                      addMedication(dose, 'mg', 'IV');
                      input.value = '';
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gas Tracking */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Syringe className="h-5 w-5" />
            Gas Administration
          </h3>
          
          <div className="space-y-6">
            {/* Oxygen Section */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Oxygen Administration
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Flow Rate</Label>
                  <Select 
                    value={gases.oxygen?.flowRate?.toString() || ''} 
                    onValueChange={(value) => {
                      if (value === 'custom') return;
                      updateGas('oxygen', { flowRate: parseFloat(value) || 0 });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select flow rate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3.0 LPM</SelectItem>
                      <SelectItem value="6">6.0 LPM</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {gases.oxygen?.flowRate && gases.oxygen.flowRate !== 3.0 && gases.oxygen.flowRate !== 6.0 && (
                  <div className="space-y-2">
                    <Label>Custom Rate (LPM)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="Enter flow rate"
                      value={gases.oxygen.flowRate.toString()}
                      onChange={(e) => {
                        const flowRate = parseFloat(e.target.value) || 0;
                        updateGas('oxygen', { flowRate });
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Nitrous Oxide Section */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Nitrous Oxide Administration
              </h4>
              
              {/* Start/End Times */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Input
                    type="text"
                    placeholder="HHMM"
                    value={gases.nitrous?.startTime || ''}
                    onChange={(e) => {
                      updateGas('nitrous', { ...gases.nitrous, startTime: e.target.value });
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Input
                    type="text"
                    placeholder="HHMM"
                    value={gases.nitrous?.endTime || ''}
                    onChange={(e) => {
                      updateGas('nitrous', { ...gases.nitrous, endTime: e.target.value });
                    }}
                  />
                </div>
              </div>

              {/* Induction */}
              <div className="space-y-2">
                <Label>Induction Ratio</Label>
                <div className="flex gap-2">
                  <Button
                    variant={gases.nitrous?.induction === '70/30' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      updateGas('nitrous', { ...gases.nitrous, induction: gases.nitrous?.induction === '70/30' ? '' : '70/30' });
                    }}
                  >
                    70/30
                  </Button>
                  <Button
                    variant={gases.nitrous?.induction === '60/40' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      updateGas('nitrous', { ...gases.nitrous, induction: gases.nitrous?.induction === '60/40' ? '' : '60/40' });
                    }}
                  >
                    60/40
                  </Button>
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      placeholder=""
                      className="w-16 h-8 text-sm"
                      value={gases.nitrous?.induction && gases.nitrous.induction !== '70/30' && gases.nitrous.induction !== '60/40' ? gases.nitrous.induction.split('/')[0] : ''}
                      onChange={(e) => {
                        const first = e.target.value;
                        const second = gases.nitrous?.induction?.split('/')[1] || '';
                        updateGas('nitrous', { ...gases.nitrous, induction: first && second ? `${first}/${second}` : first });
                      }}
                    />
                    <span className="text-sm text-muted-foreground">/</span>
                    <Input
                      type="number"
                      placeholder=""
                      className="w-16 h-8 text-sm"
                      value={gases.nitrous?.induction && gases.nitrous.induction !== '70/30' && gases.nitrous.induction !== '60/40' ? gases.nitrous.induction.split('/')[1] : ''}
                      onChange={(e) => {
                        const first = gases.nitrous?.induction?.split('/')[0] || '';
                        const second = e.target.value;
                        updateGas('nitrous', { ...gases.nitrous, induction: first && second ? `${first}/${second}` : second });
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Maintenance */}
              <div className="space-y-2">
                <Label>Maintenance Ratio</Label>
                <div className="flex gap-2">
                  <Button
                    variant={gases.nitrous?.maintenance === '70/30' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      updateGas('nitrous', { ...gases.nitrous, maintenance: gases.nitrous?.maintenance === '70/30' ? '' : '70/30' });
                    }}
                  >
                    70/30
                  </Button>
                  <Button
                    variant={gases.nitrous?.maintenance === '60/40' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      updateGas('nitrous', { ...gases.nitrous, maintenance: gases.nitrous?.maintenance === '60/40' ? '' : '60/40' });
                    }}
                  >
                    60/40
                  </Button>
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      placeholder=""
                      className="w-16 h-8 text-sm"
                      value={gases.nitrous?.maintenance && gases.nitrous.maintenance !== '70/30' && gases.nitrous.maintenance !== '60/40' ? gases.nitrous.maintenance.split('/')[0] : ''}
                      onChange={(e) => {
                        const first = e.target.value;
                        const second = gases.nitrous?.maintenance?.split('/')[1] || '';
                        updateGas('nitrous', { ...gases.nitrous, maintenance: first && second ? `${first}/${second}` : first });
                      }}
                    />
                    <span className="text-sm text-muted-foreground">/</span>
                    <Input
                      type="number"
                      placeholder=""
                      className="w-16 h-8 text-sm"
                      value={gases.nitrous?.maintenance && gases.nitrous.maintenance !== '70/30' && gases.nitrous.maintenance !== '60/40' ? gases.nitrous.maintenance.split('/')[1] : ''}
                      onChange={(e) => {
                        const first = gases.nitrous?.maintenance?.split('/')[0] || '';
                        const second = e.target.value;
                        updateGas('nitrous', { ...gases.nitrous, maintenance: first && second ? `${first}/${second}` : second });
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Recovery */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="recovery"
                  className="w-4 h-4"
                  checked={gases.nitrous?.recovery || false}
                  onChange={(e) => {
                    updateGas('nitrous', { ...gases.nitrous, recovery: e.target.checked });
                  }}
                />
                <Label htmlFor="recovery" className="text-sm font-normal">
                  Recovered on 100% O2 for 5 min
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Local Anesthetic Tracking */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Syringe className="h-5 w-5" />
            Local Anesthetic Administration
          </h3>
          
          {/* Quick Add Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Button
              variant="outline"
              onClick={() => addLocalAnesthetic('articaine', '2%', '1:100K Epi', 1)}
              className="h-16 flex flex-col items-center justify-center p-2"
            >
              <span className="font-semibold text-sm">Articaine</span>
              <span className="text-xs text-muted-foreground">2% c w/ 1:100K Epi</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => addLocalAnesthetic('bupivicaine', '0.5%', '1:200K Epi', 1)}
              className="h-16 flex flex-col items-center justify-center p-2"
            >
              <span className="font-semibold text-sm">Bupivicaine</span>
              <span className="text-xs text-muted-foreground">0.5% c w/ 1:200K Epi</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => addLocalAnesthetic('mepivicaine', '3%', 'none', 1)}
              className="h-16 flex flex-col items-center justify-center p-2"
            >
              <span className="font-semibold text-sm">Mepivicaine</span>
              <span className="text-xs text-muted-foreground">3% c w/o Epi</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => addLocalAnesthetic('lidocaine', '2%', '1:100K Epi', 1)}
              className="h-16 flex flex-col items-center justify-center p-2"
            >
              <span className="font-semibold text-sm">Lidocaine</span>
              <span className="text-xs text-muted-foreground">2% c w/ 1:100K Epi</span>
            </Button>
          </div>

          {/* Local Anesthetic Entries */}
          {localAnesthetics.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold">Local Anesthetic Entries ({localAnesthetics.length})</h4>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-3 font-medium">Time</th>
                      <th className="text-left p-3 font-medium">Anesthetic</th>
                      <th className="text-center p-3 font-medium">Carpules</th>
                      <th className="text-right p-3 font-medium">Total Volume</th>
                      <th className="text-center p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {localAnesthetics.map((anesthetic) => (
                      <tr key={anesthetic.id} className="border-t hover:bg-muted/50">
                        <td className="p-3">
                          <Badge variant="secondary" className="font-mono text-xs">
                            {anesthetic.time}
                          </Badge>
                        </td>
                        <td className="p-3 font-medium text-sm">
                          {getLocalAnestheticDisplayName(anesthetic.type, anesthetic.concentration, anesthetic.epinephrine)}
                        </td>
                        <td className="p-3 text-center">
                          <Input
                            type="number"
                            min="1"
                            max="10"
                            value={anesthetic.carpules}
                            onChange={(e) => updateLocalAnesthetic(anesthetic.id, { carpules: parseInt(e.target.value) || 1 })}
                            className="w-16 h-8 text-sm text-center"
                          />
                        </td>
                        <td className="p-3 text-right font-mono text-sm">
                          {anesthetic.totalVolume.toFixed(1)} ml
                        </td>
                        <td className="p-3 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEntry('localAnesthetic', anesthetic.id)}
                            title="Remove"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Level of Consciousness Tracking */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Level of Consciousness ({consciousnessLevels.length})
          </h3>
          
          <div className="space-y-4">
            {/* Consciousness Level Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5].map(score => (
                <Button
                  key={score}
                  variant="outline"
                  onClick={() => {
                    addConsciousnessLevel(score, getConsciousnessDescription(score), getConsciousnessResponse(score));
                  }}
                  className="flex flex-col h-16 items-center justify-center p-2 hover:bg-primary hover:text-primary-foreground"
                >
                  <span className="font-bold text-lg">{score}</span>
                  <span className="text-xs text-center">{getConsciousnessDescription(score)}</span>
                </Button>
              ))}
            </div>

            {/* Consciousness Level List */}
            {consciousnessLevels.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Recorded Levels:</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {consciousnessLevels.map((level) => (
                    <div key={level.id} className="flex items-center justify-between p-3 bg-background border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="text-lg font-bold min-w-[2rem] text-center">
                          {level.score}
                        </Badge>
                        <div>
                          <div className="font-medium">{level.description}</div>
                          <div className="text-sm text-muted-foreground">{level.response}</div>
                        </div>
                        <Badge variant="secondary" className="font-mono">
                          {level.time}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEntry('consciousness', level.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current Entries Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Medications */}
        <Card className="lg:col-span-3">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3">Medication Tracking Table ({medications.length})</h4>
            {medications.length > 0 ? (
              <div className="space-y-4">
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-3 font-medium">Time</th>
                        <th className="text-left p-3 font-medium">Medication</th>
                        <th className="text-left p-3 font-medium">Route</th>
                        <th className="text-right p-3 font-medium">Dose</th>
                        {manualOverride && (
                          <>
                            <th className="text-right p-3 font-medium">Used</th>
                            <th className="text-right p-3 font-medium">Wasted</th>
                            <th className="text-right p-3 font-medium">Total</th>
                          </>
                        )}
                        <th className="text-center p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {medications.map((med) => (
                        <tr key={med.id} className="border-t hover:bg-muted/50">
                          <td className="p-3">
                            {manualOverride ? (
                              <Input
                                value={med.time}
                                onChange={(e) => {
                                  updateMedication(med.id, { time: e.target.value });
                                }}
                                className="w-20 h-8 text-xs font-mono text-center"
                                placeholder="HHMM"
                                maxLength={4}
                              />
                            ) : (
                              <Badge variant="secondary" className="font-mono text-xs">
                                {med.time}
                              </Badge>
                            )}
                          </td>
                          <td className="p-3 font-medium text-sm">
                            {manualOverride ? (
                              <Input
                                value={getMedicationName(med.dose, med.unit)}
                                onChange={(e) => {
                                  // For now, we'll keep the auto-detection but allow editing the display
                                  // In a full implementation, you might want to store custom names
                                }}
                                className="w-full h-8 text-sm"
                                placeholder="Medication name"
                              />
                            ) : (
                              getMedicationName(med.dose, med.unit)
                            )}
                          </td>
                          <td className="p-3">
                            {manualOverride ? (
                              <Select 
                                value={med.route} 
                                onValueChange={(value) => updateMedication(med.id, { route: value })}
                              >
                                <SelectTrigger className="w-20 h-8 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="IV">IV</SelectItem>
                                  <SelectItem value="IM">IM</SelectItem>
                                  <SelectItem value="PO">PO</SelectItem>
                                  <SelectItem value="IN">IN</SelectItem>
                                  <SelectItem value="SL">SL</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <Badge variant="outline" className="text-xs">{med.route}</Badge>
                            )}
                          </td>
                          <td className="p-3 text-right font-mono text-sm">
                            {manualOverride ? (
                              <div className="flex items-center gap-1">
                                <Input
                                  type="number"
                                  step="0.1"
                                  value={med.dose}
                                  onChange={(e) => {
                                    const newDose = parseFloat(e.target.value) || 0;
                                    updateMedication(med.id, { 
                                      dose: newDose,
                                      used: newDose.toString(),
                                      total: newDose.toString()
                                    });
                                  }}
                                  className="w-16 h-8 text-sm text-center"
                                />
                                <span className="text-xs">{med.unit}</span>
                              </div>
                            ) : (
                              `${med.dose} ${med.unit}`
                            )}
                          </td>
                          {manualOverride && (
                            <>
                              <td className="p-3 text-right font-mono text-sm">
                                <Input
                                  type="number"
                                  step="0.1"
                                  placeholder="0"
                                  className="w-16 h-8 text-sm text-center"
                                  value={med.used || ''}
                                  onChange={(e) => {
                                    updateMedication(med.id, { 
                                      used: e.target.value
                                    });
                                  }}
                                />
                              </td>
                              <td className="p-3 text-right font-mono text-sm">
                                <Input
                                  type="number"
                                  step="0.1"
                                  placeholder="0"
                                  className="w-16 h-8 text-sm text-center"
                                  value={med.wasted || ''}
                                  onChange={(e) => {
                                    updateMedication(med.id, { 
                                      wasted: e.target.value
                                    });
                                  }}
                                />
                              </td>
                              <td className="p-3 text-right font-mono text-sm font-semibold">
                                {med.total || med.dose}
                              </td>
                            </>
                          )}
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const used = prompt(`Enter used amount for ${getMedicationName(med.dose, med.unit)} (${med.dose} ${med.unit}):`);
                                  if (used && !isNaN(parseFloat(used))) {
                                    updateMedication(med.id, { used });
                                  }
                                }}
                                title="Set Used Amount"
                              >
                                <CheckCircle className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const wasted = prompt(`Enter wasted amount for ${getMedicationName(med.dose, med.unit)}:`);
                                  if (wasted && !isNaN(parseFloat(wasted))) {
                                    updateMedication(med.id, { wasted });
                                  }
                                }}
                                title="Set Wasted Amount"
                              >
                                <AlertCircle className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const witness = prompt('Enter witness name:');
                                  if (witness) {
                                    updateMedication(med.id, { witness });
                                  }
                                }}
                                title="Add Witness"
                              >
                                <User className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeEntry('medication', med.id)}
                                title="Remove"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Medication Totals Table */}
                {medications.length > 0 && (
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <h5 className="font-semibold mb-3">Medication Totals</h5>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted">
                          <tr>
                            <th className="text-left p-3 font-medium">Medication</th>
                            <th className="text-right p-3 font-medium">Total Used</th>
                            <th className="text-right p-3 font-medium">Total Wasted</th>
                            <th className="text-right p-3 font-medium">Grand Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getMedicationTotals().map((total, index) => (
                            <tr key={index} className="border-t">
                              <td className="p-3 font-medium">{total?.medication || 'Unknown'}</td>
                              <td className="p-3 text-right font-mono">
                                {manualOverride ? (
                                  <Input
                                    type="number"
                                    step="0.1"
                                    value={(total?.used || 0).toFixed(1)}
                                    onChange={(e) => {
                                      // In manual mode, you could allow editing totals directly
                                      // This would require more complex logic to update individual medications
                                    }}
                                    className="w-20 h-8 text-sm text-center"
                                  />
                                ) : (
                                  `${(total?.used || 0).toFixed(1)} ${total?.unit || ''}`
                                )}
                              </td>
                              <td className="p-3 text-right font-mono">
                                {manualOverride ? (
                                  <Input
                                    type="number"
                                    step="0.1"
                                    value={(total?.wasted || 0).toFixed(1)}
                                    onChange={(e) => {
                                      // In manual mode, you could allow editing totals directly
                                    }}
                                    className="w-20 h-8 text-sm text-center"
                                  />
                                ) : (
                                  `${(total?.wasted || 0).toFixed(1)} ${total?.unit || ''}`
                                )}
                              </td>
                              <td className="p-3 text-right font-mono font-semibold">
                                {manualOverride ? (
                                  <Input
                                    type="number"
                                    step="0.1"
                                    value={(total?.grandTotal || 0).toFixed(1)}
                                    onChange={(e) => {
                                      // In manual mode, you could allow editing totals directly
                                    }}
                                    className="w-20 h-8 text-sm text-center"
                                  />
                                ) : (
                                  `${(total?.grandTotal || 0).toFixed(1)} ${total?.unit || ''}`
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No medications recorded. Use the quick entry buttons above to add medications.
              </p>
            )}
          </CardContent>
        </Card>


      </div>

      {/* Summary Alert */}
      {medications.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Active Monitoring:</strong> {medications.length} medications, {gases.length} gas entries, 
            and {consciousnessLevels.length} consciousness assessments recorded.
            {consciousnessLevels.length > 0 && consciousnessLevels[consciousnessLevels.length - 1].score < 3 && 
              " ⚠️ Patient currently at low consciousness level."
            }
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default IntraOpMedicationTracker;

