// pages/api/configurations.ts

import { NextApiRequest, NextApiResponse } from 'next/types'
import prisma from 'src/libs/prismadb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const configurations = await prisma.configuration.findMany()
    res.status(200).json(configurations)
  } else if (req.method === 'PUT') {
    const configurations = req.body
    for (const config of configurations) {
      await prisma.configuration.update({
        where: { id: config.id },
        data: { value: config.value, isSwitchedOn: config.isSwitchedOn }
      })
    }
    res.status(200).json({ message: 'Configurations updated successfully.' })
  } else if (req.method === 'POST') {
    const { field, value, isSwitchedOn } = req.body
    const newConfiguration = await prisma.configuration.create({
      data: {
        field,
        value,
        isSwitchedOn
      }
    })
    res.status(201).json(newConfiguration)
  } else {
    res.status(405).json({ message: 'Method not allowed.' })
  }
}
