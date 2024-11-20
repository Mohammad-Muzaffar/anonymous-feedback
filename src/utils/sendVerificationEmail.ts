import { resend } from "@/lib/resend";
import VerificationEmail from "@/../emails/VerificationEmail";
import { APIResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  otp: string
): Promise<APIResponse> {
  try {
    await resend.emails.send({
      from: "Anonymous Feedback <onboarding@resend.dev>",
      to: email,
      subject: "Anonymous Feedback | Verification Code",
      react: VerificationEmail({ username, otp }),
    });
    return {
      success: true,
      message: "Verification email send successfully.",
    };
  } catch (error) {
    console.error("Failed to send verification email.", error);
    return {
      success: false,
      message:
        "Failed to send verification email. " +
        (error instanceof Error ? error.message : error),
    };
  }
}
