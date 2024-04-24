"use client";

interface ContainerProps {
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div
      className="max-w-auto-[250px] 
  mx-auto
  xl:px-20
  md:px-10
  sm:px-4

  "
    >
      {children}
    </div>
  );
};

export default Container;
