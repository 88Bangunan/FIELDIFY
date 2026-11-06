import { useContext, useEffect, useState } from "react";
import { FaSearch, FaSpinner, FaStar } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";
import { Link } from "react-router";

function HomePage({fields, setFields, isLoading, error, setError, fetchFieldsData}) {

  const { theme } = useContext(ThemeContext);

  const [searchFieldText, setSearchFieldText] = useState("");
  const [sportType, setSportType] = useState("");
  const [filteredSportType, setFilteredSportType] = useState([]);


  const handleSearch = (e) => {
    e.preventDefault();

    if (searchFieldText.trim().length <= 0) return;

    if (Array.isArray(fields) && fields.length > 0) {
      const fieldsSearchData = fields.filter(
        (field) => field.name === searchFieldText,
      );

      if (fieldsSearchData.length <= 0) {
        const error = { message: "Lapangan tidak tersedia / tidak ditemukan" };
        return setError(error);
      }

      return setFields(fieldsSearchData);
    }
  };

  const handleChange = async (e) => {
    if (e.target.value.length === 0) {
      await fetchFieldsData();
    }

    setSearchFieldText(e.target.value);
  };

  const handleSportTypeChange = async (e) => {
    if (e.target.value === "none") {
        setFilteredSportType([])
        setError(null)
    }

    setSportType(e.target.value);
  };

  useEffect(() => {
    const filteringSportType = async () => {
      const fieldsSportTypeFiltering = fields.filter(
        (field) => field.sportType === sportType,
      );

      if (fieldsSportTypeFiltering.length <= 0) {
        const error = {
          message: "Lapangan tidak tersedia / tidak ditemukan",
        };
        return setError(error);
      }

      return setFilteredSportType(fieldsSportTypeFiltering);
    };

    if (sportType!=='none' && sportType.trim().length > 0) {
      filteringSportType();
    }
  }, [sportType]);

  if (filteredSportType.length > 0) {
    return (
      <div>
        <div className="online-field-booking-banner relative">
          <img
            src="/unsplash-booking-lapangan-online.jpg"
            className="w-full h-80 object-cover md:rounded-xl"
            alt=""
          />
          <div className="absolute left-0 right-0 top-0 bottom-0 bg-black/45 md:rounded-xl"></div>
          <div
            className={`online-field-booking-text absolute top-1/4 sm:top-1/3 sm:left-1/10 sm:right-1/10 md:left-1/15 md:right-1/15 bottom-1/3 text-center text-white space-y-5 animate-swipeUp`}
          >
            <h3 className="uppercase font-bold text-3xl text-shadow-lg">
              Sewa Lapangan Olahraga Online Terbaik
            </h3>
            <button className="bg-secondary text-white py-2 px-5 font-semibold rounded-xl cursor-pointer hover:bg-amber-500 hover:shadow-xl transition duration-500 ease-in-out">
              Daftarkan Venue
            </button>
          </div>
        </div>
        <div className="w-4/5 mx-auto py-10 border-b-2 border-gray-200 md:w-full">
          <form
            className="flex flex-col gap-y-3 md:flex-row md:items-center md:gap-x-5"
            onSubmit={handleSearch}
          >
            <div className="name-field-container relative text-gray-400 md:w-3/4 xl:w-7/8">
              <input
                type="text"
                placeholder="Cari nama lapangan"
                className={`border w-full border-gray-300 rounded-lg py-5 px-12 box-border ${theme === 'dark' ? "placeholder:text-white focus:outline-blue-500" : "placeholder:text-gray-400 focus:outline-primary"} transition duration-500 ease-in-out`}
                onChange={handleChange}
              />
              <FaSearch className="absolute top-1/3 left-1/20 sm:left-1/25 md:left-1/35 md:top-3/8 lg:left-1/50" />
            </div>
            <button
              type="submit"
              className="w-full bg-primary px-3 py-5 box-border text-white font-semibold rounded-xl hover:bg-red-900 transition duration-500 ease-in-out cursor-pointer hover:shadow-xl md:w-1/4 xl:w-1/8"
            >
              Cari Lapangan
            </button>
          </form>
        </div>
        <div
          className={`filtering-container w-4/5 mx-auto md:w-full py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-y-5 ${theme === "dark" ? "text-white" : "text-gray-500"}`}
        >
          <p>
            Menampilkan {filteredSportType.length} lapangan {sportType} tersedia
          </p>
          <div className="flex flex-col gap-y-5 lg:flex-row lg:items-center lg:gap-x-10">
            <form className="flex flex-col gap-y-3 md:flex-row md:items-center md:gap-x-3">
              <label htmlFor="sportType">
                Filter berdasarkan tipe olahraga
              </label>
              <select
                name="sportType"
                id="sportType"
                className="border-b border-gray-400 mt-2 md:mt-0 capitalize"
                onChange={handleSportTypeChange}
              >
                {[
                  "futsal",
                  "basketball",
                  "badminton",
                  "tennis",
                  "volleyball",
                  "swimming",
                ].map((type, index) => {
                  return (
                    <option key={index + 1} value={type}>
                      {type}
                    </option>
                  );
                })}
              </select>
            </form>
            <button
              className="bg-primary text-white font-semibold p-3 box-border rounded-lg cursor-pointer hover:bg-red-900 hover:shadow-xl transition duration-500 ease-in-out"
              onClick={() => {
                setFilteredSportType([]);
                setSportType("none");
              }}
            >
              Reset Filter
            </button>
          </div>
        </div>
        <div className="text-center flex items-center justify-center">
          {isLoading && (
            <FaSpinner className="animate-spin text-primary font-bold text-xl" />
          )}
          {error && (
            <div className="flex flex-col gap-y-2">
              <h3 className="text-4xl text-primary font-bold">Error</h3>
              <p className="text-gray-400 font-medium">{error.message}</p>
            </div>
          )}
        </div>

        <div className="w-4/5 mx-auto md:w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
          {Array.isArray(filteredSportType) &&
            filteredSportType.length > 0 &&
            filteredSportType.map((field) => {
              return (
                <div
                  key={field.id}
                  className={`${
                    theme === "dark"
                      ? "bg-white shadow-white shadow-lg p-5 box-border rounded-lg hover:shadow-xl transition duration-500 ease-in-out cursor-pointer flex flex-col justify-between h-55"
                      : "border border-gray-200 p-5 box-border rounded-lg hover:shadow-xl transition duration-500 ease-in-out cursor-pointer flex flex-col justify-between h-55"
                  }`}
                >
                  <div className="field-information flex flex-col gap-y-2">
                    <h3 className="text-xl font-bold">{field.name}</h3>
                    <div className="rating-location-container flex items-center gap-x-1 text-sm">
                      <div className="rating-container flex items-center gap-x-1">
                        <FaStar className="text-amber-400" />
                        <span>{field.rating}</span>
                      </div>
                      <span className="text-2xl">·</span>
                      <span className="text-gray-500 font-medium">
                        {field.location}
                      </span>
                    </div>
                    <span className="capitalize text-gray-500 text-sm">
                      {field.sportType}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-500 font-medium text-sm">
                      Mulai{" "}
                      <span className="text-primary font-bold text-xl px-1 box-border">
                        Rp{field.price.toLocaleString("id-ID")}
                      </span>
                      <span className="text-gray-400 text-sm">/sesi</span>
                    </p>
                    <Link to={`/booking?idField=${field.id}`}>
                      <button className="bg-primary text-white p-3 box-border rounded-lg font-semibold cursor-pointer hover:bg-red-900 hover:shadow-xl transition duration-500 ease-in-out">
                        Booking Sekarang
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div className="online-field-booking-banner relative">
          <img
            src="/unsplash-booking-lapangan-online.jpg"
            className="w-full h-80 object-cover md:rounded-xl"
            alt=""
          />
          <div className="absolute left-0 right-0 top-0 bottom-0 bg-black/45 md:rounded-xl"></div>
          <div
            className={`online-field-booking-text absolute top-1/4 sm:top-1/3 sm:left-1/10 sm:right-1/10 md:left-1/15 md:right-1/15 bottom-1/3 text-center text-white space-y-5 animate-swipeUp`}
          >
            <h3 className="uppercase font-bold text-3xl text-shadow-lg">
              Sewa Lapangan Olahraga Online Terbaik
            </h3>
            <button className="bg-secondary text-white py-2 px-5 font-semibold rounded-xl cursor-pointer hover:bg-amber-500 hover:shadow-xl transition duration-500 ease-in-out">
              Daftarkan Lapangan
            </button>
          </div>
        </div>
        <div className="w-4/5 mx-auto py-10 border-b-2 border-gray-200 md:w-full">
          <form
            className="flex flex-col gap-y-3 md:flex-row md:items-center md:gap-x-5"
            onSubmit={handleSearch}
          >
            <div
              className={`name-field-container relative text-gray-400 md:w-3/4 xl:w-7/8 ${theme === "dark" && "text-white"}`}
            >
              <input
                type="text"
                placeholder="Cari nama lapangan"
                className={`border w-full border-gray-300 rounded-lg py-5 px-12 box-border ${theme === "dark" ? "placeholder:text-white focus:outline-blue-500" : "placeholder:text-gray-500 focus:outline-primary"} transition duration-500 ease-in-out`}
                onChange={handleChange}
              />
              <FaSearch className="absolute top-1/3 left-1/20 sm:left-1/25 md:left-1/35 md:top-3/8 lg:left-1/50" />
            </div>
            <button
              type="submit"
              className="w-full bg-primary px-3 py-5 box-border text-white font-semibold rounded-xl hover:bg-red-900 transition duration-500 ease-in-out cursor-pointer hover:shadow-xl md:w-1/4 xl:w-1/8"
            >
              Cari Lapangan
            </button>
          </form>
        </div>
        <div
          className={`filtering-container w-4/5 mx-auto md:w-full py-10 flex flex-col md:flex-row md:justify-between md:items-center gap-y-5 ${theme === "dark" ? "text-white" : "text-gray-500"}`}
        >
          <p>Menampilkan {fields.length} lapangan tersedia</p>
          <form className="md:space-x-3">
            <label htmlFor="sportType">Filter berdasarkan tipe olahraga</label>
            <select
              name="sportType"
              id="sportType"
              className="border-b border-gray-400 mt-2 capitalize"
              onChange={handleSportTypeChange}
            >
              <option value="none">Tidak ada</option>
              {[
                "futsal",
                "basketball",
                "badminton",
                "tennis",
                "volleyball",
                "swimming",
              ].map((type, index) => {
                return (
                  <option key={index + 1} value={type}>
                    {type}
                  </option>
                );
              })}
            </select>
          </form>
        </div>
        <div className="text-center flex items-center justify-center">
          {isLoading && (
            <FaSpinner className="animate-spin text-primary font-bold text-xl" />
          )}
          {error && (
            <div className="flex flex-col gap-y-2">
              <h3 className="text-4xl text-primary font-bold">Error</h3>
              <p className="text-gray-400 font-medium">{error.message}</p>
            </div>
          )}
        </div>
        <div className="w-4/5 mx-auto md:w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
          {Array.isArray(fields) &&
            fields.length > 0 &&
            fields.map((field) => {
              return (
                <div
                  key={field.id}
                  className={`${
                    theme === "dark"
                      ? "bg-white shadow-white shadow-lg p-5 box-border rounded-lg hover:shadow-xl transition duration-500 ease-in-out cursor-pointer flex flex-col justify-between h-55"
                      : "border border-gray-200 p-5 box-border rounded-lg hover:shadow-xl transition duration-500 ease-in-out cursor-pointer flex flex-col justify-between h-55"
                  }`}
                >
                  <div className="field-information flex flex-col gap-y-2">
                    <h3 className="text-xl font-bold">{field.name}</h3>
                    <div className="rating-location-container flex items-center gap-x-1 text-sm">
                      <div className="rating-container flex items-center gap-x-1">
                        <FaStar className="text-amber-400" />
                        <span>{field.rating}</span>
                      </div>
                      <span className="text-2xl">·</span>
                      <span className="text-gray-500 font-medium">
                        {field.location}
                      </span>
                    </div>
                    <span className="capitalize text-gray-500 text-sm">
                      {field.sportType}
                    </span>
                  </div>
                  <div className="flex flex-col gap-y-2 mt-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-gray-500 font-medium text-sm">
                      Mulai{" "}
                      <span className="text-primary font-bold text-xl px-1 box-border">
                        Rp{field.price.toLocaleString("id-ID")}
                      </span>
                      <span className="text-gray-400 text-sm">/sesi</span>
                    </p>
                    <Link to={`/booking?idField=${field.id}`}>
                      <button className="bg-primary text-white text-sm p-3 box-border rounded-lg font-semibold cursor-pointer hover:bg-red-900 hover:shadow-xl transition duration-500 ease-in-out">
                        Booking Sekarang
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}

export default HomePage;
