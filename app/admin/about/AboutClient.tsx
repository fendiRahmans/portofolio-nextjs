"use client";

import { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminHeader from "../../components/admin/AdminHeader";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import CoreValuesEditor from "../../components/admin/CoreValuesEditor";
import InterestsEditor from "../../components/admin/InterestsEditor";
import { Label } from "../../components/ui/Label";
import { AboutSchema, aboutSchema } from "@/lib/validations";
import { updateAbout } from "@/actions/about";
import { useRouter } from "next/navigation";
import { TextArea } from "../../components/ui/TextArea";

interface AboutClientProps {
  initialData?: AboutSchema | null;
}

export default function AboutClient({ initialData }: AboutClientProps) {
  const router = useRouter();
  
  // Ensure default values for arrays
  const safeInitialData = initialData ? {
    ...initialData,
    coreValues: Array.isArray(initialData.coreValues) ? initialData.coreValues : [],
    interests: Array.isArray(initialData.interests) ? initialData.interests : [],
  } : null;
  
  const [formData, setFormData] = useState<AboutSchema>({
    name: safeInitialData?.name || "",
    title: safeInitialData?.title || "",
    location: safeInitialData?.location || "",
    imageUrl: safeInitialData?.imageUrl || "",
    narrativeTitle: safeInitialData?.narrativeTitle || "",
    narrativeContent: safeInitialData?.narrativeContent || "",
    coreValues: safeInitialData?.coreValues || [],
    interests: safeInitialData?.interests || [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof AboutSchema, string[]>>>({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (field: keyof AboutSchema, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setSuccessMessage("");

    // Client-side validation
    const result = aboutSchema.safeParse(formData);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await updateAbout(formData);
      if (response.success) {
        setSuccessMessage("About page updated successfully!");
        router.refresh();
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        if (response.fieldErrors) {
          setErrors(response.fieldErrors as any);
        } else {
          // General error, maybe show in a toast or general alert
          console.error(response.error);
        }
      }
    } catch (error) {
      console.error("Failed to update about page:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <AdminHeader title="About Page" subtitle="Manage your profile information" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 max-w-4xl mx-auto">
          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-500/20 text-green-400 px-4 py-3 rounded-xl border border-green-500/30 animate-fade-in">
              {successMessage}
            </div>
          )}

          {/* Profile Section */}
          <section className="glass-panel p-4 sm:p-6 rounded-2xl space-y-4 sm:space-y-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white border-b border-white/10 pb-4">
              Profile Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label icon="person">Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Your Name"
                />
                {errors.name && (
                  <p className="text-red-400 text-sm">{errors.name[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label icon="badge">Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="e.g. Frontend Specialist"
                />
                {errors.title && (
                  <p className="text-red-400 text-sm">{errors.title[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label icon="location_on">Location</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  placeholder="e.g. Jakarta, Indonesia"
                />
                {errors.location && (
                  <p className="text-red-400 text-sm">{errors.location[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label icon="image">Image URL</Label>
                <Input
                  value={formData.imageUrl}
                  onChange={(e) => handleChange("imageUrl", e.target.value)}
                  placeholder="https://..."
                />
                {errors.imageUrl && (
                  <p className="text-red-400 text-sm">{errors.imageUrl[0]}</p>
                )}
              </div>
            </div>
          </section>

          {/* Narrative Section */}
          <section className="glass-panel p-4 sm:p-6 rounded-2xl space-y-4 sm:space-y-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white border-b border-white/10 pb-4">
              Narrative
            </h2>
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label icon="article">Narrative Title</Label>
                <Input
                  value={formData.narrativeTitle}
                  onChange={(e) => handleChange("narrativeTitle", e.target.value)}
                  placeholder="e.g. My Journey"
                />
                {errors.narrativeTitle && (
                  <p className="text-red-400 text-sm">{errors.narrativeTitle[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Narrative Content</Label>
                <TextArea
                  value={formData.narrativeContent}
                  onChange={(e) => handleChange("narrativeContent", e.target.value)}
                  placeholder="Tell your story..."
                  className="min-h-[200px]"
                />
                {errors.narrativeContent && (
                  <p className="text-red-400 text-sm">
                    {errors.narrativeContent[0]}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Core Values Section */}
          <section className="glass-panel p-4 sm:p-6 rounded-2xl space-y-4 sm:space-y-6">
            <CoreValuesEditor
              value={formData.coreValues}
              onChange={(newValues) => handleChange("coreValues", newValues)}
            />
          </section>

          {/* Interests Section */}
          <section className="glass-panel p-4 sm:p-6 rounded-2xl space-y-4 sm:space-y-6">
            <InterestsEditor
              value={formData.interests}
              onChange={(newInterests) => handleChange("interests", newInterests)}
            />
            {errors.interests && (
              <p className="text-red-400 text-sm">{errors.interests[0]}</p>
            )}
          </section>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              isLoading={isLoading}
              className="!w-auto min-w-[150px]"
              icon="save"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </main>
    </AdminLayout>
  );
}
