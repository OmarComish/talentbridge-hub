import { useEffect, useState } from "react";
import { useConfig} from "./use-config";
import { set } from "date-fns";

interface Job {
  id: string;
  title: string;
  companyId: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Remote";
  description: string;
  responsibilities: string[];
  requirements: string[];
  salary: string;
  postedDate: string;
  featured: boolean;
}

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { config, loadingConfigs} = useConfig();

  useEffect(() => {

    if(!config) return;

    fetch(`${config.apiBaseUrl}/api/jobpostings`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch jobs");
        return res.json();
      })
      .then(setJobs)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
   }, [config]);

  return { jobs, loading, error };
}
