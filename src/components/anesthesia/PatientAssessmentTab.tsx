import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Stethoscope, Shield } from 'lucide-react';
import EnhancedInput from '@/components/ui/enhanced-input';
import { PatientAssessment } from '@/types/anesthesia';
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

interface PatientAssessmentTabProps {
  data: PatientAssessment;
  onChange: (data: PatientAssessment) => void;
}

const PatientAssessmentTab: React.FC<PatientAssessmentTabProps> = ({ data, onChange }) => {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [warnings, setWarnings] = useState<Record<string, string>>({});

  const handleAssessmentChange = (field: keyof PatientAssessment, value: any) => {
    onChange({ ...data, [field]: value });
    
    // Validate ASA classification
    if (field === 'asa') {
      const validation = PDFLogic.validateASAClassification(value, 0, []);
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

  return (
    <div className="space-y-6">
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
                value={data.asa?.toString() || ''} 
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
                value={data.mallampatti?.toString() || ''} 
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
              <div className="flex items-center space-x-4">
                <Label className="text-sm font-medium">NPO Status Verified</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="npoStatusVerified-yes-main"
                    checked={data.npoStatusVerified === true}
                    onCheckedChange={(checked) => handleAssessmentChange('npoStatusVerified', checked ? true : null)}
                  />
                  <Label htmlFor="npoStatusVerified-yes-main" className="text-sm">Y</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="npoStatusVerified-no-main"
                    checked={data.npoStatusVerified === false}
                    onCheckedChange={(checked) => handleAssessmentChange('npoStatusVerified', checked ? false : null)}
                  />
                  <Label htmlFor="npoStatusVerified-no-main" className="text-sm">N</Label>
                </div>
              </div>
              <EnhancedInput
                label="NPO Hours"
                type="number"
                value={data.npoHours?.toString() || '0'}
                onChange={(e) => handleAssessmentChange('npoHours', parseFloat(e.target.value) || 0)}
                placeholder="Hours since last meal"
                step="0.5"
                validation={{ type: 'positive' }}
                error={validationErrors.npoHours}
                warning={warnings.npoHours}
              />
            </div>


            

            

            {/* Pediatric Patient */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Pediatric Patient</Label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pediatricPatient-yes"
                    checked={data.pediatricPatient === true}
                    onCheckedChange={(checked) => handleAssessmentChange('pediatricPatient', checked ? true : null)}
                  />
                  <Label htmlFor="pediatricPatient-yes" className="text-sm">Y</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pediatricPatient-no"
                    checked={data.pediatricPatient === false}
                    onCheckedChange={(checked) => handleAssessmentChange('pediatricPatient', checked ? false : null)}
                  />
                  <Label htmlFor="pediatricPatient-no" className="text-sm">N</Label>
                </div>
              </div>
            </div>

            {/* High Risk Patient */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">High Risk Patient</Label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="highRiskPatient-yes"
                    checked={data.highRiskPatient === true}
                    onCheckedChange={(checked) => handleAssessmentChange('highRiskPatient', checked ? true : null)}
                  />
                  <Label htmlFor="highRiskPatient-yes" className="text-sm">Y</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="highRiskPatient-no"
                    checked={data.highRiskPatient === false}
                    onCheckedChange={(checked) => handleAssessmentChange('highRiskPatient', checked ? false : null)}
                  />
                  <Label htmlFor="highRiskPatient-no" className="text-sm">N</Label>
                </div>
              </div>
            </div>
          </div>

          {/* Assessment Checklist */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium">Assessment Checklist</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Med Clearance needed (Y/N) */}
              <div className="flex items-center space-x-4 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Label className="flex items-center gap-2">
                  <CheckCircle className={`h-4 w-4 ${data.medicalClearance !== null && data.medicalClearance !== undefined ? 'text-green-600' : 'text-muted-foreground'}`} />
                  Med Clearance needed
                </Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="medicalClearance-yes"
                    checked={data.medicalClearance === true}
                    onCheckedChange={(checked) => handleAssessmentChange('medicalClearance', checked ? true : null)}
                  />
                  <Label htmlFor="medicalClearance-yes" className="text-sm">Y</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="medicalClearance-no"
                    checked={data.medicalClearance === false}
                    onCheckedChange={(checked) => handleAssessmentChange('medicalClearance', checked ? false : null)}
                  />
                  <Label htmlFor="medicalClearance-no" className="text-sm">N</Label>
                </div>
              </div>

              <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  id="consentSigned"
                  checked={data.consentSigned}
                  onCheckedChange={(checked) => handleAssessmentChange('consentSigned', checked)}
                />
                <Label htmlFor="consentSigned" className="flex items-center gap-2">
                  <CheckCircle className={`h-4 w-4 ${data.consentSigned ? 'text-green-600' : 'text-muted-foreground'}`} />
                  Consent Signed and in Chart
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  id="questionsAnswered"
                  checked={data.questionsAnswered}
                  onCheckedChange={(checked) => handleAssessmentChange('questionsAnswered', checked)}
                />
                <Label htmlFor="questionsAnswered" className="flex items-center gap-2">
                  <CheckCircle className={`h-4 w-4 ${data.questionsAnswered ? 'text-green-600' : 'text-muted-foreground'}`} />
                  All Questions Answered
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  id="informedConsentVideo"
                  checked={data.informedConsentVideo}
                  onCheckedChange={(checked) => handleAssessmentChange('informedConsentVideo', checked)}
                />
                <Label htmlFor="informedConsentVideo" className="flex items-center gap-2">
                  <CheckCircle className={`h-4 w-4 ${data.informedConsentVideo ? 'text-green-600' : 'text-muted-foreground'}`} />
                  Patient Viewed Informed Consent Video
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  id="postOpVideo"
                  checked={data.postOpVideo}
                  onCheckedChange={(checked) => handleAssessmentChange('postOpVideo', checked)}
                />
                <Label htmlFor="postOpVideo" className="flex items-center gap-2">
                  <CheckCircle className={`h-4 w-4 ${data.postOpVideo ? 'text-green-600' : 'text-muted-foreground'}`} />
                  Patient Viewed Post-Op Instruction Video
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  id="preProcedureTimeOut"
                  checked={data.preProcedureTimeOut}
                  onCheckedChange={(checked) => handleAssessmentChange('preProcedureTimeOut', checked)}
                />
                <Label htmlFor="preProcedureTimeOut" className="flex items-center gap-2">
                  <CheckCircle className={`h-4 w-4 ${data.preProcedureTimeOut ? 'text-green-600' : 'text-muted-foreground'}`} />
                  Pre-Procedure Time Out
                </Label>
              </div>
            </div>
            
            <div className="space-y-6 mt-6">
              {/* Lungs Auscultated */}
              <div className="space-y-2">
                <div className="flex items-center space-x-4">
                  <h5 className="text-md font-medium">Lungs Auscultated</h5>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="lungsAuscultated-yes"
                      checked={data.lungsAuscultated === true}
                      onCheckedChange={(checked) => handleAssessmentChange('lungsAuscultated', checked ? true : null)}
                    />
                    <Label htmlFor="lungsAuscultated-yes" className="text-sm">Y</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="lungsAuscultated-no"
                      checked={data.lungsAuscultated === false}
                      onCheckedChange={(checked) => handleAssessmentChange('lungsAuscultated', checked ? false : null)}
                    />
                    <Label htmlFor="lungsAuscultated-no" className="text-sm">N</Label>
                  </div>
                </div>
                <div className="flex items-center space-x-4 ml-0">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="lungs-ctab-checklist"
                      checked={data.lungsCTAB}
                      onCheckedChange={(checked) => {
                        handleAssessmentChange('lungsCTAB', checked);
                        if (checked) handleAssessmentChange('lungsOther', '');
                      }}
                    />
                    <Label htmlFor="lungs-ctab-checklist" className="text-sm">CTAB</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="lungs-other-checklist"
                      checked={Boolean(data.lungsOther && data.lungsOther.length > 0)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleAssessmentChange('lungsCTAB', false);
                          handleAssessmentChange('lungsOther', data.lungsOther && data.lungsOther.length > 0 ? data.lungsOther : 'Other');
                        } else {
                          handleAssessmentChange('lungsOther', '');
                        }
                      }}
                    />
                    <Label htmlFor="lungs-other-checklist" className="text-sm">Other:</Label>
                    <Input
                      value={data.lungsOther}
                      onChange={(e) => {
                        handleAssessmentChange('lungsOther', e.target.value);
                        if (e.target.value) {
                          handleAssessmentChange('lungsCTAB', false);
                        }
                      }}
                      className="w-32 h-8"
                      placeholder=""
                      disabled={!Boolean(data.lungsOther && data.lungsOther.length > 0)}
                    />
                  </div>
                </div>
              </div>

              {/* Heart Auscultated */}
              <div className="space-y-2">
                <div className="flex items-center space-x-4">
                  <h5 className="text-md font-medium">Heart Auscultated</h5>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="heartAuscultated-yes"
                      checked={data.heartAuscultated === true}
                      onCheckedChange={(checked) => handleAssessmentChange('heartAuscultated', checked ? true : null)}
                    />
                    <Label htmlFor="heartAuscultated-yes" className="text-sm">Y</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="heartAuscultated-no"
                      checked={data.heartAuscultated === false}
                      onCheckedChange={(checked) => handleAssessmentChange('heartAuscultated', checked ? false : null)}
                    />
                    <Label htmlFor="heartAuscultated-no" className="text-sm">N</Label>
                  </div>
                </div>
                <div className="flex items-center space-x-4 ml-0">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="heart-rrr-checklist"
                      checked={data.heartRRR}
                      onCheckedChange={(checked) => {
                        handleAssessmentChange('heartRRR', checked);
                        if (checked) handleAssessmentChange('heartOther', '');
                      }}
                    />
                    <Label htmlFor="heart-rrr-checklist" className="text-sm">RRR</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="heart-other-checklist"
                      checked={Boolean(data.heartOther && data.heartOther.length > 0)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleAssessmentChange('heartRRR', false);
                          handleAssessmentChange('heartOther', data.heartOther && data.heartOther.length > 0 ? data.heartOther : 'Other');
                        } else {
                          handleAssessmentChange('heartOther', '');
                        }
                      }}
                    />
                    <Label htmlFor="heart-other-checklist" className="text-sm">Other:</Label>
                    <Input
                      value={data.heartOther}
                      onChange={(e) => {
                        handleAssessmentChange('heartOther', e.target.value);
                        if (e.target.value) {
                          handleAssessmentChange('heartRRR', false);
                        }
                      }}
                      className="w-32 h-8"
                      placeholder=""
                      disabled={!Boolean(data.heartOther && data.heartOther.length > 0)}
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Notes */}
          <div className="mt-6 space-y-2">
            <Label htmlFor="notes">Notes/Reason for omission of any items</Label>
            <Textarea
              id="notes"
              value={data.notes}
              onChange={(e) => handleAssessmentChange('notes', e.target.value)}
              placeholder="Enter any notes or reasons for omissions..."
              rows={3}
              className="resize-none"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientAssessmentTab;
