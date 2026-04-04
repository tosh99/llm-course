import { Link, useLocation } from "react-router"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
    title: string
    count?: number
}

const navLinks = [{ to: "/", label: "Home" }]

export function PageHeader({ title, count }: PageHeaderProps) {
    const { pathname } = useLocation()

    return (
        <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-8">
                <div className="flex items-center gap-3">
                    <div className="flex h-2 w-2 rounded-full bg-primary" />
                    <h1 className="text-base font-semibold">{title}</h1>
                    {count !== undefined && (
                        <span className="rounded-md border px-2 py-0.5 font-mono text-xs">
                            {count}
                        </span>
                    )}
                </div>
                <nav className="hidden items-center gap-4 sm:flex">
                    {navLinks.map(({ to, label }) => (
                        <Link
                            key={to}
                            to={to}
                            className={cn(
                                "text-sm transition-colors",
                                pathname === to
                                    ? "font-medium text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    )
}
