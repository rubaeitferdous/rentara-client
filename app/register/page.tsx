"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { signUp, signIn } from "@/lib/auth-client";
import { clearTokenCache } from "@/lib/api";
import { uploadImage } from "@/lib/imgbb";
import {
  Compass,
  User,
  Mail,
  Lock,
  Image as ImageIcon,
  Upload,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const [password, setPassword] = useState("");

  // Real-time password validation helpers
  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const localPreview = URL.createObjectURL(selectedFile);
      setPreviewUrl(localPreview);
      setPhotoUrl(""); // Clear manual URL if file is chosen
    }
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim().toLowerCase();

    // Password validation according to assignment rules
    if (!hasMinLength) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    if (!hasUppercase) {
      toast.error("Password must contain at least one uppercase letter (A-Z).");
      return;
    }
    if (!hasLowercase) {
      toast.error("Password must contain at least one lowercase letter (a-z).");
      return;
    }

    setLoading(true);
    try {
      let finalImageUrl = photoUrl.trim();

      // Upload file to ImgBB if selected
      if (file) {
        setUploadingImage(true);
        try {
          finalImageUrl = await uploadImage(file);
        } catch (uploadErr: any) {
          throw new Error(`Profile image upload failed: ${uploadErr.message}`);
        } finally {
          setUploadingImage(false);
        }
      }

      const { data, error } = await signUp.email({
        name,
        email,
        password,
        image: finalImageUrl || undefined,
      });

      if (error) {
        throw new Error(error.message || "Registration failed. Please check your details.");
      }

      clearTokenCache();

      await Swal.fire({
        icon: "success",
        title: "Welcome to Rentara!",
        text: "Your customer account has been created successfully.",
        confirmButtonColor: "#d97706",
        timer: 2000,
        showConfirmButton: false,
      });

      router.push("/");
      router.refresh();
    } catch (err: any) {
      console.error("Registration error:", err);
      toast.error(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (err: any) {
      console.error("Google sign in error:", err);
      toast.error("Failed to connect with Google.");
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 warm-glow">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-600 to-stone-900 text-white shadow-lg shadow-amber-950/10 mb-2">
            <Compass className="w-6 h-6 text-amber-200" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Create an Account
          </h1>
          <p className="text-sm text-muted-foreground">
            Join Rentara to rent professional gear or monetize idle equipment.
          </p>
        </div>

        {/* Card Shell */}
        <div className="warm-card p-6 sm:p-8 shadow-xl shadow-amber-950/5">
          <form onSubmit={onSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <User className="w-4 h-4" />
                </div>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="e.g. Alex Mercer"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@domain.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                />
              </div>

              {/* Password criteria chips */}
              {password.length > 0 && (
                <div className="pt-1.5 flex flex-wrap gap-2 text-[11px]">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-medium transition-colors ${
                      hasMinLength
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {hasMinLength ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    6+ characters
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-medium transition-colors ${
                      hasUppercase
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {hasUppercase ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    1 uppercase
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-medium transition-colors ${
                      hasLowercase
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {hasLowercase ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    1 lowercase
                  </span>
                </div>
              )}
            </div>

            {/* Profile Photo (URL or ImgBB file upload) */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Profile Photo (Optional)
              </label>

              {/* Image preview thumbnail if available */}
              {(previewUrl || photoUrl) && (
                <div className="flex items-center gap-3 p-2 rounded-xl bg-muted/40 border border-border">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-500/30 bg-card">
                    <img
                      src={previewUrl || photoUrl}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs text-muted-foreground truncate flex-1">
                    {file ? file.name : "Image link provided"}
                  </span>
                </div>
              )}

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  value={photoUrl}
                  disabled={Boolean(file)}
                  onChange={(e) => {
                    setPhotoUrl(e.target.value);
                    setPreviewUrl("");
                  }}
                  placeholder="Direct image URL (https://...)"
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all disabled:opacity-50"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-dashed border-border hover:border-amber-500/50 hover:bg-muted/30 cursor-pointer transition-colors text-xs text-muted-foreground font-medium">
                  <Upload className="w-3.5 h-3.5 text-amber-600" />
                  <span>{file ? "Change photo" : "Or upload file via ImgBB"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {file && (
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setPreviewUrl("");
                    }}
                    className="text-xs text-red-500 hover:underline px-2"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-amber-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-md shadow-amber-900/15 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <span>{uploadingImage ? "Uploading Photo..." : "Creating Account..."}</span>
              ) : (
                <>
                  <span>Create Free Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Social Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2.5 text-muted-foreground font-medium">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full py-2.5 px-4 rounded-xl border border-border bg-background hover:bg-muted/70 text-foreground font-semibold text-sm transition-colors flex items-center justify-center gap-3 shadow-xs cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google Account</span>
          </button>

          {/* Footer Link */}
          <div className="mt-6 text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-amber-700 dark:text-amber-400 font-semibold hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Security Assurance Badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Encrypted passwords & role-based session protection</span>
        </div>
      </div>
    </div>
  );
}
