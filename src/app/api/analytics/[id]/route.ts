import { NextResponse } from "next/server";
import dbConnect from "@/models/db.connect";
import PostModel from "@/models/post.model";
import FeedbackModel from "@/models/feedback.model";
import PostAnalyticsModel from "@/models/analytics.model";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Google Generative AI
const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

// Helper function to run AI generation
async function runAI(prompt: string) {
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              text: 'Analyze the feedback for the following post:\n    Title: What\'s your opinion on my new application anonymous feedback?\n    Description: A Next.js platform where users can create posts/questions/opinions and share a unique link to gather honest and anonymous feedback. The platform utilizes analytics powered by google ai models to provide insights on feedback, enabling users to make informed decisions based on true, unbiased responses.\n    Feedback Data: ""feedbacks": [\n        {\n            "voteCount": {\n                "upvotes": 1,\n                "downvotes": 2\n            },\n            "_id": "674ef215e7269da0e36acf04",\n            "postId": "674835ef18589e2c40d29f2a",\n            "content": "You can definitely do better.",\n            "ipAddress": "$2b$10$IGDZ16tvsH35GXY3XoSLzu9KXNJBWTFAhqYKAAG0UOcC3P4fXKIfq",\n            "userToken": "f50a55e7-3582-4856-bcdf-51851727135e",\n            "votes": [\n                "674fe63060483f57d60d4b3d",\n                "674fe63060483f57d60d4b3f",\n                "674fedae996af145cf43e7d7"\n            ],\n            "createdAt": "2024-12-03T11:57:09.257Z",\n            "updatedAt": "2024-12-04T06:29:21.051Z",\n            "__v": 0\n        },\n        {\n            "voteCount": {\n                "upvotes": 10,\n                "downvotes": 2\n            },\n            "_id": "675011fd9c7c18117c168cdc",\n            "postId": "674835ef18589e2c40d29f2a",\n            "content": "The application looks promising, keep up the great work!",\n            "ipAddress": "$2b$10$IGDZ16tvsH35GXY3XoSLzu9KXNJBWTFAhqYKAAG0UOcC3P4fXKIfq",\n            "userToken": "f50a55e7-3582-4856-bcdf-51851727135e",\n            "votes": [],\n            "createdAt": "2024-12-03T11:57:09.257Z",\n            "updatedAt": "2024-12-04T06:29:21.051Z",\n            "__v": 0\n        },\n        {\n            "voteCount": {\n                "upvotes": 5,\n                "downvotes": 1\n            },\n            "_id": "675011fd9c7c18117c168cdd",\n            "postId": "674835ef18589e2c40d29f2a",\n            "content": "I think the UI could be more intuitive.",\n            "ipAddress": "$2b$10$UXqOYRWjM1S6LZ98xYOZJ.BMOntw7VYjIA6X.BO.Rdh5D7YqLxoWm",\n            "userToken": "a12b55e7-3582-4856-bcdf-51851727136f",\n            "votes": [],\n            "createdAt": "2024-12-03T12:00:00.000Z",\n            "updatedAt": "2024-12-04T06:30:21.051Z",\n            "__v": 0\n        },\n        {\n            "voteCount": {\n                "upvotes": 3,\n                "downvotes": 5\n            },\n            "_id": "675011fd9c7c18117c168cde",\n            "postId": "674835ef18589e2c40d29f2a",\n            "content": "You can definitely do better.",\n            "ipAddress": "$2b$10$aZq29YtOP3H0zZ59TX7sPUtRWOJduRKaNtpAdB8M1S6LZ98x2xoP3",\n            "userToken": "c78d55e7-3582-4856-bcdf-51851727137g",\n            "votes": [],\n            "createdAt": "2024-12-03T12:30:00.000Z",\n            "updatedAt": "2024-12-04T06:31:21.051Z",\n            "__v": 0\n        },\n        {\n            "voteCount": {\n                "upvotes": 15,\n                "downvotes": 0\n            },\n            "_id": "675011fd9c7c18117c168cdf",\n            "postId": "674835ef18589e2c40d29f2a",\n            "content": "Amazing app! Loved using it.",\n            "ipAddress": "$2b$10$5WPK8RHv39jYcHqSMx3AVhFXwzAdV6kQapO8qz89EPrGZX2xoVlm",\n            "userToken": "d43e55e7-3582-4856-bcdf-51851727138h",\n            "votes": [],\n            "createdAt": "2024-12-03T13:00:00.000Z",\n            "updatedAt": "2024-12-04T06:32:21.051Z",\n            "__v": 0\n        },\n        {\n            "voteCount": {\n                "upvotes": 0,\n                "downvotes": 8\n            },\n            "_id": "675011fd9c7c18117c168ce0",\n            "postId": "674835ef18589e2c40d29f2a",\n            "content": "Not sure what this app is for.",\n            "ipAddress": "$2b$10$TZPlRmvQ7JXFoL3D9APeJW58lz9YT9M2mE9RkFKjXAn7cQ8oxmXym",\n            "userToken": "e29f55e7-3582-4856-bcdf-51851727139i",\n            "votes": [],\n            "createdAt": "2024-12-03T14:00:00.000Z",\n            "updatedAt": "2024-12-04T06:33:21.051Z",\n            "__v": 0\n        },\n        {\n            "voteCount": {\n                "upvotes": 7,\n                "downvotes": 3\n            },\n            "_id": "675011fd9c7c18117c168ce1",\n            "postId": "674835ef18589e2c40d29f2a",\n            "content": "Great effort, but you should improve performance.",\n            "ipAddress": "$2b$10$NpAxZGxM8lJTPzF12rRWL4Z2MFIYQK7WpxDnJ19HlOQzFZWxoMwPW",\n            "userToken": "f65f55e7-3582-4856-bcdf-51851727140j",\n            "votes": [],\n            "createdAt": "2024-12-03T15:00:00.000Z",\n            "updatedAt": "2024-12-04T06:34:21.051Z",\n            "__v": 0\n        },\n        {\n            "voteCount": {\n                "upvotes": 0,\n                "downvotes": 0\n            },\n            "_id": "675011fd9c7c18117c168ce2",\n            "postId": "674835ef18589e2c40d29f2a",\n            "content": "!!! $$$ ### (noisy feedback)",\n            "ipAddress": "$2b$10$BPJGZ3wP6RwmZ97l9YXqlAfZ8OQcFY19oSZXLNwoMUC5Q8LxmPwPO",\n            "userToken": "g78g55e7-3582-4856-bcdf-51851727141k",\n            "votes": [],\n            "createdAt": "2024-12-03T16:00:00.000Z",\n            "updatedAt": "2024-12-04T06:35:21.051Z",\n            "__v": 0\n        }\n    ]"\n\n    Please provide:\n    1. A sentiment summary (positive, neutral, negative counts).\n    2. The most upvoted and most downvoted feedback.\n    3. Common themes in the feedback.\n    Respond in JSON format.',
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: '```json\n{\n  "sentimentSummary": {\n    "positive": 3,\n    "neutral": 1,\n    "negative": 3\n  },\n  "mostUpvotedFeedback": {\n    "content": "Amazing app! Loved using it.",\n    "upvoteCount": 15\n  },\n  "mostDownvotedFeedback": {\n    "content": "Not sure what this app is for.",\n    "downvoteCount": 8\n  },\n  "commonThemes": [\n    "UI/UX improvements (intuitive design)",\n    "Performance optimization",\n    "Overall positive feedback on the app concept",\n    "Unclear purpose/use case (for some users)",\n    "Generic negative feedback without specifics"\n  ]\n}\n```\n',
            },
          ],
        },
      ],
    });

    const response = await chatSession.sendMessage(prompt);
    return JSON.parse(response.response.text());
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error("Error interacting with Google Generative AI.");
  }
}

