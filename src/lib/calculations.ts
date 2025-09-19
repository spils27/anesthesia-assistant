// Core calculation utilities extracted from PDF logic
// This module centralizes all calculations and validations

export interface WeightConversion {
  kg: number;
  lbs: number;
}

export interface BMICalculation {
  bmi: number;
  category: string;
}

export interface AgeCalculation {
  age: number;
  ageInMonths: number;
}

export interface DrugDoseValidation {
  isValid: boolean;
  formattedDose: string;
  timestamp: string;
  error?: string;
}

// Weight conversion utilities (matches PDF updateWeight logic)
export const convertWeight = {
  kgToLbs: (kg: number): number => Math.round(kg * 2.20462 * 10) / 10,
  lbsToKg: (lbs: number): number => Math.round(lbs / 2.20462 * 10) / 10,
  
  // Bidirectional conversion
  convert: (value: number, fromUnit: 'kg' | 'lbs', toUnit: 'kg' | 'lbs'): number => {
    if (fromUnit === toUnit) return value;
    return fromUnit === 'kg' ? convertWeight.kgToLbs(value) : convertWeight.lbsToKg(value);
  }
};

// BMI calculation (matches PDF calculateBMI logic)
export const calculateBMI = (weightKg: number, heightInches: number): BMICalculation => {
  if (weightKg <= 0 || heightInches <= 0) {
    return { bmi: 0, category: 'Invalid' };
  }
  
  const heightMeters = heightInches * 0.0254;
  const bmi = Math.round((weightKg / (heightMeters * heightMeters)) * 10) / 10;
  
  let category = '';
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi < 25) category = 'Normal';
  else if (bmi < 30) category = 'Overweight';
  else if (bmi < 35) category = 'Obese Class I';
  else if (bmi < 40) category = 'Obese Class II';
  else category = 'Obese Class III';
  
  return { bmi, category };
};

// Age calculation (matches PDF CalculateAge logic)
export const calculateAge = (dob: string): AgeCalculation => {
  if (!dob) return { age: 0, ageInMonths: 0 };
  
  const today = new Date();
  const birthDate = new Date(dob);
  
  if (birthDate > today) return { age: 0, ageInMonths: 0 };
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  const ageInMonths = age * 12 + monthDiff;
  
  return { age, ageInMonths };
};

// Drug dose validation and formatting (matches PDF Mid-T1 ValidateAction logic)
export const validateDrugDose = (
  drugName: string,
  dose: string,
  unit: string = 'mg'
): DrugDoseValidation => {
  const timestamp = new Date().toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  // Validate dose format
  const doseNumber = parseFloat(dose);
  if (isNaN(doseNumber) || doseNumber <= 0) {
    return {
      isValid: false,
      formattedDose: '',
      timestamp,
      error: 'Invalid dose amount'
    };
  }
  
  // Format dose string (matches PDF formatting)
  const formattedDose = `${timestamp} ${doseNumber} ${unit}`;
  
  return {
    isValid: true,
    formattedDose,
    timestamp
  };
};

// NPO validation logic
export const validateNPO = (npoHours: number, procedureType: string): {
  isValid: boolean;
  warning?: string;
  recommendation: string;
} => {
  const recommendations = {
    'clear_liquids': { min: 2, max: 4, text: 'Clear liquids: 2-4 hours' },
    'light_meal': { min: 6, max: 8, text: 'Light meal: 6-8 hours' },
    'heavy_meal': { min: 8, max: 12, text: 'Heavy meal: 8-12 hours' },
    'general': { min: 6, max: 8, text: 'General: 6-8 hours' }
  };
  
  const rec = recommendations[procedureType as keyof typeof recommendations] || recommendations.general;
  
  if (npoHours < rec.min) {
    return {
      isValid: false,
      warning: `NPO time (${npoHours}h) is less than recommended minimum (${rec.min}h)`,
      recommendation: rec.text
    };
  }
  
  if (npoHours > rec.max) {
    return {
      isValid: true,
      warning: `NPO time (${npoHours}h) exceeds recommended maximum (${rec.max}h)`,
      recommendation: rec.text
    };
  }
  
  return {
    isValid: true,
    recommendation: rec.text
  };
};

