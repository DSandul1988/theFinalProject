"use client";
interface LoginMenuItemProps {
  onClick: () => void;
  label: string;
}
export const LoginMenuItem: React.FC<LoginMenuItemProps> = ({
  onClick,
  label,
}) => {
  return (
    <div
      onClick={onClick}
      className="px-4
  py-3
  text-slate-700
  hover:bg-green-200
  transition
  font-semibold"
    >
      {label}
    </div>
  );
};

export default LoginMenuItem;
