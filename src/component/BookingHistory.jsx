import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import auth from "../../firebase.config";
import Sidebar from "./Sidebar";

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]); // Store booking history
  const [userEmail, setUserEmail] = useState(null); // Track logged-in user's email
  const navigate = useNavigate();

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        // If not logged in, redirect to login page
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Fetch booking history
  useEffect(() => {
    if (userEmail) {
      fetch("https://book-a-bunk-server-kappa.vercel.app/bookings")
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          
          // Filter data for the logged-in user
          const userBookings = data.filter(
            (booking) => booking.userEmail === userEmail
          );
          setBookings(userBookings);
        })
        .catch((error) => console.error("Error fetching bookings:", error));
    }
  }, [userEmail]);

  return (
    <div className="max-w-4xl mx-auto p-8">
        <Sidebar></Sidebar>
      <h2 className="text-3xl font-bold text-center mb-6">Booking History</h2>
      {bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.roomId}
              className="bg-white shadow-md rounded-lg p-6 border border-gray-200"
            >
              <h3 className="text-xl font-semibold">Room {booking.
roomId}</h3>
              <p className="text-gray-700">Booking Date: {booking.date}</p>
              <p
                className={`text-sm mt-2 ${
                  booking.status === "Confirmed"
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No booking history available.</p>
      )}
    </div>
  );
};

export default BookingHistory;
