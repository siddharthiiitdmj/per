import { NextApiRequest, NextApiResponse } from 'next/types'
import { getDateRange } from 'src/@core/utils/get-daterange'
import prisma from 'src/libs/prismadb'
import { DeviceType } from 'src/types/apps/deviceTypes'
import { EventsType } from 'src/types/apps/eventTypes'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const filters: any = {}

    const { id } = req.query

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
        userId: id
      },
      include: {
        device: true
      }
    })

    const formattedEvents = events.map((event: EventsType & { device: DeviceType }) => ({
      ...event,
      id: event.device?.id,
      OS: event.device?.OS,
      Kernel: event.device?.Kernel,
      devicemodel: event.device?.devicemodel,
      OS_version: event.device?.OS_version,
      Screen_resolution: event.device?.Screen_resolution
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
            filtered.push(event.id)
          }
        })

        if (filtered.length && filtered.includes(event.id)) {
          return (
            event.userId.toLowerCase().includes(queryLowered) ||
            event.deviceId.toLowerCase().includes(queryLowered) ||
            event.OS.toLowerCase().includes(queryLowered) ||
            event.nodename.toLowerCase().includes(queryLowered)
          )
        }
      } else {
        return (
          event.userId.toLowerCase().includes(queryLowered) ||
          event.deviceId.toLowerCase().includes(queryLowered) ||
          event.OS.toLowerCase().includes(queryLowered) ||
          event.nodename.toLowerCase().includes(queryLowered)
        )
      }
    })

    const uniqueDevices = Array.from(new Set(filteredData.map((event: EventsType) => event.deviceId))).map(deviceId => {
      const userEvent = filteredData.find((event: EventsType) => event.deviceId === deviceId)

      return {
        id: userEvent?.id,
        OS: userEvent?.OS,
        Kernel: userEvent?.Kernel,
        devicemodel: userEvent?.devicemodel,
        OS_version: userEvent?.OS_version,
        Screen_resolution: userEvent?.Screen_resolution
      }
    })

    res.status(200).json({ allData: uniqueDevices, total: uniqueDevices.length })
  } catch (err) {
    res.status(500).send(err)
  }
}
