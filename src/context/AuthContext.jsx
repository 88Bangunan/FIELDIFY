import { createContext, useState } from "react";

export const AuthProvider = ({children}) => {

    const [successLoggedInUser, setSuccessLoggedInUser] = useState(JSON.parse(localStorage.getItem('successLoggedInUser')) ?? {})
    
    return (
        <AuthContext value={{successLoggedInUser, setSuccessLoggedInUser}}>
            {children}
        </AuthContext>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null)