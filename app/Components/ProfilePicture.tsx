"use client";
import Image from "next/image";
interface ProfilePictureProps {
  src: string | null | undefined;
  onClick?: () => void;
}
// Adds cursor pointer to profile picture. It's used to show picture on top
export const ProfilePicture: React.FC<ProfilePictureProps> = ({
  src,
  onClick,
}) => {
  return (
    <div onClick={onClick} className="cursor-pointer">
      <Image
        className="rounded-full "
        height="40"
        width="40"
        alt="profile picture"
        src={src || "/images/profile.jpg"}
      />
    </div>
  );
};
