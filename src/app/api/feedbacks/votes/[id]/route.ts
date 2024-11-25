import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import dbConnect from "@/models/db.connect";
import FeedbackModel from "@/models/feedback.model";
import FeedbackVoteModel from "@/models/feedbackVote.model";
import { voteSchema } from "@/schemas/voteSchema";
import { v4 as uuid } from "uuid";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { pathname } = new URL(request.url);
    const id = pathname.split("/").pop(); // Extract dynamic ID

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Post ID not provided." },
        { status: 400 }
      );
    }

    const payload = await request.json();
    const { success, error, data } = voteSchema.safeParse(payload);
    if (!success) {
      const errors = error.errors.map((err) => err.message);
      return NextResponse.json(
        {
          success: false,
          message: "Validation error.",
          errors,
        },
        { status: 400 }
      );
    }

    const { ipAddress, vote } = data;
    let { userToken } = data;

    // Step 1: Find the feedback
    const feedback = await FeedbackModel.findById(id);
    if (!feedback) {
      return NextResponse.json(
        {
          success: false,
          message: "Feedback not found.",
        },
        { status: 404 }
      );
    }

    // Step 2: Check for existing vote
    const previousFeedbackVotes = await FeedbackVoteModel.find({
      feedbackId: id,
    });

    let feedbackVoteExists = false;
    let existingFeedbackVote = null;

    for (const feedbackVote of previousFeedbackVotes) {
      // Compare userToken first
      if (feedbackVote.userToken === userToken) {
        existingFeedbackVote = feedbackVote;
        feedbackVoteExists = true;
        break; // Stop once we find a match
      }

      // Compare hashed IP addresses using bcrypt
      const isIpMatch = await bcrypt.compare(ipAddress, feedbackVote.ipAddress);
      if (isIpMatch) {
        existingFeedbackVote = feedbackVote;
        feedbackVoteExists = true;
        break; // Stop once we find a match
      }
    }

    // Step 3: Handle the case where the vote already exists
    if (feedbackVoteExists) {
      // If the same vote type (upvote/downvote), return early
      if (existingFeedbackVote.voteType === vote) {
        return NextResponse.json(
          {
            success: true,
            message: "Vote already updated.",
          },
          { status: 202 }
        );
      }

      // If the vote type is different, update the existing vote
      existingFeedbackVote.voteType = vote;
      await existingFeedbackVote.save();

      // Step 4: Update feedback model vote count (upvotes or downvotes)
      await FeedbackModel.findByIdAndUpdate(id, {
        $inc:
          vote === "upvote"
            ? { "voteCount.upvotes": 1, "voteCount.downvotes": -1 }
            : { "voteCount.upvotes": -1, "voteCount.downvotes": 1 },
      });

      return NextResponse.json(
        {
          success: true,
          message: "Vote updated successfully.",
          updatedFeedbackVote: existingFeedbackVote,
        },
        { status: 200 }
      );
    }

    // Step 5: Create a new vote if no previous vote exists
    if (!userToken) {
      userToken = uuid(); // Generate a new user token if not provided
    }

    // Hash the IP address to store securely
    const hashedIp = await bcrypt.hash(ipAddress, 10);

    const newVote = new FeedbackVoteModel({
      feedbackId: id,
      ipAddress: hashedIp, // Store the hashed IP
      userToken, // Store userToken (can be null if not provided)
      voteType: vote,
    });

    await newVote.save();

    // Step 6: Update feedback model vote count
    await FeedbackModel.findByIdAndUpdate(id, {
      $inc:
        vote === "upvote"
          ? { "voteCount.upvotes": 1 }
          : { "voteCount.downvotes": 1 },
    });

    return NextResponse.json(
      { success: true, message: "Vote added successfully.", newVote },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while updating post:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error while updating post.",
        error: error instanceof Error ? error.message : "Unknown error.",
      },
      { status: 500 }
    );
  }
}
