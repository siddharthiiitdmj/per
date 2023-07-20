// API to get device data with OS and Date range filters and pagination

import prisma from 'src/libs/prismadb'
import { NextApiRequest, NextApiResponse } from 'next/types'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { os, startDate, endDate, page, rowsPerPage } = req.query

    // Define the filters based on the parameters received
    const filters: any = {}

    if (os && os !== 'All') {
      filters.OS = os
    }

    if (startDate && endDate) {
      const startDateValue = Array.isArray(startDate) ? startDate[0] : startDate
      const endDateValue = Array.isArray(endDate) ? endDate[0] : endDate

      filters.updatedAt = {
        gte: new Date(startDateValue),
        lte: new Date(endDateValue)
      }
    }

    // Calculate the number of rows to skip based on the current page and rows per page
    const currentPage = parseInt(page as string, 10) || 1
    const skipRows = (currentPage - 1) * (parseInt(rowsPerPage as string, 10) || 10)

    // Fetch devices from the database with the applied filters and pagination
    const [devices, totalCount] = await Promise.all([
      prisma.deviceInfo.findMany({
        where: filters,
        skip: skipRows,
        take: parseInt(rowsPerPage as string) || 10
      }),
      prisma.deviceInfo.count({
        where: filters
      })
    ])

    // Return the devices and total count as a JSON response
    res.status(200).json({ devices, totalCount })
  } catch (err) {
    // Handle any errors that occur during the process
    res.status(500).send(err)
  }
}
