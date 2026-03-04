import { useState } from "react";
import { Briefcase, Users, UserCheck, Plus, Download, UserCircle, X, ChevronRight, Phone, Calendar, Star, GraduationCap, Clock, Mail, User, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KPICard } from "@/components/dashboard/KPICard";
import { ApplicantsChart } from "@/components/dashboard/ApplicantsChart";
import { StatusPieChart } from "@/components/dashboard/StatusPieChart";
import { Link } from "react-router-dom";

const EDUCATION_LEVELS = [
  "High School / GCE O-Level",
  "Certificate / Diploma",
  "Associate Degree",
  "Bachelor's Degree",
  "Postgraduate Diploma",
  "Master's Degree",
  "Doctorate (PhD)",
  "Professional Certification",
  "Other",
];

const SKILL_SUGGESTIONS = [
  "JavaScript", "TypeScript", "React", "Node.js", "Python", "Java", "SQL",
  "Project Management", "Data Analysis", "UI/UX Design", "Communication",
  "Leadership", "Problem Solving", "Agile / Scrum",
];

interface ProfileForm {
  name: string;
  email: string;
  phone: string;
  yearsOfExperience: string;
  dateOfBirth: string;
  skills: string[];
  educationLevel: string;
}

const initialForm: ProfileForm = {
  name: "",
  email: "",
  phone: "",
  yearsOfExperience: "",
  dateOfBirth: "",
  skills: [],
  educationLevel: "",
};

