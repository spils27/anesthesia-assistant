// Anesthesia Form Data Types
export interface PatientInfo {
  name: string;
  dob: string;
  age: number;
  weight: number; // kg
  height: number; // inches
  bmi: number;
  sex: 'M' | 'F';
  lmpDate?: string; // for females
}

export interface Vitals {
  bloodPressure: string;
  pulse: number;
  spo2: number;
  respiration: number;
  etco2?: number;
  fbg?: number; // fasting blood glucose
}

export interface PreOpAssessment {
  asa: number;
  mallampatti: number;
  npoHours: number;
  heart: string;
  lungs: string;
  allergies: string[];
  medications: string[];
  // Assessment Checklist items
  patientIdentified: boolean;
  rbcAltReviewed: boolean; // Risks/Benefits/Complications/Alternatives Tx/No Tx Reviewed
  writtenVerbalConsentsGiven: boolean; // W & V consents given
  reviewedProcedureIvPreOp: boolean; // Reviewed Procedure and IV Pre-Op
  preRinsePeridex: boolean; // 1 min Pre-Rinse w/ Peridex
  medicalClearance: boolean;
  consentSigned: boolean;
  questionsAnswered: boolean;
  informedConsentVideo: boolean;
  postOpVideo: boolean;
  preProcedureTimeOut: boolean;
  // Special Pre-Operative Considerations
  pediatricPatient: boolean | null; // null = not selected, true = yes, false = no
  highRiskPatient: boolean | null;
  lungsAuscultated: boolean | null;
  lungsCTAB: boolean;
  lungsOther: string;
  heartAuscultated: boolean | null;
  heartRRR: boolean;
  heartOther: string;
  npoStatusVerified: boolean | null;
  npoEightHours: boolean;
  npoSixHours: boolean;
  npoOther: string;
  specialConsiderationsNotes: string;
}

export interface PatientAssessment {
  asa: number;
  mallampatti: number;
  npoHours: number;
  heart: string;
  lungs: string;
  allergies: string[];
  medications: string[];
  medicalClearance: boolean;
  consentSigned: boolean;
  questionsAnswered: boolean;
  informedConsentVideo: boolean;
  postOpVideo: boolean;
  preProcedureTimeOut: boolean;
  // Special Pre-Operative Considerations
  pediatricPatient: boolean | null; // null = not selected, true = yes, false = no
  highRiskPatient: boolean | null;
  lungsAuscultated: boolean | null;
  lungsCTAB: boolean;
  lungsOther: string;
  heartAuscultated: boolean | null;
  heartRRR: boolean;
  heartOther: string;
  npoStatusVerified: boolean | null;
  npoEightHours: boolean;
  npoSixHours: boolean;
  npoOther: string;
  notes: string;
}

export interface MedicalReview {
  medicalHistoryReviewed: boolean | null;
  allergiesReviewed: boolean | null;
  surgicalAnesthesiaHistoryReviewed: boolean | null;
  familyHistoryReviewed: boolean | null;
  medicationsReviewed: boolean | null;
  diabeticMedication: boolean;
  anticoagulant: boolean;
  immunosuppressive: boolean;
  bisphosphonates: boolean;
  medicationModifications: boolean | null;
  medicalConsultReviewed: boolean | null;
  medicalConsultNA: boolean;
  notes: string;
}

export interface PreOpVitals {
  timeoutVerification: boolean;
  surgeonName: string;
  sedationBySurgeon: boolean;
  sedationLevel: 'nitrous' | 'level1' | 'level2' | 'level3' | '';
  takenDayOfProcedure?: boolean;
  height: string;
  weightLbs: string;
  weightKg: string;
  bloodPressure: string;
  pulse: string;
  spo2: string;
  respiratoryRate: string;
  fsbg: string;
  time: string;
  equipmentDate: string;
  equipmentCompletedBy: string;
  equipmentNotes: string;
}

export interface PreOpInstructions {
  preOpInstructions: boolean;
  postOpInstructions: boolean;
  additionalNotes: string;
}

export interface AnesthesiaType {
  ivSedation: boolean;
  oralSedation: boolean;
  nitrousOxide: boolean;
  localAnesthesia: boolean;
}

export interface PreOpChecklist {
  monitors: boolean;
  suction: boolean;
  airway: boolean;
  ivSetup: boolean;
  emergencyKit: boolean;
  nitrousOxide: boolean;
  emergencyMeds: boolean;
  oxygen: boolean;
  anesthesiaMonitors: boolean;
}

export interface Monitoring {
  bloodPressureCuff: boolean;
  ecg: boolean;
  pulseOximetry: boolean;
  respiration: boolean;
  etco2: boolean;
}

