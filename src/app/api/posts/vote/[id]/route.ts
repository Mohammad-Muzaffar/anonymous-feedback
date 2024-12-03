import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import dbConnect from "@/models/db.connect";
import PostModel from "@/models/post.model";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { pathname } = new URL(request.url);
    const postId = pathname.split("/").pop();

    if (!postId) {
      return NextResponse.json(
        { success: false, message: "Post ID not provided." },
        { status: 400 }
      );
    }

    const { voteType, userToken } = await request.json();

    if (!["like", "dislike"].includes(voteType)) {
      return NextResponse.json(
        { success: false, message: "Invalid vote type." },
        { status: 400 }
      );
    }

    // Generate a new token for anonymous users if not provided
    const token = userToken || uuid();

    // Step 1: Ensure the post exists
    const post = await PostModel.findById(postId);
    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found." },
        { status: 404 }
      );
    }

    // Step 2: Check if the user already voted (using userToken as the key in voteTracker)
    const existingVote = post.voteTracker.get(token);

    if (existingVote) {
      // If the same vote type, do nothing (idempotent)
      if (existingVote === voteType) {
        return NextResponse.json(
          { success: true, message: "Vote already recorded." },
          { status: 200 }
        );
      }

      // Step 3: If the vote type is different, update it
      const updateField =
        voteType === "like"
          ? { likes: 1, dislikes: -1 }
          : { likes: -1, dislikes: 1 };

      // Update the post's vote counts
      post.likes += updateField.likes;
      post.dislikes += updateField.dislikes;
      post.voteTracker.set(token, voteType); // Update vote tracker
      await post.save();

      return NextResponse.json(
        { success: true, message: "Vote updated successfully.", post },
        { status: 200 }
      );
    }

    // Step 4: Record a new vote
    if (voteType === "like") post.likes += 1;
    if (voteType === "dislike") post.dislikes += 1;
    post.voteTracker.set(token, voteType); // Save vote tracker
    await post.save();

    return NextResponse.json(
      {
        success: true,
        message: "Vote recorded successfully.",
        post,
        userToken: token,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error recording vote:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
