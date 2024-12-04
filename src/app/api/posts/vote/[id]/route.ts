import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import dbConnect from "@/models/db.connect";
import PostModel from "@/models/post.model";
import PostVoteModel from "@/models/postVote.model";
import { v4 as uuid } from "uuid";

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

    const payload = await request.json();
    const { voteType, userToken } = payload;

    if (!["like", "dislike"].includes(voteType)) {
      return NextResponse.json(
        { success: false, message: "Invalid vote type." },
        { status: 400 }
      );
    }

    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0] ?? "127.0.0.1";

    // Step 1: Ensure the post exists
    const post = await PostModel.findById(postId);
    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found." },
        { status: 404 }
      );
    }

    // Step 2: Check for an existing vote
    const previousVotes = await PostVoteModel.find({ postId });
    let existingVote = null;

    for (const vote of previousVotes) {
      if (vote.userToken === userToken) {
        existingVote = vote;
        break;
      }

      const isIpMatch = await bcrypt.compare(ipAddress, vote.ipAddress);
      if (isIpMatch) {
        existingVote = vote;
        break;
      }
    }

    // Step 3: Handle existing vote
    if (existingVote) {
      if (existingVote.voteType === voteType) {
        return NextResponse.json(
          { success: true, message: "Vote already recorded." },
          { status: 200 }
        );
      }

      // Update the vote type
      existingVote.voteType = voteType;
      await existingVote.save();

      // Adjust post vote counts
      if (voteType === "like") {
        post.likes += 1;
        post.dislikes -= 1;
      } else {
        post.likes -= 1;
        post.dislikes += 1;
      }

      await post.save();

      return NextResponse.json(
        { success: true, message: "Vote updated successfully.", post },
        { status: 200 }
      );
    }

    // Step 4: Create a new vote
    const hashedIp = await bcrypt.hash(ipAddress, 10);
    const token = userToken || uuid();

    const newVote = new PostVoteModel({
      postId,
      ipAddress: hashedIp,
      userToken: token,
      voteType,
    });

    await newVote.save();

    // Update post vote counts
    if (voteType === "like") post.likes += 1;
    if (voteType === "dislike") post.dislikes += 1;

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

