// ── Backend contract types ──────────────────────────────────────────

export interface DiabetesInput {
  Pregnancies: number;
  Glucose: number;
  BloodPressure: number;
  SkinThickness: number;
  Insulin: number;
  BMI: number;
  DiabetesPedigreeFunction: number;
  Age: number;
}

export interface PredictionResult {
  prediction: "Diabetes" | "No Diabetes";
  class: 0 | 1;
  confidence: number;
  probability_diabetes: number;
}

// ── Form field metadata ─────────────────────────────────────────────

export interface FieldMeta {
  key: keyof DiabetesInput;
  label: string;
  placeholder: string;
  step: string;
  min: number;
  icon: string;
  hint: string;
}

export const FORM_FIELDS: FieldMeta[] = [
  {
    key: "Pregnancies",
    label: "Pregnancies",
    placeholder: "e.g. 2",
    step: "1",
    min: 0,
    icon: "Activity",
    hint: "Number of pregnancies",
  },
  {
    key: "Glucose",
    label: "Glucose",
    placeholder: "e.g. 120",
    step: "0.1",
    min: 0,
    icon: "Droplets",
    hint: "Plasma glucose (mg/dL)",
  },
  {
    key: "BloodPressure",
    label: "Blood Pressure",
    placeholder: "e.g. 70",
    step: "0.1",
    min: 0,
    icon: "HeartPulse",
    hint: "Diastolic (mm Hg)",
  },
  {
    key: "SkinThickness",
    label: "Skin Thickness",
    placeholder: "e.g. 20",
    step: "0.1",
    min: 0,
    icon: "Layers",
    hint: "Triceps fold (mm)",
  },
  {
    key: "Insulin",
    label: "Insulin",
    placeholder: "e.g. 85",
    step: "0.1",
    min: 0,
    icon: "Syringe",
    hint: "2-hr serum (mu U/ml)",
  },
  {
    key: "BMI",
    label: "BMI",
    placeholder: "e.g. 28.5",
    step: "0.1",
    min: 0,
    icon: "Scale",
    hint: "Body mass index (kg/m²)",
  },
  {
    key: "DiabetesPedigreeFunction",
    label: "Diabetes Pedigree",
    placeholder: "e.g. 0.5",
    step: "0.001",
    min: 0,
    icon: "Dna",
    hint: "Pedigree function score",
  },
  {
    key: "Age",
    label: "Age",
    placeholder: "e.g. 35",
    step: "1",
    min: 0,
    icon: "User",
    hint: "Age in years",
  },
];
