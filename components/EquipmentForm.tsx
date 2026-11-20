"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { uploadImage } from "@/lib/imgbb";
import { CATEGORY_NAMES, RENTAL_TYPES } from "@/lib/constants";
import type { Equipment } from "@/types";
import {
  Upload,
  Image as ImageIcon,
  Sparkles,
  ArrowRight,
  Layers,
  Calendar,
  MapPin,
  Tag,
  DollarSign,
  Loader2,
} from "lucide-react";

interface EquipmentFormProps {
  initial?: Equipment;
  redirectTo: string;
}

export default function EquipmentForm({ initial, redirectTo }: EquipmentFormProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(initial?.image || "");
  const [imageUrl, setImageUrl] = useState<string>(initial?.image || "");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setImageUrl("");
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const name = String(fd.get("name") || "").trim();
    const description = String(fd.get("description") || "").trim();
    const category = String(fd.get("category") || "");
    const location = String(fd.get("location") || "").trim();
    const price = Number(fd.get("price"));
    const rentalType = String(fd.get("rentalType") || "Daily");
    const availableQuantity = Number(fd.get("availableQuantity"));
    const condition = String(fd.get("condition") || "Excellent");
    const brand = String(fd.get("brand") || "").trim();
    const model = String(fd.get("model") || "").trim();
    const terms = String(fd.get("terms") || "").trim();

    if (!name || !description || !category || !location || !price || !availableQuantity) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      let finalImage = imageUrl.trim();

      if (file) {
        setUploadingImage(true);
        try {
          finalImage = await uploadImage(file);
        } catch (uploadErr: any) {
          throw new Error(`Image upload failed: ${uploadErr.message}`);
        } finally {
          setUploadingImage(false);
        }
      }

      if (!finalImage) {
        throw new Error("Please supply an image for this equipment listing.");
      }

      const payload = {
        name,
        description,
        category,
        location,
        price,
        rentalType,
        availableQuantity,
        condition,
        brand,
        model,
        image: finalImage,
        terms,
      };

      if (initial?._id) {
        await api(`/equipment/${initial._id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        toast.success("Equipment updated. Re-submitted for review.");
      } else {
        await api("/equipment", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Equipment submitted! It is now pending administrative approval.");
      }

      router.push(redirectTo);
      router.refresh();
    } catch (err: any) {
      console.error("Equipment submit error:", err);
      toast.error(err.message || "Failed to save equipment listing.");
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="warm-card p-6 sm:p-8 rounded-3xl border border-border space-y-6"
    >
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-bold text-foreground">
          {initial ? "Edit Equipment Listing" : "List New Equipment for Rent"}
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {initial
            ? "Updates to listing specifications will place it back into review."
            : "All equipment submissions are reviewed by platform administrators before publication."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Name */}
        <div className="space-y-1 sm:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Equipment Name *
          </label>
          <input
            name="name"
            defaultValue={initial?.name || ""}
            required
            placeholder="e.g. Caterpillar CAT 320 Hydraulic Excavator"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          />
        </div>

        {/* Category */}
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Category *
          </label>
          <select
            name="category"
            defaultValue={initial?.category || CATEGORY_NAMES[0]}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          >
            {CATEGORY_NAMES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Storage Location / Depot *
          </label>
          <input
            name="location"
            defaultValue={initial?.location || ""}
            required
            placeholder="e.g. Gulshan, Dhaka"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          />
        </div>

        {/* Rental Price */}
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Rental Rate ($ USD) *
          </label>
          <input
            name="price"
            type="number"
            min={1}
            step="any"
            defaultValue={initial?.price || 150}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          />
        </div>

        {/* Rental Type */}
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Billing Basis *
          </label>
          <select
            name="rentalType"
            defaultValue={initial?.rentalType || "Daily"}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          >
            {RENTAL_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Available Quantity */}
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Available Quantity / Fleet Stock *
          </label>
          <input
            name="availableQuantity"
            type="number"
            min={1}
            defaultValue={initial?.availableQuantity || 2}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          />
        </div>

        {/* Condition */}
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Equipment Condition *
          </label>
          <select
            name="condition"
            defaultValue={initial?.condition || "Excellent"}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          >
            <option value="Like New">Like New (Mint)</option>
            <option value="Excellent">Excellent (Factory Maintained)</option>
            <option value="Good">Good (Working Order)</option>
            <option value="Fair">Fair (Standard Wear)</option>
          </select>
        </div>

        {/* Brand & Model */}
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Brand / Manufacturer
          </label>
          <input
            name="brand"
            defaultValue={initial?.brand || ""}
            placeholder="e.g. Caterpillar, Sony, Toyota"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Model Number / Spec Code
          </label>
          <input
            name="model"
            defaultValue={initial?.model || ""}
            placeholder="e.g. 320D3, FX6 Cinema, Hiace GL"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          />
        </div>

        {/* Image Upload Area */}
        <div className="space-y-2 sm:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Equipment Image *
          </label>

          {previewUrl && (
            <div className="relative w-48 h-32 rounded-2xl overflow-hidden border border-border bg-muted mb-2">
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="url"
              value={imageUrl}
              disabled={Boolean(file)}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setPreviewUrl(e.target.value);
              }}
              placeholder="Direct image URL (https://...)"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground disabled:opacity-50"
            />

            <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-border hover:border-amber-500/40 bg-muted/30 cursor-pointer text-xs font-semibold text-muted-foreground transition-colors">
              <Upload className="w-4 h-4 text-amber-600" />
              <span>{file ? file.name : "Upload photo via ImgBB"}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1 sm:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Detailed Description *
          </label>
          <textarea
            name="description"
            rows={3}
            defaultValue={initial?.description || ""}
            required
            placeholder="Describe machine specifications, recent servicing, included attachments, and technical capabilities..."
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          />
        </div>

        {/* Terms & Conditions */}
        <div className="space-y-1 sm:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Rental Terms &amp; Conditions *
          </label>
          <textarea
            name="terms"
            rows={3}
            defaultValue={
              initial?.terms ||
              "Security deposit required upon delivery. Return equipment clean and with equal fuel levels. Late returns are charged extra."
            }
            required
            placeholder="Security deposit requirements, authorized operator qualifications, fuel conditions, and penalty clauses..."
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-amber-700 transition-colors shadow-md shadow-amber-900/15 disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{uploadingImage ? "Uploading Photo..." : "Saving Listing..."}</span>
            </>
          ) : (
            <>
              <span>{initial ? "Update Equipment" : "Submit for Approval"}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
