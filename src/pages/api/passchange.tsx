import bcrypt from "bcryptjs";
import prisma from "../../libs/prismadb";
import { NextApiRequest, NextApiResponse } from "next/types";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { email, currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.hashedPassword === null) {
      return res.status(400).json({
        error: "Password can't be changed on a Google-connected account",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.hashedPassword
    );

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid current password" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    const updatedUser = await prisma.user.update({
      where: { email },
      data: { hashedPassword: hashedNewPassword },
    });

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).send(err);
  }
};
