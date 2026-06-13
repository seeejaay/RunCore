import Link from "next/link"
import { X } from "lucide-react"
import { NavigationLinks } from "@/constants/Navigation"
import AuthButton from "@/components/custom/AuthButton"
type MobileNavigationProps = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function MobileNavigation({
  isOpen,
  setIsOpen,
}: MobileNavigationProps) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-transform duration-300 ease-in-out ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={`fixed top-0 right-0 z-50 h-screen w-72 bg-gray-800 py-4 text-white shadow-xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-b-gray-700">
          <div className="flex w-full items-center justify-between px-4 py-4">
            <Link href="/" className="text-lg font-bold">
              Run Core
            </Link>

            <button onClick={() => setIsOpen(false)}>
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <nav className="flex flex-col gap-4 px-4">
          <div className="mt-4">
            <AuthButton isMobile />
          </div>
          {NavigationLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className="block rounded-lg px-4 py-2 text-sm hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  )
}
