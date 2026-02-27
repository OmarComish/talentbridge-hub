import { useEffect, useState } from "react";
import { useConfig} from "./use-config";
import { set } from "date-fns";

interface Company {
  id: string;
  name: string;
  industry: string;
  location: string;
  description: string;
  logo: string;
}
export function useCompanies() {
     const [companies, setCompanies] = useState<Company[]>([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);
     const { config, loadingConfigs} = useConfig();

        useEffect(() => {

            if(!config) return;

            fetch(`${config.apiBaseUrl}/api/company`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch jobs");
                return res.json();
            })
            .then(setCompanies)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
        }, [config]);

    return { companies, loading, error };
}