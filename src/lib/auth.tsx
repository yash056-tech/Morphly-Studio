"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = 
  | "Student" 
  | "Working Professional" 
  | "Freelancer / Creator" 
  | "Researcher / Academic";

export interface EmailNotification {
  to: string;
  adminTo?: string;
  subject: string;
  html: string;
  text: string;
  userSubject?: string;
  userHtml?: string;
  userText?: string;
  sentAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  organization?: string;
  avatar?: string;
  provider: "email" | "phone" | "google" | "github" | "demo";
  plan: "Pro Unlimited";
  joinedAt: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  organization?: string;
  password?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  latestEmail: EmailNotification | null;
  isEmailModalOpen: boolean;
  openEmailModal: () => void;
  closeEmailModal: () => void;
  register: (payload: RegisterPayload) => Promise<boolean>;
  loginWithEmail: (email: string, password?: string) => Promise<boolean>;
  loginWithPhone: (phone: string, otp: string) => Promise<boolean>;
  loginWithSocial: (provider: "google" | "github") => Promise<boolean>;
  loginAsDemoStudent: () => void;
  loginAsDemoProfessional: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [latestEmail, setLatestEmail] = useState<EmailNotification | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("morphly_auth_user") || localStorage.getItem("omnitools_auth_user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
      const storedEmail = localStorage.getItem("morphly_latest_email") || localStorage.getItem("omnitools_latest_email");
      if (storedEmail) {
        setLatestEmail(JSON.parse(storedEmail));
      }
    } catch (e) {
      console.warn("Failed to read user from localStorage", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const dispatchEmailNotification = async (payload: {
    type: "registration" | "signin";
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    organization?: string;
  }) => {
    try {
      const res = await fetch("/api/auth/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.emailPreview) {
          setLatestEmail(data.emailPreview);
          localStorage.setItem("morphly_latest_email", JSON.stringify(data.emailPreview));
        }
      }
    } catch (e) {
      console.warn("Could not dispatch email notification:", e);
    }
  };

  const saveUserSession = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem("morphly_auth_user", JSON.stringify(newUser));
    setIsAuthModalOpen(false);
  };

  const register = async (payload: RegisterPayload): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: payload.name.trim(),
      email: payload.email.trim(),
      phone: payload.phone.trim(),
      role: payload.role,
      organization: payload.organization?.trim() || (payload.role === "Student" ? "University Campus" : "Enterprise"),
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(payload.name)}`,
      provider: "email",
      plan: "Pro Unlimited",
      joinedAt: new Date().toISOString(),
    };

    saveUserSession(newUser);

    // Send confirmation email containing all details
    await dispatchEmailNotification({
      type: "registration",
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      organization: newUser.organization,
    });

    setIsLoading(false);
    return true;
  };

  const loginWithEmail = async (email: string, password?: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));

    const defaultName = email.split("@")[0].replace(/[._]/g, " ");
    const formattedName = defaultName.charAt(0).toUpperCase() + defaultName.slice(1);

    const newUser: User = {
      id: user?.id || `usr_${Date.now()}`,
      name: user?.name || formattedName || "Pro Member",
      email: email,
      phone: user?.phone || "+1 (555) 019-2834",
      role: user?.role || "Working Professional",
      organization: user?.organization || "Enterprise",
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formattedName)}`,
      provider: "email",
      plan: "Pro Unlimited",
      joinedAt: user?.joinedAt || new Date().toISOString(),
    };

    saveUserSession(newUser);

    await dispatchEmailNotification({
      type: "signin",
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      organization: newUser.organization,
    });

    setIsLoading(false);
    return true;
  };

  const loginWithPhone = async (phone: string, otp: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));

    const newUser: User = {
      id: user?.id || `usr_${Date.now()}`,
      name: user?.name || `User ${phone.slice(-4)}`,
      email: user?.email || `user${phone.slice(-4)}@morphly.pro`,
      phone: phone,
      role: user?.role || "Working Professional",
      organization: user?.organization || "Mobile Member",
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(phone)}`,
      provider: "phone",
      plan: "Pro Unlimited",
      joinedAt: user?.joinedAt || new Date().toISOString(),
    };

    saveUserSession(newUser);

    await dispatchEmailNotification({
      type: "signin",
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      organization: newUser.organization,
    });

    setIsLoading(false);
    return true;
  };

  const loginWithSocial = async (provider: "google" | "github"): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    const isGoogle = provider === "google";
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: isGoogle ? "Alex Rivera" : "Developer Rivera",
      email: isGoogle ? "alex.rivera@gmail.com" : "alex@github.dev",
      phone: "+1 (555) 789-0123",
      role: isGoogle ? "Working Professional" : "Freelancer / Creator",
      organization: isGoogle ? "Google Cloud Partner" : "Open Source Community",
      avatar: isGoogle
        ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80"
        : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&auto=format&fit=crop&q=80",
      provider: provider,
      plan: "Pro Unlimited",
      joinedAt: new Date().toISOString(),
    };

    saveUserSession(newUser);

    await dispatchEmailNotification({
      type: "signin",
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      organization: newUser.organization,
    });

    setIsLoading(false);
    return true;
  };

  const loginAsDemoStudent = () => {
    const newUser: User = {
      id: `usr_demo_student_${Date.now()}`,
      name: "Emma Watson",
      email: "emma.watson@stanford.edu",
      phone: "+1 (650) 723-2300",
      role: "Student",
      organization: "Stanford University",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&auto=format&fit=crop&q=80",
      provider: "demo",
      plan: "Pro Unlimited",
      joinedAt: new Date().toISOString(),
    };
    saveUserSession(newUser);
    dispatchEmailNotification({
      type: "registration",
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      organization: newUser.organization,
    });
  };

  const loginAsDemoProfessional = () => {
    const newUser: User = {
      id: `usr_demo_pro_${Date.now()}`,
      name: "David Chen",
      email: "david.chen@enterprise.com",
      phone: "+1 (415) 555-8921",
      role: "Working Professional",
      organization: "Global Solutions Inc.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&auto=format&fit=crop&q=80",
      provider: "demo",
      plan: "Pro Unlimited",
      joinedAt: new Date().toISOString(),
    };
    saveUserSession(newUser);
    dispatchEmailNotification({
      type: "registration",
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      organization: newUser.organization,
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("morphly_auth_user");
    localStorage.removeItem("omnitools_auth_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        latestEmail,
        isEmailModalOpen,
        openEmailModal: () => setIsEmailModalOpen(true),
        closeEmailModal: () => setIsEmailModalOpen(false),
        register,
        loginWithEmail,
        loginWithPhone,
        loginWithSocial,
        loginAsDemoStudent,
        loginAsDemoProfessional,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
