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
import { Chapter9Page } from "@/pages/chapter-9"
import { Chapter10Page } from "@/pages/chapter-10"
import { Chapter11Page } from "@/pages/chapter-11"
import { Chapter12Page } from "@/pages/chapter-12"
import { Chapter13Page } from "@/pages/chapter-13"
import { Chapter14Page } from "@/pages/chapter-14"

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
                <Route path="/chapter/9" element={<Chapter9Page />} />
                <Route path="/chapter/10" element={<Chapter10Page />} />
                <Route path="/chapter/11" element={<Chapter11Page />} />
                <Route path="/chapter/12" element={<Chapter12Page />} />
                <Route path="/chapter/13" element={<Chapter13Page />} />
                <Route path="/chapter/14" element={<Chapter14Page />} />
            </Routes>
        </>
    )
}

export function App() {
    return <Layout />
}

export default App
