import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MedicalReview } from '@/types/anesthesia';

const SectionHeader = ({
  children
}: {
  children: React.ReactNode;
}) => (
  <div className="bg-primary text-primary-foreground p-3 font-semibold text-base mb-4 mx-0 py-[6px] px-[15px]">
    {children}
  </div>
);

interface MedicalReviewTabProps {
  data: MedicalReview;
  onChange: (data: MedicalReview) => void;
}

const MedicalReviewTab: React.FC<MedicalReviewTabProps> = ({ data, onChange }) => {
  const updateField = (field: keyof MedicalReview, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const renderYesNoCheckboxes = (field: keyof MedicalReview, label: string, notes?: string) => (
    <div className="space-y-2">
      <div className="flex items-center space-x-4">
        <Label className="text-sm font-medium min-w-[200px]">{label}</Label>
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`${field}-yes`}
            checked={data[field] === true}
            onCheckedChange={(checked) => updateField(field, checked ? true : null)}
          />
          <Label htmlFor={`${field}-yes`} className="text-sm">Y</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`${field}-no`}
            checked={data[field] === false}
            onCheckedChange={(checked) => updateField(field, checked ? false : null)}
          />
          <Label htmlFor={`${field}-no`} className="text-sm">N</Label>
        </div>
      </div>
      {notes && (
        <div className="ml-[200px] text-xs text-muted-foreground">
          Notes: {notes}
        </div>
      )}
    </div>
  );

  const renderYesNoNACheckboxes = (field: keyof MedicalReview, label: string) => (
    <div className="flex items-center space-x-4">
      <Label className="text-sm font-medium min-w-[200px]">{label}</Label>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${field}-yes`}
          checked={data[field] === true}
          onCheckedChange={(checked) => updateField(field, checked ? true : null)}
        />
        <Label htmlFor={`${field}-yes`} className="text-sm">Y</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${field}-no`}
          checked={data[field] === false}
          onCheckedChange={(checked) => updateField(field, checked ? false : null)}
        />
        <Label htmlFor={`${field}-no`} className="text-sm">N</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${field}-na`}
          checked={data.medicalConsultNA}
          onCheckedChange={(checked) => updateField('medicalConsultNA', checked)}
        />
        <Label htmlFor={`${field}-na`} className="text-sm">NA</Label>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <SectionHeader>Pre-Procedure Medical Review (to be completed by the Surgeon ONLY)</SectionHeader>
          
          <div className="space-y-6">
            {renderYesNoCheckboxes(
              'medicalHistoryReviewed', 
              'Review of Patient\'s Medical History',
              'See Surgical Health Questionnaire Form for Patient\'s Medical History'
            )}

            {renderYesNoCheckboxes(
              'allergiesReviewed', 
              'Review of Patient\'s Allergies',
              'See Surgical Health Questionnaire Form for List of Patient\'s Allergies'
            )}

            {renderYesNoCheckboxes('surgicalAnesthesiaHistoryReviewed', 'Review of Patient\'s Surgical/Anesthesia History')}

            {renderYesNoCheckboxes('familyHistoryReviewed', 'Review of Patient\'s Family Surgical/Anesthesia Complication History')}

            {/* Medications Review */}
            <div className="space-y-3">
              {renderYesNoCheckboxes(
                'medicationsReviewed', 
                'Review of Patient\'s Medication(s)',
                'See Surgical Health Questionnaire Form for List of Medications'
              )}
              
              <div className="ml-[200px] space-y-2">
                <div className="text-xs text-muted-foreground mb-2">
                  Pre-Op & Post Op Medication Modification Instructions Given Prior to Procedure:
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="diabetic-med"
                      checked={data.diabeticMedication}
                      onCheckedChange={(checked) => updateField('diabeticMedication', checked)}
                    />
                    <Label htmlFor="diabetic-med" className="text-sm">Diabetic Medication</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="anticoagulant"
                      checked={data.anticoagulant}
                      onCheckedChange={(checked) => updateField('anticoagulant', checked)}
                    />
                    <Label htmlFor="anticoagulant" className="text-sm">Anticoagulant</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="immunosuppressive"
                      checked={data.immunosuppressive}
                      onCheckedChange={(checked) => updateField('immunosuppressive', checked)}
                    />
                    <Label htmlFor="immunosuppressive" className="text-sm">Immunosuppressive</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="bisphosphonates"
                      checked={data.bisphosphonates}
                      onCheckedChange={(checked) => updateField('bisphosphonates', checked)}
                    />
                    <Label htmlFor="bisphosphonates" className="text-sm">Bisphosphonates</Label>
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground mt-2">
                  Other/Notes:
                </div>
              </div>
            </div>

            {renderYesNoCheckboxes('medicationModifications', 'Any Modification(s) as needed?')}

            {renderYesNoNACheckboxes('medicalConsultReviewed', 'Review of Medical Consult (If Necessary)')}

            {/* Notes */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Notes:</Label>
              <Textarea
                value={data.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                placeholder="Enter any additional notes..."
                className="min-h-[100px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalReviewTab;
