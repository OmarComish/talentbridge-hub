import { Link } from "react-router-dom";
import { User, Mail, LogOut, Briefcase, Clock, ExternalLink } from "lucide-react";
import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import { useApplications } from "@/context/ApplicationContext";
import { jobs } from "@/data/jobs";
import { companies } from "@/data/companies";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { getUserApplications } = useApplications();

  if (!user) return null;

  const userApps = getUserApplications(user.id);

  const statusColors: Record<string, string> = {
    Submitted: "bg-accent/10 text-accent",
    "Under Review": "bg-warning/10 text-warning",
    Interview: "bg-success/10 text-success",
    Rejected: "bg-destructive/10 text-destructive",
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border shadow-card p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full gradient-hero flex items-center justify-center">
                  <span className="font-display text-lg font-bold text-primary-foreground">
                    {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </span>
                </div>
                <div>
                  <h2 className="font-display text-lg font-semibold text-foreground">{user.name}</h2>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Mail className="w-3.5 h-3.5" />
                    {user.email}
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Applications</span>
                  <span className="font-semibold text-foreground">{userApps.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Member Since</span>
                  <span className="font-semibold text-foreground">Feb 2026</span>
                </div>
              </div>

              <button
                onClick={logout}
                className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/5 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Applications */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-display text-2xl font-bold text-foreground">My Applications</h1>
              <Link
                to="/jobs"
                className="text-sm font-semibold text-accent hover:underline flex items-center gap-1"
              >
                Browse Jobs
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            {userApps.length === 0 ? (
              <div className="bg-card rounded-xl border border-border shadow-card p-12 text-center">
                <Briefcase className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">No Applications Yet</h3>
                <p className="text-sm text-muted-foreground mb-6">Start exploring jobs and submit your first application.</p>
                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 transition-colors"
                >
                  Find Jobs
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {userApps.map((app, i) => {
                  const job = jobs.find((j) => j.id === app.jobId);
                  const company = job ? companies.find((c) => c.id === job.companyId) : null;
                  if (!job) return null;

                  return (
                    <div
                      key={app.id}
                      className="bg-card rounded-xl border border-border shadow-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in"
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-primary">{company?.logo}</span>
                        </div>
                        <div>
                          <Link
                            to={`/jobs/${job.id}`}
                            className="font-display font-semibold text-foreground hover:text-accent transition-colors"
                          >
                            {job.title}
                          </Link>
                          <p className="text-sm text-muted-foreground">{company?.name}</p>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                            <Clock className="w-3 h-3" />
                            Applied {new Date(app.appliedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </div>
                        </div>
                      </div>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${statusColors[app.status] || "bg-muted text-muted-foreground"}`}>
                        {app.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
