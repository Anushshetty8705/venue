'use client'

import React, { useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const Stairs = ({ children }) => {
  const pathname = usePathname()
  const pageRef = useRef(null)
  const parentstaticRef = useRef(null)

  useGSAP(() => {
    const t1 = gsap.timeline()

    t1.set(parentstaticRef.current, {
      display: 'block',
    })

    t1.from('.stair', {
      height: 100,
      stagger: {
        amount: -0.3,
      },
    })

    t1.to('.stair', {
      y: '100%',
      stagger: {
        amount: -0.3,
      },
    })

    t1.set(parentstaticRef.current, {
      display: 'none',
    })

    t1.to('.stair', {
      y: '0%',
    })

    gsap.from(pageRef.current, {
      opacity: 0,
      delay: 1.2,
      scale: 1.2,
    })
  }, [pathname]) // Run on every path change

  return (
    <div>
      <div ref={parentstaticRef} className="fixed h-screen w-full z-20 pointer-events-none">
        <div className="flex h-full w-full">
          <div className="stair w-1/5 h-full bg-black"></div>
          <div className="stair w-1/5 h-full bg-black"></div>
          <div className="stair w-1/5 h-full bg-black"></div>
          <div className="stair w-1/5 h-full bg-black"></div>
          <div className="stair w-1/5 h-full bg-black"></div>
        </div>
      </div>
      <div ref={pageRef}>{children}</div>
    </div>
  )
}

export default Stairs
