import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Calculator } from 'lucide-react';
import EnhancedInput from '@/components/ui/enhanced-input';
import { PatientInfo } from '@/types/anesthesia';
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

interface EnhancedPatientInfoSectionProps {
  data: PatientInfo;
  onChange: (data: Partial<PatientInfo>) => void;
}

const EnhancedPatientInfoSection: React.FC<EnhancedPatientInfoSectionProps> = ({ data, onChange }) => {
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('lbs');
  const [heightUnit, setHeightUnit] = useState<'inches' | 'cm'>('inches');
  const [heightFeet, setHeightFeet] = useState<number>(0);
  const [heightInches, setHeightInches] = useState<number>(0);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [warnings, setWarnings] = useState<Record<string, string>>({});

  // Stable onChange function to prevent unnecessary re-renders
  const stableOnChange = useCallback((updates: Partial<PatientInfo>) => {
    onChange(updates);
    try {
      const merged = { ...data, ...updates } as PatientInfo;
      localStorage.setItem('patientInfo', JSON.stringify(merged));
    } catch (err) {
      // no-op: localStorage might be unavailable
    }
  }, [onChange, data]);

  // Initialize feet and inches from total height
  useEffect(() => {
    if (data.height > 0) {
      const totalInches = data.height;
      const feet = Math.floor(totalInches / 12);
      const inches = totalInches % 12;
      setHeightFeet(feet);
      setHeightInches(inches);
    }
  }, [data.height]);

  // Auto-calculate age when DOB changes
  useEffect(() => {
    if (data.dob) {
      const today = new Date();
      const birthDate = new Date(data.dob);
      
      if (birthDate > today) {
        stableOnChange({ age: 0 });
        return;
      }
      
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age !== data.age) {
        stableOnChange({ age });
      }
    }
  }, [data.dob]);

  // Auto-calculate BMI when weight or height changes
  useEffect(() => {
    if (data.weight > 0 && data.height > 0) {
      // Convert height from inches to meters
      const heightMeters = data.height * 0.0254;
      const bmi = Math.round((data.weight / (heightMeters * heightMeters)) * 10) / 10;
      
      if (bmi !== data.bmi) {
        stableOnChange({ bmi });
      }
      
      // Set BMI category and ASA-related warnings (BMI-only here)
      let category = '';
      let bmiAsaWarning = '';
      
      if (bmi < 18.5) {
        category = 'Underweight';
        bmiAsaWarning = 'Consider ASA II for severe malnutrition';
      } else if (bmi < 25) {
        category = 'Normal weight';
        // No BMI warning for normal weight
      } else if (bmi < 30) {
        category = 'Overweight';
        bmiAsaWarning = 'Consider ASA II if associated comorbidities';
      } else if (bmi < 35) {
        category = 'Obese Class I (Mild)';
        bmiAsaWarning = 'Consider ASA II-III for obesity-related comorbidities';
      } else if (bmi < 40) {
        category = 'Obese Class II (Moderate)';
        bmiAsaWarning = 'Consider ASA III for significant obesity-related comorbidities';
      } else {
        category = 'Obese Class III (Severe/Morbid)';
        bmiAsaWarning = 'Consider ASA III-IV for severe obesity with comorbidities';
      }
      
      // Set BMI category warning
      if (category !== 'Normal weight') {
        setWarnings(prev => ({ ...prev, bmi: `${category} BMI` }));
      } else {
        setWarnings(prev => {
          const { bmi: _, ...rest } = prev;
          return rest;
        });
      }
      
      // Set BMI-related ASA warning only (no age text here)
      if (bmiAsaWarning) {
        setWarnings(prev => ({ ...prev, asa: bmiAsaWarning }));
      } else {
        setWarnings(prev => {
          const { asa: _, ...rest } = prev;
          return rest;
        });
      }
    }
  }, [data.weight, data.height, data.age]);

  // Weight conversion handler
  const handleWeightChange = (value: string, unit: 'kg' | 'lbs') => {
    const numValue = parseFloat(value) || 0;
    if (numValue <= 0) {
      setValidationErrors(prev => ({ ...prev, weight: 'Weight must be positive' }));
      return;
    }
    
    setValidationErrors(prev => {
      const { weight: _, ...rest } = prev;
      return rest;
    });
    
    // Convert to kg for storage
    const weightInKg = unit === 'kg' ? numValue : Math.round(numValue / 2.20462 * 10) / 10;
    stableOnChange({ weight: weightInKg });
  };

  // Height conversion handler
  const handleHeightChange = (value: string, unit: 'inches' | 'cm') => {
    const numValue = parseFloat(value) || 0;
    if (numValue <= 0) {
      setValidationErrors(prev => ({ ...prev, height: 'Height must be positive' }));
      return;
    }
    
    setValidationErrors(prev => {
      const { height: _, ...rest } = prev;
      return rest;
    });
    
    const heightInInches = unit === 'inches' ? numValue : numValue / 2.54;
    stableOnChange({ height: heightInInches });
  };

  // Handle feet and inches change
  const handleFeetInchesChange = (feet: number, inches: number) => {
    if (feet < 0 || inches < 0 || inches >= 12) {
      setValidationErrors(prev => ({ 
        ...prev, 
        height: 'Invalid height: feet must be ≥0, inches must be 0-11' 
      }));
      return;
    }
    
    setValidationErrors(prev => {
      const { height: _, ...rest } = prev;
      return rest;
    });
    
    const totalInches = feet * 12 + inches;
    stableOnChange({ height: totalInches });
  };


  // Age-based field visibility (matches PDF age-triggered logic)
  const isMinor = data.age < 18;
  const isInfant = data.age < 1;

  return (
    <div className="space-y-6">
      <SectionHeader>Patient Information</SectionHeader>
      
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <EnhancedInput
                label="Patient Name"
                value={data.name}
                onChange={(e) => stableOnChange({ name: e.target.value })}
                placeholder="Enter patient name"
                required
                validation={{ type: 'required' }}
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <EnhancedInput
                label="Date of Birth"
                type="date"
                value={data.dob}
                onChange={(e) => stableOnChange({ dob: e.target.value })}
                required
                validation={{ type: 'required' }}
              />
            </div>

            {/* Age (auto-calculated) */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                Age
                <Calculator className="h-4 w-4 text-muted-foreground" />
              </Label>
              <EnhancedInput
                value={data.age?.toString() || '0'}
                readOnly
                className="bg-muted"
                placeholder="Auto-calculated"
                success={data.age > 0 ? `${data.age} years old` : undefined}
              />
              {/* Age-related Considerations right under Age */}
              {data.age > 0 && (data.age < 1 || data.age < 18 || data.age >= 65) && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Age-related Considerations:</strong>
                    {data.age < 1 && ' Special considerations required for patients under 1 year old.'}
                    {data.age >= 1 && data.age < 18 && ' Parental consent and special protocols required for minor.'}
                    {data.age >= 65 && ' Consider ASA II+ for geriatric patient (≥65 years).'}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Weight with unit conversion */}
            <div className="space-y-2">
              <Label>Weight</Label>
              <div className="flex gap-2">
                <EnhancedInput
                  value={weightUnit === 'kg' ? (data.weight?.toString() || '0') : Math.round((data.weight || 0) * 2.20462 * 10) / 10}
                  onChange={(e) => handleWeightChange(e.target.value, weightUnit)}
                  placeholder="Enter weight"
                  type="number"
                  step="0.1"
                  validation={{ type: 'positive' }}
                  error={validationErrors.weight}
                />
                <Select value={weightUnit} onValueChange={(value: 'kg' | 'lbs') => setWeightUnit(value)}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="lbs">lbs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Height with unit conversion */}
            <div className="space-y-2">
              <Label>Height</Label>
              {heightUnit === 'inches' ? (
                <div className="flex gap-2">
                  <div className="flex gap-1">
                    <EnhancedInput
                      value={heightFeet?.toString() || '0'}
                      onChange={(e) => {
                        const feet = parseInt(e.target.value) || 0;
                        setHeightFeet(feet);
                        handleFeetInchesChange(feet, heightInches);
                      }}
                      placeholder="5"
                      type="number"
                      min="0"
                      max="8"
                      className="w-16"
                      validation={{ type: 'range', min: 0, max: 8 }}
                    />
                    <span className="flex items-center text-sm text-muted-foreground">ft</span>
                  </div>
                  <div className="flex gap-1">
                    <EnhancedInput
                      value={heightInches?.toString() || '0'}
                      onChange={(e) => {
                        const inches = parseInt(e.target.value) || 0;
                        setHeightInches(inches);
                        handleFeetInchesChange(heightFeet, inches);
                      }}
                      placeholder="10"
                      type="number"
                      min="0"
                      max="11"
                      className="w-16"
                      validation={{ type: 'range', min: 0, max: 11 }}
                    />
                    <span className="flex items-center text-sm text-muted-foreground">in</span>
                  </div>
                  <Select value={heightUnit} onValueChange={(value: 'inches' | 'cm') => setHeightUnit(value)}>
                    <SelectTrigger className="w-20">
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
                  <EnhancedInput
                    value={((data.height || 0) * 2.54).toString()}
                    onChange={(e) => handleHeightChange(e.target.value, heightUnit)}
                    placeholder="Enter height"
                    type="number"
                    step="0.1"
                    validation={{ type: 'positive' }}
                    error={validationErrors.height}
                  />
                  <Select value={heightUnit} onValueChange={(value: 'inches' | 'cm') => setHeightUnit(value)}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inches">ft/in</SelectItem>
                      <SelectItem value="cm">cm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              {validationErrors.height && (
                <p className="text-sm text-destructive">{validationErrors.height}</p>
              )}
            </div>

            {/* BMI (auto-calculated) */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                BMI
                <Calculator className="h-4 w-4 text-muted-foreground" />
              </Label>
              <EnhancedInput
                value={data.bmi?.toString() || '0'}
                readOnly
                className="bg-muted"
                placeholder="Auto-calculated"
                success={data.bmi > 0 ? `BMI: ${data.bmi}` : undefined}
                warning={warnings.bmi}
              />
              {/* BMI-related ASA Warning (BMI section only) */}
              {warnings.asa && (
                <Alert className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Clinical Considerations (BMI):</strong> {warnings.asa}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Sex */}
            <div className="space-y-2">
              <Label>Sex</Label>
              <Select value={data.sex} onValueChange={(value: 'M' | 'F') => stableOnChange({ sex: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sex" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Male</SelectItem>
                  <SelectItem value="F">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>


            {/* LMP Date (for females only) */}
            {data.sex === 'F' && (
              <div className="space-y-2">
                <EnhancedInput
                  label="Last Menstrual Period"
                  type="date"
                  value={data.lmpDate || ''}
                  onChange={(e) => stableOnChange({ lmpDate: e.target.value })}
                />
              </div>
            )}
          </div>


        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedPatientInfoSection;
