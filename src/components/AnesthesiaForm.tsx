import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Stethoscope, Activity, Clock, ClipboardCheck, Pill } from 'lucide-react';
import { AnesthesiaRecord } from '@/types/anesthesia';

// Import section components
import PreOpSection from './anesthesia/PreOpSection';
import VitalsSection from './anesthesia/VitalsSection';
import IntraOpSection from './anesthesia/IntraOpSection';
import PostOpSection from './anesthesia/PostOpSection';
import MedicationRxSection from './anesthesia/MedicationRxSection';

const SectionHeader = ({
  children
}: {
  children: React.ReactNode;
}) => (
  <div className="bg-primary text-primary-foreground p-3 font-semibold text-base mb-4 mx-0 py-[6px] px-[15px]">
    {children}
  </div>
);

const AnesthesiaForm: React.FC = () => {
  const [formData, setFormData] = useState<AnesthesiaRecord>({
    // Basic Info
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    patient: {
      name: '',
      dob: '',
      age: 0,
      weight: 0,
      height: 0,
      bmi: 0,
      sex: 'M',
    },
    
    // Pre-Op
    preOpAssessment: {
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
    },
    anesthesiaType: {
      ivSedation: false,
      oralSedation: false,
      nitrousOxide: false,
      localAnesthesia: false,
    },
    preOpChecklist: {
      monitors: false,
      suction: false,
      airway: false,
      ivSetup: false,
      emergencyKit: false,
      nitrousOxide: false,
      emergencyMeds: false,
      oxygen: false,
      anesthesiaMonitors: false,
    },
    medicationPrescriptions: {
      pmpReportVerified: false,
      selectedCategory: '',
      draftMedications: [],
      medicationLog: [],
    },
    
    // Intra-Op
    vitals: {
      bloodPressure: '',
      pulse: 0,
      spo2: 0,
      respiration: 0,
    },
    monitoring: {
      bloodPressureCuff: false,
      ecg: false,
      pulseOximetry: false,
      respiration: false,
      etco2: false,
    },
    medications: {
      preSedMeds: {
        halcion: false,
        dose: '',
        time: '',
      },
      antiemetics: {
        zofran: false,
        other1: '',
        other2: '',
      },
      oxygen: {
        rate: '3.0',
        other: '',
      },
      loggedDrugs: [],
    },
    surgicalProcedure: {
      procedure: '',
      teeth: [],
      technique: [],
      complications: '',
      notes: '',
    },
    localAnesthetic: {
      articaine: false,
      bupivicaine: false,
      mepivicaine: false,
      lidocaine: false,
      carpules: 0,
    },
    fluidManagement: {
      lactatedRinger: 0,
      normalSaline: 0,
      dextrose5: 0,
      ebl: 0,
    },
    airwayProtection: {
      oropharyngealDrape: false,
      gauzePack: false,
      biteBlock: false,
      tmjStabilization: false,
    },
    timeSummary: {
      anesthesiaStart: '',
      anesthesiaEnd: '',
      operationStart: '',
      operationEnd: '',
      airwayMaintenance: '',
    },
    
    // Post-Op
    dischargeScore: {
      vitals: 0,
      ambulation: 0,
      respiration: 0,
      consciousness: 0,
      color: 0,
      total: 0,
      timeDischarged: '',
    },
    postOpInstructions: {
      prescriptions: [],
      followUp: {
        prn: false,
        oneWeek: false,
        twoWeeks: false,
        oneMonth: false,
        other: '',
      },
      objectives: '',
    },
    
    // Signatures
    surgeonName: '',
    surgeonSignature: '',
    anesthesiaProviderName: '',
    anesthesiaProviderSignature: '',
    surgicalAssistantName: '',
    surgicalAssistantSignature: '',
    
    // Additional
    notes: '',
    pageNumber: 1,
    totalPages: 1,
  });

  const updateFormData = (section: keyof AnesthesiaRecord, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  const handleSave = () => {
    console.log('Saving anesthesia record:', formData);
    // TODO: Implement save functionality
  };

  const handlePrint = () => {
    window.print();
  };

  // Autofill Intra-Op vitals from Pre-Op snapshot if present
  useEffect(() => {
    try {
      const preOpSnapshotRaw = localStorage.getItem('preOpVitalsSnapshot');
      if (preOpSnapshotRaw) {
        const snap = JSON.parse(preOpSnapshotRaw);
        setFormData(prev => ({
          ...prev,
          vitals: {
            ...prev.vitals,
            bloodPressure: snap.bloodPressure ?? prev.vitals.bloodPressure,
            pulse: snap.pulse ?? prev.vitals.pulse,
            spo2: snap.spo2 ?? prev.vitals.spo2,
            respiration: snap.respiratoryRate ?? prev.vitals.respiration,
          }
        }));
      }
    } catch {}
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6 shadow-medium">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Anesthesia Record</h1>
          <div className="flex items-center space-x-4 text-sm">
            <span>Date: {formData.date}</span>
            <span>Time: {formData.time}</span>
            <span>Patient: {formData.patient.name || 'New Patient'}</span>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="max-w-7xl mx-auto p-6">
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-6 w-6" />
              <span>Anesthesia Documentation</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="preop" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="preop" className="flex items-center space-x-2">
                  <Stethoscope className="h-4 w-4" />
                  <span className="hidden sm:inline">Pre-Op</span>
                </TabsTrigger>
                <TabsTrigger value="vitals" className="flex items-center space-x-2">
                  <Activity className="h-4 w-4" />
                  <span className="hidden sm:inline">Vitals</span>
                </TabsTrigger>
                <TabsTrigger value="intraop" className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span className="hidden sm:inline">Intra-Op</span>
                </TabsTrigger>
                <TabsTrigger value="medications" className="flex items-center space-x-2">
                  <Pill className="h-4 w-4" />
                  <span className="hidden sm:inline">Med Rx</span>
                </TabsTrigger>
                <TabsTrigger value="postop" className="flex items-center space-x-2">
                  <ClipboardCheck className="h-4 w-4" />
                  <span className="hidden sm:inline">Post-Op</span>
                </TabsTrigger>
                <TabsTrigger value="summary" className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Summary</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="preop" className="mt-6">
                <PreOpSection 
                  preOpAssessment={formData.preOpAssessment}
                  anesthesiaType={formData.anesthesiaType}
                  preOpChecklist={formData.preOpChecklist}
                  onChange={(section, data) => updateFormData(section, data)} 
                />
              </TabsContent>

              <TabsContent value="vitals" className="mt-6">
                <VitalsSection 
                  vitals={formData.vitals}
                  monitoring={formData.monitoring}
                  onChange={(section, data) => updateFormData(section, data)} 
                />
              </TabsContent>

              <TabsContent value="intraop" className="mt-6">
                <IntraOpSection 
                  surgicalProcedure={formData.surgicalProcedure}
                  localAnesthetic={formData.localAnesthetic}
                  fluidManagement={formData.fluidManagement}
                  airwayProtection={formData.airwayProtection}
                  timeSummary={formData.timeSummary}
                  onChange={(section, data) => updateFormData(section, data)} 
                />
              </TabsContent>

              <TabsContent value="medications" className="mt-6">
                <MedicationRxSection 
                  prescriptions={formData.medicationPrescriptions}
                  onChange={(prescriptions) => updateFormData('medicationPrescriptions', prescriptions)} 
                />
              </TabsContent>

              <TabsContent value="postop" className="mt-6">
                <PostOpSection 
                  dischargeScore={formData.dischargeScore}
                  postOpInstructions={formData.postOpInstructions}
                  onChange={(section, data) => updateFormData(section, data)} 
                />
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
              <Button variant="outline" onClick={handlePrint}>
                Print Record
              </Button>
              <Button onClick={handleSave}>
                Save Record
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnesthesiaForm;
