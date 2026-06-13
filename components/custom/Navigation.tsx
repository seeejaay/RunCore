"use client"

import Link from "next/link"
import Image from "next/image"
import { Menu } from "lucide-react"
import AuthButton from "./AuthButton"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import runcore_logo from "@/public/assets/runcore_logo.svg"
import { NavigationLinks } from "@/constants/Navigation"
import MobileNavigation from "@/components/custom/MobileNavigation"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false)
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <>
      <nav className="flex items-center justify-around py-4 text-foreground">
        <div className="text-3xl font-bold">
          <Link href="/" className="flex items-center">
            <Image
              src={runcore_logo}
              alt="RunCore Logo"
              width={360}
              height={180}
              priority
              className="h-14 w-auto md:h-16"
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden items-center gap-6 md:flex">
          <ul className="flex gap-4">
            {NavigationLinks.map((link) => (
              <li key={link.id}>
                <Link
                  href={link.href}
                  className="font-medium transition-colors duration-200 hover:text-gray-700"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Login / Logout Button */}
          <AuthButton />
        </div>
        <button
          type="button"
          className="relative z-50 inline-flex h-14 w-14 touch-manipulation items-center justify-center rounded-lg active:scale-95 md:hidden"
          onClick={() => setIsOpen((open) => !open)}
        >
          {/* Add pointer-events-none here! */}
          <Menu className="pointer-events-none h-8 w-8" />
        </button>
      </nav>
      <MobileNavigation isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  )
}
