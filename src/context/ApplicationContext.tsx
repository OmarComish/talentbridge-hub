import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface Application {
  id: string;
  userId: string;
  jobId: string;
  coverLetter: string;
  cvFileName: string;
  appliedAt: string;
  status: "Submitted" | "Under Review" | "Interview" | "Rejected";
}

interface ApplicationContextType {
  applications: Application[];
  applyToJob: (userId: string, jobId: string, coverLetter: string, cvFileName: string) => { success: boolean; error?: string };
  getUserApplications: (userId: string) => Application[];
  hasApplied: (userId: string, jobId: string) => boolean;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

const APPS_KEY = "tb_applications";

const getStored = (): Application[] => {
  try {
    return JSON.parse(localStorage.getItem(APPS_KEY) || "[]");
  } catch {
    return [];
  }
};

export const ApplicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [applications, setApplications] = useState<Application[]>(getStored);

  useEffect(() => {
    localStorage.setItem(APPS_KEY, JSON.stringify(applications));
  }, [applications]);

  const applyToJob = useCallback(
    (userId: string, jobId: string, coverLetter: string, cvFileName: string) => {
      if (applications.find((a) => a.userId === userId && a.jobId === jobId)) {
        return { success: false, error: "You have already applied to this job" };
      }
      const app: Application = {
        id: `a_${Date.now()}`,
        userId,
        jobId,
        coverLetter,
        cvFileName,
        appliedAt: new Date().toISOString(),
        status: "Submitted",
      };
      setApplications((prev) => [...prev, app]);
      return { success: true };
    },
    [applications]
  );

  const getUserApplications = useCallback(
    (userId: string) => applications.filter((a) => a.userId === userId),
    [applications]
  );

  const hasApplied = useCallback(
    (userId: string, jobId: string) => applications.some((a) => a.userId === userId && a.jobId === jobId),
    [applications]
  );

  return (
    <ApplicationContext.Provider value={{ applications, applyToJob, getUserApplications, hasApplied }}>
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplications = () => {
  const ctx = useContext(ApplicationContext);
  if (!ctx) throw new Error("useApplications must be used within ApplicationProvider");
  return ctx;
};
