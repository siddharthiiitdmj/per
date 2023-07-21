// API to populate countryInfo in Stats table in DB according to the events

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

    //Manipulate data
    // Sort the countries by their values in descending order
    // const manipulatedData = manipulateCountryData(countriesCount)

    await prisma.Stats.deleteMany({
      where: {
        os: null
      }
    })

    await prisma.Stats.create({
      data: {
        countryInfo: countriesCount
      }
    })

    res.status(200).json({ message: 'CountryInfo data stored in db successfully', data: countriesCount })
  } catch (error) {
    console.error('Error while populating countryInfo:', error)
    res.status(500).json({ error: 'An error occurred while populating countryInfo.' })
  }
}

// function manipulateCountryData(countriesCount: { [key: string]: number }) {
//   const sortedCountries = Object.entries(countriesCount).sort((a, b) => b[1] - a[1])

//   const topCountries = sortedCountries.slice(0, 11)
//   const otherCountriesSum = sortedCountries.slice(11).reduce((sum, [, value]) => sum + value, 0)

//   const manipulatedData: any = {}

//   topCountries.forEach(([country, value]) => {
//     manipulatedData[country] = value
//   })

//   if (otherCountriesSum > 0) {
//     manipulatedData['others'] = otherCountriesSum
//   }
// }
