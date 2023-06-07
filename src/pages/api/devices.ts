import { NextApiRequest, NextApiResponse } from 'next/types'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  function generateRandomDevicesArray(count: number) {
    const devices = []
    const startDate = new Date('January 1, 2021')
    const endDate = new Date('May 31, 2023')

    // Array of possible OS values
    const osOptions = ['iOS', 'Android', 'Windows']

    // Array of possible kernel values
    const kernelOptions = ['4.19', '5.4', '5.10', '3.0.1', '11.0.0', '12.0.0', '11.2.3']

    // Array of possible boolean values
    const booleanOptions = [true, false]

    // Array of possible device models
    const deviceModelOptions = [
      'iPhone 12',
      'Samsung Galaxy S21',
      'Google Pixel 5',
      'OnePlus 9 Pro',
      'Xiaomi Mi 11',
      'Sony Xperia 1 III',
      'LG Velvet',
      'Motorola Edge+',
      'Nokia 9 PureView',
      'Huawei P40 Pro',
      'Oppo Find X3 Pro',
      'Vivo X60 Pro+',
      'Realme GT',
      'Asus ROG Phone 5',
      'Lenovo Legion Phone Duel',
      'BlackBerry Key2',
      'HTC U12+',
      'ZTE Axon 30 Ultra',
      'Apple iPhone SE (2020)',
      'Samsung Galaxy Note 20 Ultra'
    ]

    for (let i = 0; i < count; i++) {
      const uid = `uid_${i}`
      const deviceId = `device_${i}`
      const os = osOptions[Math.floor(Math.random() * osOptions.length)]
      const kernel = kernelOptions[Math.floor(Math.random() * kernelOptions.length)]
      const isVPNSpoofed = booleanOptions[Math.floor(Math.random() * booleanOptions.length)]
      const isVirtualOS = booleanOptions[Math.floor(Math.random() * booleanOptions.length)]
      const isAPPSpoofed = booleanOptions[Math.floor(Math.random() * booleanOptions.length)]
      const deviceModel = deviceModelOptions[Math.floor(Math.random() * deviceModelOptions.length)]

      const timestamp = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()))

      const device = {
        uid,
        deviceId,
        os,
        kernel,
        isVPNSpoofed,
        isVirtualOS,
        isAPPSpoofed,
        deviceModel,
        timestamp
      }

      devices.push(device)
    }

    return devices
  }

  const randomDevicesArray = generateRandomDevicesArray(20)

  try {
    res.status(200).json(randomDevicesArray)
  } catch (err) {
    res.status(500).send(err)
  }
}
