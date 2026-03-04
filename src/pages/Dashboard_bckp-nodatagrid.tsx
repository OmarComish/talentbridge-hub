import { useState } from "react";
import {
  Briefcase, Users, UserCheck, Plus, Download,
  UserCircle, X, ChevronRight, Phone, Calendar,
  Star, GraduationCap, Clock, Mail, User, CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {useConfig} from "@/hooks/use-config";
import { toast } from "@/hooks/use-toast";

// ─── Types ────────────────────────────────────────────────────────────────────

interface KPICardProps {
  title: string;
  value: number | string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: React.ElementType;
  iconColor?: string;
}

interface ProfileForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  yearsOfExperience: string;
  dateOfBirth: string;
  skills: string[];
  educationLevel: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

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
  "JavaScript", "TypeScript", "React", "Node.js", "Python",
  "Java", "SQL", "Project Management", "Data Analysis",
  "UI/UX Design", "Communication", "Leadership", "Agile / Scrum",
];

const INITIAL_FORM: ProfileForm = {
  firstName: "",lastName: "", email: "", phone: "",
  yearsOfExperience: "", dateOfBirth: "",
  skills: [], educationLevel: "",
};

// ─── Inline KPICard ───────────────────────────────────────────────────────────

function KPICard({ title, value, change, changeType, icon: Icon, iconColor = "bg-primary/10 text-primary" }: KPICardProps) {
  const changeColor =
    changeType === "positive" ? "text-green-600" :
    changeType === "negative" ? "text-red-500" :
    "text-muted-foreground";

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-full shrink-0 ${iconColor}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground truncate">{title}</p>
        <p className="text-2xl font-bold leading-tight">{value}</p>
        <p className={`text-xs font-medium mt-0.5 ${changeColor}`}>{change}</p>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
  icon, label, error, children,
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

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [form, setForm] = useState<ProfileForm>(INITIAL_FORM);
  const [skillInput, setSkillInput] = useState("");
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileForm, string>>>({});
  const {config, loading} = useConfig();

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

  const removeSkill = (skill: string) =>
    setForm((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));

  const validate = () => {
    const e: Partial<Record<keyof ProfileForm, string>> = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email is required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (!form.yearsOfExperience) e.yearsOfExperience = "Required";
    if (!form.dateOfBirth) e.dateOfBirth = "Required";
    if (!form.educationLevel) e.educationLevel = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async() => { 

    if (!validate()) return;
      const newapplicant = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phoneNumber: form.phone,
        dateofBirth: form.dateOfBirth,
        skills: form.skills.join(", "),
        educationLevel: 3,
        yearsOfExperience: form.yearsOfExperience
      };
       console.log(newapplicant)
      try {
        const response = await fetch(`${config.apiBaseUrl}/api/applicants/createapplicant`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newapplicant),
        });
        if(!response.ok){
           throw new Error(`We failed to add new applicant ${response.status}`);
        }
        const result = await response.json();
        console.log(result);

        toast({
          title: "Applicant Created",
          description: `Applicant name ${newapplicant.firstName} has been successfully created.`,
        });

         //setIsDialogOpen(false);
          setSaved(true); 

      } catch (error) {
          toast({
            title: "Error",
            description: "We failed to add new applicant. Please try again.",
            variant: "destructive",
          });
          console.error('Error creating applicant:', error);
      }

      setSaved(true); 
  };

  const filledCount = [
    form.firstName,form.lastName, form.email, form.phone,
    form.yearsOfExperience, form.dateOfBirth,
    form.educationLevel, form.skills.length > 0 ? "yes" : "",
  ].filter(Boolean).length;
  const completionPct = Math.round((filledCount / 8) * 100);

  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your recruitment pipeline</p>
        </div>
        <div className="flex gap-2">
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

      {/* ── KPI Cards ── */}
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

      {/* ── Backdrop ── */}
      {panelOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setPanelOpen(false)}
        />
      )}

      {/* ── Slide-over Panel ── */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-lg bg-background border-l shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${panelOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <UserCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-lg leading-tight">Applicant Profile</h2>
              <p className="text-xs text-muted-foreground">Fill in your personal details</p>
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

        {/* Progress Bar */}
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

        {/* Scrollable Form */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">

          <FieldGroup icon={<User className="h-4 w-4" />} label="First Name" error={errors.firstName}>
            <input
              type="text"
              placeholder="e.g. Chisomo"
              value={form.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              className={inputCls(!!errors.firstName)}
            />
          </FieldGroup>
             <FieldGroup icon={<User className="h-4 w-4" />} label="Last Name" error={errors.lastName}>
            <input
              type="text"
              placeholder="e.g. Kumala"
              value={form.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              className={inputCls(!!errors.lastName)}
            />
          </FieldGroup>

          <FieldGroup icon={<Mail className="h-4 w-4" />} label="Email Address" error={errors.email}>
            <input
              type="email"
              placeholder="e.g. jane@example.com"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={inputCls(!!errors.email)}
            />
          </FieldGroup>

          <FieldGroup icon={<Phone className="h-4 w-4" />} label="Phone Number" error={errors.phone}>
            <input
              type="tel"
              placeholder="e.g. +265 999 123 456"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className={inputCls(!!errors.phone)}
            />
          </FieldGroup>

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

            <div className="flex flex-wrap gap-2 mb-2 min-h-[2rem]">
              {form.skills.length === 0 ? (
                <span className="text-xs text-muted-foreground italic">No skills added yet</span>
              ) : (
                form.skills.map((skill) => (
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
                ))
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a skill and press Enter"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") { e.preventDefault(); addSkill(skillInput); }
                }}
                className={`${inputCls(false)} flex-1`}
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

            <div className="flex flex-wrap gap-1.5 mt-2">
              {SKILL_SUGGESTIONS
                .filter((s) =>
                  !form.skills.includes(s) &&
                  s.toLowerCase().includes(skillInput.toLowerCase())
                )
                .slice(0, 6)
                .map((s) => (
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
              {7 - filledCount} field{7 - filledCount !== 1 ? "s" : ""} remaining
            </span>
          )}
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setForm(INITIAL_FORM); setSaved(false); setErrors({}); }}
            >
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
