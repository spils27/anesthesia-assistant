import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Stethoscope, ClipboardCheck, Shield } from 'lucide-react';
import EnhancedInput from '@/components/ui/enhanced-input';
import { PreOpAssessment, AnesthesiaType, PreOpChecklist } from '@/types/anesthesia';
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

interface PreOpSectionProps {
  preOpAssessment: PreOpAssessment;
  anesthesiaType: AnesthesiaType;
  preOpChecklist: PreOpChecklist;
  onChange: (section: string, data: any) => void;
}

const PreOpSection: React.FC<PreOpSectionProps> = ({ 
  preOpAssessment, 
  anesthesiaType, 
  preOpChecklist, 
  onChange 
}) => {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [warnings, setWarnings] = useState<Record<string, string>>({});

  const handleAssessmentChange = (field: keyof PreOpAssessment, value: any) => {
    onChange('preOpAssessment', { [field]: value });
    
    // Validate ASA classification
    if (field === 'asa') {
      const validation = PDFLogic.validateASAClassification(value, 0, preOpAssessment.medications);
      if (!validation.isValid) {
        setValidationErrors(prev => ({ ...prev, asa: validation.warning || '' }));
      } else {
        setValidationErrors(prev => {
          const { asa: _, ...rest } = prev;
          return rest;
        });
      }
    }
    
    // Validate NPO hours
    if (field === 'npoHours') {
      const validation = PDFLogic.validateNPO(value, 'general');
      if (!validation.isValid) {
        setValidationErrors(prev => ({ ...prev, npoHours: validation.warning || '' }));
      } else if (validation.warning) {
        setWarnings(prev => ({ ...prev, npoHours: validation.warning || '' }));
      } else {
        setValidationErrors(prev => {
          const { npoHours: _, ...rest } = prev;
          return rest;
        });
        setWarnings(prev => {
          const { npoHours: _, ...rest } = prev;
          return rest;
        });
      }
    }
  };

  const handleAnesthesiaTypeChange = (field: keyof AnesthesiaType, value: boolean) => {
    onChange('anesthesiaType', { [field]: value });
  };

  const handleChecklistChange = (field: keyof PreOpChecklist, value: boolean) => {
    onChange('preOpChecklist', { [field]: value });
  };

  // Calculate completion percentage
  const getCompletionPercentage = () => {
    const totalItems = Object.keys(preOpChecklist).length;
    const completedItems = Object.values(preOpChecklist).filter(Boolean).length;
    return Math.round((completedItems / totalItems) * 100);
  };

  const completionPercentage = getCompletionPercentage();

  return (
    <div className="space-y-6">
      {/* Pre-Operative Assessment */}
      <SectionHeader>Pre-Operative Assessment</SectionHeader>
      
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* ASA Classification */}
            <div className="space-y-2">
              <Label htmlFor="asa" className="flex items-center gap-2">
                ASA Classification
                <Shield className="h-4 w-4 text-muted-foreground" />
              </Label>
              <Select 
                value={preOpAssessment.asa.toString()} 
                onValueChange={(value) => handleAssessmentChange('asa', parseInt(value))}
              >
                <SelectTrigger className={validationErrors.asa ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select ASA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">ASA I - Normal healthy patient</SelectItem>
                  <SelectItem value="2">ASA II - Mild systemic disease</SelectItem>
                  <SelectItem value="3">ASA III - Severe systemic disease</SelectItem>
                  <SelectItem value="4">ASA IV - Severe systemic disease that is a constant threat to life</SelectItem>
                  <SelectItem value="5">ASA V - Moribund patient not expected to survive</SelectItem>
                </SelectContent>
              </Select>
              {validationErrors.asa && (
                <p className="text-sm text-destructive">{validationErrors.asa}</p>
              )}
            </div>

            {/* Mallampatti Score */}
            <div className="space-y-2">
              <Label htmlFor="mallampatti" className="flex items-center gap-2">
                Mallampatti Score
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
              </Label>
              <Select 
                value={preOpAssessment.mallampatti.toString()} 
                onValueChange={(value) => handleAssessmentChange('mallampatti', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Mallampatti" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Class I - Full visibility of tonsils, uvula, and soft palate</SelectItem>
                  <SelectItem value="2">Class II - Partial visibility of tonsils, uvula, and soft palate</SelectItem>
                  <SelectItem value="3">Class III - Only soft palate and base of uvula visible</SelectItem>
                  <SelectItem value="4">Class IV - Only hard palate visible</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* NPO Hours */}
            <div className="space-y-2">
              <EnhancedInput
                label="NPO Hours"
                type="number"
                value={preOpAssessment.npoHours.toString()}
                onChange={(e) => handleAssessmentChange('npoHours', parseFloat(e.target.value) || 0)}
                placeholder="Hours since last meal"
                step="0.5"
                validation={{ type: 'positive' }}
                error={validationErrors.npoHours}
                warning={warnings.npoHours}
              />
            </div>

            

            
          </div>

          {/* Assessment Checklist */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium">Assessment Checklist</h4>
              <div className="flex items-center gap-2">
                <div className="text-sm text-muted-foreground">
                  {completionPercentage}% Complete
                </div>
                <div className="w-24 bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Patient Identified */}
              <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  id="patientIdentified"
                  checked={preOpAssessment.patientIdentified}
                  onCheckedChange={(checked) => handleAssessmentChange('patientIdentified', checked)}
                />
                <Label htmlFor="patientIdentified" className="flex items-center gap-2">
                  <CheckCircle className={`h-4 w-4 ${preOpAssessment.patientIdentified ? 'text-green-600' : 'text-muted-foreground'}`} />
                  Patient Identified
                </Label>
              </div>

              {/* R/B/C/ALT Tx/No Tx Reviewed */}
              <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  id="rbcAltReviewed"
                  checked={preOpAssessment.rbcAltReviewed}
                  onCheckedChange={(checked) => handleAssessmentChange('rbcAltReviewed', checked)}
                />
                <Label htmlFor="rbcAltReviewed" className="flex items-center gap-2">
                  <CheckCircle className={`h-4 w-4 ${preOpAssessment.rbcAltReviewed ? 'text-green-600' : 'text-muted-foreground'}`} />
                  R/B/C/ALT Tx/No Tx Reviewed
                </Label>
              </div>

              {/* W & V consents given */}
              <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  id="writtenVerbalConsentsGiven"
                  checked={preOpAssessment.writtenVerbalConsentsGiven}
                  onCheckedChange={(checked) => handleAssessmentChange('writtenVerbalConsentsGiven', checked)}
                />
                <Label htmlFor="writtenVerbalConsentsGiven" className="flex items-center gap-2">
                  <CheckCircle className={`h-4 w-4 ${preOpAssessment.writtenVerbalConsentsGiven ? 'text-green-600' : 'text-muted-foreground'}`} />
                  W & V consents given
                </Label>
              </div>
              <div className="flex items-center space-x-4 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Label className="flex items-center gap-2">
                  <CheckCircle className={`h-4 w-4 ${preOpAssessment.medicalClearance ? 'text-green-600' : 'text-muted-foreground'}`} />
                  Med Clearance needed
                </Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="medicalClearance-yes-preop"
                    checked={preOpAssessment.medicalClearance === true}
                    onCheckedChange={(checked) => handleAssessmentChange('medicalClearance', checked ? true : preOpAssessment.medicalClearance)}
                  />
                  <Label htmlFor="medicalClearance-yes-preop" className="text-sm">Y</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="medicalClearance-no-preop"
                    checked={preOpAssessment.medicalClearance === false}
                    onCheckedChange={(checked) => handleAssessmentChange('medicalClearance', checked ? false : preOpAssessment.medicalClearance)}
                  />
                  <Label htmlFor="medicalClearance-no-preop" className="text-sm">N</Label>
                </div>
              </div>

              <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  id="consentSigned"
                  checked={preOpAssessment.consentSigned}
                  onCheckedChange={(checked) => handleAssessmentChange('consentSigned', checked)}
                />
                <Label htmlFor="consentSigned" className="flex items-center gap-2">
                  <CheckCircle className={`h-4 w-4 ${preOpAssessment.consentSigned ? 'text-green-600' : 'text-muted-foreground'}`} />
                  Consent Signed and in Chart
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  id="questionsAnswered"
                  checked={preOpAssessment.questionsAnswered}
                  onCheckedChange={(checked) => handleAssessmentChange('questionsAnswered', checked)}
                />
                <Label htmlFor="questionsAnswered" className="flex items-center gap-2">
                  <CheckCircle className={`h-4 w-4 ${preOpAssessment.questionsAnswered ? 'text-green-600' : 'text-muted-foreground'}`} />
                  All Questions Answered
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  id="informedConsentVideo"
                  checked={preOpAssessment.informedConsentVideo}
                  onCheckedChange={(checked) => handleAssessmentChange('informedConsentVideo', checked)}
                />
                <Label htmlFor="informedConsentVideo" className="flex items-center gap-2">
                  <CheckCircle className={`h-4 w-4 ${preOpAssessment.informedConsentVideo ? 'text-green-600' : 'text-muted-foreground'}`} />
                  Patient Viewed Informed Consent Video
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  id="postOpVideo"
                  checked={preOpAssessment.postOpVideo}
                  onCheckedChange={(checked) => handleAssessmentChange('postOpVideo', checked)}
                />
                <Label htmlFor="postOpVideo" className="flex items-center gap-2">
                  <CheckCircle className={`h-4 w-4 ${preOpAssessment.postOpVideo ? 'text-green-600' : 'text-muted-foreground'}`} />
                  Patient Viewed Post-Op Instruction Video
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  id="preProcedureTimeOut"
                  checked={preOpAssessment.preProcedureTimeOut}
                  onCheckedChange={(checked) => handleAssessmentChange('preProcedureTimeOut', checked)}
                />
                <Label htmlFor="preProcedureTimeOut" className="flex items-center gap-2">
                  <CheckCircle className={`h-4 w-4 ${preOpAssessment.preProcedureTimeOut ? 'text-green-600' : 'text-muted-foreground'}`} />
                  Pre-Procedure Time Out
                </Label>
              </div>

              {/* Reviewed Procedure and IV Pre-Op */}
              <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  id="reviewedProcedureIvPreOp"
                  checked={preOpAssessment.reviewedProcedureIvPreOp}
                  onCheckedChange={(checked) => handleAssessmentChange('reviewedProcedureIvPreOp', checked)}
                />
                <Label htmlFor="reviewedProcedureIvPreOp" className="flex items-center gap-2">
                  <CheckCircle className={`h-4 w-4 ${preOpAssessment.reviewedProcedureIvPreOp ? 'text-green-600' : 'text-muted-foreground'}`} />
                  Reviewed Procedure and IV Pre-Op
                </Label>
              </div>

              {/* 1 min Pre-Rinse w/ Peridex */}
              <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  id="preRinsePeridex"
                  checked={preOpAssessment.preRinsePeridex}
                  onCheckedChange={(checked) => handleAssessmentChange('preRinsePeridex', checked)}
                />
                <Label htmlFor="preRinsePeridex" className="flex items-center gap-2">
                  <CheckCircle className={`h-4 w-4 ${preOpAssessment.preRinsePeridex ? 'text-green-600' : 'text-muted-foreground'}`} />
                  1 min Pre-Rinse w/ Peridex
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Anesthesia Type */}
      <SectionHeader>Anesthesia Type</SectionHeader>
      
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <Checkbox
                id="ivSedation"
                checked={anesthesiaType.ivSedation}
                onCheckedChange={(checked) => handleAnesthesiaTypeChange('ivSedation', checked)}
              />
              <Label htmlFor="ivSedation" className="flex items-center gap-2">
                <CheckCircle className={`h-4 w-4 ${anesthesiaType.ivSedation ? 'text-green-600' : 'text-muted-foreground'}`} />
                IV Sedation
              </Label>
            </div>

            <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <Checkbox
                id="oralSedation"
                checked={anesthesiaType.oralSedation}
                onCheckedChange={(checked) => handleAnesthesiaTypeChange('oralSedation', checked)}
              />
              <Label htmlFor="oralSedation" className="flex items-center gap-2">
                <CheckCircle className={`h-4 w-4 ${anesthesiaType.oralSedation ? 'text-green-600' : 'text-muted-foreground'}`} />
                Oral Sedation
              </Label>
            </div>

            <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <Checkbox
                id="nitrousOxide"
                checked={anesthesiaType.nitrousOxide}
                onCheckedChange={(checked) => handleAnesthesiaTypeChange('nitrousOxide', checked)}
              />
              <Label htmlFor="nitrousOxide" className="flex items-center gap-2">
                <CheckCircle className={`h-4 w-4 ${anesthesiaType.nitrousOxide ? 'text-green-600' : 'text-muted-foreground'}`} />
                Nitrous Oxide
              </Label>
            </div>

            <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <Checkbox
                id="localAnesthesia"
                checked={anesthesiaType.localAnesthesia}
                onCheckedChange={(checked) => handleAnesthesiaTypeChange('localAnesthesia', checked)}
              />
              <Label htmlFor="localAnesthesia" className="flex items-center gap-2">
                <CheckCircle className={`h-4 w-4 ${anesthesiaType.localAnesthesia ? 'text-green-600' : 'text-muted-foreground'}`} />
                Local Anesthesia
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pre-Operative Checklist */}
      <SectionHeader>Pre-Operative Checklist</SectionHeader>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium">Equipment & Safety Checklist</h4>
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                {completionPercentage}% Complete
              </div>
              <div className="w-24 bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <Checkbox
                id="monitors"
                checked={preOpChecklist.monitors}
                onCheckedChange={(checked) => handleChecklistChange('monitors', checked)}
              />
              <Label htmlFor="monitors" className="flex items-center gap-2">
                <CheckCircle className={`h-4 w-4 ${preOpChecklist.monitors ? 'text-green-600' : 'text-muted-foreground'}`} />
                Monitors
              </Label>
            </div>

            <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <Checkbox
                id="suction"
                checked={preOpChecklist.suction}
                onCheckedChange={(checked) => handleChecklistChange('suction', checked)}
              />
              <Label htmlFor="suction" className="flex items-center gap-2">
                <CheckCircle className={`h-4 w-4 ${preOpChecklist.suction ? 'text-green-600' : 'text-muted-foreground'}`} />
                Suction
              </Label>
            </div>

            <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <Checkbox
                id="airway"
                checked={preOpChecklist.airway}
                onCheckedChange={(checked) => handleChecklistChange('airway', checked)}
              />
              <Label htmlFor="airway" className="flex items-center gap-2">
                <CheckCircle className={`h-4 w-4 ${preOpChecklist.airway ? 'text-green-600' : 'text-muted-foreground'}`} />
                Airway
              </Label>
            </div>

            <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <Checkbox
                id="ivSetup"
                checked={preOpChecklist.ivSetup}
                onCheckedChange={(checked) => handleChecklistChange('ivSetup', checked)}
              />
              <Label htmlFor="ivSetup" className="flex items-center gap-2">
                <CheckCircle className={`h-4 w-4 ${preOpChecklist.ivSetup ? 'text-green-600' : 'text-muted-foreground'}`} />
                IV Setup
              </Label>
            </div>

            <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <Checkbox
                id="emergencyKit"
                checked={preOpChecklist.emergencyKit}
                onCheckedChange={(checked) => handleChecklistChange('emergencyKit', checked)}
              />
              <Label htmlFor="emergencyKit" className="flex items-center gap-2">
                <CheckCircle className={`h-4 w-4 ${preOpChecklist.emergencyKit ? 'text-green-600' : 'text-muted-foreground'}`} />
                Emergency Kit
              </Label>
            </div>

            <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <Checkbox
                id="nitrousOxideCheck"
                checked={preOpChecklist.nitrousOxide}
                onCheckedChange={(checked) => handleChecklistChange('nitrousOxide', checked)}
              />
              <Label htmlFor="nitrousOxideCheck" className="flex items-center gap-2">
                <CheckCircle className={`h-4 w-4 ${preOpChecklist.nitrousOxide ? 'text-green-600' : 'text-muted-foreground'}`} />
                Nitrous Oxide
              </Label>
            </div>

            <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <Checkbox
                id="emergencyMeds"
                checked={preOpChecklist.emergencyMeds}
                onCheckedChange={(checked) => handleChecklistChange('emergencyMeds', checked)}
              />
              <Label htmlFor="emergencyMeds" className="flex items-center gap-2">
                <CheckCircle className={`h-4 w-4 ${preOpChecklist.emergencyMeds ? 'text-green-600' : 'text-muted-foreground'}`} />
                Emergency Meds
              </Label>
            </div>

            <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <Checkbox
                id="oxygen"
                checked={preOpChecklist.oxygen}
                onCheckedChange={(checked) => handleChecklistChange('oxygen', checked)}
              />
              <Label htmlFor="oxygen" className="flex items-center gap-2">
                <CheckCircle className={`h-4 w-4 ${preOpChecklist.oxygen ? 'text-green-600' : 'text-muted-foreground'}`} />
                Oxygen
              </Label>
            </div>

            <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <Checkbox
                id="anesthesiaMonitors"
                checked={preOpChecklist.anesthesiaMonitors}
                onCheckedChange={(checked) => handleChecklistChange('anesthesiaMonitors', checked)}
              />
              <Label htmlFor="anesthesiaMonitors" className="flex items-center gap-2">
                <CheckCircle className={`h-4 w-4 ${preOpChecklist.anesthesiaMonitors ? 'text-green-600' : 'text-muted-foreground'}`} />
                Anesthesia Monitors
              </Label>
            </div>
          </div>
          
          {/* Completion Status Alert */}
          {completionPercentage === 100 && (
            <Alert className="mt-4 border-green-600 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-sm text-green-800">
                <strong>Checklist Complete!</strong> All pre-operative requirements have been verified.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PreOpSection;
