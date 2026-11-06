import { Route, Routes } from "react-router";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HistoryPage from "./pages/HistoryPage";
import BookingPage from "./pages/BookingPage";
import { useEffect, useState } from "react";
import { getFields } from "./services/fieldService";

function App() {
  const [fields, setFields] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFieldsData = async () => {
    try {
      const fieldsData = await getFields();
      setFields(fieldsData);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fieldsData = async () => {
      await fetchFieldsData();
    };

    fieldsData();
  }, []);

  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Static Routes */}
        <Route
          path="/"
          element={
            <HomePage
              fields={fields}
              setFields={setFields}
              isLoading={isLoading}
              error={error}
              setError={setError}
              fetchFieldsData={fetchFieldsData}
            />
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/history" element={<HistoryPage />} />

        {/* Dynamic Routes */}
        <Route path="/booking" element={<BookingPage fields={fields} />} />
      </Route>
    </Routes>
  );
}

export default App;
