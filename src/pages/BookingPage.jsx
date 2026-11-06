import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useSearchParams } from "react-router";
import { FaMapPin, FaStar } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { BookingContext } from "../context/BookingContext";
import { GrStatusGood } from "react-icons/gr";

const fieldLists = [
  "Lapangan 1",
  "Lapangan 2",
  "Lapangan 3",
  "Lapangan 4",
  "Lapangan 5",
];

const initialTimeSlots = [
  "08.00 - 09.00",
  "09.00 - 10.00",
  "10.00 - 11.00",
  "11.00 - 12.00",
  "13.00 - 14.00",
  "14.00 - 15.00",
  "15.00 - 16.00",
  "16.00 - 17.00",
  "17.00 - 18.00",
  "18.00 - 19.00",
  "19.00 - 20.00",
  "20.00 - 21.00",
];

function BookingPage({ fields }) {
  const { successLoggedInUser } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const idField = searchParams.get("idField");

  const [availableTimeSlots, setAvailableTimeSlots] =
    useState(initialTimeSlots);
  const selectedField = fields.find((field) => field.id === idField);
  const [bookingForm, setBookingForm] = useState({
    id: crypto.randomUUID(),
    idField: searchParams?.get("idField") || "",
    fieldName: selectedField?.name || "",
    fieldLocation: selectedField?.location || "",
    idUser: successLoggedInUser?.id || "",
    fieldNumber: "",
    date: "",
    timeSlot: "",
    notes: "-",
    totalAmount: selectedField?.price || 0,
    status: "Aktif"
  });
  const { bookingLists, setBookingLists } = useContext(BookingContext);

  const navigate = useNavigate();

  const [confirmationScreen, setConfirmationScreen] = useState(false);
  const [successScreen, setSuccessScreen] = useState(false);

  const [error, setError] = useState({});

  useEffect(() => {
    if (successLoggedInUser && Object.keys(successLoggedInUser).length <= 0) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if (!bookingForm.fieldNumber || !bookingForm.date) {
      const returnInitialTimeSlots = () => {
        setAvailableTimeSlots(initialTimeSlots);
      };
      returnInitialTimeSlots();
      return;
    }

    if (bookingForm.fieldNumber && bookingForm.date) {
      const checkExistingBooking = bookingLists.filter(
        (booking) =>
          booking.idField === bookingForm.idField &&
          booking.fieldNumber === bookingForm.fieldNumber &&
          booking.date === bookingForm.date,
      );
      const filteredTimeSlots = availableTimeSlots.filter((time) => {
        return !checkExistingBooking.some(
          (booking) => booking.timeSlot === time,
        );
      });

      const updateInitialTimeSlots = () => {
        setAvailableTimeSlots(filteredTimeSlots);
      };

      updateInitialTimeSlots();
    }
  }, [
    bookingForm.fieldNumber,
    bookingForm.date,
    bookingForm.idField,
    bookingLists,
  ]);

  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const now = `${year}-${month}-${day}`;
  const timeNow = `${hours}.${minutes}`;

  const validTimeSlots = availableTimeSlots.filter((time) => time > timeNow);

  const validate = () => {
    const newErrors = {};

    if (!bookingForm.idField) newErrors.idField = "Id field tidak boleh kosong";

    if (!bookingForm.idUser) newErrors.idUser = "Id user tidak boleh kosong";

    if (!bookingForm.fieldNumber)
      newErrors.fieldNumber =
        "Nomor Lapangan tidak boleh kosong / wajib dipilih";

    if (!bookingForm.date) newErrors.date = "Jadwal booking wajib diisi";
    else if (bookingForm.date < now)
      newErrors.date = "Jadwal booking yang dipilih tidak valid";

    if (!bookingForm.timeSlot) newErrors.timeSlot = "Slot waktu wajib dipilih";

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setBookingForm({
      ...bookingForm,
      [name]: value,
    });

    setError({
      ...error,
      [name]: "",
    });
  };

  const handleBooking = (e) => {
    e.preventDefault();

    const error = validate();

    if (Object.keys(error).length > 0) return setError(error);

    setConfirmationScreen(true);
  };

  if (idField) {
    const selectedField = fields.find((field) => field.id === idField);

    if (Object.keys(selectedField).length > 0) {
      return (
        <>
          <div className="pt-15 px-5 box-border md:flex md:justify-between md:px-0 md:gap-x-7 lg:w-7/8 xl:w-2/3 lg:mx-auto">
            <div className="preview-selected-field-container flex flex-col gap-y-2 md:w-1/3">
              <h3 className="text-2xl font-semibold">{selectedField.name}</h3>
              <div className="flex items-center gap-x-2">
                <span className="field-rating flex items-center gap-x-1">
                  <FaStar className="text-amber-500" />
                  {selectedField.rating}
                </span>
                <span className="font-bold text-xl">·</span>
                <span className="field-location text-black">
                  {selectedField.location}
                </span>
              </div>
              <span className="capitalize">{selectedField.sportType}</span>
              <span className="text-2xl font-semibold text-primary">
                Rp{selectedField.price.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="booking-form-container py-5 box-border md:w-2/3 lg:w-1/2 md:py-0">
              <form
                onSubmit={handleBooking}
                className="p-5 box-border border border-gray-400 rounded-lg"
              >
                <h3 className="font-bold text-xl">Form Booking</h3>
                <div className="flex flex-col gap-y-4 mt-5">
                  <div className="fieldLists-field-container flex flex-col gap-y-2">
                    <label htmlFor="fieldNumber">Pilih Lapangan</label>
                    <select
                      name="fieldNumber"
                      id="fieldNumber"
                      value={bookingForm.fieldNumber}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-lg p-2 box-border w-full focus:outline-primary"
                    >
                      <option value="">--- Pilih Lapangan ---</option>
                      {fieldLists.map((field, index) => {
                        return (
                          <div key={index + 1}>
                            <option value={field}>{field}</option>
                          </div>
                        );
                      })}
                    </select>
                    {error.fieldNumber && (
                      <p className="animate-shake text-pink-600 font-semibold mt-2">
                        {error.fieldNumber}
                      </p>
                    )}
                  </div>
                  <div className="booking-date-field-container flex flex-col gap-y-2">
                    <label htmlFor="date">Pilih Jadwal</label>
                    <input
                      type="date"
                      name="date"
                      id="date"
                      value={bookingForm.date}
                      onChange={handleChange}
                      className="block w-full border border-gray-300 rounded-lg focus:outline-primary p-2 box-border"
                    />
                    {error.date && (
                      <p className="animate-shake text-pink-600 font-semibold mt-2">
                        {error.date}
                      </p>
                    )}
                  </div>
                  <div className="booking-timeSlot-field-container flex flex-col gap-y-2">
                    <label htmlFor="timeSlot">Pilih Slot Waktu</label>
                    <select
                      name="timeSlot"
                      id="timeSlot"
                      value={bookingForm.timeSlot}
                      onChange={handleChange}
                      className="block w-full border border-gray-300 rounded-lg focus:outline-primary p-2 box-border"
                    >
                      <option value="">--- Pilih Slot Waktu ---</option>
                      {bookingForm.date === now
                        ? validTimeSlots.map((time, index) => {
                            return (
                              <div key={index + 1}>
                                <option value={time}>{time}</option>
                              </div>
                            );
                          })
                        : availableTimeSlots.map((time, index) => {
                            return (
                              <div key={index + 1}>
                                <option value={time}>{time}</option>
                              </div>
                            );
                          })}
                    </select>
                    {error.timeSlot && (
                      <p className="animate-shake text-pink-600 font-semibold mt-2">
                        {error.timeSlot}
                      </p>
                    )}
                  </div>
                  <div className="booking-notes-field-container flex flex-col gap-y-2">
                    <label htmlFor="notes">Catatan</label>
                    <textarea
                      name="notes"
                      id="notes"
                      value={bookingForm.notes}
                      onChange={handleChange}
                      className="w-full block border border-gray-300 rounded-lg p-3 box-border"
                      rows={4}
                    ></textarea>
                  </div>
                  <div className="booking-totalAmount-field-container flex items-center justify-between">
                    <span className="text-lg font-semibold">Total Harga:</span>
                    <span className="text-xl text-primary font-bold">
                      Rp{selectedField.price.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="button-container">
                    <button
                      type="submit"
                      className="w-full bg-primary text-white font-semibold rounded-lg p-3 box-border cursor-pointer hover:shadow-xl hover:bg-red-900 transition duration-500 ease-in-out"
                    >
                      Pesan Sekarang
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {confirmationScreen && (
            <div className="fixed left-0 right-0 top-0 bottom-0 bg-black/50">
              <div className="absolute left-1/18 top-1/5 w-9/10 bg-white rounded-lg shadow-xl z-10 p-6 box-border">
                <div className="flex justify-end">
                  <IoMdClose
                    className="text-2xl font-semibold"
                    onClick={() => setConfirmationScreen(false)}
                  />
                </div>
                <div className="flex flex-col gap-y-2">
                  <h4 className="text-xl font-semibold">
                    {selectedField.name}
                  </h4>
                  <span className="flex items-center gap-x-2 text-gray-500">
                    <FaMapPin className="text-primary" />
                    {selectedField.location}
                  </span>
                  <span className="text-lg">{bookingForm.fieldNumber}</span>
                  <div className="booking-information-container flex flex-col gap-y-2">
                    <div className="booking-date-container flex flex-col gap-y-1">
                      <h5 className="font-semibold">Tanggal Booking</h5>
                      <span className="text-lg">{bookingForm.date}</span>
                    </div>
                    <div className="booking-timeSlot-container flex flex-col gap-y-1">
                      <h5 className="font-semibold">Waktu Booking</h5>
                      <span className="text-lg">{bookingForm.timeSlot}</span>
                    </div>
                    <div className="booking-notes-container flex flex-col gap-y-1">
                      <h5 className="font-semibold">Catatan</h5>
                      <span className="text-lg">
                        {bookingForm.notes.length > 0 ? bookingForm.notes : '-'}
                      </span>
                    </div>
                  </div>
                  <div className="button-container">
                    <button
                      className="w-full text-white font-semibold bg-primary p-4 box-border rounded-lg cursor-pointer hover:shadow-xl hover:bg-red-900 transition duration-500 ease-in-out"
                      onClick={() => {
                        const updatedBookingLists = [
                          ...bookingLists,
                          bookingForm,
                        ];
                        setBookingLists(updatedBookingLists);
                        setConfirmationScreen(false);
                        localStorage.setItem(
                          "bookingLists",
                          JSON.stringify(updatedBookingLists),
                        );
                        setSuccessScreen(true);
                      }}
                    >
                      Saya telah konfirmasi pesanan ini
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {successScreen && (
            <div className="fixed left-0 right-0 top-0 bottom-0 bg-black/50">
              <div className="absolute left-1/18 top-1/5 w-9/10 md:w-1/2 md:left-1/4 lg:w-1/3 lg:left-1/3 xl:w-1/4 xl:left-3/8 bg-white rounded-lg shadow-xl z-10 py-6 px-3 box-border">
                <div className="flex flex-col gap-y-5">
                  <div className="flex justify-center">
                    <GrStatusGood className="text-green-500 text-6xl" />
                  </div>
                  <div className="button-container flex items-center gap-x-3">
                    <button
                      className="w-3/4 text-white font-semibold bg-primary p-3 text-sm box-border rounded-lg cursor-pointer hover:shadow-xl hover:bg-red-900 transition duration-500 ease-in-out"
                      onClick={() => {
                        setSuccessScreen(false);
                        navigate("/history");
                      }}
                    >
                      Lihat Riwayat Booking
                    </button>
                    <button
                      className="w-1/2 text-primary font-semibold bg-transparent py-3 text-sm box-border border border-primary rounded-lg cursor-pointer hover:shadow-xl hover:bg-primary hover:text-white transition duration-500 ease-in-out"
                      onClick={() => {
                        setSuccessScreen(false);
                        navigate("/");
                      }}
                    >
                      Booking Lagi
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      );
    }
  }
}

export default BookingPage;
