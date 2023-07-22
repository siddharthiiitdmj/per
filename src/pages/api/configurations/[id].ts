import { NextApiRequest, NextApiResponse } from 'next/types';
import prisma from 'src/libs/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = parseInt(req.query.id as string, 10);

  if (req.method === 'DELETE') {
    try {
      // Delete the configuration field with the given ID
      await prisma.configuration.delete({
        where: { id },
      });
      res.status(200).json({ message: 'Configuration field deleted successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting configuration field.' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed.' });
  }
}
