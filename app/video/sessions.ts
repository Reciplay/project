import type { NextApiRequest, NextApiResponse } from "next"

const OPENVIDU_URL = process.env.OPENVIDU_URL || 'https://YOUR_SERVER_IP:4443'
const OPENVIDU_SECRET = process.env.OPENVIDU_SECRET || 'MY_SECRET'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { customSessionId } = req.body

  const response = 
}