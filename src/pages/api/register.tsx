import bcrypt from "bcryptjs"
import prisma from "../../libs/prismadb";
import { NextApiRequest, NextApiResponse } from "next/types";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { email,name,password, } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
      }
    });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).send(err)
  }
};