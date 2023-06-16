import prisma from 'src/libs/prismadb'
import { NextApiRequest, NextApiResponse } from 'next/types'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { os, startDate, endDate } = req.query

    // Define the filters based on the parameters received
    const filters: any = {}

    if (os && os !== 'All') {
      filters.OS = os
    }

    if (startDate && endDate) {
      const startDateValue = Array.isArray(startDate) ? startDate[0] : startDate;
      const endDateValue = Array.isArray(endDate) ? endDate[0] : endDate;
      
      filters.updatedAt = {
        gte: new Date(startDateValue),
        lte: new Date(endDateValue)
      }
    }

    // Fetch devices from the database with the applied filters
    const devices = await prisma.deviceInfo.findMany({
      where: filters
    })

    // Return the devices as a JSON response
    res.status(200).json(devices)
  } catch (err) {
    // Handle any errors that occur during the process
    res.status(500).send(err)
  }
}
