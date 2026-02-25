import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, Building2, DollarSign, Briefcase, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import Layout from "@/components/Layout";
import { jobs } from "@/data/jobs";
import { companies } from "@/data/companies";
import { useAuth } from "@/context/AuthContext";
import { useApplications } from "@/context/ApplicationContext";
import { useToast } from "@/hooks/use-toast";

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { applyToJob, hasApplied } = useApplications();
  const { toast } = useToast();

  const [showApplyForm, setShowApplyForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [cvFileName, setCvFileName] = useState("");

  const job = jobs.find((j) => j.id === id);
  const company = job ? companies.find((c) => c.id === job.companyId) : null;

  if (!job || !company) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-2xl font-bold text-foreground mb-4">Job Not Found</h1>
          <Link to="/jobs" className="text-accent hover:underline">Back to Jobs</Link>
        </div>
      </Layout>
    );
  }

  const alreadyApplied = user ? hasApplied(user.id, job.id) : false;

  const handleApply = () => {
    if (!user) return;
    if (!coverLetter.trim()) {
      toast({ title: "Error", description: "Please write a cover letter.", variant: "destructive" });
      return;
    }
    const result = applyToJob(user.id, job.id, coverLetter.trim(), cvFileName || "resume.pdf");
    if (result.success) {
      toast({ title: "Application Submitted!", description: `You've applied to ${job.title} at ${company.name}.` });
      setShowApplyForm(false);
      setCoverLetter("");
      setCvFileName("");
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
  };

  return (
    <Layout>
      {/* Header */}
      <section className="gradient-hero py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary-foreground/10 flex items-center justify-center shrink-0">
              <span className="font-display text-lg font-bold text-primary-foreground">{company.logo}</span>
            </div>
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-1">
                {job.title}
              </h1>
              <p className="text-primary-foreground/70">{company.name}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            {/* Meta */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon: MapPin, text: job.location },
                { icon: Briefcase, text: job.type },
                { icon: DollarSign, text: job.salary },
                { icon: Clock, text: `Posted ${new Date(job.postedDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}` },
              ].map((item) => (
                <span
                  key={item.text}
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-lg"
                >
                  <item.icon className="w-3.5 h-3.5" />
                  {item.text}
                </span>
              ))}
            </div>

            {/* Description */}
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">About This Role</h2>
              <p className="text-muted-foreground leading-relaxed">{job.description}</p>
            </div>

            {/* Responsibilities */}
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">Responsibilities</h2>
              <ul className="space-y-2">
                {job.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
                    <span className="text-sm leading-relaxed">{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">Requirements</h2>
              <ul className="space-y-2">
                {job.requirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <span className="text-sm leading-relaxed">{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <div className="bg-card rounded-xl border border-border shadow-card p-6">
              {alreadyApplied ? (
                <div className="text-center">
                  <CheckCircle2 className="w-10 h-10 text-success mx-auto mb-3" />
                  <h3 className="font-display font-semibold text-foreground mb-1">Already Applied</h3>
                  <p className="text-sm text-muted-foreground">You've submitted your application for this role.</p>
                  <Link to="/dashboard" className="inline-block mt-4 text-sm font-semibold text-accent hover:underline">
                    View Dashboard
                  </Link>
                </div>
              ) : isAuthenticated ? (
                showApplyForm ? (
                  <div className="space-y-4">
                    <h3 className="font-display font-semibold text-foreground">Apply Now</h3>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Cover Letter *</label>
                      <textarea
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        rows={5}
                        placeholder="Tell us why you're a great fit..."
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">CV / Resume</label>
                      <input
                        type="text"
                        value={cvFileName}
                        onChange={(e) => setCvFileName(e.target.value)}
                        placeholder="resume.pdf"
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Enter file name (upload simulation)</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleApply}
                        className="flex-1 py-2.5 rounded-lg bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 transition-colors"
                      >
                        Submit Application
                      </button>
                      <button
                        onClick={() => setShowApplyForm(false)}
                        className="px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowApplyForm(true)}
                    className="w-full py-3 rounded-lg bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 transition-colors"
                  >
                    Apply Now
                  </button>
                )
              ) : (
                <div className="text-center">
                  <h3 className="font-display font-semibold text-foreground mb-2">Interested?</h3>
                  <p className="text-sm text-muted-foreground mb-4">Sign in to apply for this position.</p>
                  <Link
                    to="/login"
                    className="block w-full py-2.5 rounded-lg bg-accent text-accent-foreground text-sm font-semibold text-center hover:bg-accent/90 transition-colors"
                  >
                    Sign In to Apply
                  </Link>
                  <p className="text-xs text-muted-foreground mt-3">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-accent hover:underline">Sign Up</Link>
                  </p>
                </div>
              )}
            </div>

            {/* Company Card */}
            <div className="bg-card rounded-xl border border-border shadow-card p-6">
              <h3 className="font-display font-semibold text-foreground mb-3">About {company.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">{company.description}</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5" />
                  {company.industry}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" />
                  {company.location}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default JobDetails;
