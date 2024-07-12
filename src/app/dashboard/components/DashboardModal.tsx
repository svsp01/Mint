import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { updateProfile, updateSettings } from "@/redux/features/userSlice";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: "profile" | "settings" | null;
}

const DashboardModal: React.FC<ModalProps> = ({ isOpen, onClose, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {content === "profile" ? "Profile" : "Settings"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        {content === "profile" ? <ProfileContent /> : <SettingsContent />}
      </div>
    </div>
  );
};

const ProfileContent: React.FC = () => {
  const dispatch = useDispatch();
  const { username, email, bio } = useSelector(
    (state: RootState) => state.user
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    dispatch(
      updateProfile({
        username: formData.get("name") as string,
        email: formData.get("email") as string,
        bio: formData.get("bio") as string,
      })
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-4">
        <img
          src="/avatar.jpg"
          alt="User Avatar"
          className="w-24 h-24 rounded-full"
        />
        <div>
          <input
            name="name"
            defaultValue={username}
            className="text-xl font-semibold border-b border-gray-300 focus:border-blue-500 outline-none"
          />
          <input
            name="email"
            defaultValue={email}
            className="text-gray-500 border-b border-gray-300 focus:border-blue-500 outline-none"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="bio"
          className="block text-sm font-medium text-gray-700"
        >
          Bio
        </label>
        <textarea
          name="bio"
          id="bio"
          rows={3}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          defaultValue={bio}
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        Save Changes
      </button>
    </form>
  );
};

const SettingsContent: React.FC = () => {
  const dispatch = useDispatch();
  const { emailNotifications, theme } = useSelector(
    (state: RootState) => state.user
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    dispatch(
      updateSettings({
        emailNotifications: formData.get("emailNotifications") === "on",
        theme: formData.get("theme") as "light" | "dark" | "system",
      })
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email-notifications" className="flex items-center">
          <input
            type="checkbox"
            id="email-notifications"
            name="emailNotifications"
            className="rounded text-blue-600 focus:ring-blue-500"
            defaultChecked={emailNotifications}
          />
          <span className="ml-2">Receive email notifications</span>
        </label>
      </div>
      <div>
        <label
          htmlFor="theme"
          className="block text-sm font-medium text-gray-700"
        >
          Theme
        </label>
        <select
          id="theme"
          name="theme"
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          defaultValue={theme}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        Save Settings
      </button>
    </form>
  );
};

export default DashboardModal;
