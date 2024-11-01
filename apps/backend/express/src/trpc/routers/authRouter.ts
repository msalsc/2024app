import { prisma } from "@event-app/database";
import {
  createUserSchema,
  forgetPasswordForEmailSchema,
  resetPasswordWithTokenSchema,
  signInWithEmailSchema,
} from "@event-app/schema";
import bcrypt from "bcryptjs";
import { createTokens } from "../../controllers/authController";
import { publicProcedure, router } from "../trpc";

export const authRouter = router({
  signInWithEmail: publicProcedure
    .input(signInWithEmailSchema)
    .mutation(async (req) => {
      const jwt = "";
      let user = null;
      try {
        user = await prisma?.user.findUniqueOrThrow({
          where: {
            email: req.input.email,
          },
          include: {
            password: true,
          },
        });
      } catch (err) {
        return {
          success: false,
          error: "We couldn't find an account for that email.",
        };
      }

      if (user.deleted_at !== null) {
        return {
          success: false,
          error: "This account has been deleted.",
        };
      }

      const valid = await bcrypt.compare(
        req.input.password,
        user.password?.hash
      );

      if (!valid) {
        return { success: false, error: "Invalid password" };
      }

      const object = await createTokens({ id: user.id });

      return { success: true, jwt: object?.token };
    }),
  forgetPasswordForEmail: publicProcedure
    .input(forgetPasswordForEmailSchema)
    .mutation(async (req) => {
      if (!req.ctx.session.user?.id) {
        return null;
      }

      return { success: true };
    }),
  createUser: publicProcedure.input(createUserSchema).mutation(async (req) => {
    try {
      const { password, birthday, email, gender, name } = req.input;

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma?.user.create({
        data: {
          email: email,
          gender,
          name,
          birthday: birthday ? new Date(birthday) : undefined,
          password: {
            create: {
              hash: hashedPassword,
            },
          },
        },
      });

      const { token } = await createTokens({ id: user.id });

      return { token };
    } catch (err) {
      console.log("there was an error", err);
      return { error: "There was an error creating your account." };
    }
  }),
  resetPasswordWithToken: publicProcedure
    .input(resetPasswordWithTokenSchema)
    .query(async (req) => {}),
});
