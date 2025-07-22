'use client'

import { useEffect, useRef, useState } from "react"
import { OpenVidu } from "openvidu-browser"
import { getToken } from "next-auth/jwt"

export default function VideoPage() {
  const [session, setSession] = useState(null)
  const [publisher, setPublisher] = useState<import("openvidu-browser").Publisher | null>(null)
  const [subscribers, setSubscribers] = useState<any[]>([])
  const OV = useRef<OpenVidu | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    OV.current = new OpenVidu
    const mySession = OV.current.initSession()

    mySession.on('streamCreated', ({ stream }) => {
      const subscriber = mySession.subscribe(stream, undefined)
      setSubscribers((prev) => [...prev, subscriber])
    })

    getToken().then((token) => {
      mySession.connect(token).then(() => {
        const myPublisher = OV.current!.initPublisher(undefined, {
          audioSource: undefined,
          videoSource: undefined,
          publishAudio: true,
          publishVideo: true,
          resolution: '640x480',
          frameRate: 30,
          insertMode: 'APPEND',
          mirror: false,
        })

        mySession.publish(myPublisher)
        setPublisher(myPublisher)
      })

      setSession(mySession)

      return () => {
        mySession.disconnect()
      }
    })
  })

  return (
    <div>
      <div id="video-container"></div>
    </div>
  )
}

async function getToken(): Promise<string> {
  const sessionId = await createSession('MySession');
  return await createToken(sessionId);
}

async function createSession(sessionName: string): Promise<string> {
  return Promise.resolve('dummy-session-id');
}

async function createToken(sessionId: string): Promise<string> {
  return Promise.resolve('dummy-token');
}