// Main POST handler
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
      PostModel.findById(postId),
      FeedbackModel.find({ postId }),
    ]);

    if (!post || feedbacks.length === 0) {
      return NextResponse.json(
        { success: false, message: "Post or feedback not found." },
        { status: 404 }
      );
    }

    const feedbackData = feedbacks.map(({ content, sentiment, voteCount }) => ({
      content,
      sentiment,
      upvotes: voteCount.upvotes,
      downvotes: voteCount.downvotes,
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

    const aiResponse = await runAI(prompt);

    const {
      sentimentSummary,
      mostUpvotedFeedback,
      mostDownvotedFeedback,
      commonThemes,
    } = aiResponse;

    const analyticsUpdate = {
      postId,
      sentimentSummary,
      mostUpvotedFeedback: feedbacks.find(
        (f) => f.content === mostUpvotedFeedback.content
      )?._id,
      mostDownvotedFeedback: feedbacks.find(
        (f) => f.content === mostDownvotedFeedback.content
      )?._id,
      commonFeedbackThemes: commonThemes,
      feedbackCount: feedbacks.length,
    };

    await Promise.all([
      PostAnalyticsModel.findOneAndUpdate({ postId }, analyticsUpdate, {
        upsert: true,
        new: true,
      }),
      PostModel.findByIdAndUpdate(postId, {
        sentimentSummary,
        mostUpvotedFeedback: analyticsUpdate.mostUpvotedFeedback,
        mostDownvotedFeedback: analyticsUpdate.mostDownvotedFeedback,
        commonFeedbackThemes: analyticsUpdate.commonFeedbackThemes,
      }),
    ]);

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
        error: error || "Unknown error.",
      },
      { status: 500 }
    );
  }
}
