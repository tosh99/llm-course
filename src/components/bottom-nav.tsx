import { Link, useLocation } from "react-router"
import { cn } from "@/lib/utils"

function HomeIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
        </svg>
    )
}

const navItems = [{ to: "/", label: "Home", Icon: HomeIcon }]

export function BottomNav() {
    const { pathname } = useLocation()

    return (
        <nav className="fixed right-0 bottom-0 left-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:hidden">
            <div className="flex h-16 items-stretch">
                {navItems.map(({ to, label, Icon }) => {
                    const isActive = pathname === to
                    return (
                        <Link
                            key={to}
                            to={to}
                            className={cn(
                                "flex flex-1 flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            <span>{label}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
