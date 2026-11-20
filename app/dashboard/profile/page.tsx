"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { uploadImage } from "@/lib/imgbb";
import Loader from "@/components/Loader";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Upload,
  Image as ImageIcon,
  Shield,
  Save,
  Loader2,
} from "lucide-react";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [photoUrl, setPhotoUrl] = useState<string>("");

  if (isPending || !session?.user) {
    return <Loader fullScreen message="Loading Your Profile Details..." />;
  }

  const u = session.user as {
    name: string;
    email: string;
    image?: string | null;
    role?: string;
    phone?: string;
    address?: string;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setPhotoUrl("");
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const name = String(fd.get("name") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    const address = String(fd.get("address") || "").trim();

    setSaving(true);
    try {
      let finalImage = photoUrl.trim() || u.image || "";

      if (file) {
        setUploadingImage(true);
        try {
          finalImage = await uploadImage(file);
        } catch (uploadErr: any) {
          throw new Error(`Profile image upload failed: ${uploadErr.message}`);
        } finally {
          setUploadingImage(false);
        }
      }

      await api("/users/profile", {
        method: "PATCH",
        body: JSON.stringify({
          name,
          phone,
          address,
          image: finalImage,
        }),
      });

      toast.success("Profile information updated successfully!");
      router.refresh();
    } catch (err: any) {
      console.error("Profile update error:", err);
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
      setUploadingImage(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          My Account Profile
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Review and update your personal details, contact coordinates, and public identity.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="warm-card p-6 sm:p-8 rounded-3xl border border-border space-y-6">
        {/* User Identity Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 border-b border-border pb-6">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-amber-500/40 bg-muted flex items-center justify-center text-amber-700 text-2xl font-black shrink-0 shadow-md">
            {previewUrl || photoUrl || u.image ? (
              <img
                src={previewUrl || photoUrl || u.image || ""}
                alt={u.name}
                className="w-full h-full object-cover"
              />
            ) : (
              u.name?.charAt(0).toUpperCase() || "U"
            )}
          </div>

          <div className="space-y-1 truncate">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-foreground truncate">{u.name}</h2>
              <span className="badge-warm text-xs capitalize">{u.role || "customer"}</span>
            </div>
            <p className="text-xs text-muted-foreground truncate">{u.email}</p>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-600" />
                <span>Full Name *</span>
              </label>
              <input
                name="name"
                defaultValue={u.name}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>

            {/* Email (Read-Only) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-600" />
                <span>Email Address (Primary)</span>
              </label>
              <input
                value={u.email}
                readOnly
                disabled
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/50 text-sm text-muted-foreground cursor-not-allowed opacity-70"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-600" />
                <span>Phone Number</span>
              </label>
              <input
                name="phone"
                defaultValue={u.phone || ""}
                placeholder="+880 1700-000000"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>Physical / Depot Address</span>
              </label>
              <input
                name="address"
                defaultValue={u.address || ""}
                placeholder="City, District, Postal Code"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>

            {/* Profile Photo Upload */}
            <div className="space-y-2 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                <span>Profile Photo (URL or ImgBB Upload)</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="url"
                  value={photoUrl}
                  disabled={Boolean(file)}
                  onChange={(e) => {
                    setPhotoUrl(e.target.value);
                    setPreviewUrl(e.target.value);
                  }}
                  placeholder="Direct image URL (https://...)"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground disabled:opacity-50"
                />

                <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-border hover:border-amber-500/40 bg-muted/30 cursor-pointer text-xs font-semibold text-muted-foreground transition-colors">
                  <Upload className="w-4 h-4 text-amber-600" />
                  <span>{file ? file.name : "Upload new image via ImgBB"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-border flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-amber-700 transition-colors shadow-md shadow-amber-900/15 disabled:opacity-50 cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{uploadingImage ? "Uploading Photo..." : "Saving Profile..."}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
