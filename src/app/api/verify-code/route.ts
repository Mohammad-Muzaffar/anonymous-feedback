import dbConnect from "@/models/db.connect";
import UserModel from "@/models/user.model";
import { verifySchema } from "@/schemas/verifySchema";
import { sendVerificationEmail } from "@/utils/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const payload = await request.json();
    const { success, error, data } = verifySchema.safeParse(payload);
    if (!success) {
      const errors = error.errors.map((err) => err.message);
      return Response.json(
        {
          success: false,
          message: "Zod validation error",
          errors,
        },
        { status: 400 }
      );
    }
    const { code, username } = data;

    const user = await UserModel.findOne({
      username,
    });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (user.isVerified) {
      return Response.json(
        {
          success: false,
          message: "User already verified.",
        },
        { status: 400 }
      );
    }
    if (isCodeNotExpired && isCodeValid && user.isVerified === false) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: "Account verified.",
        },
        { status: 200 }
      );
    } else if (!isCodeNotExpired && user.isVerified === false) {
      const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      user.verifyCode = verifyCode;
      user.verifyCodeExpiry = expiryDate;
      await user.save();

      sendVerificationEmail(user.email, user.username, verifyCode);
      return Response.json(
        {
          success: false,
          message: "Code expired sent new verification code please enter new verification code.",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Code is not valid or expired.",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        success: false,
        message: "Error verifying user. " + error,
      },
      { status: 500 }
    );
  }
}
