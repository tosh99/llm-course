import { Route, Routes, useLocation } from "react-router"
import { HomePage } from "@/pages/home-page"
import { Chapter0Page } from "@/pages/chapter-0"
import { Chapter1Page } from "@/pages/chapter-1"
import { Chapter2Page } from "@/pages/chapter-2"
import { BottomNav } from "@/components/bottom-nav"

function Layout() {
    const { pathname } = useLocation()
    const fullscreen = pathname.startsWith("/chapter/")

    return (
        <>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/chapter/0" element={<Chapter0Page />} />
                <Route path="/chapter/1" element={<Chapter1Page />} />
                <Route path="/chapter/2" element={<Chapter2Page />} />
            </Routes>
            {!fullscreen && <BottomNav />}
        </>
    )
}

export function App() {
    return <Layout />
}

export default App
