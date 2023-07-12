import { NextApiRequest, NextApiResponse } from 'next/types'
import { getDateRange } from 'src/@core/utils/get-daterange'
import prisma from 'src/libs/prismadb'
import { DeviceType } from 'src/types/apps/deviceTypes'
import { EventsType } from 'src/types/apps/eventTypes'

interface UserType {
  name: string
  email: string
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const filters: any = {}

    const { id } = req.query
    const parsedId = parseInt(id as string)

    const { OS = '', q = '' } = req.query ?? ''

    const dates = req.query['dates[]']

    const queryLowered = (q as any).toLowerCase()

    if (OS && OS !== '') {
      filters.OS = OS
    }

    const events = await prisma.events.findMany({
      where: {
        device: {
          OS: OS || undefined
        },
        deviceId: parsedId
      },
      include: {
        device: { select: { OS: true } },
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    const formattedEvents = events.map((event: EventsType & { device: DeviceType } & { user: UserType }) => ({
      ...event,
      OS: event.device?.OS,
      username: event.user?.name,
      email: event.user?.email
    }))

    const filteredData = formattedEvents.filter((event: EventsType) => {
      if (dates?.length) {
        const [start, end] = dates
        const startDate = new Date(start)
        const endDate = new Date(end)
        const filtered: string[] = []
        const range = getDateRange(startDate, endDate)
        const eventDate = new Date(event.updatedAt)

        range.filter(date => {
          const rangeDate = new Date(date)
          if (
            eventDate.getFullYear() === rangeDate.getFullYear() &&
            eventDate.getDate() === rangeDate.getDate() &&
            eventDate.getMonth() === rangeDate.getMonth()
          ) {
            filtered.push(event.id.toString())
          }
        })

        if (filtered.length && filtered.includes(event.id.toString())) {
          return (
            event.userId.toString().toLowerCase().includes(queryLowered) ||
            event.deviceId.toString().toLowerCase().includes(queryLowered) ||
            event.OS.toLowerCase().includes(queryLowered) ||
            event.nodename.toLowerCase().includes(queryLowered)
          )
        }
      } else {
        return (
          event.userId.toString().toLowerCase().includes(queryLowered) ||
          event.deviceId.toString().toLowerCase().includes(queryLowered) ||
          event.OS.toLowerCase().includes(queryLowered) ||
          event.nodename.toLowerCase().includes(queryLowered)
        )
      }
    })

    const uniqueUsers = Array.from(new Set(filteredData.map((event: EventsType) => event.userId))).map(userId => {
      const userEvent = filteredData.find((event: EventsType) => event.userId === userId);
      
      return {
        id: userId,
        username: userEvent.username,
        email: userEvent.email
      };
    });

    res.status(200).json({ allData: uniqueUsers, total: uniqueUsers.length })
  } catch (err) {
    res.status(500).send(err)
  }
}
