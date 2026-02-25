import { Link } from "react-router-dom";
import { MapPin, Clock, Building2, ArrowRight } from "lucide-react";
import { Job } from "@/data/jobs";
import { companies } from "@/data/companies";

interface JobCardProps {
  job: Job;
}

const JobCard = ({ job }: JobCardProps) => {
  const company = companies.find((c) => c.id === job.companyId);

  const typeColors: Record<string, string> = {
    "Full-time": "bg-success/10 text-success",
    "Part-time": "bg-warning/10 text-warning",
    Contract: "bg-accent/10 text-accent",
    Remote: "bg-primary/10 text-primary",
  };

  return (
    <Link
      to={`/jobs/${job.id}`}
      className="group block bg-card rounded-xl border border-border p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <span className="text-sm font-bold text-primary">{company?.logo}</span>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${typeColors[job.type] || "bg-muted text-muted-foreground"}`}>
          {job.type}
        </span>
      </div>

      <h3 className="font-display text-lg font-semibold text-foreground mb-1 group-hover:text-accent transition-colors">
        {job.title}
      </h3>

      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
        <Building2 className="w-3.5 h-3.5" />
        <span>{company?.name}</span>
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
        {job.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {job.location}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {new Date(job.postedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
};

export default JobCard;
