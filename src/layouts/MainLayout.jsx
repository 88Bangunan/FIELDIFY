import { Outlet } from "react-router"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { useContext } from "react"
import { ThemeContext } from "../context/ThemeContext"

function MainLayout() {

    const {theme} = useContext(ThemeContext)

    return (
      <>
        {/* Header - Navbar */}
        <header>
          <Navbar />
        </header>

        {/* Content */}
        <div
          className={`${theme === "dark" && "bg-black"} md:px-25 md:box-border pt-10 md:pt-25`}
        >
          <Outlet />
        </div>

        {/* Footer */}
        <footer
          className={`
            ${theme === "dark" ? "bg-black text-white" : "bg-white"}
        `}
        >
          <Footer />
        </footer>
      </>
    );
}

export default MainLayout