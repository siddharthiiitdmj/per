// pages/api/events.ts

import prisma from 'src/libs/prismadb'
import { NextApiRequest, NextApiResponse } from 'next/types'
import axios from 'axios'

const ipinfoToken = '6a1d530855c5ad'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const events = await prisma.events.findMany({
      select: {
        IPaddress: true
      }
    })

    const countriesCount: { [key: string]: number } = {}

    for (let i = 0; i < 5; i++) {
      const { IPaddress } = events[i]
      const response = await axios.get(`https://ipinfo.io/${IPaddress}?token=${ipinfoToken}`)
      const data = response.data

      const country = data.country

      // Increment the count of IP addresses for the country
      countriesCount[country] = (countriesCount[country] || 0) + 1
    }

    res.status(200).json(countriesCount)
  } catch (error) {
    console.error('Error retrieving events:', error)
    res.status(500).json({ error: 'An error occurred while retrieving events.' })
  }
}
