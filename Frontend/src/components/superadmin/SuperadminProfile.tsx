import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, MapPin, Building, Camera } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const SuperadminProfile = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email] = useState(user?.email || "");
  const [telephone, setTelephone] = useState(user?.telephone || "");
  const [district, setDistrict] = useState(user?.district || "");
  const [sector, setSector] = useState(user?.sector || "");
  const [bio, setBio] = useState((user as any)?.bio || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Replace with actual API call to backend
      // const response = await updateProfile({
      //   fullName,
      //   telephone,
      //   district,
      //   sector,
      //   bio
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success(t("profileUpdatedSuccessfully") || "Profile updated successfully");
    } catch (error) {
      toast.error(t("failedToUpdateProfile") || "Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = () => {
    // TODO: Implement image upload functionality
    toast.info(t("imageUploadNotImplemented") || "Image upload functionality is not implemented yet.");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-foreground">{t("profileSettings")}</h2>
      </div>

      {/* Profile Picture Section */}
      <div className="bg-card rounded-xl p-6 border shadow-soft">
        <h3 className="text-xl font-semibold mb-4">{t("profilePicture")}</h3>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              {(user as any)?.profilePicture ? (
                <img
                  src={(user as any).profilePicture}
                  alt={t("profilePicture")}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-primary" />
              )}
            </div>
            <button
              onClick={handleImageUpload}
              className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90 transition-colors"
              aria-label={t("changePicture")}
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              {t("uploadANewProfilePicture")}. {t("recommendedSize")}
            </p>
            <Button variant="outline" size="sm" onClick={handleImageUpload}>
              {t("changePicture")}
            </Button>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-card rounded-xl p-6 border shadow-soft">
        <h3 className="text-xl font-semibold mb-6">{t("personalInformation")}</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                {t("fullName")} *
              </Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t("enterYourFullName")}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                {t("emailAddress")}
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">{t("emailCannotBeChanged")}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="telephone" className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                {t("telephone")}
              </Label>
              <Input
                id="telephone"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                placeholder={t("enterYourPhoneNumber")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="district" className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                {t("district")}
              </Label>
              <Input
                id="district"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder={t("enterYourDistrict")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sector" className="flex items-center">
                <Building className="w-4 h-4 mr-2" />
                {t("sector")}
              </Label>
              <Input
                id="sector"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                placeholder={t("enterYourSector")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">{t("bio")}</Label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={t("tellUsAboutYourself")}
              className="w-full min-h-[100px] px-3 py-2 text-sm border border-input rounded-md bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFullName(user?.fullName || "");
                setTelephone(user?.telephone || "");
                setDistrict(user?.district || "");
                setSector(user?.sector || "");
                setBio((user as any)?.bio || "");
              }}
            >
              {t("resetChanges")}
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? t("saving") : t("saveChanges")}
            </Button>
          </div>
        </form>
      </div>

      {/* Account Information (Read-only) */}
      <div className="bg-card rounded-xl p-6 border shadow-soft">
        <h3 className="text-xl font-semibold mb-4">{t("accountInformation")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">{t("role")}</Label>
            <p className="text-sm font-medium">{t("superAdministrator")}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">{t("accountStatus")}</Label>
            <p className="text-sm font-medium text-green-600">{t("active")}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">{t("memberSince")}</Label>
            <p className="text-sm font-medium">
              {(user as any)?.createdAt ? new Date((user as any).createdAt).toLocaleDateString() : "N/A"}
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">{t("lastLogin")}</Label>
            <p className="text-sm font-medium">
              {(user as any)?.lastLogin ? new Date((user as any).lastLogin).toLocaleDateString() : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperadminProfile;