// ASA classification validation
export const validateASAClassification = (asa: number, age: number, comorbidities: string[]): {
  isValid: boolean;
  warning?: string;
  recommendation: string;
} => {
  const recommendations = {
    1: 'Normal healthy patient',
    2: 'Mild systemic disease',
    3: 'Severe systemic disease',
    4: 'Severe systemic disease that is a constant threat to life',
    5: 'Moribund patient not expected to survive'
  };
  
  // Age-based validation
  if (age < 1 && asa > 2) {
    return {
      isValid: false,
      warning: 'ASA classification may be too high for infant age',
      recommendation: recommendations[asa as keyof typeof recommendations]
    };
  }
  
  // Comorbidity validation
  if (comorbidities.length === 0 && asa > 2) {
    return {
      isValid: false,
      warning: 'ASA classification may be too high without documented comorbidities',
      recommendation: recommendations[asa as keyof typeof recommendations]
    };
  }
  
  return {
    isValid: true,
    recommendation: recommendations[asa as keyof typeof recommendations]
  };
};

// Drug total calculations (matches PDF total/waste logic)
export const calculateDrugTotals = (drugEntries: Array<{
  used: boolean;
  wasted: boolean;
  dose: number;
}>): {
  totalUsed: number;
  totalWasted: number;
  totalDispensed: number;
} => {
  const totalUsed = drugEntries
    .filter(entry => entry.used)
    .reduce((sum, entry) => sum + entry.dose, 0);
    
  const totalWasted = drugEntries
    .filter(entry => entry.wasted)
    .reduce((sum, entry) => sum + entry.dose, 0);
    
  const totalDispensed = totalUsed + totalWasted;
  
  return { totalUsed, totalWasted, totalDispensed };
};

// Aldete discharge score calculation
export const calculateAldeteScore = (scores: {
  vitals: number;
  ambulation: number;
  nv: number; // nausea/vomiting
  pain: number;
  consciousness: number;
  color: number;
}): {
  total: number;
  isReadyForDischarge: boolean;
  recommendation: string;
} => {
  const total = scores.vitals + scores.ambulation + scores.nv + scores.pain + scores.consciousness + scores.color;
  
  let recommendation = '';
  let isReadyForDischarge = false;
  
  if (total >= 8) {
    isReadyForDischarge = true;
    recommendation = 'Patient ready for discharge';
  } else if (total >= 6) {
    recommendation = 'Monitor closely, may be ready soon';
  } else {
    recommendation = 'Patient not ready for discharge';
  }
  
  return { total, isReadyForDischarge, recommendation };
};

// Field validation utilities
export const validateField = {
  required: (value: any): boolean => value !== null && value !== undefined && value !== '',
  
  numeric: (value: string): boolean => !isNaN(parseFloat(value)) && isFinite(parseFloat(value)),
  
  positive: (value: number): boolean => value > 0,
  
  range: (value: number, min: number, max: number): boolean => value >= min && value <= max,
  
  email: (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  
  phone: (value: string): boolean => /^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-\(\)]/g, ''))
};

// Time formatting utilities
export const formatTime = {
  toHHMM: (date: Date): string => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  },
  
  toHHMMSS: (date: Date): string => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  },
  
  parseHHMM: (timeString: string): Date => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }
};

// Export all utilities as a single object for easy importing
export const PDFLogic = {
  convertWeight,
  calculateBMI,
  calculateAge,
  validateDrugDose,
  validateNPO,
  validateASAClassification,
  calculateDrugTotals,
  calculateAldeteScore,
  validateField,
  formatTime
};
