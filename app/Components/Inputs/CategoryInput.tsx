import Image from "next/image";

interface CategoryInputProps {
  photo: string;
  label: string;
  width: number;
  height: number;
  selected?: boolean;
  onClick: (value: string) => void;
}

const CategoryInput: React.FC<CategoryInputProps> = ({
  photo,
  label,
  selected,
  onClick,
  width,
  height,
}) => {
  return (
    <div
      onClick={() => onClick(label)}
      className={`rounded-xl 
  border-2 p-4 flex flex-col gap-3 hover:border-black 
  transition cursor-pointer
   ${selected ? "border-black" : "border-neutral"}`}
    >
      <Image src={photo} alt={label} width={width} height={height} />
      {label}
    </div>
  );
};

export default CategoryInput;
