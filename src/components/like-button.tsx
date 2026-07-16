"use client";

import { useEffect, useState } from "react";
import { ThumbsUp } from "lucide-react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/config/firebase";
import { likeReview, unlikeReview } from "@/services/reviews";

interface LikeButtonProps {
  reviewId: string;
  initialLikes: number;
}

export function LikeButton({ reviewId, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState<number>(initialLikes);
  const [liked, setLiked] = useState<boolean>(false);

  useEffect(() => {
    const stored = localStorage.getItem(`liked_${reviewId}`);
    if (stored === "true") {
      setLiked(true);
    }
  }, [reviewId]);

  useEffect(() => {
    const reviewRef = doc(db, "reviews", reviewId);
    const unsubscribe = onSnapshot(
      reviewRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (typeof data.likesCount === "number") {
            setLikes(data.likesCount);
          }
        }
      },
      (error) => {
        console.error("Erro no listener de likes:", error);
      }
    );

    return () => unsubscribe();
  }, [reviewId]);

  const handleLike = async () => {
    try {
      if (liked) {
        await unlikeReview(reviewId);
        localStorage.removeItem(`liked_${reviewId}`);
        setLiked(false);
      } else {
        await likeReview(reviewId);
        localStorage.setItem(`liked_${reviewId}`, "true");
        setLiked(true);
      }
    } catch (error) {
      console.error("Erro ao curtir/descurtir:", error);
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
        liked
          ? "fill-blue-500 text-blue-500 scale-105"
          : "text-neutral-500 hover:text-blue-500 active:scale-95"
      }`}
    >
      <ThumbsUp className={`h-4 w-4 ${liked ? "fill-blue-100 text-blue-500" : ""}`} />
      <span>{likes}</span>
    </button>
  );
}