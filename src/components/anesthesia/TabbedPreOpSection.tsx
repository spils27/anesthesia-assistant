import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, Stethoscope, Activity, FileText } from 'lucide-react';
import { PreOpAssessment, MedicalReview, PreOpVitals, PreOpInstructions } from '@/types/anesthesia';
import PatientAssessmentTab from './PatientAssessmentTab';
import MedicalReviewTab from './MedicalReviewTab';
import PreOpVitalsTab from './PreOpVitalsTab';
import PreOpInstructionsTab from './PreOpInstructionsTab';

interface TabbedPreOpSectionProps {
  preOpAssessment: PreOpAssessment;
  medicalReview: MedicalReview;
  preOpVitals: PreOpVitals;
  preOpInstructions: PreOpInstructions;
  onChange: (section: string, data: any) => void;
}

const TabbedPreOpSection: React.FC<TabbedPreOpSectionProps> = ({
  preOpAssessment,
  medicalReview,
  preOpVitals,
  preOpInstructions,
  onChange
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <Tabs defaultValue="assessment" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="assessment" className="flex items-center space-x-2">
                <Stethoscope className="h-4 w-4" />
                <span className="hidden sm:inline">Assessment</span>
              </TabsTrigger>
              <TabsTrigger value="medical-review" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Medical Review</span>
              </TabsTrigger>
              <TabsTrigger value="vitals" className="flex items-center space-x-2">
                <Activity className="h-4 w-4" />
                <span className="hidden sm:inline">Vitals & Equipment</span>
              </TabsTrigger>
              <TabsTrigger value="instructions" className="flex items-center space-x-2">
                <ClipboardList className="h-4 w-4" />
                <span className="hidden sm:inline">Instructions</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="assessment" className="mt-6">
              <PatientAssessmentTab 
                data={preOpAssessment}
                onChange={(data) => onChange('preOpAssessment', data)}
              />
            </TabsContent>

            <TabsContent value="medical-review" className="mt-6">
              <MedicalReviewTab 
                data={medicalReview}
                onChange={(data) => onChange('medicalReview', data)}
              />
            </TabsContent>

            <TabsContent value="vitals" className="mt-6">
              <PreOpVitalsTab 
                data={preOpVitals}
                onChange={(data) => onChange('preOpVitals', data)}
                instructions={preOpInstructions}
                onChangeInstructions={(data) => onChange('preOpInstructions', data)}
              />
            </TabsContent>

            <TabsContent value="instructions" className="mt-6">
              <PreOpInstructionsTab 
                data={preOpInstructions}
                onChange={(data) => onChange('preOpInstructions', data)}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TabbedPreOpSection;
