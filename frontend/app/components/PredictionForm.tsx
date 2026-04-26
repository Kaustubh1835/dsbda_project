"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { FORM_FIELDS, type DiabetesInput, type FieldMeta } from "../types";
import * as Icons from "lucide-react";

interface Props {
  onSubmit: (data: DiabetesInput) => void;
  isLoading: boolean;
}

const blankValues: Record<string, string> = Object.fromEntries(
  FORM_FIELDS.map((f) => [f.key, ""])
);

export default function PredictionForm({ onSubmit, isLoading }: Props) {
  const [values, setValues] = useState<Record<string, string>>({ ...blankValues });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    for (const field of FORM_FIELDS) {
      const raw = values[field.key];
      if (raw === "" || raw === undefined) {
        errs[field.key] = "Required";
        continue;
      }
      const num = Number(raw);
      if (isNaN(num)) {
        errs[field.key] = "Enter a valid number";
        continue;
      }
      if (num < field.min) {
        errs[field.key] = `Min ${field.min}`;
      }
    }
    setErrors(errs);
    // Mark all fields as touched so errors show
    const allTouched: Record<string, boolean> = {};
    FORM_FIELDS.forEach((f) => (allTouched[f.key] = true));
    setTouched(allTouched);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const payload: Record<string, number> = {};
    for (const field of FORM_FIELDS) {
      payload[field.key] = Number(values[field.key]);
    }
    onSubmit(payload as unknown as DiabetesInput);
  }

  function handleReset() {
    setValues({ ...blankValues });
    setErrors({});
    setTouched({});
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Card header */}
      <div className="card-header">
        <h2 className="card-title">Health Metrics</h2>
        <p className="card-description">
          Fill in your clinical indicators to generate a risk assessment.
        </p>
      </div>

      {/* Field grid */}
      <div className="form-grid">
        {FORM_FIELDS.map((field: FieldMeta) => {
          const hasError = touched[field.key] && errors[field.key];
          const IconComponent = (Icons as any)[field.icon] || Icons.HelpCircle;

          return (
            <div key={field.key} className="field">
              <label htmlFor={field.key} className="field-label">
                <span className="field-label-icon">
                  <IconComponent size={14} strokeWidth={2.5} />
                </span>
                {field.label}
              </label>
              <input
                id={field.key}
                name={field.key}
                type="number"
                inputMode="decimal"
                step={field.step}
                min={field.min}
                placeholder={field.placeholder}
                value={values[field.key]}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading}
                aria-invalid={!!hasError}
                aria-describedby={`${field.key}-hint`}
                className={`field-input${hasError ? " field-input--error" : ""}`}
              />
              {hasError ? (
                <span className="field-error-text">{errors[field.key]}</span>
              ) : (
                <span id={`${field.key}-hint`} className="field-hint">
                  {field.hint}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="form-actions">
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary"
          id="submit-prediction"
        >
          {isLoading ? (
            <>
              <span className="spinner" />
              Analyzing…
            </>
          ) : (
            "Predict Risk"
          )}
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={isLoading}
          className="btn-ghost"
          id="reset-form"
        >
          Clear
        </button>
      </div>
    </form>
  );
}
