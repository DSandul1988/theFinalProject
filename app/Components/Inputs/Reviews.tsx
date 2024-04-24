import React, { useState, useEffect } from "react";
import axios from "axios";
import { SafeUser } from "@/app/types";

interface Review {
  id: string;
  content: string;
  userName: string | null;
  createdAt: Date;
}

interface ReviewProps {
  user?: SafeUser | null;
  listingId: string;
  content: Review[];
}

const Reviews: React.FC<ReviewProps> = ({ user, listingId, content }) => {
  const [reviews, setReviews] = useState<Review[]>(content);
  const [newReview, setNewReview] = useState("");

  useEffect(() => {
    fetchReviews();
  }, [listingId]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`/api/rew/${listingId}`);
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.trim() || !user) {
      alert("Please write a review before submitting.");
      return;
    }

    try {
      await axios.post("/api/reviews", {
        userId: user.id,
        listingId,
        content: newReview,
      });
      setNewReview("");
      fetchReviews(); // Refresh the list of reviews
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-gray-100 p-4 rounded-lg shadow mb-2"
          >
            <p>{review.content}</p>
            <p className="text-sm text-gray-500">
              - {review.userName || "Anonymous"},{" "}
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
      {user && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            className="w-full p-2 border border-gray-300 rounded-lg"
            rows={4}
            placeholder="Write your review..."
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
          ></textarea>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit Review
          </button>
        </form>
      )}
    </div>
  );
};

export default Reviews;
