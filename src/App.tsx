import { Route, Routes } from "react-router"
import { HomePage } from "@/pages/home-page"
import { Chapter0Page } from "@/pages/chapter-0"
import { Chapter1Page } from "@/pages/chapter-1"
import { Chapter2Page } from "@/pages/chapter-2"
import { Chapter3Page } from "@/pages/chapter-3"
import { Chapter4Page } from "@/pages/chapter-4"
import { Chapter5Page } from "@/pages/chapter-5"
import { Chapter6Page } from "@/pages/chapter-6"
import { Chapter7Page } from "@/pages/chapter-7"
import { Chapter8Page } from "@/pages/chapter-8"

function Layout() {
    return (
        <>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/chapter/0" element={<Chapter0Page />} />
                <Route path="/chapter/1" element={<Chapter1Page />} />
                <Route path="/chapter/2" element={<Chapter2Page />} />
                <Route path="/chapter/3" element={<Chapter3Page />} />
                <Route path="/chapter/4" element={<Chapter4Page />} />
                <Route path="/chapter/5" element={<Chapter5Page />} />
                <Route path="/chapter/6" element={<Chapter6Page />} />
                <Route path="/chapter/7" element={<Chapter7Page />} />
                <Route path="/chapter/8" element={<Chapter8Page />} />
            </Routes>
        </>
    )
}

export function App() {
    return <Layout />
}

export default App
