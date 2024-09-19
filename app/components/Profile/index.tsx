import { useState } from "react";
import { TextInput } from "../ui/TextInput";
import { Button } from "../ui/Button";
import { TextArea } from "../ui/TextArea";

interface ProfileFormProps {
  initialValues: {
    userImage: string;
    username: string;
    twitter: string;
    telegram: string;
    discord: string;
    bio: string;
  };
  onSave: (data: any) => void;
}

const ProfileForm = ({ initialValues, onSave }: ProfileFormProps) => {
  const [formData, setFormData] = useState(initialValues);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-full p-6 bg-gray-800 flex flex-col gap-6 overflow-y-auto scrollbar text-title-12-auto-regular"
    >
      {/* Profile Photo */}
      <div className="flex items-center justify-start">
        <div className="flex flex-row items-end gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={formData.userImage}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover bg-black dark:bg-white"
          />
          <Button variant="subtle" className="!p-0" size="small">
            Edit
          </Button>
        </div>
      </div>

      {/* Username */}
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2" htmlFor="username">
          Username
        </label>
        <TextInput
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Your username"
        />
      </div>

      {/* Twitter */}
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2" htmlFor="twitter">
          Twitter
        </label>
        <TextInput
          type="text"
          id="twitter"
          name="twitter"
          value={formData.twitter}
          onChange={handleChange}
          placeholder="Your Twitter handle"
        />
      </div>

      {/* Telegram */}
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2" htmlFor="telegram">
          Telegram
        </label>
        <TextInput
          type="text"
          id="telegram"
          name="telegram"
          value={formData.telegram}
          onChange={handleChange}
          placeholder="Your Telegram username"
        />
      </div>

      {/* Discord */}
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2" htmlFor="discord">
          Discord
        </label>
        <TextInput
          type="text"
          id="discord"
          name="discord"
          value={formData.discord}
          onChange={handleChange}
          placeholder="Your Discord username"
        />
      </div>

      {/* Bio */}
      <div className="mb-6">
        <label className="block text-sm font-bold mb-2" htmlFor="bio">
          A short bio
        </label>
        <TextArea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          maxLength={160}
          wrapperClassName="w-full"
        />
        <p className="text-sm text-neutral-500 text-end text-basic-11-auto-regular">
          {formData.bio.length}/160
        </p>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button type="submit" variant="secondary" size="small">
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
