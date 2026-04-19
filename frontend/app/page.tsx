"use client";

import { useState } from "react";
import type { DiabetesInput, PredictionResult } from "./types";
import PredictionForm from "./components/PredictionForm";
import ResultCard from "./components/ResultCard";
import ErrorBanner from "./components/ErrorBanner";

let API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/predict";

// Gracefully handle if the environment variable is missing the /predict path
if (!API_URL.endsWith("/predict")) {
  API_URL = `${API_URL.replace(/\/$/, "")}/predict`;
}

export default function Home() {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(data: DiabetesInput) {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(
          body?.detail ?? `Server responded with status ${res.status}`
        );
      }

      const prediction: PredictionResult = await res.json();
      setResult(prediction);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleReset() {
    setResult(null);
    setError(null);
  }

  return (
    <div className="page-wrapper">
      <main className="page-main">
        {/* ── Hero ──────────────────────────────────────────────── */}
        <section className="hero">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            ML-Powered Health Screening
          </div>

          <h1 className="hero-title">
            Diabetes Risk{" "}
            <span className="hero-title-accent">Predictor</span>
          </h1>

          <p className="hero-subtitle">
            Enter your health metrics below to receive an instant, AI-powered
            diabetes risk assessment based on clinical indicators.
          </p>
        </section>

        {/* ── Error ─────────────────────────────────────────────── */}
        {error && (
          <ErrorBanner message={error} onDismiss={() => setError(null)} />
        )}

        {/* ── Card ──────────────────────────────────────────────── */}
        <div className="card">
          {result ? (
            <ResultCard result={result} onReset={handleReset} />
          ) : (
            <PredictionForm onSubmit={handleSubmit} isLoading={isLoading} />
          )}
        </div>

      </main>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="page-footer">
        <div className="footer-divider" />
        Built with Next.js &amp; FastAPI &middot; Powered by Machine Learning
      </footer>
    </div>
  );
}
