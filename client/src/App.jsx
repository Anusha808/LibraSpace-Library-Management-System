import { BrowserRouter, Routes, Route } from "react-router-dom";

// ================= PUBLIC PAGES =================

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

// ================= STUDENT PAGES =================

import StudentDashboard from "./pages/StudentDashboard";
import SeatReservation from "./pages/SeatReservation";
import MyReservations from "./pages/MyReservations";
import Membership from "./pages/Membership";
import RenewMembership from "./pages/RenewMembership";
import Profile from "./pages/Profile";
import PaymentHistory from "./pages/PaymentHistory";

// ================= ADMIN PAGES =================

import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import AdminBooks from "./admin/AdminBooks";
import AdminSeats from "./admin/AdminSeats";
import AdminReservations from "./admin/AdminReservations";
import AdminMembers from "./admin/AdminMembers";
import AdminMemberships from "./admin/AdminMemberships";
import AdminPayments from "./admin/AdminPayments";
import AdminReports from "./admin/AdminReports";
import AdminSettings from "./admin/AdminSettings";



function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* =====================================================
                    PUBLIC PAGES
                ===================================================== */}

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />


                {/* =====================================================
                    STUDENT PAGES
                ===================================================== */}

                <Route
                    path="/dashboard"
                    element={<StudentDashboard />}
                />

                <Route
                    path="/seats"
                    element={<SeatReservation />}
                />

                <Route
                    path="/reservations"
                    element={<MyReservations />}
                />

                <Route
                    path="/membership"
                    element={<Membership />}
                />

                <Route
                    path="/renew-membership"
                    element={<RenewMembership />}
                />

                <Route
                    path="/profile"
                    element={<Profile />}
                />

                <Route
                    path="/payment-history"
                    element={<PaymentHistory />}
                />


                {/* =====================================================
                    ADMIN PAGES
                ===================================================== */}

                {/* Admin Login */}

                <Route
                    path="/admin/login"
                    element={<AdminLogin />}
                />


                {/* Admin Dashboard */}

                <Route
                    path="/admin/dashboard"
                    element={<AdminDashboard />}
                />


                {/* Manage Books */}

                <Route
                    path="/admin/books"
                    element={<AdminBooks />}
                />


                {/* Manage Seats */}

                <Route
                    path="/admin/seats"
                    element={<AdminSeats />}
                />


                {/* Manage Reservations */}

                <Route
                    path="/admin/reservations"
                    element={<AdminReservations />}
                />


                {/* Manage Members */}

                <Route
                    path="/admin/members"
                    element={<AdminMembers />}
                />


                {/* Manage Memberships */}

                <Route
                    path="/admin/memberships"
                    element={<AdminMemberships />}
                />
                <Route path="/admin/payments" element={<AdminPayments />} />

                <Route
    path="/admin/reports"
    element={<AdminReports />}
/>

<Route
    path="/admin/settings"
    element={<AdminSettings />}
/>
            </Routes>

        </BrowserRouter>
    );
}


export default App;