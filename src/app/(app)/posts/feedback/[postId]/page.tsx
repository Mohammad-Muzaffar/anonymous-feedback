"use client";
import { useParams } from "next/navigation";
import React from "react";

function PostFeedback() {
  const { postId } = useParams();
  return <div>post feedback</div>;
}

export default PostFeedback;
