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
        deviceId: id
      },
      include: {
        device: { select: { OS: true } }
      },
      orderBy: {
        createdAt: 'desc'
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

    const activityTimeline = getTimeline(filteredData)

    return res
      .status(200)
      .json({ allData: filteredData, activityTimeline: activityTimeline, total: filteredData.length })
  } catch (err) {
    res.status(500).send(err)
  }
}

function getTimeline(events: any) {
  const activityTimeline = []

  // Keep track of the previous event
  let previousEvent = null

  for (const event of events) {
    // Check if any of the boolean fields changed from false to true
    const titles = []
    const subTitles = []

    if (previousEvent) {
      if (!previousEvent.isVPNSpoofed && event.isVPNSpoofed) {
        titles.push('VPN Spoofed')
        subTitles.push('VPN Spoofing detected')
      }
      if (!previousEvent.isVirtualOS && event.isVirtualOS) {
        titles.push('Virtual OS detected')
        subTitles.push('The device started using Virtual OS')
      }
      if (!previousEvent.isEmulator && event.isEmulator) {
        titles.push('Emulator detected')
        subTitles.push('The device started using Emulator')
      }
      if (!previousEvent.isAppSpoofed && event.isAppSpoofed) {
        titles.push('App Spoofed')
        subTitles.push('App Spoofing detected')
      }
      if (!previousEvent.isAppPatched && event.isAppPatched) {
        titles.push('App Patched')
        subTitles.push('App Patching detected')
      }
      if (!previousEvent.isAppCloned && event.isAppCloned) {
        titles.push('App Cloned')
        subTitles.push('App Cloning detected on the device')
      }

      // if (previousEvent.IPaddress !== event.IPaddress) {
      //   titles.push('New coordinates detected')
      // }

      // // Check for new user associated with the device
      // if (previousEvent.userId !== event.userId) {
      //   titles.push('New User detected')
      // }
    }

    // Add the titles and date to the timeline
    if (titles.length > 0) {
      activityTimeline.push({
        titles,
        subTitles,
        date: formatDate(event.createdAt)
      })
    }

    // Update the previousEvent for the next iteration
    previousEvent = event
  }

  activityTimeline.push({
    titles: ['Device added'],
    subTitles: ['New Device was added'],
    date: formatDate(events[events.length - 1].createdAt)
  })

  return activityTimeline
}

function formatDate(dateString: any) {
  const date = new Date(dateString)
  const month = date.toLocaleString('en-US', { month: 'long' })
  const day = date.toLocaleString('en-US', { day: 'numeric' })

  return `${month}, ${day}`
}
