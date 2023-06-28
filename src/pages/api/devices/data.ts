import prisma from "src/libs/prismadb";
import { NextApiRequest, NextApiResponse } from "next/types";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const devices = await prisma.device.findMany();
    const length = Object.keys(devices).length
    res.status(200).json({allData: devices, total: length});
  } catch (err) {
    res.status(500).send(err)
  }
};