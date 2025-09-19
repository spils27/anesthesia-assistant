# Anesthesia Assistant

A comprehensive anesthesia recordkeeping application for dental and surgical procedures, inspired by iPro Anesthesia software and built with modern web technologies.

## Features

### 🏥 **Pre-Operative Form**
- Patient information management
- Pre-operative assessment checklist
- Medical clearance tracking
- Consent verification

### 💉 **Anesthesia Form**
- **Patient Information**: Demographics, BMI calculation, NPO status
- **Pre-Operative Assessment**: ASA classification, Mallampatti score, medical history
- **Vital Signs**: Blood pressure, pulse, temperature, SpO2, respiration
- **Medications**: Pre-sedation meds, antiemetics, oxygen, controlled substance logging
- **Intra-Operative**: Surgical procedures, local anesthetics, fluid management, airway protection
- **Post-Operative**: Aldete discharge scoring, prescriptions, follow-up instructions

### 🎨 **Modern UI/UX**
- Medical-themed color scheme
- Responsive design for desktop and mobile
- Tabbed interface for organized data entry
- Real-time calculations (BMI, discharge scores)
- Print-friendly layouts

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Components**: Radix UI + Tailwind CSS
- **Routing**: React Router
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with custom medical theme

## Getting Started

### Prerequisites
- Node.js 18+ (recommended: Node.js 20+)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/spils27/anesthesia-assistant.git
   cd anesthesia-assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Local: http://localhost:8081
   - Network: http://192.168.1.81:8081 (if accessible)

### Building for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── anesthesia/         # Anesthesia form sections
│   ├── AnesthesiaForm.tsx  # Main anesthesia form
│   └── Navigation.tsx      # App navigation
├── pages/
│   ├── Index.tsx          # Pre-op form page
│   └── AnesthesiaPage.tsx # Anesthesia form page
├── types/
│   └── anesthesia.ts      # TypeScript interfaces
├── lib/
│   └── utils.ts           # Utility functions
└── App.tsx                # Main app component
```

## Features in Detail

### Patient Information
- Auto-calculated BMI and age
- Gender-specific fields (LMP for females)
- NPO hours tracking

### Pre-Operative Assessment
- ASA classification (I-V)
- Mallampatti score (I-IV)
- Medical history and allergies
- Comprehensive checklist

### Vital Signs Monitoring
- Real-time vital sign entry
- Monitoring equipment tracking
- Discharge vitals comparison

### Medication Management
- Pre-sedation medication tracking
- Antiemetic administration
- Oxygen delivery settings
- Controlled substance logging with witness requirements

### Intra-Operative Documentation
- Surgical procedure details
- Local anesthetic selection and dosage
- Fluid management tracking
- Airway protection measures
- Time summary documentation

### Post-Operative Care
- Aldete discharge scoring system
- Prescription management
- Follow-up scheduling
- Post-operative objectives

## Customization

### Color Theme
The application uses a medical blue theme defined in `src/index.css`. You can customize colors by modifying the CSS variables:

```css
:root {
  --primary: 203 89% 53%;        /* Medical blue */
  --secondary: 173 58% 85%;      /* Light teal */
  --background: 210 25% 98%;     /* Light background */
  /* ... other colors */
}
```

### Form Fields
Add or modify form fields by updating the TypeScript interfaces in `src/types/anesthesia.ts` and corresponding components.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@anesthesia-assistant.com or create an issue in the GitHub repository.

---

**Built with ❤️ for healthcare professionals**