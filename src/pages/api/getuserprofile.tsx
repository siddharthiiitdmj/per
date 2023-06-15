import prisma from "src/libs/prismadb";
import { NextApiRequest, NextApiResponse } from "next/types";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { email } = req.query;

    const userProfile = await prisma.userProfile.findUnique({
      where: {
        email: email as string,
      },
    });

    if (userProfile) {
      const {
        state,
        phoneNumber,
        address,
        zipcode,
        lastName,
        firstName,
        language,
        country,
        organisation,
      } = userProfile;

      res.status(200).json({
        state,
        phoneNumber,
        address,
        zipcode,
        lastName,
        firstName,
        language,
        country,
        organisation,
      });
    } else {
      res.status(200).json({
        state: "",
        phoneNumber: "",
        address: "",
        zipcode: "",
        lastName: "",
        firstName: "",
        language: "",
        country: "",
        organisation: "",
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
