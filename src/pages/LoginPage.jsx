import { useContext, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router"
import { AuthContext } from "../context/AuthContext";

function LoginPage() {

    const [showPassword, setShowPassword] = useState(false)

    const [loggedInUser, setLoggedInUser] = useState({
        username: "",
        password: ""
    })

    const navigate = useNavigate()

    const [registeredUsers, setRegisteredUsers] = useState(JSON.parse(localStorage.getItem('users')) ?? [])
    const {setSuccessLoggedInUser} = useContext(AuthContext)

    const [error, setError] = useState(null)

    const handleLoginError = () => {
        const newErrors = {}

        if(loggedInUser.username.trim().length <= 0) {
            newErrors.username = "Username wajib diisi"
        }

        if(loggedInUser.password.trim().length <= 0) {
            newErrors.password = "Password wajib diisi"
        }

        // Check with the existing registered user
        if(loggedInUser.username.trim().length > 0 && loggedInUser.password.trim().length > 0) {

            if(registeredUsers.length <= 0) {
                newErrors.general = "Username atau password anda tidak sesuai";
            }
            let checkExistingUsername = registeredUsers.find(registered => registered.username === loggedInUser.username)
    
            if(checkExistingUsername === undefined) {
                checkExistingUsername = {}
            }

            if(checkExistingUsername && Object.keys(checkExistingUsername).length <= 0) {
                newErrors.general = "Username atau password anda tidak sesuai";
            }
    
            if(checkExistingUsername && loggedInUser.password !== checkExistingUsername.password) {
                newErrors.general = "Username atau password anda tidak sesuai";
            }
        }

        return newErrors
    }

    const handleLogin = (e) => {
        e.preventDefault()

        const errors = handleLoginError()
        if(errors && Object.keys(errors).length > 0) return setError(errors)

        const loggedInUserData = registeredUsers.find(user => user.username === loggedInUser.username)

        setSuccessLoggedInUser(loggedInUserData)
        localStorage.setItem('successLoggedInUser', JSON.stringify(loggedInUserData))
        navigate("/")

    }

    const handleChange = (e) => {
        const {name, value} = e.target

        setError({
            ...error,
            [name]: ""
        })
        setLoggedInUser({
            ...loggedInUser,
            [name]: value
        })
    }

    return (
      <div className="h-135 lg:h-150 flex items-center justify-center">
        <form
          onSubmit={handleLogin}
          className="dark:bg-white dark:text-black md:w-3/5 lg:w-3/7 xl:w-3/9 mx-auto shadow-xl border border-gray-300 rounded-lg p-5 box-border flex flex-col gap-y-5"
        >
          <div className="form-heading flex flex-col gap-y-3">
            <h3 className="font-semibold text-2xl">Masuk</h3>
            <p className="text-gray-400">
              Belum punya akun FIELDIFY?{" "}
              <Link className="font-semibold text-primary" to="/register">
                Daftar
              </Link>
            </p>
            {error && error.general && (
              <p className="animate-shake text-pink-500">{error.general}</p>
            )}
          </div>
          <div className="username-field-container flex flex-col gap-y-2">
            <label className="cursor-pointer" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={loggedInUser.username}
              onChange={handleChange}
              placeholder="Masukkan username"
              className="block w-full p-3 box-border rounded-lg border border-gray-300 focus:outline-primary transition duration-500 ease-in-out"
            />
            {error && error.username && (
              <p className="animate-shake text-pink-500">{error.username}</p>
            )}
          </div>
          <div className="password-field-container flex flex-col gap-y-2">
            <label className="cursor-pointer" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={loggedInUser.password}
                onChange={handleChange}
                placeholder="Masukkan password"
                className="block w-full p-3 box-border rounded-lg border border-gray-300 focus:outline-primary transition duration-500 ease-in-out"
              />
              {showPassword ? (
                <FaEye
                  className="absolute top-1/3 right-5 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              ) : (
                <FaEyeSlash
                  className="absolute top-1/3 right-5 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              )}
              {error && error.password && (
                <p className="animate-shake text-pink-500">{error.password}</p>
              )}
            </div>
          </div>
          <div className="button-container">
            <button
              type="submit"
              className="w-full bg-primary text-white font-semibold rounded-lg p-3 box-border hover:shadow-xl hover:bg-red-900 transition duration-500 ease-in-out cursor-pointer"
            >
              Masuk
            </button>
          </div>
        </form>
      </div>
    );
}

export default LoginPage