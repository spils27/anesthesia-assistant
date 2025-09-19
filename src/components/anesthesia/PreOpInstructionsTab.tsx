import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PreOpInstructions } from '@/types/anesthesia';

const SectionHeader = ({
  children
}: {
  children: React.ReactNode;
}) => (
  <div className="bg-primary text-primary-foreground p-3 font-semibold text-base mb-4 mx-0 py-[6px] px-[15px]">
    {children}
  </div>
);

interface PreOpInstructionsTabProps {
  data: PreOpInstructions;
  onChange: (data: PreOpInstructions) => void;
}

const PreOpInstructionsTab: React.FC<PreOpInstructionsTabProps> = ({ data, onChange }) => {
  const updateField = (field: keyof PreOpInstructions, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <SectionHeader>Patient Instructions</SectionHeader>
          
          <div className="space-y-4">
            <div className="text-sm font-medium mb-3">
              In Advance of Surgery, the Patient was given Written & Verbal
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="preop-instructions"
                  checked={data.preOpInstructions}
                  onCheckedChange={(checked) => updateField('preOpInstructions', checked)}
                />
                <Label htmlFor="preop-instructions" className="text-sm">
                  Pre-Op Instructions
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="postop-instructions"
                  checked={data.postOpInstructions}
                  onCheckedChange={(checked) => updateField('postOpInstructions', checked)}
                />
                <Label htmlFor="postop-instructions" className="text-sm">
                  Post-Op Instructions
                </Label>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Additional Notes:</Label>
              <Textarea
                value={data.additionalNotes}
                onChange={(e) => updateField('additionalNotes', e.target.value)}
                placeholder="Enter any additional notes or instructions..."
                className="min-h-[120px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PreOpInstructionsTab;
