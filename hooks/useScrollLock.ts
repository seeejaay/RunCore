import { useEffect } from "react"

type Opts = { iosFix?: boolean }

export default function useScrollLock(
  locked: boolean,
  { iosFix = true }: Opts = {}
) {
  useEffect(() => {
    if (typeof window === "undefined") return

    const doc = document.documentElement
    const body = document.body

    if (!locked) return

    if (!iosFix) {
      const prevBodyOverflow = body.style.overflow
      const prevDocOverflow = doc.style.overflow
      body.style.overflow = "hidden"
      doc.style.overflow = "hidden"
      return () => {
        body.style.overflow = prevBodyOverflow
        doc.style.overflow = prevDocOverflow
      }
    }

    const scrollY = window.scrollY || window.pageYOffset || 0
    body.dataset.rcScrollY = String(scrollY)
    body.classList.add("rc-scroll-lock")
    doc.classList.add("rc-scroll-lock")

    return () => {
      const prevY = parseInt(body.dataset.rcScrollY || "0", 10)
      body.classList.remove("rc-scroll-lock")
      doc.classList.remove("rc-scroll-lock")
      delete body.dataset.rcScrollY
      window.scrollTo(0, prevY)
    }
  }, [locked, iosFix])
}
