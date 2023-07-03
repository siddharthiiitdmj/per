import prisma from "src/libs/prismadb";
import { NextApiRequest, NextApiResponse } from "next/types";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {os} = req.query;
    const filters: any = {}

    if (os && os !== '') {
      filters.OS = os
    }

    const devices = await prisma.device.findMany({
      where: filters
    })
    const length = Object.keys(devices).length
    res.status(200).json({allData: devices, total: length});
  } catch (err) {
    res.status(500).send(err)
  }
};