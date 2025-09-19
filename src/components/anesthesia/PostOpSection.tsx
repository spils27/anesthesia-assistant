import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { DischargeScore, PostOpInstructions } from '@/types/anesthesia';
import { Badge } from '@/components/ui/badge';

const SectionHeader = ({
  children
}: {
  children: React.ReactNode;
}) => (
  <div className="bg-primary text-primary-foreground p-3 font-semibold text-base mb-4 mx-0 py-[6px] px-[15px]">
    {children}
  </div>
);

interface PostOpSectionProps {
  dischargeScore: DischargeScore;
  postOpInstructions: PostOpInstructions;
  onChange: (section: string, data: any) => void;
}

const PostOpSection: React.FC<PostOpSectionProps> = ({ dischargeScore, postOpInstructions, onChange }) => {
  const [autoCirculation, setAutoCirculation] = useState<boolean>(false);
  const parseSystolic = (bp: string | undefined): number | null => {
    if (!bp) return null;
    try {
      const match = String(bp).match(/\s*(\d{2,3})\s*\/?/);
      if (match && match[1]) return parseInt(match[1]);
    } catch {}
    return null;
  };

  const deriveCirculationFromBP = (dischargeBp: string): number | null => {
    try {
      const stored = localStorage.getItem('preOpVitalsSnapshot');
      if (!stored) return null;
      const snap = JSON.parse(stored) as { bloodPressure?: string };
      const preOpSys = parseSystolic(snap.bloodPressure);
      const postOpSys = parseSystolic(dischargeBp);
      if (preOpSys == null || postOpSys == null || preOpSys <= 0) return null;
      const diffPct = Math.abs(postOpSys - preOpSys) / preOpSys * 100;
      if (diffPct <= 20) return 2;
      if (diffPct <= 50) return 1;
      return 0;
    } catch {
      return null;
    }
  };
  const handleDischargeScoreChange = (field: keyof DischargeScore, value: any) => {
    const updatedScore = { ...dischargeScore, [field]: value };
    
    // Auto-calculate total across all Aldrete categories
    if (field !== 'total' && field !== 'timeDischarged' && field !== 'dischargeBloodPressure' && field !== 'dischargePulse' && field !== 'dischargeSpO2' && field !== 'dischargeRespirations') {
      const total =
        (Number(updatedScore.vitals) || 0) +
        (Number(updatedScore.ambulation) || 0) +
        (Number(updatedScore.respiration) || 0) +
        (Number(updatedScore.consciousness) || 0) +
        (Number(updatedScore.color) || 0);
      updatedScore.total = total;
    }
    
    onChange('dischargeScore', updatedScore);
  };

  const handleFollowUpChange = (field: keyof typeof postOpInstructions.followUp, value: any) => {
    onChange('postOpInstructions', {
      ...postOpInstructions,
      followUp: {
        ...postOpInstructions.followUp,
        [field]: value
      }
    });
  };

  const addPrescription = () => {
    const newPrescription = {
      medication: '',
      dosage: '',
      instructions: '',
      refill: false
    };
    
    onChange('postOpInstructions', {
      ...postOpInstructions,
      prescriptions: [...postOpInstructions.prescriptions, newPrescription]
    });
  };

  const updatePrescription = (index: number, field: string, value: any) => {
    const updatedPrescriptions = postOpInstructions.prescriptions.map((prescription, i) => 
      i === index ? { ...prescription, [field]: value } : prescription
    );
    
    onChange('postOpInstructions', {
      ...postOpInstructions,
      prescriptions: updatedPrescriptions
    });
  };

  const removePrescription = (index: number) => {
    const updatedPrescriptions = postOpInstructions.prescriptions.filter((_, i) => i !== index);
    onChange('postOpInstructions', {
      ...postOpInstructions,
      prescriptions: updatedPrescriptions
    });
  };

  return (
    <div className="space-y-6">
      {/* Aldrete Discharge Score */}
      <SectionHeader>Aldrete Discharge Score</SectionHeader>
      
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Circulation (BP) */}
              <div className="space-y-2">
                <Label htmlFor="vitals" className="flex items-center gap-2">
                  Circulation (BP)
                  {autoCirculation && (
                    <Badge variant="secondary">Auto</Badge>
                  )}
                </Label>
                <Select 
                  value={dischargeScore.vitals.toString()} 
                  onValueChange={(value) => {
                    setAutoCirculation(false);
                    handleDischargeScoreChange('vitals', parseInt(value));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select score" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 = BP ±20%</SelectItem>
                    <SelectItem value="1">1 = BP ±21-50%</SelectItem>
                    <SelectItem value="0">0 = BP ±50%</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Activity */}
              <div className="space-y-2">
                <Label htmlFor="ambulation">Activity</Label>
                <Select 
                  value={dischargeScore.ambulation.toString()} 
                  onValueChange={(value) => handleDischargeScoreChange('ambulation', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select score" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 = Moves all</SelectItem>
                    <SelectItem value="1">1 = Moves 2</SelectItem>
                    <SelectItem value="0">0 = None</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Respiration */}
              <div className="space-y-2">
                <Label htmlFor="respiration">Respiration</Label>
                <Select 
                  value={dischargeScore.respiration.toString()} 
                  onValueChange={(value) => handleDischargeScoreChange('respiration', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select score" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 = Able to breathe and cough freely</SelectItem>
                    <SelectItem value="1">1 = Dyspnea, shallow or limited breathing</SelectItem>
                    <SelectItem value="0">0 = Apnea</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Consciousness */}
              <div className="space-y-2">
                <Label htmlFor="consciousness">Consciousness</Label>
                <Select 
                  value={dischargeScore.consciousness.toString()}
                  onValueChange={(value) => handleDischargeScoreChange('consciousness', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select score" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 = Alert</SelectItem>
                    <SelectItem value="1">1 = Responds</SelectItem>
                    <SelectItem value="0">0 = No Response</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Color */}
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Select 
                  value={dischargeScore.color.toString()}
                  onValueChange={(value) => handleDischargeScoreChange('color', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select score" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 = Pink</SelectItem>
                    <SelectItem value="1">1 = Pale/Dusky</SelectItem>
                    <SelectItem value="0">0 = Cyanotic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Total Score */}
            <div className="flex items-center space-x-4">
              <div className="space-y-2">
                <Label htmlFor="total">Total Score</Label>
                <Input
                  id="total"
                  type="number"
                  value={dischargeScore.total}
                  readOnly
                  className="bg-muted font-bold text-lg"
                  min="0"
                  max="10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeDischarged">Time Discharged</Label>
                <Input
                  id="timeDischarged"
                  type="time"
                  value={dischargeScore.timeDischarged}
                  onChange={(e) => handleDischargeScoreChange('timeDischarged', e.target.value)}
                />
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Discharge Criteria:</strong> Score of 8-10 indicates patient is ready for discharge.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Discharge Vitals */}
      <SectionHeader>Discharge Vitals</SectionHeader>
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label>Discharge Blood Pressure</Label>
                <Input
                  type="text"
                  placeholder="e.g., 110/70"
                  value={dischargeScore.dischargeBloodPressure || ''}
                  onChange={(e) => {
                    const bp = e.target.value;
                    const autoScore = deriveCirculationFromBP(bp);
                    // Build one combined update to avoid racey double updates
                    const combined: Partial<DischargeScore> = {
                      dischargeBloodPressure: bp
                    } as any;
                    if (autoScore !== null) {
                      combined.vitals = autoScore as any;
                      setAutoCirculation(true);
                    }
                    onChange('dischargeScore', { ...dischargeScore, ...combined });
                  }}
                />
            </div>

            <div className="space-y-2">
              <Label>Discharge Pulse</Label>
              <Input
                placeholder="BPM"
                type="number"
                value={dischargeScore.dischargePulse || ''}
                onChange={(e) => handleDischargeScoreChange('dischargePulse' as any, e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Discharge SpO2</Label>
              <Input
                placeholder="%"
                type="number"
                min="0"
                max="100"
                value={dischargeScore.dischargeSpO2 || ''}
                onChange={(e) => handleDischargeScoreChange('dischargeSpO2' as any, e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Discharge Respirations</Label>
              <Input
                placeholder="RPM"
                type="number"
                value={dischargeScore.dischargeRespirations || ''}
                onChange={(e) => handleDischargeScoreChange('dischargeRespirations' as any, e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Post-Operative Instructions */}
      <SectionHeader>Post-Operative Instructions</SectionHeader>
      
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Removed prescriptions UI per request */}

            {/* Follow-up */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium">Follow-up</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="prn"
                    checked={postOpInstructions.followUp.prn}
                    onCheckedChange={(checked) => handleFollowUpChange('prn', checked)}
                  />
                  <Label htmlFor="prn">PRN</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="oneWeek"
                    checked={postOpInstructions.followUp.oneWeek}
                    onCheckedChange={(checked) => handleFollowUpChange('oneWeek', checked)}
                  />
                  <Label htmlFor="oneWeek">1 Week</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="twoWeeks"
                    checked={postOpInstructions.followUp.twoWeeks}
                    onCheckedChange={(checked) => handleFollowUpChange('twoWeeks', checked)}
                  />
                  <Label htmlFor="twoWeeks">2 Weeks</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="oneMonth"
                    checked={postOpInstructions.followUp.oneMonth}
                    onCheckedChange={(checked) => handleFollowUpChange('oneMonth', checked)}
                  />
                  <Label htmlFor="oneMonth">1 Month</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="otherFollowUp">Other</Label>
                <Input
                  id="otherFollowUp"
                  value={postOpInstructions.followUp.other}
                  onChange={(e) => handleFollowUpChange('other', e.target.value)}
                  placeholder="Specify other follow-up"
                />
              </div>
            </div>

            {/* Objectives */}
            <div className="space-y-2">
              <Label htmlFor="objectives">Objectives</Label>
              <Textarea
                id="objectives"
                value={postOpInstructions.objectives}
                onChange={(e) => onChange('postOpInstructions', {
                  ...postOpInstructions,
                  objectives: e.target.value
                })}
                placeholder="Post-operative objectives and goals"
                rows={4}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostOpSection;
