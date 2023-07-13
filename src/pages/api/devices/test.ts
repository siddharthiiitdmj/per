import prisma from 'src/libs/prismadb'
import { NextApiRequest, NextApiResponse } from 'next/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { os } = req.query

    // const events = await prisma.events.findMany({
    //   where: {
    //     device: {
    //       OS: os
    //     }
    //   }
    // })

    const deviceInfos = await prisma.Events.findMany({
      where: {
        device: {
          OS: os
        }
      },
      orderBy: {
        createdAt: 'asc'
      },
      select: {
        createdAt: true,
        isVPNSpoofed: true,
        isVirtualOS: true,
        isEmulator: true,
        isAppSpoofed: true,
        isAppPatched: true,
        isAppCloned: true
      }
    })

    res.status(200).json(deviceInfos)

    // res.status(200).json(events)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Really.!!!' })
  }
}