export default function Dashboard() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [form, setForm] = useState<ProfileForm>(initialForm);
  const [skillInput, setSkillInput] = useState("");
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Partial<ProfileForm>>({});

  const handleChange = (field: keyof ProfileForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setSaved(false);
  };

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !form.skills.includes(trimmed)) {
      setForm((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
      setSaved(false);
    }
    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    setForm((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));
    setSaved(false);
  };

  const validate = (): boolean => {
    const newErrors: Partial<ProfileForm> = {};
    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Valid email is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    if (!form.yearsOfExperience) newErrors.yearsOfExperience = "Required";
    if (!form.dateOfBirth) newErrors.dateOfBirth = "Required";
    if (!form.educationLevel) newErrors.educationLevel = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      // Here you'd call your API / dispatch action
      setSaved(true);
    }
  };

  const completionCount = [
    form.name, form.email, form.phone, form.yearsOfExperience,
    form.dateOfBirth, form.educationLevel, form.skills.length > 0 ? "yes" : "",
  ].filter(Boolean).length;
  const completionPct = Math.round((completionCount / 7) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your recruitment pipeline</p>
        </div>
        <div className="flex gap-2">
          {/* ── My Profile button ── */}
          <Button variant="outline" onClick={() => setPanelOpen(true)}>
            <UserCircle className="h-4 w-4 mr-2" />
            My Profile
            <ChevronRight className="h-4 w-4 ml-1 opacity-50" />
          </Button>
          <Button asChild>
            <Link to="/jobs">
              <Plus className="h-4 w-4 mr-2" />
              Create Job
            </Link>
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <KPICard
          title="Total Jobs"
          value={12}
          change="+2 this month"
          changeType="positive"
          icon={Briefcase}
          iconColor="bg-primary/10 text-primary"
        />
        <KPICard
          title="Total Applicants"
          value={145}
          change="+23 this week"
          changeType="positive"
          icon={Users}
          iconColor="bg-accent/10 text-accent"
        />
        <KPICard
          title="Shortlisted"
          value={18}
          change="12.4% of total"
          changeType="neutral"
          icon={UserCheck}
          iconColor="bg-success/10 text-success"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ApplicantsChart />
        <StatusPieChart />
      </div>

      {/* ─────────────── Slide-over Profile Panel ─────────────── */}
      {/* Backdrop */}
      {panelOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setPanelOpen(false)}
        />
      )}

      {/* Panel */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-lg bg-background border-l shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${
          panelOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <UserCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-lg leading-tight">Applicant Profile</h2>
              <p className="text-xs text-muted-foreground">Fill in your details below</p>
            </div>
          </div>
          <button
            onClick={() => setPanelOpen(false)}
            className="p-2 rounded-md hover:bg-muted transition-colors"
            aria-label="Close panel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-6 pt-4 pb-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">Profile completion</span>
            <span className="text-xs font-semibold text-primary">{completionPct}%</span>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </div>

        {/* Scrollable form body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {/* Full Name */}
          <FieldGroup icon={<User className="h-4 w-4" />} label="Full Name" error={errors.name}>
            <input
              type="text"
              placeholder="e.g. Jane Banda"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={inputCls(!!errors.name)}
            />
          </FieldGroup>

          {/* Email */}
          <FieldGroup icon={<Mail className="h-4 w-4" />} label="Email Address" error={errors.email}>
            <input
              type="email"
              placeholder="e.g. jane@example.com"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={inputCls(!!errors.email)}
            />
          </FieldGroup>

          {/* Phone */}
          <FieldGroup icon={<Phone className="h-4 w-4" />} label="Phone Number" error={errors.phone}>
            <input
              type="tel"
              placeholder="e.g. +265 999 123 456"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className={inputCls(!!errors.phone)}
            />
          </FieldGroup>

          {/* Years of Experience + DOB side-by-side */}
          <div className="grid grid-cols-2 gap-4">
            <FieldGroup
              icon={<Clock className="h-4 w-4" />}
              label="Years of Experience"
              error={errors.yearsOfExperience}
            >
              <input
                type="number"
                min="0"
                max="50"
                placeholder="e.g. 3"
                value={form.yearsOfExperience}
                onChange={(e) => handleChange("yearsOfExperience", e.target.value)}
                className={inputCls(!!errors.yearsOfExperience)}
              />
            </FieldGroup>

            <FieldGroup
              icon={<Calendar className="h-4 w-4" />}
              label="Date of Birth"
              error={errors.dateOfBirth}
            >
              <input
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                className={inputCls(!!errors.dateOfBirth)}
              />
            </FieldGroup>
          </div>

          {/* Education Level */}
          <FieldGroup
            icon={<GraduationCap className="h-4 w-4" />}
            label="Education Level"
            error={errors.educationLevel}
          >
            <select
              value={form.educationLevel}
              onChange={(e) => handleChange("educationLevel", e.target.value)}
              className={inputCls(!!errors.educationLevel)}
            >
              <option value="">Select education level…</option>
              {EDUCATION_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </FieldGroup>

          {/* Skills */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium mb-1.5">
              <Star className="h-4 w-4 text-muted-foreground" />
              Skills
            </label>

            {/* Chips */}
            <div className="flex flex-wrap gap-2 mb-2 min-h-[2rem]">
              {form.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="hover:text-destructive transition-colors"
                    aria-label={`Remove ${skill}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {form.skills.length === 0 && (
                <span className="text-xs text-muted-foreground italic">No skills added yet</span>
              )}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a skill and press Enter"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill(skillInput);
                  }
                }}
                className={inputCls(false) + " flex-1"}
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => addSkill(skillInput)}
                disabled={!skillInput.trim()}
              >
                Add
              </Button>
            </div>

            {/* Suggestions */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {SKILL_SUGGESTIONS.filter(
                (s) => !form.skills.includes(s) &&
                  s.toLowerCase().includes(skillInput.toLowerCase())
              ).slice(0, 6).map((s) => (
                <button
                  key={s}
                  onClick={() => addSkill(s)}
                  className="text-xs px-2 py-0.5 rounded-full border border-dashed border-muted-foreground/40 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Panel Footer */}
        <div className="px-6 py-4 border-t bg-muted/30 flex items-center justify-between gap-3">
          {saved ? (
            <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
              <CheckCircle2 className="h-4 w-4" />
              Profile saved!
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">
              {7 - completionCount} field{7 - completionCount !== 1 ? "s" : ""} remaining
            </span>
          )}
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => { setForm(initialForm); setSaved(false); setErrors({}); }}>
              Clear
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save Profile
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
}

/* ── Helpers ── */

function inputCls(hasError: boolean) {
  return [
    "w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm",
    "placeholder:text-muted-foreground",
    "focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary",
    "transition-colors",
    hasError ? "border-destructive focus:ring-destructive/40" : "border-input",
  ].join(" ");
}

function FieldGroup({
  icon,
  label,
  error,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium mb-1.5">
        <span className="text-muted-foreground">{icon}</span>
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
