import prisma from "../../libs/prismadb";
import { NextApiRequest, NextApiResponse } from "next/types";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { email, firstName, lastName, organisation, phoneNumber, address, state, zipcode, country, language } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    let userProfile = await prisma.userProfile.findUnique({
      where: { userId: user.id },
    });

    if (!userProfile) {
      userProfile = await prisma.userProfile.create({
        data: {
          email,
          firstName,
          lastName,
          organisation,
          phoneNumber,
          address,
          state,
          zipcode,
          country,
          language,
          user: { connect: { id: user.id } },
        },
      });
    } else {
      userProfile = await prisma.userProfile.update({
        where: { id: userProfile.id },
        data: {
          firstName,
          lastName,
          organisation,
          phoneNumber,
          address,
          state,
          zipcode,
          country,
          language,
        },
      });
    }

    res.status(200).json(userProfile);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};
