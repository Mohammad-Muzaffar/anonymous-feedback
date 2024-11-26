import zod from "zod";
import dbConnect from "@/models/db.connect";
import UserModel from "@/models/user.model";

const usernameSchema = zod.object({
  username: zod
    .string()
    .min(4, { message: "Username must be atleast 4 characters." })
    .max(20, { message: "Username should be under 20 characters." }),
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };

    const { success, error, data } = usernameSchema.safeParse(queryParam);
    if (!success) {
      const userNameErrors = error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message: userNameErrors,
        },
        { status: 400 }
      );
    }
    const { username } = data;

    const userExists = await UserModel.findOne({
      username,
    });
    if (userExists) {
      return Response.json(
        {
          success: false,
          message: "Username already exists.",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is unique.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        success: false,
        message: "Error checking username. " + error,
      },
      { status: 500 }
    );
  }
}
