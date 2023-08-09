import prisma from 'src/libs/prismadb'
import { NextApiRequest, NextApiResponse } from 'next/types'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { os, startDate, endDate, page } = req.query
    const rowsPerPage = 10

    // Define the filters based on the parameters received
    const filters: any = {}

    if (os && os !== 'All') {
      filters.device = {
        OS: os || undefined
      }
    }

    if (startDate && endDate) {
      const startDateValue = Array.isArray(startDate) ? startDate[0] : startDate
      const endDateValue = Array.isArray(endDate) ? endDate[0] : endDate

      filters.createdAt = {
        gte: new Date(startDateValue),
        lte: new Date(endDateValue)
      }
    }

    // Calculate the number of rows to skip based on the current page and rows per page
    const currentPage = parseInt(page as string, 10) || 1
    const skipRows = (currentPage - 1) * rowsPerPage

    // Fetch events from the database with the applied filters and pagination
    const [events, totalCount] = await Promise.all([
      prisma.events.findMany({
        where: filters,
        skip: skipRows,
        take: rowsPerPage,
        include: {
          device: {
            select: {
              OS: true
            }
          }
        }
      }),
      prisma.events.count({
        where: filters
      })
    ])

    // const events = event.map((event: EventsType & { device: DeviceType }) => ({
    //   ...event,
    //   OS: event.device?.OS
    // }))

    // Return the events and total count as a JSON response
    res.status(200).json({ events, totalCount })
  } catch (err) {
    // Handle any errors that occur during the process
    res.status(500).send(err)
  }
}
