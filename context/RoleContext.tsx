"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type RoleType =
  | "spotter"
  | "analyst"
  | "vaccine_maker"
  | "field_health_worker"
  | "public_view";

export interface RoleInfo {
  id: RoleType;
  title: string;
  badge: string;
  description: string;
  href: string;
  color: string;
}

export const ROLES: Record<RoleType, RoleInfo> = {
  spotter: {
    id: "spotter",
    title: "Spotter",
    badge: "EYE / SENTRY",
    description: "Detects and submits suspicious viral content encountering in the wild.",
    href: "/submit",
    color: "#3B82F6",
  },
  analyst: {
    id: "analyst",
    title: "Analyst",
    badge: "LAB / TRIAGE",
    description: "Evaluates AI suggested techniques and clusters matching strains.",
    href: "/analyst",
    color: "#8B5CF6",
  },
  vaccine_maker: {
    id: "vaccine_maker",
    title: "Vaccine Maker",
    badge: "SYNTHESIS / COUNTER",
    description: "Drafts plain-language counter-narratives & verification explainers.",
    href: "/vaccine",
    color: "#10B981",
  },
  field_health_worker: {
    id: "field_health_worker",
    title: "Field Health Worker",
    badge: "DEPLOYMENT / HERD",
    description: "Distributes counter-content across affected regional channels.",
    href: "/distribute",
    color: "#F59E0B",
  },
  public_view: {
    id: "public_view",
    title: "Public / Regional Lead",
    badge: "OVERVIEW / SURVEILLANCE",
    description: "Monitors real-time outbreak maps and regional herd immunity metrics.",
    href: "/map",
    color: "#FFFFFF",
  },
};

interface RoleContextType {
  role: RoleType;
  roleInfo: RoleInfo;
  setRole: (role: RoleType) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<RoleType>("public_view");

  useEffect(() => {
    const savedRole = localStorage.getItem("vois_current_role") as RoleType;
    if (savedRole && ROLES[savedRole]) {
      setRoleState(savedRole);
    }
  }, []);

  const setRole = (newRole: RoleType) => {
    setRoleState(newRole);
    localStorage.setItem("vois_current_role", newRole);
  };

  return (
    <RoleContext.Provider
      value={{
        role,
        roleInfo: ROLES[role],
        setRole,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
