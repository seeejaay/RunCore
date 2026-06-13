"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NavigationLinks } from "@/constants/Navigation"
import MobileNavigation from "@/components/custom/MobileNavigation"
import AuthButton from "./AuthButton"

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
      <nav className="flex items-center justify-between bg-gray-800 p-4 text-white">
        <div className="text-lg font-bold">
          <Link href="/">Run Core</Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden items-center gap-6 md:flex">
          <ul className="flex gap-4">
            {NavigationLinks.map((link) => (
              <li key={link.id}>
                <Link href={link.href} className="hover:text-gray-300">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Login / Logout Button */}
          <AuthButton />
        </div>
        <Button
          variant="ghost"
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu className="h-6 w-6 cursor-pointer md:hidden" />
        </Button>
      </nav>
      <MobileNavigation isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  )
}
