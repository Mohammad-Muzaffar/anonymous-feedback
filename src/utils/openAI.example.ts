import OpenAI from "openai";
import { NextResponse } from "next/server";
import dbConnect from "@/models/db.connect";
import PostModel from "@/models/post.model";
import FeedbackModel from "@/models/feedback.model";
import PostAnalyticsModel from "@/models/analytics.model";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "nodejs";

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

    const [post, feedbacks] = await Promise.all([
      PostModel.findOne({ _id: postId }),
      FeedbackModel.find({ postId }),
    ]);

    if (!post || feedbacks.length === 0) {
      return NextResponse.json(
        { success: false, message: "Post or feedback not found." },
        { status: 404 }
      );
    }

    const feedbackData = feedbacks.map((f) => ({
      content: f.content,
      sentiment: f.sentiment,
      upvotes: f.voteCount.upvotes,
      downvotes: f.voteCount.downvotes,
    }));

    const prompt = `
    Analyze the feedback for the following post:
    Title: ${post.title}
    Description: ${post.description}
    Feedback Data: ${JSON.stringify(feedbackData, null, 2)}

    Please provide:
    1. A sentiment summary (positive, neutral, negative counts).
    2. The most upvoted and most downvoted feedback.
    3. Common themes in the feedback.
    Respond in JSON format.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 0,
    });

    if (!response || !response.choices || response.choices.length === 0) {
      throw new Error("Invalid response from OpenAI API");
    }

    const {
      sentimentSummary,
      mostUpvotedFeedback,
      mostDownvotedFeedback,
      commonThemes,
    } = JSON.parse(response.choices[0].message.content || "");

    const analyticsUpdate = {
      postId,
      sentimentSummary,
      mostUpvotedFeedback: feedbacks.find((f) =>
        f._id.equals(mostUpvotedFeedback._id)
      )._id,
      mostDownvotedFeedback: feedbacks.find((f) =>
        f._id.equals(mostDownvotedFeedback._id)
      )._id,
      commonFeedbackThemes: commonThemes,
      feedbackCount: feedbacks.length,
    };

    await PostAnalyticsModel.findOneAndUpdate({ postId }, analyticsUpdate, {
      upsert: true,
      new: true,
    });

    await PostModel.findByIdAndUpdate(postId, {
      sentimentSummary,
      mostUpvotedFeedback: analyticsUpdate.mostUpvotedFeedback,
      mostDownvotedFeedback: analyticsUpdate.mostDownvotedFeedback,
      commonFeedbackThemes: analyticsUpdate.commonFeedbackThemes,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Post analytics updated successfully.",
        analytics: analyticsUpdate,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating analytics:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error updating analytics.",
        error: error instanceof Error ? error.message : "Unknown error.",
      },
      { status: 500 }
    );
  }
}
