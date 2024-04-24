"use client";

import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import getCurrentUser from "@/app/actions/getCurrentUser";
import useLogin from "@/app/hooks/useLogin";
import { SafeUser } from "@/app/types";
import { useRouter } from "next/navigation"; // Corrected from "next/navigation" to "next/router"

interface RatingProps {
  user?: SafeUser | null;
  listingId: string;
  value: number;
}

const Rating: React.FC<RatingProps> = ({ user, listingId, value }) => {
  const [rating, setRating] = useState<number | null>(value);
  const [hover, setHover] = useState<number | null>(null);
  const [averageRating, setAverageRating] = useState<number>(value);

  const login = useLogin(); // Assuming this opens a login modal
  const router = useRouter();
  console.log(listingId);
  // Define fetchAverageRating outside useEffect so it can be reused
  const fetchAverageRating = async () => {
    try {
      const response = await axios.get(`/api/ratings/${listingId}`);
      setAverageRating(response.data.averageRating);
    } catch (error) {
      console.error("Failed to fetch average rating", error);
    }
  };

  // useEffect to fetch the latest average rating on mount and after submitting a new rating
  useEffect(() => {
    fetchAverageRating();
  }, [listingId]); // Rerun when listingId changes

  const submitRating = async (ratingValue: number) => {
    if (!user) {
      login.handleOpen(); // Trigger login modal
      return;
    }
    try {
      await axios.post("/api/ratings", {
        userId: user.id,
        listingId,
        value: ratingValue,
      });
      // Fetch the latest average rating after submitting a new rating
      await fetchAverageRating();
    } catch (error) {
      console.error("Failed to submit rating", error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex">
        {[...Array(5)].map((_, index) => {
          const ratingValue = index + 1;
          return (
            <label key={index} className="cursor-pointer">
              <input
                type="radio"
                name="rating"
                value={ratingValue}
                onClick={() => submitRating(ratingValue)}
                className="hidden"
              />
              <FaStar
                size={20}
                className={`mx-1 hover:scale-110 transition-transform duration-200 ${
                  ratingValue <= (hover ?? rating ?? 0)
                    ? "text-yellow-400"
                    : "text-gray-400"
                }`}
                onMouseEnter={() => setHover(ratingValue)}
                onMouseLeave={() => setHover(null)}
              />
            </label>
          );
        })}
      </div>
      <p className="mt-2 text-sm text-gray-600">
        The current average rating is: {averageRating.toFixed(1)}
      </p>
    </div>
  );
};

export default Rating;
