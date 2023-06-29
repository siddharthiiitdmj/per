import prisma from "src/libs/prismadb";
import { NextApiRequest, NextApiResponse } from "next/types";
import { EventsType } from 'src/types/apps/eventTypes'
import { DeviceType } from "src/types/apps/deviceTypes";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {os} = req.query
    const filters: any = {}

    if (os && os !== '') {
      filters.OS = os
    }

    const events = await prisma.events.findMany({
      where: {
        device: {
          OS: os || undefined
        }
      },
      include: {
        device: { select: { OS: true } }
      }
    });

    const formattedEvents = events.map((event: EventsType & {device: DeviceType}) => ({
      ...event,
      OS: event.device?.OS
    }));

    res.status(200).json({allData: formattedEvents, total: formattedEvents.length});
  } catch (err) {
    res.status(500).send(err)
  }
};