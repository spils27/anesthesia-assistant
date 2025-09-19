# PDF Logic Integration Mapping

This document maps the PDF's JavaScript/Java automation logic to the React/TypeScript application components.

## 📋 **PDF Script to Application Component Mapping**

| PDF Script/Feature | Destination Component | Action/Event | Translation in App |
|-------------------|----------------------|--------------|-------------------|
| `updateWeight` (kg/lbs) | EnhancedPatientInfoSection | OnChange Weight/Height | `PDFLogic.convertWeight` utility + auto-update |
| `calculateBMI` | EnhancedPatientInfoSection | OnChange any height/weight | `PDFLogic.calculateBMI` + real-time display |
| `CalculateAge` | EnhancedPatientInfoSection | OnChange DOB | `PDFLogic.calculateAge` + auto-fill age field |
| `Mid-T1 ValidateAction` | EnhancedDrugLog | OnBlur/Submit dose cell | `PDFLogic.validateDrugDose` + timestamp + format |
| Field N/A Toggle | All Sections | OnChange checkbox | Show/hide fields dynamically with React state |
| Total/Waste Calculation | EnhancedDrugLog | OnChange drug entry | `PDFLogic.calculateDrugTotals` + real-time totals |
| NPO Validation | EnhancedPatientInfoSection | OnChange NPO hours | `PDFLogic.validateNPO` + warnings |
| ASA Validation | PreOpSection | OnChange ASA selection | `PDFLogic.validateASAClassification` + recommendations |
| Aldete Score | PostOpSection | OnChange score fields | `PDFLogic.calculateAldeteScore` + discharge readiness |

## 🔧 **Core Calculation Functions**

### Weight Conversion (`updateWeight` logic)
```typescript
// PDF: updateWeight function
// App: PDFLogic.convertWeight
convertWeight.kgToLbs(kg: number): number
convertWeight.lbsToKg(lbs: number): number
convertWeight.convert(value, fromUnit, toUnit): number
```

### BMI Calculation (`calculateBMI` logic)
```typescript
// PDF: calculateBMI function
// App: PDFLogic.calculateBMI
calculateBMI(weightKg: number, heightInches: number): {
  bmi: number;
  category: string; // Underweight, Normal, Overweight, etc.
}
```

### Age Calculation (`CalculateAge` logic)
```typescript
// PDF: CalculateAge function
// App: PDFLogic.calculateAge
calculateAge(dob: string): {
  age: number;
  ageInMonths: number;
}
```

### Drug Dose Validation (`Mid-T1 ValidateAction` logic)
```typescript
// PDF: Mid-T1 ValidateAction
// App: PDFLogic.validateDrugDose
validateDrugDose(drugName: string, dose: string, unit: string): {
  isValid: boolean;
  formattedDose: string; // "HHMM 2 mg"
  timestamp: string;
  error?: string;
}
```

## 🎯 **Field-Level Handlers**

### Real-time Validation
- **Enhanced Input Component**: Provides inline validation with visual feedback
- **Auto-calculation**: BMI, age, drug totals update automatically
- **Error Prevention**: Invalid values are caught before form submission

### Conditional Display Logic
- **Age-based fields**: LMP date shows only for females
- **Infant warnings**: Special alerts for patients under 1 year
- **Minor protocols**: Different validation for patients under 18

### Dynamic Behavior
- **Unit conversion**: Weight/height can be entered in different units
- **Auto-timestamping**: Drug entries get automatic timestamps
- **Real-time totals**: Drug usage totals update as entries are made

## 📊 **Validation Rules**

### Required Fields
- Patient name, DOB, weight, height
- Drug name and dose for controlled substances
- Witness information for drug entries

### Range Validations
- Weight: Must be positive
- Height: Must be positive
- NPO hours: Validated against procedure type
- ASA classification: Validated against age and comorbidities

### Format Validations
- Email addresses (if applicable)
- Phone numbers (if applicable)
- Time formats (HH:MM)
- Numeric values with appropriate decimal places

## 🔄 **State Management**

### Form State
- **Patient Info**: Auto-calculated fields update parent state
- **Drug Log**: Individual entries maintain validation state
- **Totals**: Calculated values update in real-time

### Validation State
- **Field-level**: Individual field validation status
- **Form-level**: Overall form completion status
- **Warning system**: Non-blocking alerts for recommendations

## 🎨 **UI/UX Enhancements**

### Visual Feedback
- **Status Icons**: Check marks, warning triangles, error indicators
- **Color Coding**: Green for valid, red for errors, yellow for warnings
- **Progress Indicators**: Form completion status

### User Experience
- **Auto-fill**: Calculated fields are read-only with clear labeling
- **Smart Defaults**: Common values pre-filled where appropriate
- **Keyboard Navigation**: Tab order optimized for form flow

## 🧪 **Testing Strategy**

### Unit Tests
- Test each calculation function with known inputs
- Verify validation rules with edge cases
- Test unit conversions with various values

### Integration Tests
- Test form state updates when fields change
- Verify real-time calculations work correctly
- Test conditional field visibility

### User Acceptance Tests
- Compare app behavior to PDF functionality
- Test with real clinical scenarios
- Verify all PDF automation is replicated

## 📝 **Maintenance Notes**

### Code Comments
```typescript
// This BMI calculator matches the logic on page X of PDF
// Drug dose formatting: see ValidateAction1 for Mid-T1 in paste.txt
// Weight conversion: matches updateWeight function in PDF
```

### Future Enhancements
- Add more sophisticated validation rules
- Implement audit trail for all calculations
- Add export functionality matching PDF format
- Integrate with electronic health records

## 🚀 **Deployment Considerations**

### Performance
- Calculations are optimized for real-time updates
- Validation runs on blur/change events, not keystroke
- Large forms use virtualization for better performance

### Accessibility
- All form fields have proper labels
- Validation messages are screen-reader friendly
- Keyboard navigation is fully supported

### Browser Compatibility
- Uses modern JavaScript features with fallbacks
- CSS Grid and Flexbox with appropriate fallbacks
- Progressive enhancement for older browsers

---

**Last Updated**: $(date)
**Version**: 1.0.0
**Maintainer**: Development Team
