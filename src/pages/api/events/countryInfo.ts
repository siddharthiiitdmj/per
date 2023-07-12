import prisma from 'src/libs/prismadb'
import { NextApiRequest, NextApiResponse } from 'next/types'
import axios from 'axios'

const ipInfoToken = '6a1d530855c5ad'
const batchSize = 10 // Number of IP addresses to include in each batch
const requestDelay = 1000 // Delay between batches in milliseconds

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const events = await prisma.events.findMany({
      select: {
        IPaddress: true
      }
    })

    const totalEvents = events.length

    const countriesCount: { [key: string]: number } = {}
    const batches: string[][] = []

    // Create batches of IP addresses
    for (let i = 0; i < totalEvents; i += batchSize) {
      const batch = events.slice(i, i + batchSize).map((event: any) => event.IPaddress)
      batches.push(batch)
    }

    // Process each batch
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i]
      const promises = batch.map(IPaddress => axios.get(`https://ipinfo.io/${IPaddress}?token=${ipInfoToken}`))
      const responses = await Promise.all(promises)

      for (let j = 0; j < responses.length; j++) {
        const response = responses[j]
        const data = response.data
        const country = data.country
        countriesCount[country] = (countriesCount[country] || 0) + 1
      }

      // Delay before processing the next batch
      if (i < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, requestDelay))
      }
    }

    res.status(200).json(countriesCount)
  } catch (error) {
    console.error('Error retrieving events:', error)
    res.status(500).json({ error: 'An error occurred while retrieving events.' })
  }
}
