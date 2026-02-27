import { Link } from "react-router-dom";
import { Briefcase, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="font-display text-lg font-bold tracking-tight">TalentBridge</span>
            </Link>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              Connecting exceptional talent with outstanding opportunities. Your career journey starts here.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-sm uppercase tracking-wider text-primary-foreground/50">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {[
                { to: "/", label: "Home" },
                { to: "/jobs", label: "Browse Jobs" },
                { to: "/signup", label: "Create Account" },
                { to: "/login", label: "Sign In" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-sm uppercase tracking-wider text-primary-foreground/50">
              Resources
            </h4>
            <ul className="space-y-2.5">
              {["Career Advice", "Resume Tips", "Interview Prep", "Salary Guide"].map((item) => (
                <li key={item}>
                  <span className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors cursor-pointer">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-sm uppercase tracking-wider text-primary-foreground/50">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-sm text-primary-foreground/70">
                <Mail className="w-4 h-4 shrink-0" />
                hello@talentbridge.com
              </li>
              <li className="flex items-center gap-2.5 text-sm text-primary-foreground/70">
                <Phone className="w-4 h-4 shrink-0" />
                (265) 999-349649
              </li>
              <li className="flex items-center gap-2.5 text-sm text-primary-foreground/70">
                <MapPin className="w-4 h-4 shrink-0" />
                HS900 Nkhamenya Street, Area 47, Lilongwe, Malawi
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-10 pt-6 text-center">
          <p className="text-xs text-primary-foreground/50">
            © {new Date().getFullYear()} TalentBridge Recruitment. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
