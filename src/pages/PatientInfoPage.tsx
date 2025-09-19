import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import { PatientInfo } from '@/types/anesthesia';
import EnhancedPatientInfoSection from '@/components/anesthesia/EnhancedPatientInfoSection';

const PatientInfoPage: React.FC = () => {
  const [patientData, setPatientData] = useState<PatientInfo>({
    name: '',
    dob: '',
    age: 0,
    weight: 0,
    height: 0,
    bmi: 0,
    sex: 'M',
  });

  // Stable onChange function to prevent unnecessary re-renders
  const handlePatientDataChange = useCallback((updates: Partial<PatientInfo>) => {
    setPatientData(prev => ({ ...prev, ...updates }));
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Patient Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EnhancedPatientInfoSection 
            data={patientData} 
            onChange={handlePatientDataChange} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientInfoPage;
