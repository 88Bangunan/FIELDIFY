import { Link, NavLink } from "react-router"
import {BsBrightnessHighFill} from "react-icons/bs";
import { RxHamburgerMenu } from "react-icons/rx";
import { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { MdBrightness2 } from "react-icons/md";
import { AuthContext } from "../context/AuthContext";
import { BookingContext } from "../context/BookingContext";

export const Navbar = () => {

    const [responsiveNav, setResponsiveNav] = useState(false)

    const {theme, setTheme} = useContext(ThemeContext)
    const {setBookingLists} = useContext(BookingContext)

    const {successLoggedInUser, setSuccessLoggedInUser} = useContext(AuthContext)

    return (
      <div className="navbar-container bg-white fixed left-0 right-0 top-0 z-10 shadow-xl">
        <div className="navbar-container-inner px-5 py-3 box-border md:w-7/8 mx-auto flex justify-between items-center">
          <div className="navbar-container-left">
            <Link to="/">
              <span className="uppercase text-primary font-bold text-3xl">
                Fieldify
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-x-5 md:hidden">
            {theme === "light" ? (
              <BsBrightnessHighFill
                className="text-xl cursor-pointer"
                onClick={() => setTheme("dark")}
              />
            ) : (
              <MdBrightness2
                className="text-xl cursor-pointer"
                onClick={() => setTheme("light")}
              />
            )}
            <RxHamburgerMenu
              className="rounded-lg text-3xl"
              onClick={() => setResponsiveNav(!responsiveNav)}
            />
          </div>
          <div className="navbar-container-right hidden md:block">
            <nav>
              <ul className="flex items-center gap-x-10">
                <li>
                  <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                      isActive
                        ? "font-bold underline underline-offset-2"
                        : "text-gray-500 font-medium"
                    }
                  >
                    Beranda
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/history"
                    end
                    className={({ isActive }) =>
                      isActive
                        ? "font-bold underline underline-offset-2"
                        : "text-gray-500 font-medium"
                    }
                  >
                    Riwayat
                  </NavLink>
                </li>
                <li>
                  {successLoggedInUser &&
                  Object.keys(successLoggedInUser).length > 0 ? (
                    <Link to="/login">
                      <button
                        className="bg-primary text-white px-5 py-3 font-semibold box-border rounded-lg cursor-pointer hover:bg-red-900 transition duration-500 ease-in-out hover:shadow-xl"
                        onClick={() => {
                          localStorage.removeItem("successLoggedInUser");
                          setSuccessLoggedInUser({});
                        }}
                      >
                        Logout
                      </button>
                    </Link>
                  ) : (
                    <Link to="/login">
                      <button className="bg-primary text-white px-5 py-3 font-semibold box-border rounded-lg cursor-pointer hover:bg-red-900 transition duration-500 ease-in-out hover:shadow-xl">
                        Login
                      </button>
                    </Link>
                  )}
                </li>
                <li>
                  {theme === "light" ? (
                    <BsBrightnessHighFill
                      className="text-xl cursor-pointer"
                      onClick={() => setTheme("dark")}
                    />
                  ) : (
                    <MdBrightness2
                      className="text-xl cursor-pointer"
                      onClick={() => setTheme("light")}
                    />
                  )}
                </li>
              </ul>
            </nav>
          </div>
        </div>
        {responsiveNav && (
          <div
            className={`${responsiveNav ? `transform: translateY(0%) animate-swipeDown` : `transform: translateY(25%) animate-swipeUp`} shadow-xl`}
          >
            <hr className="border border-gray-200" />
            <nav className="px-5 box-border">
              <ul className="flex flex-col gap-y-5 py-5">
                <li>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      isActive
                        ? "font-bold underline underline-offset-2"
                        : "text-gray-500 font-medium"
                    }
                  >
                    Beranda
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      isActive
                        ? "font-bold underline underline-offset-2"
                        : "text-gray-500 font-medium"
                    }
                    to="/history"
                  >
                    Riwayat
                  </NavLink>
                </li>
                <li>
                  {Object.keys(successLoggedInUser).length > 0 ? (
                    <Link to="/login">
                      <button
                        className="bg-primary text-white w-full px-5 py-3 font-semibold box-border rounded-lg cursor-pointer hover:bg-red-900 transition duration-500 ease-in-out hover:shadow-xl"
                        onClick={() => {
                          localStorage.removeItem("successLoggedInUser");
                          setSuccessLoggedInUser({})
                        }}
                      >
                        Logout
                      </button>
                    </Link>
                  ) : (
                    <Link to="/login">
                      <button
                        className="bg-primary text-white w-full px-5 py-3 font-semibold box-border rounded-lg cursor-pointer hover:bg-red-900 transition duration-500 ease-in-out hover:shadow-xl"
                      >
                        Login
                      </button>
                    </Link>
                  )}
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    );
}