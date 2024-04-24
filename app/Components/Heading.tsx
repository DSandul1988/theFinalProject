"use client";

interface HeadingProps {
  title: string;
  subtitle?: string;
  center?: boolean;
  createdAt?: string;
  email?: string | undefined | null;
}

export const Heading: React.FC<HeadingProps> = ({
  title,
  subtitle,
  center,
  createdAt,
  email,
}) => {
  return (
    <div className={center ? "text-center" : "text-start"}>
      <div className="text-2xl font-bold text-black">{title}</div>
      <div className=" font-light text-black mt-2">{subtitle}</div>
      {createdAt && (
        <div className="font-light text-black mt-2">
          The user was created at: {createdAt}
        </div>
      )}
      {email && (
        <div className="font-light text-black mt-2">
          The user email is: {email}
        </div>
      )}
    </div>
  );
};

export default Heading;
