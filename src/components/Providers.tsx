"use client";

import React from "react";
import { AuthProvider } from "@/lib/auth";
import { AuthModal } from "@/components/AuthModal";
import { EmailPreviewModal } from "@/components/EmailPreviewModal";
import { HelpAssistant } from "@/components/HelpAssistant";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <AuthModal />
      <EmailPreviewModal />
      <HelpAssistant />
    </AuthProvider>
  );
}
