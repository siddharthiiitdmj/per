import { NextApiRequest, NextApiResponse } from 'next/types'
import { getDateRange } from 'src/@core/utils/get-daterange'
import prisma from 'src/libs/prismadb'
import { DeviceType } from 'src/types/apps/deviceTypes'
import { EventsType } from 'src/types/apps/eventTypes'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const filters: any = {}

    const { OS = '', q = ''} = req.query ?? ''
    
    const dates = req.query['dates[]'];

    const queryLowered = (q as any).toLowerCase()

    if (OS && OS !== '') {
      filters.OS = OS
    }

    const events = await prisma.events.findMany({
      where: {
        device: {
          OS: OS || undefined
        }
      },
      include: {
        device: { select: { OS: true } }
      }
    })

    const formattedEvents = events.map((event: EventsType & { device: DeviceType }) => ({
      ...event,
      OS: event.device?.OS
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

    res.status(200).json({ allData: filteredData, total: filteredData.length })
  } catch (err) {
    res.status(500).send(err)
  }
}
