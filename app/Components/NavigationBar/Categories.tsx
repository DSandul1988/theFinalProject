"use client";

import Beach from "@/public/images/beach.jpg";
import Country from "@/public/images/country.jpg";
import City from "@/public/images/city.jpg";
import Mountains from "@/public/images/mountains.jpg";

import Container from "../Container";
import CategoryV from "../CategoryV";
import { usePathname, useSearchParams } from "next/navigation";
export const catego = [
  {
    label: "Beach",
    photo: { src: "/images/beach.jpg", width: 100, height: 60 },
    description: "This is near the beach",
  },
  {
    label: "City",
    photo: { src: "/images/city.jpg", width: 100, height: 100 },
    description: "This is in the city",
  },
  {
    label: "Island",
    photo: { src: "/images/island.jpg", width: 100, height: 100 },
    description: "This is in on the Island",
  },
  {
    label: "Log Cabins",
    photo: { src: "/images/cabin.jpg", width: 100, height: 100 },
    description: "This are the log cabins",
  },
  {
    label: "Woods",
    photo: { src: "/images/woods.jpg", width: 100, height: 100 },
    description: "This is in the woods",
  },
  {
    label: "Castle",
    photo: { src: "/images/castle.jpg", width: 100, height: 100 },
    description: "This is in the ancient sight",
  },
  {
    label: "Tropical",
    photo: { src: "/images/tropical.jpg", width: 100, height: 100 },
    description: "This is in the tropics",
  },
  {
    label: "Countryside",
    photo: { src: "/images/country.jpg", width: 100, height: 60 },
    description: "This is in the country",
  },
  {
    label: "Mountains",
    photo: { src: "/images/mountains.jpg", width: 100, height: 60 },
    description: "This is in the Mountains",
  },
];

const Categories = () => {
  const params = useSearchParams();
  const category = params?.get("category");
  const pathname = usePathname();
  const isMain = pathname === "/";
  if (!isMain) {
    return null;
  }
  return (
    <div className="my-gradient h-50">
      <Container>
        <div
          className="pt-4 flex flex-row bg-amber-200
  items-center justify-beween overflow-x-auto "
        >
          {catego.map((item) => (
            <CategoryV
              key={item.label}
              label={item.label}
              description={item.description}
              selected={category === item.label}
              photo={item.photo}
            />
          ))}
        </div>
      </Container>
    </div>
  );
};

export default Categories;
