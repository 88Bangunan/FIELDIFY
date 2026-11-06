import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router";

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState({})

  const navigate = useNavigate()

  const [registeredUsers, setRegisteredUser] = useState(JSON.parse(localStorage.getItem('users')) ?? [])

  const [user, setUser] = useState({
    id: crypto.randomUUID(),
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
    city: "",
    gender: "male",
  });

  const handleRegisterError = () => {
    const newErrors = {}

    const registeredUserName = registeredUsers.find(
      (register) => register.username === user.username,
    );

    if(user.username.trim().length <= 0) {
        newErrors.username = "Username wajib diisi"
    }

    if(registeredUserName && Object.keys(registeredUserName).length > 0) {
        newErrors.username =
          "Username telah terdaftar, masukkan username yang lain !";
    } 
    
    if(user.email.trim().length <= 0) {
        newErrors.email = "Email wajib diisi"
    }
    else if(!user.email.includes('@') || !user.email.includes('.') || user.email.indexOf('.') - user.email.indexOf('@') <= 1 || user.email.split("")[0] === '@' || user.email.split("")[0] === '.' || user.email.split("")[user.email.length - 1] === '@' || user.email.split("")[user.email.length-1] === '.') {
        newErrors.email = "Format email tidak valid"
    } 

    const registeredEmail = registeredUsers.find(register => register.email === user.email)

    if(registeredEmail && Object.keys(registeredEmail).length > 0) {
        newErrors.email = "Email telah terdaftar, masukkan email yang lain !"
    }

    const checkPassword = (password) => {
      let hasLower = false
      let hasUpper = false 
      let hasNumber = false  
      for(let i=0; i<password.length; i++) {
        const eachCharCode = password.charCodeAt(i)

        if(eachCharCode >= 97 && eachCharCode <= 122) {
          hasLower = true
        }
        if(eachCharCode >= 65 && eachCharCode <= 90) {
          hasUpper = true 
        }
        if(eachCharCode >= 48 && eachCharCode <= 57) {
          hasNumber = true
        }
      }
      return (hasLower && hasUpper && hasNumber)
    }
    if(user.password.trim().length <= 0) {
      newErrors.password = "Password wajib diisi"
    }
    if(!checkPassword(user.password.trim())) newErrors.password = "Format password wajib mengandung minimal 1 huruf kapital, 1 huruf kecil, dan 1 angka"

    if(user.confirmPassword.trim().length <= 0) {
        newErrors.confirmPassword = "Konfirmasi password wajib diisi"
    } else if(user.confirmPassword !== user.password) {
        newErrors.confirmPassword = "Konfirmasi password nilainya wajib sama dengan password"
    }

    const date = new Date()
    const year = date.getFullYear()

    const currentYear = `${year}`

    if (user.dob.trim().length <= 0) {
      newErrors.dob = "Tanggal Lahir wajib diisi";
    }
    else if(currentYear - user.dob.trim().split("-")[0] < 17) newErrors.dob = "Usia wajib di atas 17 tahun"

    if (user.city.trim().length <= 0) {
      newErrors.city = "Kota wajib diisi";
    }

    if (user.gender.trim().length <= 0) {
      newErrors.gender = "Jenis Kelamin wajib diisi";
    }
    
    return newErrors
  }

  const handleRegistrationForm = async (e) => {
    e.preventDefault();

    const errors = handleRegisterError()
    setError(errors)

    if(Object.keys(errors).length <= 0) {
        const registerUser = [
          ...registeredUsers,
          user
        ]
        setRegisteredUser(registerUser)

        localStorage.setItem('users', JSON.stringify(registerUser))
        navigate("/login")
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setError({
        ...error,
        [name]: ""
    })

    setUser({
        ...user,
        [name]: value
    })
  };

  return (
    <div className="flex md:h-145 items-center py-15 justify-center">
      <form
        onSubmit={handleRegistrationForm}
        className="dark:bg-white dark:shadow-white w-4/5 md:w-11/12 lg:w-3/4 xl:w-1/2 mx-auto shadow-xl border border-gray-300 rounded-lg p-8 box-border flex flex-col gap-y-5"
      >
        <div className="form-heading flex flex-col gap-y-3">
          <h3 className="font-semibold text-2xl">Daftar</h3>
          <p className="text-gray-400">
            Sudah punya akun FIELDIFY?{" "}
            <Link className="font-semibold text-primary" to="/login">
              Masuk
            </Link>
          </p>
        </div>
        <div className="flex flex-col gap-y-4 md:flex-row md:justify-between md:gap-x-10">
          <div className="md:w-1/2 flex flex-col gap-y-4">
            <div className="username-field-container flex flex-col gap-y-2">
              <label className="cursor-pointer" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                value={user.username}
                onChange={handleChange}
                placeholder="Masukkan username"
                className="block w-full p-3 box-border rounded-lg border border-gray-300 focus:outline-primary transition duration-500 ease-in-out"
              />
              {error.username && (
                <p className="text-pink-500 animate-shake">{error.username}</p>
              )}
            </div>
            <div className="email-field-container flex flex-col gap-y-2">
              <label className="cursor-pointer" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={user.email}
                onChange={handleChange}
                placeholder="Masukkan email"
                className="invalid:border-pink-500 invalid:text-pink-600 focus:border-primary focus:outline focus:outline-primary focus:invalid:border-pink-500 focus:invalid:outline-pink-500 block w-full p-3 box-border rounded-lg border border-gray-300 disabled:border-gray-300 transition duration-500 ease-in-out peer"
              />
              <span className="hidden peer-invalid:block peer-invalid:text-pink-500 peer-invalid:font-semibold peer-invalid:animate-shake">
                Format email tidak valid
              </span>
              {error.email && (
                <p className="text-pink-500 animate-shake">{error.email}</p>
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
                  placeholder="Masukkan password"
                  value={user.password}
                  onChange={handleChange}
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
                {error.password && (
                  <p className="text-pink-500 animate-shake">
                    {error.password}
                  </p>
                )}
              </div>
            </div>
            <div className="confirm-password-field-container flex flex-col gap-y-2">
              <label className="cursor-pointer" htmlFor="password">
                Konfirmasi Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="Masukkan password"
                  value={user.confirmPassword}
                  onChange={handleChange}
                  className="block w-full p-3 box-border rounded-lg border border-gray-300 focus:outline-primary transition duration-500 ease-in-out"
                />
                {showConfirmPassword ? (
                  <FaEye
                    className="absolute top-1/3 right-5 cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                ) : (
                  <FaEyeSlash
                    className="absolute top-1/3 right-5 cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                )}
                {error.confirmPassword && (
                  <p className="text-pink-500 animate-shake">
                    {error.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="md:w-1/2 flex flex-col gap-y-4">
            <div className="dob-field-container flex flex-col gap-y-2">
              <label className="cursor-pointer" htmlFor="dob">
                Tanggal Lahir
              </label>
              <input
                type="date"
                name="dob"
                id="dob"
                value={user.dob}
                placeholder="Masukkan tanggal lahir"
                onChange={handleChange}
                className="block w-full p-3 box-border rounded-lg border border-gray-300 focus:outline-primary transition duration-500 ease-in-out"
              />
              {error.dob && (
                <p className="text-pink-500 animate-shake">{error.dob}</p>
              )}
            </div>
            <div className="city-field-container flex flex-col gap-y-2">
              <label className="cursor-pointer" htmlFor="city">
                Kota
              </label>
              <input
                type="text"
                name="city"
                id="city"
                value={user.city}
                onChange={handleChange}
                placeholder="Masukkan kota"
                className="block w-full p-3 box-border rounded-lg border border-gray-300 focus:outline-primary transition duration-500 ease-in-out"
              />
              {error.city && (
                <p className="text-pink-500 animate-shake">{error.city}</p>
              )}
            </div>
            <div className="gender-field-container flex flex-col gap-y-2">
              <label className="cursor-pointer" htmlFor="gender">
                Jenis Kelamin
              </label>
              <div className="flex items-center gap-x-3">
                <div className="male-container flex items-center gap-x-2">
                  <input
                    type="radio"
                    name="gender"
                    id="male"
                    value="male"
                    onChange={handleChange}
                    defaultChecked
                  />
                  <label className="cursor-pointer" htmlFor="male">
                    Laki-Laki
                  </label>
                </div>
                <div className="female-container flex items-center gap-x-2">
                  <input
                    type="radio"
                    name="gender"
                    id="female"
                    value="female"
                    onChange={handleChange}
                  />
                  <label className="cursor-pointer" htmlFor="female">
                    Perempuan
                  </label>
                </div>
              </div>
              {error.gender && (
                <p className="text-pink-500 animate-shake">
                  {error.gender}
                </p>
              )}
            </div>
            <div className="button-container">
              <button
                type="submit"
                className="w-full bg-primary text-white font-semibold rounded-lg p-3 box-border hover:shadow-xl hover:bg-red-900 transition duration-500 ease-in-out cursor-pointer"
              >
                Daftar
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;
