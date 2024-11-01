import jwt from "jsonwebtoken";

export const createTokens = async (identity: any) => {
  if (!identity?.id) {
    return null;
  }
  const tokenExpiresIn = process.env.TOKEN_EXPIRES_IN;

  const createToken = jwt.sign(
    { identity: { id: identity.id } },
    process.env.JWT_SECRET as string,
    {
      expiresIn: tokenExpiresIn,
    }
  );

  const token = await createToken;

  return { token };
};
