import Image from "next/image";

interface ListingCategoryProps {
  label: string;
  description: string;
}

const ListingCategory: React.FC<ListingCategoryProps> = ({
  label,
  description,
}) => {
  return (
    <div className="flex flex-col gap-6">
      <div>{label}</div>
      <div>{description}</div>
    </div>
  );
};

export default ListingCategory;
