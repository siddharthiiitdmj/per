import prisma from "src/libs/prismadb";
import { NextApiRequest, NextApiResponse } from "next/types";
import { DeviceType } from "src/types/apps/deviceTypes";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { OS = '', q = ''} = req.query ?? ''
    const queryLowered = (q as any).toLowerCase()

    const devices = await prisma.device.findMany({
      where: {
        OS: OS || undefined
      }
    })

    const filteredData = devices.filter((device: DeviceType) => {
        return (
          device.id.toLowerCase().includes(queryLowered) ||
          device.devicemodel.toLowerCase().includes(queryLowered) ||
          device.OS.toLowerCase().includes(queryLowered) ||
          device.Kernel.toLowerCase().includes(queryLowered) ||
          device.Screen_resolution.toLowerCase().includes(queryLowered)
        )
    })

    res.status(200).json({allData: filteredData, total: filteredData.length});
  } catch (err) {
    res.status(500).send(err)
  }
};