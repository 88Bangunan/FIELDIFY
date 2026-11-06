import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { BookingContext } from "../context/BookingContext"
import { Link } from "react-router"
import { AiFillHourglass } from "react-icons/ai";
import { FaMapPin } from "react-icons/fa";
import { FaRegCalendarDays } from "react-icons/fa6";
import { CgNotes } from "react-icons/cg";
import { ThemeContext } from "../context/ThemeContext";

function HistoryPage() {
    const {successLoggedInUser} = useContext(AuthContext)
    const {bookingLists} = useContext(BookingContext)
    const {theme} = useContext(ThemeContext)

    const [usersBooking, setUsersBooking] = useState([])
    const [statusBookingFiltering, setStatusBookingFiltering] = useState("Semua")

    useEffect(() => {
        const checkExistingBookingOwnership = bookingLists.filter(booking => booking.idUser === successLoggedInUser.id)
        if(checkExistingBookingOwnership.length <= 0) {
            const returnInitialUsersBooking = () => {
                setUsersBooking([])
                return
            }

            returnInitialUsersBooking()
        }
        
        const date = new Date()
        const year = date.getFullYear()
        const month = String(date.getMonth()+1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")

        const currentDate = `${year}-${month}-${day}`

        const hours = String(date.getHours()).padStart(2, "0")
        const minutes = String(date.getMinutes()).padStart(2, "0")
        const currentTime = `${hours}.${minutes}`

        checkExistingBookingOwnership.map(booking => {
            if((booking.date === currentDate && booking.timeSlot < currentTime) || (booking.date < currentDate)) {
                return booking.status = "Selesai"
            }
            
            return booking.status = "Aktif"
        })

        const returnUsersBooking = () => {
            setUsersBooking(checkExistingBookingOwnership)
        }

        const returnUsersFilteredBooking = (status) => {
            setUsersBooking(checkExistingBookingOwnership.filter(booking => booking.status === status))
        }

        if(statusBookingFiltering === "Semua") {
            returnUsersBooking()
        }
        else if(["Aktif", "Selesai"].includes(statusBookingFiltering)) {
            returnUsersFilteredBooking(statusBookingFiltering)
        }

    }, [successLoggedInUser, statusBookingFiltering])


    return (
      <div className="history-container pt-15 px-5 lg:w-3/4 lg:mx-auto xl:w-full box-border">
        <div className={theme === "dark" && "text-white"}>
          <div className="history-heading flex flex-col gap-y-2">
            <h1 className="text-3xl font-semibold text-shadow-2xs">
              Riwayat Booking Anda
            </h1>
            <h3 className="flex items-center gap-x-1">
              Total Booking:{" "}
              {usersBooking.length > 0 ? (
                <>
                  {usersBooking.length}
                  {statusBookingFiltering !== "Semua" && (
                    <>
                      {" "}
                      Berstatus{" "}
                      <span
                        className={`${statusBookingFiltering === "Aktif" ? "text-amber-600" : "text-green-500"} font-semibold`}
                      >
                        {statusBookingFiltering}
                      </span>
                    </>
                  )}
                </>
              ) : (
                <>
                  {usersBooking.length}
                  <Link
                    to="/"
                    className="underline underline-offset-6 text-primary"
                  >
                    Booking Sekarang
                  </Link>
                </>
              )}
            </h3>
            <div className="status-booking-filtering-container flex flex-col gap-y-2">
              <label htmlFor="status" className="capitalize">
                Filter berdasarkan status booking
              </label>
              <select
                name="status"
                id="status"
                className={`${theme === "dark" ? "focus:outline-blue-50" : "focus:outline-primary"} border border-gray-300 rounded-lg p-3 box-border`}
                onChange={(e) => setStatusBookingFiltering(e.target.value)}
              >
                {["Semua", "Aktif", "Selesai"].map((status, index) => {
                  return (
                    <div key={index + 1}>
                      <option value={status}>{status}</option>
                    </div>
                  );
                })}
              </select>
            </div>
          </div>
        </div>
        <div className="booking-history-lists-container py-5">
          {usersBooking.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {usersBooking.map((booking) => {
                return (
                  <div
                    key={booking.id}
                    className="dark:bg-white border border-gray-300 rounded-lg shadow-xl p-5 box-border flex flex-col gap-y-3"
                  >
                    <div className="card-history-heading flex flex-col gap-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-2xl">
                          {booking.fieldName}
                        </h3>
                        <span
                          className={`${booking.status === "Aktif" ? "text-amber-600" : "text-green-600"} font-semibold`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <span className="flex items-center gap-x-2 text-gray-500">
                        <FaMapPin className="text-primary text-lg" />
                        {booking.fieldLocation}
                      </span>
                    </div>
                    <div className="card-history-datetime flex flex-col gap-y-1">
                      <span className="text-md font-semibold flex items-center gap-x-2">
                        <FaRegCalendarDays className="text-xl" />
                        <span>Tanggal & Waktu Booking:</span>
                      </span>
                      {booking.date} • {booking.timeSlot}
                    </div>
                    <div className="card-history-bottom flex flex-col gap-y-1">
                      <span className="text-xl text-primary font-semibold">
                        Rp{booking.totalAmount.toLocaleString("id-ID")}
                      </span>
                      <div className="notes-container">
                        <span className="text-md font-semibold flex items-center gap-x-2">
                          <CgNotes />
                          Catatan:
                        </span>
                        <span>{booking.notes}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={`flex flex-col gap-y-3 items-center justify-center h-60 md:h-80 ${theme === 'dark' && "text-white"}`}>
              <AiFillHourglass className="text-amber-600 animate-shake text-5xl font-semibold" />
              <div className="flex flex-col items-center gap-y-2">
                <h3>Belum ada data booking yang tersedia</h3>
                <Link to="/">
                  <button className="bg-primary rounded-lg p-3 box-border text-white font-semibold cursor-pointer hover:shadow-xl hover:bg-red-900 transition duration-500 ease-in-out">
                    Booking Sekarang
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    );
}

export default HistoryPage