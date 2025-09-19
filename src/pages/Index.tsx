import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardList, CheckCircle, Clock, User } from 'lucide-react';
import TabbedPreOpSection from '@/components/anesthesia/TabbedPreOpSection';
import { PreOpAssessment, MedicalReview, PreOpVitals, PreOpInstructions, AnesthesiaType, PreOpChecklist as PreOpChecklistType } from '@/types/anesthesia';

const PreOpChecklist: React.FC = () => {
  // Initialize form data state
  const [preOpAssessment, setPreOpAssessment] = useState<PreOpAssessment>({
    asa: 1,
    mallampatti: 1,
    npoHours: 0,
    heart: '',
    lungs: '',
    allergies: [],
    medications: [],
    patientIdentified: false,
    rbcAltReviewed: false,
    writtenVerbalConsentsGiven: false,
    reviewedProcedureIvPreOp: false,
    preRinsePeridex: false,
    medicalClearance: false,
    consentSigned: false,
    questionsAnswered: false,
    informedConsentVideo: false,
    postOpVideo: false,
    preProcedureTimeOut: false,
    // Special Pre-Operative Considerations
    pediatricPatient: null,
    highRiskPatient: null,
    lungsAuscultated: null,
    lungsCTAB: false,
    lungsOther: '',
    heartAuscultated: null,
    heartRRR: false,
    heartOther: '',
    npoStatusVerified: null,
    npoEightHours: false,
    npoSixHours: false,
    npoOther: '',
    specialConsiderationsNotes: ''
  });

  const [medicalReview, setMedicalReview] = useState<MedicalReview>({
    medicalHistoryReviewed: null,
    allergiesReviewed: null,
    surgicalAnesthesiaHistoryReviewed: null,
    familyHistoryReviewed: null,
    medicationsReviewed: null,
    diabeticMedication: false,
    anticoagulant: false,
    immunosuppressive: false,
    bisphosphonates: false,
    medicationModifications: null,
    medicalConsultReviewed: null,
    medicalConsultNA: false,
    notes: ''
  });

  const [preOpVitals, setPreOpVitals] = useState<PreOpVitals>({
    timeoutVerification: false,
    surgeonName: '',
    sedationBySurgeon: false,
    sedationLevel: '',
    height: '',
    weightLbs: '',
    weightKg: '',
    bloodPressure: '',
    pulse: '',
    spo2: '',
    respiratoryRate: '',
    fsbg: '',
    time: '',
    equipmentDate: '',
    equipmentCompletedBy: '',
    equipmentNotes: ''
  });

  const [preOpInstructions, setPreOpInstructions] = useState<PreOpInstructions>({
    preOpInstructions: false,
    postOpInstructions: false,
    additionalNotes: ''
  });

  const [anesthesiaType, setAnesthesiaType] = useState<AnesthesiaType>({
    ivSedation: false,
    oralSedation: false,
    nitrousOxide: false,
    localAnesthesia: false
  });

  const [preOpChecklist, setPreOpChecklist] = useState<PreOpChecklistType>({
    monitors: false,
    suction: false,
    airway: false,
    ivSetup: false,
    emergencyKit: false,
    nitrousOxide: false,
    emergencyMeds: false,
    oxygen: false,
    anesthesiaMonitors: false
  });

  const handleSectionChange = (section: string, data: any) => {
    switch (section) {
      case 'preOpAssessment':
        setPreOpAssessment(prev => ({ ...prev, ...data }));
        break;
      case 'medicalReview':
        setMedicalReview(prev => ({ ...prev, ...data }));
        break;
      case 'preOpVitals':
        setPreOpVitals(prev => ({ ...prev, ...data }));
        break;
      case 'preOpInstructions':
        setPreOpInstructions(prev => ({ ...prev, ...data }));
        break;
      case 'anesthesiaType':
        setAnesthesiaType(prev => ({ ...prev, ...data }));
        break;
      case 'preOpChecklist':
        setPreOpChecklist(prev => ({ ...prev, ...data }));
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6 shadow-medium">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Pre-Operative Form</h1>
          <p className="text-lg opacity-90">Complete pre-operative assessment and checklist</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ClipboardList className="h-6 w-6" />
              <span>Pre-Operative Sedation/Anesthesia Checklist</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <TabbedPreOpSection
              preOpAssessment={preOpAssessment}
              medicalReview={medicalReview}
              preOpVitals={preOpVitals}
              preOpInstructions={preOpInstructions}
              onChange={handleSectionChange}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const Index: React.FC = () => {
  return <PreOpChecklist />;
};

export default Index;
