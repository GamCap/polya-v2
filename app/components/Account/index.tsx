import { useEffect, useState } from "react";
import { TextInput } from "../ui/TextInput";
import { Button } from "../ui/Button";

interface AccountFormProps {
  initialValues: {
    email: string;
    password: string;
  };
  onSave: (data: any) => void;
  onDelete: () => void;
}

const AccountForm = ({ initialValues, onSave, onDelete }: AccountFormProps) => {
  const [formData, setFormData] = useState({
    email: initialValues.email,
    oldPassword: initialValues.password,
    newPassword: "",
    confirmPassword: "",
    emailChanged: false,
  });

  const [visibilityData, setVisibilityData] = useState({
    changePassword: false,
    showOldPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "email") {
      setFormData((prevState) => ({
        ...prevState,
        emailChanged: e.target.value !== initialValues.email,
      }));
    }
  };

  type VisibilityDataKeys = keyof typeof visibilityData;

  const togglePasswordVisibility = (field: VisibilityDataKeys) => {
    setVisibilityData((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    onSave(formData);
    handlePasswordChangeToggle();
  };

  const handlePasswordChangeToggle = () => {
    setVisibilityData((prevState) => ({
      ...prevState,
      changePassword: !prevState.changePassword,
    }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-full p-6 bg-gray-800 flex flex-col gap-6 overflow-y-auto scrollbar text-title-12-auto-regular"
    >
      {/* Personal Settings */}
      <h2 className="text-lg font-bold text-title-14-17-medium">
        Personal Settings
      </h2>

      {/* Email */}
      <div className="flex flex-col gap-2 items-start">
        <label className="block text-sm font-bold" htmlFor="email">
          Email
        </label>
        <div className="flex flex-row gap-4 items-center">
          <TextInput
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your email"
          />
          {formData.emailChanged && (
            <Button variant="subtle" size="small">
              Verify Email
            </Button>
          )}
        </div>
      </div>

      {/* Password */}
      {!visibilityData.changePassword && (
        <div className="flex flex-col gap-2 items-start">
          <label className="block text-sm font-bold" htmlFor="oldPassword">
            Password
          </label>
          <div className="flex flex-row gap-4 items-center">
            <TextInput
              type={visibilityData.showOldPassword ? "text" : "password"}
              id="oldPassword"
              name="oldPassword"
              value={"********"}
              onChange={handleChange}
              isDisabled
              placeholder="********"
            />

            <Button
              variant="subtle"
              size="small"
              onClick={handlePasswordChangeToggle}
            >
              Change Password
            </Button>
          </div>
        </div>
      )}

      {/* Old Password */}
      {visibilityData.changePassword && (
        <div className="flex flex-col gap-2 items-start">
          <label className="block text-sm font-bold" htmlFor="oldPassword">
            Old Password
          </label>
          <div className="flex flex-row gap-4 items-center">
            <TextInput
              type={visibilityData.showOldPassword ? "text" : "password"}
              id="oldPassword"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              placeholder="Enter old password"
            />
            <Button
              type="button"
              variant="subtle"
              size="small"
              onClick={() => togglePasswordVisibility("showOldPassword")}
            >
              {visibilityData.showOldPassword ? "Hide" : "Show"}
            </Button>
          </div>
        </div>
      )}

      {/* New Password */}
      {visibilityData.changePassword && (
        <div className="flex flex-col gap-2 items-start">
          <label className="block text-sm font-bold" htmlFor="newPassword">
            New Password
          </label>{" "}
          <div className="flex flex-row gap-4 items-center">
            <TextInput
              type={visibilityData.showNewPassword ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
            />

            <Button
              type="button"
              variant="subtle"
              size="small"
              onClick={() => togglePasswordVisibility("showNewPassword")}
            >
              {visibilityData.showNewPassword ? "Hide" : "Show"}
            </Button>
          </div>
        </div>
      )}

      {/* Confirm New Password */}
      {visibilityData.changePassword && (
        <div className="flex flex-col gap-2 items-start">
          <label className="block text-sm font-bold" htmlFor="confirmPassword">
            Confirm New Password
          </label>{" "}
          <div className="flex flex-row gap-4 items-center">
            <TextInput
              type={visibilityData.showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
            />

            <Button
              type="button"
              variant="subtle"
              size="small"
              onClick={() => togglePasswordVisibility("showConfirmPassword")}
            >
              {visibilityData.showConfirmPassword ? "Hide" : "Show"}
            </Button>
          </div>
        </div>
      )}

      {/* Save Button */}
      {visibilityData.changePassword && (
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="secondary"
            size="small"
            onClick={handleSubmit}
          >
            Save Changes
          </Button>
        </div>
      )}

      {/* Close Account */}
      <h2 className="text-lg text-title-14-17-medium mt-8">Close Account</h2>

      {/* Danger Zone */}
      <div className="flex">
        <Button
          type="button"
          variant="subtle"
          size="small"
          className="!text-accent-red"
          onClick={onDelete}
        >
          Delete Account
        </Button>
      </div>
    </form>
  );
};

export default AccountForm;
