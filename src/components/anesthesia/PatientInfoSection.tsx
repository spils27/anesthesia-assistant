import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PatientInfo } from '@/types/anesthesia';

const SectionHeader = ({
  children
}: {
  children: React.ReactNode;
}) => (
  <div className="bg-primary text-primary-foreground p-3 font-semibold text-base mb-4 mx-0 py-[6px] px-[15px]">
    {children}
  </div>
);

interface PatientInfoSectionProps {
  data: PatientInfo;
  onChange: (data: Partial<PatientInfo>) => void;
}

const PatientInfoSection: React.FC<PatientInfoSectionProps> = ({ data, onChange }) => {
  const calculateBMI = (weight: number, height: number) => {
    if (weight > 0 && height > 0) {
      const heightInMeters = height * 0.0254; // Convert inches to meters
      return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;
    }
    return 0;
  };

  const calculateAge = (dob: string) => {
    if (!dob) return 0;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleInputChange = (field: keyof PatientInfo, value: any) => {
    let updatedData: Partial<PatientInfo> = { [field]: value };

    // Auto-calculate age when DOB changes
    if (field === 'dob') {
      updatedData.age = calculateAge(value);
    }

    // Auto-calculate BMI when weight or height changes
    if (field === 'weight' || field === 'height') {
      const newWeight = field === 'weight' ? value : data.weight;
      const newHeight = field === 'height' ? value : data.height;
      updatedData.bmi = calculateBMI(newWeight, newHeight);
    }

    onChange(updatedData);
  };

  return (
    <div className="space-y-6">
      <SectionHeader>Patient Information</SectionHeader>
      
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="patientName">Patient Name</Label>
              <Input
                id="patientName"
                value={data.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter patient name"
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={data.dob}
                onChange={(e) => handleInputChange('dob', e.target.value)}
              />
            </div>

            {/* Age (auto-calculated) */}
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={data.age}
                readOnly
                className="bg-muted"
                placeholder="Auto-calculated"
              />
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={data.weight}
                onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                placeholder="Enter weight in kg"
                step="0.1"
              />
            </div>

            {/* Height */}
            <div className="space-y-2">
              <Label htmlFor="height">Height (inches)</Label>
              <Input
                id="height"
                type="number"
                value={data.height}
                onChange={(e) => handleInputChange('height', parseFloat(e.target.value) || 0)}
                placeholder="Enter height in inches"
                step="0.1"
              />
            </div>

            {/* BMI (auto-calculated) */}
            <div className="space-y-2">
              <Label htmlFor="bmi">BMI</Label>
              <Input
                id="bmi"
                type="number"
                value={data.bmi}
                readOnly
                className="bg-muted"
                placeholder="Auto-calculated"
                step="0.1"
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={data.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Male</SelectItem>
                  <SelectItem value="F">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* NPO Hours */}
            <div className="space-y-2">
              <Label htmlFor="npoHours">NPO Hours</Label>
              <Input
                id="npoHours"
                type="number"
                value={data.npoHours}
                onChange={(e) => handleInputChange('npoHours', parseFloat(e.target.value) || 0)}
                placeholder="Hours since last meal"
                step="0.5"
              />
            </div>

            {/* LMP Date (for females) */}
            {data.gender === 'F' && (
              <div className="space-y-2">
                <Label htmlFor="lmpDate">Last Menstrual Period</Label>
                <Input
                  id="lmpDate"
                  type="date"
                  value={data.lmpDate || ''}
                  onChange={(e) => handleInputChange('lmpDate', e.target.value)}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientInfoSection;
