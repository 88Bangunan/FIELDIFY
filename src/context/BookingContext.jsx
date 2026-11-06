import { createContext, useState } from "react";

export const BookingProvider = ({children}) => {

    const [bookingLists, setBookingLists] = useState(JSON.parse(localStorage.getItem('bookingLists')) ?? [])
    
    return (
        <BookingContext value={{bookingLists, setBookingLists}}>
            {children}
        </BookingContext>
    )
}


// eslint-disable-next-line react-refresh/only-export-components
export const BookingContext = createContext(null)