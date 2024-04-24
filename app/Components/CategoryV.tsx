"use client";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import qs from "query-string";
// Define the interface for the component's props
interface CategoryVProps {
  label: string;
  description: string;
  photo: {
    src: string; // URL or path to the image source
    alt?: string; // Optional alt text for the image
    width: number; // Width of the image for proper scaling
    height: number; // Height of the image for proper scaling
  };
  selected?: boolean;
}

// Component definition using the props interface
const CategoryV: React.FC<CategoryVProps> = ({
  label,
  description,
  photo,
  selected,
}) => {
  // Utilize the 'useRouter' hook from Next.js to control routing.
  const router = useRouter();
  // Utilize the 'useSearchParams' hook to access the query parameters of the URL.
  const params = useSearchParams();
  // Define a memoized callback function
  //'handleClick' to handle the click event on the component.
  const handleClick = useCallback(() => {
    // Initialize an empty object to hold the current query parameters.
    let currentQuerry = {};
    // Parse the current search parameters into an object if they exist.
    if (params) {
      currentQuerry = qs.parse(params.toString());
    }
    // Create a new query object by spreading
    //the current query and updating the 'category' field with the label.
    const updatedQuerry: any = { ...currentQuerry, category: label };
    // If the 'category' in the current
    // query matches the label, remove the 'category' field from the query.
    if (params?.get("category") === label) {
      delete updatedQuerry.category;
    }
    // Stringify the updated query object into a URL, skipping any null values.
    const url = qs.stringifyUrl(
      { url: "/", query: updatedQuerry },
      { skipNull: true }
    );
    // Navigate to the updated URL using the Next.js router.
    router.push(url);
  }, [label, params, router]);
  return (
    <div
      onClick={handleClick}
      className={`category-item cursor-pointer 
    transition flex flex-col gap-5
     hover:text-neutral-800 my-gradient items-center
      justify-center text-center p-4 
      ${selected ? "border-b-neutral-800" : "border-b-transparent"}
      ${selected ? "text-neutral-800" : "text-neutral-500"}`}
    >
      <Image
        src={photo.src}
        alt={photo.alt ?? label}
        width={photo.width}
        height={photo.height}
        className="rounded-lg"
      />
      <h3 className="mt-2 text-lg font-semibold">{label}</h3>
      <p className="text-sm">{description}</p>
    </div>
  );
};

export default CategoryV;
