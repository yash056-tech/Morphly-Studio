"use client";

import React, { useState } from "react";
import { 
  X, 
  Mail, 
  Phone, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Loader2, 
  Zap, 
  Github,
  KeyRound,
  User as UserIcon,
  GraduationCap,
  Briefcase,
  ExternalLink,
  Send,
  Building2,
  Check
} from "lucide-react";
import { useAuth, UserRole } from "@/lib/auth";

export function AuthModal() {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    register,
    loginWithEmail, 
    loginWithPhone, 
    loginWithSocial,
    loginAsDemoStudent,
    loginAsDemoProfessional,
    openEmailModal,
    latestEmail
  } = useAuth();

  const [mode, setMode] = useState<"register" | "signin">("register");
  const [authMethod, setAuthMethod] = useState<"email" | "phone" | "social">("email");

  // Registration form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<UserRole>("Student");
  const [organization, setOrganization] = useState("");
  const [password, setPassword] = useState("");

  // Phone OTP state
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email || !email.includes("@")) {
      setError("Please provide a valid email address.");
      return;
    }
    if (!phone || phone.length < 7) {
      setError("Please provide a valid phone number.");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await register({
        name,
        email,
        phone,
        role,
        organization: organization || (role === "Student" ? "University / College" : "Corporate Office"),
        password,
      });
      setIsSuccess(true);
    } catch {
      setError("Registration failed. Please check your details and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await loginWithEmail(email, password);
      setIsSuccess(true);
    } catch {
      setError("Failed to sign in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendOtp = () => {
    if (!phone || phone.length < 8) {
      setError("Please enter a valid phone number first.");
      return;
    }
    setError(null);
    setOtpSent(true);
  };

  const handlePhoneSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      handleSendOtp();
      return;
    }
    if (!otp || otp.length < 4) {
      setError("Please enter the 4-digit verification code sent to your phone.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await loginWithPhone(phone, otp);
      setIsSuccess(true);
    } catch {
      setError("Invalid OTP code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    setError(null);
    setIsSubmitting(true);
    try {
      await loginWithSocial(provider);
      setIsSuccess(true);
    } catch {
      setError("Social sign in failed. Please try another method.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setError(null);
    closeAuthModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-lg my-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top/Bottom Glow */}
        <div className="absolute -top-24 -left-24 w-52 h-52 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-52 h-52 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          /* SUCCESS SCREEN WITH EMAIL DETAILS */
          <div className="text-center py-6 space-y-5 animate-fade-in">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center ring-8 ring-emerald-500/5">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pro Unlimited Activated • No Size Limits</span>
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {mode === "register" ? "Registration Complete!" : "Welcome Back!"}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
                Your sign-in and profile details have been securely dispatched to{" "}
                <strong className="text-indigo-600 dark:text-indigo-400">{email || "your email"}</strong>.
              </p>
            </div>

            {/* Email Preview Notification Banner */}
            <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-left space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0 shadow-sm">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Confirmation Email Sent
                    </h4>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">
                      Just now
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 truncate">
                    Includes your Name, Phone, Role ({role}), and Pro Unlimited Access link.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  handleClose();
                  openEmailModal();
                }}
                className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Dispatched Email Confirmation</span>
              </button>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-500/25"
            >
              Start Converting & Compressing Now
            </button>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="text-center space-y-2 mb-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>Zero Size Barriers • Up to 500MB+ Processing</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {mode === "register" ? "Create Free Account" : "Sign In to Morphly"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                {mode === "register" 
                  ? "Register with your basic details to lift all size barriers and receive confirmation directly on your email."
                  : "Sign in to access high-capacity document conversions and lossless image compression."}
              </p>
            </div>

            {/* Mode Toggle: Register vs Sign In */}
            <div className="grid grid-cols-2 gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 mb-5 text-xs font-bold">
              <button
                type="button"
                onClick={() => { setMode("register"); setError(null); }}
                className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  mode === "register"
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Register (Get Pro)</span>
              </button>

              <button
                type="button"
                onClick={() => { setMode("signin"); setError(null); }}
                className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  mode === "signin"
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            </div>

            {error && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300">
                {error}
              </div>
            )}

            {/* REGISTRATION FORM (Full Name, Email, Phone, Role) */}
            {mode === "register" ? (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-left">
                {/* 1. Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* 2. Email Address */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] text-indigo-600 dark:text-indigo-400">
                      Details sent here
                    </span>
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="sarah.jenkins@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* 3. Phone Number */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Mobile Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 234-5678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* 4. Who Are You? Role Picker */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Who are you? <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole("Student")}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 text-left transition-all ${
                        role === "Student"
                          ? "border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20"
                          : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg shrink-0 ${role === "Student" ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold">Student</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Academic / College</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole("Working Professional")}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 text-left transition-all ${
                        role === "Working Professional"
                          ? "border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20"
                          : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg shrink-0 ${role === "Working Professional" ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold">Working Pro</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Corporate / Enterprise</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Email Notice Pill */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                  <Send className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span>Your registration summary will be emailed to you instantly.</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Complete Registration & Send Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* SIGN IN FORM WITH EMAIL / PHONE / SOCIAL */
              <div className="space-y-4">
                {/* Method Selector Tabs */}
                <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => { setAuthMethod("email"); setError(null); }}
                    className={`py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      authMethod === "email"
                        ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                        : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setAuthMethod("phone"); setError(null); }}
                    className={`py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      authMethod === "phone"
                        ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                        : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Phone</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setAuthMethod("social"); setError(null); }}
                    className={`py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      authMethod === "social"
                        ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                        : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Social</span>
                  </button>
                </div>

                {authMethod === "email" && (
                  <form onSubmit={handleEmailSignIn} className="space-y-3.5 text-left">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          placeholder="name@company.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        Password or Passcode (Optional)
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <span>Sign In & Dispatch Details</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {authMethod === "phone" && (
                  <form onSubmit={handlePhoneSignIn} className="space-y-3.5 text-left">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        Mobile Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="tel"
                          required
                          placeholder="+1 (555) 000-0000"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-10 pr-24 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {!otpSent && (
                          <button
                            type="button"
                            onClick={handleSendOtp}
                            className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 rounded-lg hover:bg-indigo-100"
                          >
                            Send OTP
                          </button>
                        )}
                      </div>
                    </div>

                    {otpSent && (
                      <div className="space-y-1 animate-slide-up">
                        <div className="flex justify-between items-center text-xs">
                          <label className="font-medium text-slate-700 dark:text-slate-300">
                            Verification Code
                          </label>
                          <span className="text-emerald-600 dark:text-emerald-400 text-[11px]">
                            Code ready
                          </span>
                        </div>
                        <div className="relative">
                          <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            maxLength={6}
                            placeholder="e.g. 5421"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white font-mono tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <span>{otpSent ? "Verify & Unlock Unlimited" : "Continue with Phone"}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {authMethod === "social" && (
                  <div className="space-y-2.5">
                    <button
                      type="button"
                      onClick={() => handleSocialLogin("google")}
                      disabled={isSubmitting}
                      className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-100 font-medium text-xs sm:text-sm flex items-center justify-center gap-3 transition-colors shadow-sm"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      <span>Continue with Google</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSocialLogin("github")}
                      disabled={isSubmitting}
                      className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-100 font-medium text-xs sm:text-sm flex items-center justify-center gap-3 transition-colors shadow-sm"
                    >
                      <Github className="w-4 h-4" />
                      <span>Continue with GitHub</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Quick 1-Click Demo Profiles (Student vs Working Professional) */}
            <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-center">
                Or 1-Click Quick Demo Profiles
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    loginAsDemoStudent();
                    setIsSuccess(true);
                  }}
                  className="p-2 rounded-xl border border-dashed border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/30 hover:bg-indigo-100/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>🎓 Demo Student</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    loginAsDemoProfessional();
                    setIsSuccess(true);
                  }}
                  className="p-2 rounded-xl border border-dashed border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/30 hover:bg-indigo-100/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>💼 Demo Professional</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
