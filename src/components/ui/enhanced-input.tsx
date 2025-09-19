import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { validateField } from '@/lib/calculations';

interface EnhancedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  warning?: string;
  success?: string;
  required?: boolean;
  validation?: {
    type: 'required' | 'numeric' | 'positive' | 'range' | 'email' | 'phone';
    min?: number;
    max?: number;
    custom?: (value: string) => boolean;
    message?: string;
  };
  onValidationChange?: (isValid: boolean, message?: string) => void;
}

const EnhancedInput: React.FC<EnhancedInputProps> = ({
  label,
  error,
  warning,
  success,
  required = false,
  validation,
  onValidationChange,
  className,
  ...props
}) => {
  const [isValid, setIsValid] = useState<boolean>(true);
  const [validationMessage, setValidationMessage] = useState<string>('');

  const validateValue = (value: string) => {
    if (!validation) return true;

    let valid = true;
    let message = '';

    switch (validation.type) {
      case 'required':
        valid = validateField.required(value);
        message = valid ? '' : 'This field is required';
        break;
      case 'numeric':
        valid = validateField.numeric(value);
        message = valid ? '' : 'Must be a valid number';
        break;
      case 'positive':
        const num = parseFloat(value);
        valid = validateField.positive(num);
        message = valid ? '' : 'Must be a positive number';
        break;
      case 'range':
        const rangeNum = parseFloat(value);
        valid = validation.min !== undefined && validation.max !== undefined 
          ? validateField.range(rangeNum, validation.min, validation.max)
          : true;
        message = valid ? '' : `Must be between ${validation.min} and ${validation.max}`;
        break;
      case 'email':
        valid = validateField.email(value);
        message = valid ? '' : 'Must be a valid email address';
        break;
      case 'phone':
        valid = validateField.phone(value);
        message = valid ? '' : 'Must be a valid phone number';
        break;
      default:
        if (validation.custom) {
          valid = validation.custom(value);
          message = valid ? '' : (validation.message || 'Invalid value');
        }
    }

    setIsValid(valid);
    setValidationMessage(message);
    onValidationChange?.(valid, message);
    return valid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    validateValue(value);
    props.onChange?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    validateValue(e.target.value);
    props.onBlur?.(e);
  };

  const getStatusIcon = () => {
    if (error || !isValid) return <AlertCircle className="h-4 w-4 text-destructive" />;
    if (success) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (warning) return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    return null;
  };

  const getStatusColor = () => {
    if (error || !isValid) return 'border-destructive focus:ring-destructive';
    if (success) return 'border-green-600 focus:ring-green-600';
    if (warning) return 'border-yellow-600 focus:ring-yellow-600';
    return '';
  };

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={props.id} className="flex items-center gap-2">
          {label}
          {required && <span className="text-destructive">*</span>}
          {getStatusIcon()}
        </Label>
      )}
      
      <Input
        {...props}
        className={`${getStatusColor()} ${className || ''}`}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      
      {/* Error Message */}
      {(error || (!isValid && validationMessage)) && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            {error || validationMessage}
          </AlertDescription>
        </Alert>
      )}
      
      {/* Warning Message */}
      {warning && !error && isValid && (
        <Alert className="py-2 border-yellow-600 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-sm text-yellow-800">
            {warning}
          </AlertDescription>
        </Alert>
      )}
      
      {/* Success Message */}
      {success && !error && !warning && isValid && (
        <Alert className="py-2 border-green-600 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-sm text-green-800">
            {success}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default EnhancedInput;
