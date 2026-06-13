import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSession, signIn, signOut } from "next-auth/react"

type AuthButtonProps = {
  isMobile?: boolean
}

export default function AuthButton({ isMobile }: AuthButtonProps) {
  const { data: session, status: authStatus } = useSession()

  const buttonClassName = isMobile
    ? "w-full cursor-pointer bg-orange-600 text-white hover:bg-orange-700"
    : "cursor-pointer bg-orange-600 text-white hover:bg-orange-700"

  const loadingClassName = isMobile
    ? "w-full bg-gray-600 text-gray-400"
    : "bg-gray-600 text-gray-400"

  return authStatus === "loading" ? (
    <Button disabled className={loadingClassName}>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Loading...
    </Button>
  ) : session ? (
    <Button onClick={() => signOut()} className={loadingClassName}>
      Sign Out
    </Button>
  ) : (
    <Button onClick={() => signIn()} type="button" className={buttonClassName}>
      Sign In
    </Button>
  )
}
