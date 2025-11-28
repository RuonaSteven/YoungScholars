import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

interface AvatarUploaderProps {
  userId: string;
  avatar?: string;
  onAvatarChange: (newAvatar: string) => void;
}

// Example fetch function (replace with real API call)
async function fetchAvatar(userId: string): Promise<string> {
  // Replace this with real fetch if needed
  return "/default-avatar.png";
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  userId,
  avatar,
  onAvatarChange,
}) => {
  const queryClient = useQueryClient();

  // Fetch avatar using React Query
  const { data: fetchedAvatar, isLoading } = useQuery<string, Error>({
  queryKey: ["avatar", userId],
  queryFn: () => fetchAvatar(userId),
  initialData: avatar,
  refetchOnWindowFocus: false,
});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "File too large",
        text: "Please choose an image under 2MB.",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      onAvatarChange(result);

      // Update React Query cache
      queryClient.setQueryData<string>(["avatar", userId], (old) => result);
    };
    reader.readAsDataURL(file);

    
  };

  return (
    <div
      role="button"
      aria-label="Upload avatar"
      tabIndex={0}
      className="w-20 h-20 rounded-full border-2 border-dashed border-purple-400 flex items-center justify-center cursor-pointer hover:bg-purple-100 transition-all duration-200"
      onClick={() =>
        document.getElementById(`avatar-input-${userId}`)?.click()
      }
      onKeyPress={(e) =>
        e.key === "Enter" &&
        document.getElementById(`avatar-input-${userId}`)?.click()
      }
    >
      {isLoading ? (
        <span className="text-purple-400 text-xs text-center px-2">
          Loading...
        </span>
      ) : fetchedAvatar ? (
        <img
          src={fetchedAvatar ?? "/default-avatar.png"}
          alt="Avatar"
          className="w-full h-full rounded-full object-cover"
          onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
        />
      ) : (
        <span className="text-purple-400 text-xs text-center px-2">
          Add Photo
        </span>
      )}

      <input
        id={`avatar-input-${userId}`}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
