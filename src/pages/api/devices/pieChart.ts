// import prisma from 'src/libs/prismadb'
import { NextApiRequest, NextApiResponse } from 'next/types'

// interface Device {
//   isVPNSpoofed: number;
//   isVirtualOS: number;
//   isEmulator: number;
//   isAppSpoofed: number;
//   isAppPatched: number;
//   isAppCloned: number;
// }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { os } = req.query
    console.log('os: ', !os);


    // const filters: any = {}

    // if (os && os !== 'All') {
    //   filters.OS = os
    // }

    // // Fetch devices from the database with the applied filters
    // const devices = await prisma.deviceInfo.findMany({
    //   where: filters
    // })

    // const result: Record<string, Device> = {
    //   '1': initializeDevice(),
    //   '7': initializeDevice(),
    //   '30': initializeDevice()
    // }

    // const currentDate = new Date()

    // devices.forEach((device: any) => {
    //   const deviceDate = new Date(device.updatedAt)

    //   if (isWithinTimeRange(deviceDate, currentDate, 1)) {
    //     incrementDeviceCount(result['1'], device)
    //   }
    //   if (isWithinTimeRange(deviceDate, currentDate, 7)) {
    //     incrementDeviceCount(result['7'], device)
    //   }
    //   if (isWithinTimeRange(deviceDate, currentDate, 30)) {
    //     incrementDeviceCount(result['30'], device)
    //   }
    // })

    res.status(200).json('result')
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// function initializeDevice(): Device {
//   return {
//     isVPNSpoofed: 0,
//     isVirtualOS: 0,
//     isEmulator: 0,
//     isAppSpoofed: 0,
//     isAppPatched: 0,
//     isAppCloned: 0
//   }
// }

// function isWithinTimeRange(date: Date, currentDate: Date, days: number): boolean {
//   const timeDiff = currentDate.getTime() - date.getTime()
//   const millisecondsPerDay = 24 * 60 * 60 * 1000
//   const daysDiff = Math.floor(timeDiff / millisecondsPerDay)

//   return daysDiff <= days
// }

// function incrementDeviceCount(device: Device, incrementBy: Device): void {
//   device.isVPNSpoofed += incrementBy.isVPNSpoofed
//   device.isVirtualOS += incrementBy.isVirtualOS
//   device.isEmulator += incrementBy.isEmulator
//   device.isAppSpoofed += incrementBy.isAppSpoofed
//   device.isAppPatched += incrementBy.isAppPatched
//   device.isAppCloned += incrementBy.isAppCloned
// }