export interface NitrousOxide {
  startTime: string;
  inductTime: string;
  endTime: string;
  maintenance: string; // 70/30, 60/40, etc.
  recovered: boolean;
}

export interface IVAccess {
  gauge: '18g' | '20g' | '22g' | '24g';
  location: 'ACF' | 'Hand' | 'Other';
  side: 'L' | 'R';
  route: 'IV' | 'IM';
}

export interface Medications {
  preSedMeds: {
    halcion: boolean;
    dose: string;
    time: string;
  };
  antiemetics: {
    zofran: boolean;
    other1: string;
    other2: string;
  };
  oxygen: {
    rate: '3.0' | '5.0' | 'Other';
    other: string;
  };
  loggedDrugs: Array<{
    name: string;
    time: string;
    dose: string;
    used: boolean;
    wasted: boolean;
    witness: string;
    initials: string;
    total: string;
  }>;
}

export interface SurgicalProcedure {
  procedure: string;
  teeth: string[];
  technique: string[];
  complications: string;
  notes: string;
}

export interface LocalAnesthetic {
  articaine: boolean;
  bupivicaine: boolean;
  mepivicaine: boolean;
  lidocaine: boolean;
  carpules: number;
}

export interface FluidManagement {
  lactatedRinger: number;
  normalSaline: number;
  dextrose5: number;
  ebl: number; // estimated blood loss
}

export interface AirwayProtection {
  oropharyngealDrape: boolean;
  gauzePack: boolean;
  biteBlock: boolean;
  tmjStabilization: boolean;
}

export interface TimeSummary {
  anesthesiaStart: string;
  anesthesiaEnd: string;
  operationStart: string;
  operationEnd: string;
  airwayMaintenance: string;
}

export interface DischargeScore {
  vitals: number; // Circulation (BP) 0-2
  ambulation: number; // Activity 0-2
  respiration: number; // Respiration 0-2
  consciousness: number; // 0-2
  color: number; // 0-2
  total: number; // 0-10
  timeDischarged: string;
  dischargeBloodPressure?: string;
  dischargePulse?: string;
  dischargeSpO2?: string;
  dischargeRespirations?: string;
}

export interface PostOpInstructions {
  prescriptions: Array<{
    medication: string;
    dosage: string;
    instructions: string;
    refill: boolean;
  }>;
  followUp: {
    prn: boolean;
    oneWeek: boolean;
    twoWeeks: boolean;
    oneMonth: boolean;
    other: string;
  };
  objectives: string;
}

export interface AnesthesiaRecord {
  // Basic Info
  date: string;
  time: string;
  patient: PatientInfo;
  
  // Pre-Op
  preOpAssessment: PreOpAssessment;
  medicalReview: MedicalReview;
  preOpVitals: PreOpVitals;
  preOpInstructions: PreOpInstructions;
  anesthesiaType: AnesthesiaType;
  preOpChecklist: PreOpChecklist;
  medicationPrescriptions: MedicationPrescriptions;
  
  // Intra-Op
  vitals: Vitals;
  monitoring: Monitoring;
  nitrousOxide?: NitrousOxide;
  ivAccess?: IVAccess;
  medications: Medications;
  surgicalProcedure: SurgicalProcedure;
  localAnesthetic: LocalAnesthetic;
  fluidManagement: FluidManagement;
  airwayProtection: AirwayProtection;
  timeSummary: TimeSummary;
  
  // Post-Op
  dischargeScore: DischargeScore;
  postOpInstructions: PostOpInstructions;
  
  // Signatures
  surgeonName: string;
  surgeonSignature: string;
  anesthesiaProviderName: string;
  anesthesiaProviderSignature: string;
  surgicalAssistantName: string;
  surgicalAssistantSignature: string;
  
  // Additional
  notes: string;
  pageNumber: number;
  totalPages: number;
}

export interface LocalAnesthetic {
  id: string;
  time: string;
  type: 'articaine' | 'bupivicaine' | 'mepivicaine' | 'lidocaine';
  concentration: string;
  epinephrine: string;
  carpules: number;
  totalVolume: number; // calculated from carpules
  notes?: string;
}

export interface PrescribedMedication {
  id: string;
  name: string;
  category: 'antibiotic' | 'pain' | 'other';
  prescribed: boolean;
  quantity: number;
  refills: number;
  notes?: string;
}

export interface MedicationLogEntry {
  id: string;
  name: string;
  category: 'antibiotic' | 'pain' | 'other';
  quantity: number;
  refills: number;
  notes?: string;
}

export interface MedicationPrescriptions {
  pmpReportVerified: boolean;
  selectedCategory: 'antibiotic' | 'pain' | 'other' | '';
  draftMedications: PrescribedMedication[];
  medicationLog: MedicationLogEntry[];
}
