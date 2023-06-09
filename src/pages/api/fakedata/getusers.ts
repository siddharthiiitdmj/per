import prisma from 'src/libs/prismadb'
import { NextApiRequest, NextApiResponse } from 'next/types'
import { omit } from 'lodash'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'POST') {
      const { email, imgSrc } = req.body

      // Find the user with the provided email
      const user = await prisma.user.findUnique({
        where: { email }
      })

      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      // Update the image field of the user
      const updatedUser = await prisma.user.update({
        where: { email },
        data: { image: imgSrc }
      })

      //exclude password field from the response for security purposes
      const userWithoutPassword = omit(updatedUser, 'hashedPassword')

      return res.status(200).json(userWithoutPassword)
    }

    if (req.method === 'GET') {
      const users = await prisma.user.findMany()

      return res.status(200).json(users)
    }
  } catch (err) {
    console.error(err)

    return res.status(500).json({ message: 'Server error' })
  }
}
