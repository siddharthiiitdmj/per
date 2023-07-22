import { NextApiRequest, NextApiResponse } from 'next/types';
import prisma from 'src/libs/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const risk = await prisma.risk.findUnique({ where: { id: 1 } });
    res.status(200).json(risk);
  } else if (req.method === 'PUT') {
    const { threshold } = req.body;
    const updatedRisk = await prisma.risk.update({ where: { id: 1 }, data: { threshold } });
    res.status(200).json(updatedRisk);
  } else {
    res.status(405).json({ message: 'Method not allowed.' });
  }
}
