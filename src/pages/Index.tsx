import { Link } from "react-router-dom";
import { ArrowRight, Users, Building2, TrendingUp, Search } from "lucide-react";
import Layout from "@/components/Layout";
import JobCard from "@/components/JobCard";
import { jobs } from "@/data/jobs";
import heroBg from "@/assets/hero-bg.png";

const featuredJobs = jobs.filter((j) => j.featured).slice(0, 6);

const stats = [
  { icon: Users, label: "Active Candidates", value: "12,000+" },
  { icon: Building2, label: "Partner Companies", value: "250+" },
  { icon: TrendingUp, label: "Placements Made", value: "8,500+" },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero">
        <img
          src={heroBg}
          alt="Abstract network representing talent connections"
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity"
          loading="eager"
        />
        <div className="relative container mx-auto px-4 md:px-6 py-20 md:py-32">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6">
              Connecting Talent with Opportunity
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed mb-8 max-w-xl">
              TalentBridge partners with top companies to bring you the best career opportunities.
              Find your next role today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/jobs"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent/90 transition-colors"
              >
                <Search className="w-4 h-4" />
                Browse Jobs
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary-foreground/10 text-primary-foreground border border-primary-foreground/20 font-semibold text-sm hover:bg-primary-foreground/20 transition-colors"
              >
                Create Account
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 md:px-6 -mt-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-card rounded-xl border border-border shadow-card p-6 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <stat.icon className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground mb-2">Featured Opportunities</h2>
            <p className="text-muted-foreground">Hand-picked roles from our partner companies</p>
          </div>
          <Link
            to="/jobs"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent/80 transition-colors"
          >
            View All Jobs
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredJobs.map((job, i) => (
            <div key={job.id} className="animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
              <JobCard job={job} />
            </div>
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent"
          >
            View All Jobs
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary">
        <div className="container mx-auto px-4 md:px-6 py-16 md:py-20 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">
            Ready to Take the Next Step?
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8">
            Create your free account, upload your resume, and start applying to jobs from top companies.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent/90 transition-colors"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
