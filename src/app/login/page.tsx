"use client";

import React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarIcon, MailIcon, LockIcon, EyeIcon, EyeOffIcon } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push("/api/auth/login");
    }, 600);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: "#f6f6f8",
        margin: 0,
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#ffffff",
          borderRadius: "24px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "48px 32px 32px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              backgroundColor: "#135bec",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "24px",
              color: "white",
            }}
          >
            <CalendarIcon style={{ width: "28px", height: "28px" }} />
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#0f172a", margin: "0 0 8px" }}>
            Welcome Back
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
            Sign in to manage your appointments
          </p>
        </div>

        {/* Google Button */}
        <div style={{ padding: "0 32px 32px" }}>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%",
              height: "56px",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              backgroundColor: "#white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background-color 0.2s",
            }}
          >
            <svg style={{ width: "20px", height: "20px" }} viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span style={{ fontWeight: "600", color: "#334155" }}>
              {loading ? "Signing in..." : "Sign in with Google"}
            </span>
          </button>
        </div>

        <div
          style={{
            marginTop: "auto",
            borderTop: "1px solid #f1f5f9",
            padding: "24px",
            backgroundColor: "#f8fafc",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
            New to the platform?{" "}
            <span style={{ color: "#135bec", fontWeight: "bold" }}>Create account</span>
          </p>
        </div>
      </div>
    </div>
  );
}
