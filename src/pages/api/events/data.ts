import prisma from "src/libs/prismadb";
import { NextApiRequest, NextApiResponse } from "next/types";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const events = await prisma.events.findMany();
    const length = Object.keys(events).length
    res.status(200).json({allData: events, total: length});
  } catch (err) {
    res.status(500).send(err)
  }
};