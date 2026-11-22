import Link from "next/link";
import { Compass, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="w-full bg-card border-t border-border mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Column 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 via-amber-700 to-stone-900 flex items-center justify-center text-white shadow-md">
                <Compass className="w-5 h-5 text-amber-200" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-foreground">
                Rentara
                <span className="text-amber-500">.</span>
              </span>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              The premier marketplace connecting verified industrial, cinematic,
              agricultural, and commercial gear owners with professional renters.
              Built for reliability, speed, and safety.
            </p>

            <div className="flex items-center gap-3 pt-2">
              {/* Modern X Logo (Assignment Requirement) */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Rentara on X"
                className="w-9 h-9 rounded-full border border-border bg-muted/40 hover:bg-amber-500/10 hover:border-amber-500/30 flex items-center justify-center text-foreground hover:text-amber-600 transition-colors"
              >
                <svg
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/rubaeitferdous/rentara-client"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Repository"
                className="w-9 h-9 rounded-full border border-border bg-muted/40 hover:bg-amber-500/10 hover:border-amber-500/30 flex items-center justify-center text-foreground hover:text-amber-600 transition-colors"
              >
                <svg
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="w-9 h-9 rounded-full border border-border bg-muted/40 hover:bg-amber-500/10 hover:border-amber-500/30 flex items-center justify-center text-foreground hover:text-amber-600 transition-colors"
              >
                <svg
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Popular Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-wider uppercase text-foreground">
              Equipment Categories
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/equipment?category=Construction+Equipment"
                  className="text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  Construction Equipment
                </Link>
              </li>
              <li>
                <Link
                  href="/equipment?category=Photography+Equipment"
                  className="text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  Photography & Cinema
                </Link>
              </li>
              <li>
                <Link
                  href="/equipment?category=Vehicles+%26+Transportation"
                  className="text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  Commercial Transport
                </Link>
              </li>
              <li>
                <Link
                  href="/equipment?category=Agriculture+Equipment"
                  className="text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  Agriculture Equipment
                </Link>
              </li>
              <li>
                <Link
                  href="/equipment?category=Electronics"
                  className="text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  Computing & Electronics
                </Link>
              </li>
              <li>
                <Link
                  href="/equipment?category=Event+Equipment"
                  className="text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  Stage & Event Gear
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-wider uppercase text-foreground">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/equipment"
                  className="text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  Browse All Equipment
                </Link>
              </li>
              <li>
                <Link
                  href="/#how-it-works"
                  className="text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/#why-us"
                  className="text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  Why Choose Us
                </Link>
              </li>
              <li>
                <Link
                  href="/#testimonials"
                  className="text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  Customer Reviews
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  List Your Gear (Owners)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Trust & Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-wider uppercase text-foreground">
              Safety & Support
            </h4>
            <div className="space-y-2.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified Equipment Owners</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Nationwide Hub Locations</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                <span>24/7 Rental Assistance</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                <span>support@rentara.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Rentara Equipment Rental Platform. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Engineered by</span>
            <a
              href="https://github.com/rubaeitferdous"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-amber-600 dark:text-amber-400 hover:underline transition-colors"
            >
              Rubaeit Ferdous
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
