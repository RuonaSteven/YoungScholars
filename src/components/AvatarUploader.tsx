import React, { useRef } from "react";

interface AvatarUploaderProps {
  avatar?: string;
  onAvatarChange: (newAvatar: string) => void;
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  avatar,
  onAvatarChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return; 
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
  alert("File is too large! Please choose an image under 2MB.");
  return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onAvatarChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  
};

  return (
    <div
       role="button"
      aria-label="Upload avatar"
      tabIndex={0}
      className="w-20 h-20 rounded-full border-2 border-dashed border-purple-400 flex items-center justify-center cursor-pointer hover:bg-purple-100 transition-all duration-200"
      onClick={handleAvatarClick}
      onKeyPress={(e) => e.key === 'Enter' && handleAvatarClick()}
    >
      {avatar ? (
        <img src={avatar} 
        onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
        alt="Avatar" className="w-full h-full rounded-full object-cover" />
      ) : (
        <span className="text-purple-400 text-xs text-center px-2">Add Photo</span>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>

    
  );
};
