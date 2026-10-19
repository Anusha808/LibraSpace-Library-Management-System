import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./SeatReservation.css";

const API_BASE_URL = "http://localhost:5000";

// Read the logged-in user's information from localStorage.
const getLoggedInUser = () => {
    const possibleKeys = ["currentUser", "user", "profile"];

    for (const key of possibleKeys) {
        try {
            const storedUser = localStorage.getItem(key);

            if (storedUser) {
                const parsed = JSON.parse(storedUser);

                if (parsed && typeof parsed === "object") {
                    return parsed.user ?? parsed;
                }
            }
        } catch {
            // The value may be stored as plain text instead of JSON.
            const storedValue = localStorage.getItem(key);

            if (storedValue) {
                return { name: storedValue };
            }
        }
    }

    // Fallback for applications that store each value separately.
    const individualUser = {
        name:
            localStorage.getItem("name") ||
            localStorage.getItem("fullName") ||
            localStorage.getItem("username") ||
            localStorage.getItem("userName") ||
            "",
        email: localStorage.getItem("email") || "",
        role: localStorage.getItem("role") || ""
    };

    // Try reading user details from the JWT if available.
    const token = localStorage.getItem("token");

    if (token) {
        try {
            const payload = token.split(".")[1];
            const normalized = payload
                .replace(/-/g, "+")
                .replace(/_/g, "/");

            const claims = JSON.parse(
                atob(normalized)
            );

            return {
                ...claims,
                ...individualUser,
                name:
                    individualUser.name ||
                    claims.name ||
                    claims.fullName ||
                    claims.username ||
                    claims.preferred_username ||
                    "",
                email:
                    individualUser.email ||
                    claims.email ||
                    "",
                role:
                    individualUser.role ||
                    claims.role ||
                    claims.authorities ||
                    ""
            };
        } catch {
            // Continue with the available localStorage values.
        }
    }

    return individualUser;
};

function SeatReservation() {
    const navigate = useNavigate();

    const [selectedSeat, setSelectedSeat] = useState(null);

    const [date, setDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const [startTime, setStartTime] = useState("10:00");
    const [duration, setDuration] = useState("3");

    const [myReservations, setMyReservations] = useState([]);
    const [loadingReservations, setLoadingReservations] = useState(true);
    const [processing, setProcessing] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [membership, setMembership] = useState(null);
    const [membershipActive, setMembershipActive] = useState(false);
    const [membershipLoading, setMembershipLoading] = useState(true);
    const [membershipError, setMembershipError] = useState("");

    // Dynamic logged-in user information.
    const [loggedInUser, setLoggedInUser] = useState(
        () => getLoggedInUser()
    );

    useEffect(() => {
        const updateUser = () => {
            setLoggedInUser(getLoggedInUser());
        };

        updateUser();

        window.addEventListener("focus", updateUser);

        return () => {
            window.removeEventListener("focus", updateUser);
        };
    }, []);

    const userName =
        loggedInUser?.name ||
        loggedInUser?.fullName ||
        loggedInUser?.username ||
        loggedInUser?.userName ||
        loggedInUser?.email ||
        "User";

    const userRoleValue =
        loggedInUser?.role ||
        loggedInUser?.authorities ||
        loggedInUser?.userRole ||
        "Library Member";

    const userRole = Array.isArray(userRoleValue)
        ? userRoleValue
            .map((item) =>
                typeof item === "object"
                    ? item.authority || item.name || ""
                    : String(item)
            )
            .filter(Boolean)
            .join(", ")
        : typeof userRoleValue === "object"
            ? userRoleValue.authority ||
              userRoleValue.name ||
              "Library Member"
            : String(userRoleValue);

    const userInitial = userName.trim().charAt(0).toUpperCase() || "U";

    const rows = ["A", "B", "C", "D"];
    const seatsPerRow = 5;

    const fixedReservedSeats = [
        "A3",
        "B2",
        "C3",
        "D1",
        "D5"
    ];

    const timeOptions = [
        { value: "08:00", label: "08:00 AM" },
        { value: "09:00", label: "09:00 AM" },
        { value: "10:00", label: "10:00 AM" },
        { value: "11:00", label: "11:00 AM" },
        { value: "12:00", label: "12:00 PM" },
        { value: "14:00", label: "02:00 PM" },
        { value: "16:00", label: "04:00 PM" },
        { value: "18:00", label: "06:00 PM" }
    ];

    const getToken = () => localStorage.getItem("token");

    const isMembershipExpired = (expiryDate) => {
        if (!expiryDate) return false;

        const expiryString = String(expiryDate);

        const parsedExpiry =
            /^\d{4}-\d{2}-\d{2}$/.test(expiryString)
                ? new Date(`${expiryString}T23:59:59`)
                : new Date(expiryString);

        if (Number.isNaN(parsedExpiry.getTime())) {
            return true;
        }

        return new Date() > parsedExpiry;
    };

    const extractMembership = (data) =>
        data?.membership ??
        data?.data?.membership ??
        data?.data ??
        data;

    const evaluateMembership = (membershipData) => {
        if (
            !membershipData ||
            typeof membershipData !== "object" ||
            Array.isArray(membershipData) ||
            Object.keys(membershipData).length === 0
        ) {
            return {
                membership: null,
                active: false
            };
        }

        const status = String(
            membershipData.status || ""
        ).toLowerCase();

        const expiryDate =
            membershipData.expiryDate ??
            membershipData.endDate ??
            membershipData.validUntil ??
            null;

        const statusIsActive =
            status === "active" ||
            membershipData.isActive === true ||
            membershipData.active === true;

        return {
            membership: {
                ...membershipData,
                expiryDate
            },
            active:
                statusIsActive &&
                !isMembershipExpired(expiryDate)
        };
    };

    const loadMembership = async () => {
        try {
            setMembershipLoading(true);
            setMembershipError("");

            const token = getToken();

            if (!token) {
                setMembership(null);
                setMembershipActive(false);
                return;
            }

            const response = await fetch(
                `${API_BASE_URL}/api/memberships/my`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Cache-Control": "no-cache"
                    }
                }
            );

            if (response.status === 404) {
                setMembership(null);
                setMembershipActive(false);
                setSelectedSeat(null);
                return;
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Unable to check your membership."
                );
            }

            const result = evaluateMembership(
                extractMembership(data)
            );

            setMembership(result.membership);
            setMembershipActive(result.active);

            if (!result.active) {
                setSelectedSeat(null);
            }
        } catch (err) {
            console.error("Membership loading error:", err);

            setMembership(null);
            setMembershipActive(false);
            setSelectedSeat(null);

            setMembershipError(
                "We couldn't verify your membership. Please try again."
            );
        } finally {
            setMembershipLoading(false);
        }
    };

    const getEndTime = () => {
        const [hours, minutes] = startTime.split(":").map(Number);
        const end = new Date();

        end.setHours(hours, minutes, 0, 0);
        end.setHours(end.getHours() + Number(duration));

        return end.toTimeString().slice(0, 5);
    };

    const formatTime = (time) => {
        if (!time) return "—";

        const [hours, minutes] = time.split(":").map(Number);
        const tempDate = new Date();

        tempDate.setHours(hours, minutes, 0, 0);

        return tempDate.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const formatDate = (dateValue) => {
        if (!dateValue) return "—";

        const parsedDate = new Date(dateValue);

        if (Number.isNaN(parsedDate.getTime())) {
            return dateValue;
        }

        return parsedDate.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const parseReservationTime = (dateValue, time) => {
        const result = new Date(dateValue);
        const match = String(time || "").match(
            /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i
        );

        if (!match) return result;

        let hours = Number(match[1]);
        const minutes = Number(match[2]);
        const period = match[3].toUpperCase();

        if (period === "PM" && hours !== 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;

        result.setHours(hours, minutes, 0, 0);

        return result;
    };

    const reservationStart = (reservation) =>
        parseReservationTime(
            reservation.reservationDate,
            reservation.startTime
        );

    const reservationEnd = (reservation) => {
        const start = reservationStart(reservation);
        const end = parseReservationTime(
            reservation.reservationDate,
            reservation.endTime
        );

        if (end < start) {
            end.setDate(end.getDate() + 1);
        }

        return end;
    };

    const selectedStartDate = () => {
        const [hours, minutes] = startTime.split(":").map(Number);
        const result = new Date(`${date}T00:00:00`);

        result.setHours(hours, minutes, 0, 0);

        return result;
    };

    const selectedEndDate = () => {
        const result = new Date(selectedStartDate());

        result.setHours(
            result.getHours() + Number(duration)
        );

        return result;
    };

    const reservationOverlapsSelection = (reservation) => {
        if (
            String(reservation.status || "").toLowerCase() !==
            "confirmed"
        ) {
            return false;
        }

        const existingStart = reservationStart(reservation);
        const existingEnd = reservationEnd(reservation);

        return (
            existingStart < selectedEndDate() &&
            existingEnd > selectedStartDate()
        );
    };

    const loadReservations = async () => {
        try {
            setLoadingReservations(true);
            setError("");

            const token = getToken();

            if (!token) {
                setError("Please login to reserve a seat.");
                return;
            }

            const response = await fetch(
                `${API_BASE_URL}/api/reservations/my`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Cache-Control": "no-cache"
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Unable to load reservations."
                );
            }

            setMyReservations(data.reservations || []);
        } catch (err) {
            console.error("Reservation loading error:", err);

            setError(
                err.message || "Unable to load reservations."
            );
        } finally {
            setLoadingReservations(false);
        }
    };

    useEffect(() => {
        loadMembership();
        loadReservations();
    }, []);

    useEffect(() => {
        const handleWindowFocus = () => {
            setLoggedInUser(getLoggedInUser());
            loadMembership();
        };

        window.addEventListener("focus", handleWindowFocus);

        return () => {
            window.removeEventListener("focus", handleWindowFocus);
        };
    }, []);

    useEffect(() => {
        if (!selectedSeat) return;

        const selectedSeatReserved =
            fixedReservedSeats.includes(selectedSeat) ||
            myReservations.some(
                (reservation) =>
                    reservation.seatNumber === selectedSeat &&
                    reservationOverlapsSelection(reservation)
            );

        if (selectedSeatReserved) {
            setSelectedSeat(null);
        }
    }, [date, startTime, duration, myReservations]);

    const isSeatReserved = (seat) => {
        if (fixedReservedSeats.includes(seat)) return true;

        return myReservations.some(
            (reservation) =>
                reservation.seatNumber === seat &&
                reservationOverlapsSelection(reservation)
        );
    };

    const handleSeatClick = (seat) => {
        if (membershipLoading) return;

        if (!membershipActive) {
            setSelectedSeat(null);
            setMessage("");
            setError(
                "An active membership is required to reserve a seat. Please purchase or renew your membership."
            );
            return;
        }

        if (isSeatReserved(seat)) return;

        setMessage("");
        setError("");
        setSelectedSeat(seat);
    };

    const handleReservation = async () => {
        setMessage("");
        setError("");

        if (membershipLoading) {
            setError("Please wait while we verify your membership.");
            return;
        }

        if (!membershipActive) {
            setSelectedSeat(null);
            setError(
                "An active membership is required to reserve a seat. Please purchase or renew your membership."
            );
            return;
        }

        if (!selectedSeat) {
            setError("Please select an available seat.");
            return;
        }

        if (!date) {
            setError("Please select a reservation date.");
            return;
        }

        const selectedDate = new Date(`${date}T00:00:00`);
        const today = new Date();

        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            setError("Please select today or a future date.");
            return;
        }

        if (isSeatReserved(selectedSeat)) {
            setError(
                `Seat ${selectedSeat} is already reserved for the selected time.`
            );
            return;
        }

        try {
            setProcessing(true);

            const token = getToken();

            if (!token) {
                setError("Please login to reserve a seat.");
                return;
            }

            // Recheck membership immediately before creating a reservation.
            const membershipResponse = await fetch(
                `${API_BASE_URL}/api/memberships/my`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Cache-Control": "no-cache"
                    }
                }
            );

            if (membershipResponse.status === 404) {
                setMembership(null);
                setMembershipActive(false);
                setSelectedSeat(null);

                setError(
                    "You need an active membership to reserve a seat."
                );
                return;
            }

            const membershipResponseData =
                await membershipResponse.json();

            if (!membershipResponse.ok) {
                throw new Error(
                    membershipResponseData.message ||
                    "Unable to verify membership. Please try again."
                );
            }

            const latestResult = evaluateMembership(
                extractMembership(membershipResponseData)
            );

            setMembership(latestResult.membership);
            setMembershipActive(latestResult.active);

            if (!latestResult.active) {
                setSelectedSeat(null);
                setError(
                    "Your membership is inactive or expired. Please purchase or renew your membership."
                );
                return;
            }

            const response = await fetch(
                `${API_BASE_URL}/api/reservations`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        seatNumber: selectedSeat,
                        reservationDate: date,
                        startTime: formatTime(startTime),
                        endTime: formatTime(getEndTime()),
                        purpose: "Library Study Session"
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to reserve the seat."
                );
            }

            setMessage(
                `Seat ${selectedSeat} reserved successfully!`
            );

            setSelectedSeat(null);

            await loadReservations();

            window.setTimeout(() => {
                navigate("/reservations");
            }, 1200);
        } catch (err) {
            console.error("Reservation error:", err);

            setError(
                err.message || "Unable to reserve the seat."
            );
        } finally {
            setProcessing(false);
        }
    };

    const handleDateChange = (value) => {
        setDate(value);
        setMessage("");
        setError("");
    };

    const handleStartTimeChange = (value) => {
        setStartTime(value);
        setMessage("");
        setError("");
    };

    const handleDurationChange = (value) => {
        setDuration(value);
        setMessage("");
        setError("");
    };

    const membershipLocked =
        membershipLoading || !membershipActive;

    return (
        <div className="seat-page">
            <aside className="seat-sidebar">
                <div className="seat-sidebar-logo">
                    <div className="seat-logo-icon">📚</div>

                    <div>
                        <strong>LibraSpace</strong>
                        <span>Smart Library</span>
                    </div>
                </div>

                <div className="seat-menu-title">MAIN MENU</div>

                <nav className="seat-sidebar-nav">
                    <Link to="/dashboard">
                        <span>⌂</span>
                        Dashboard
                    </Link>

                    <Link to="/seats" className="active">
                        <span>💺</span>
                        Reserve Seat
                    </Link>

                    <Link to="/reservations">
                        <span>▣</span>
                        My Reservations
                    </Link>

                    <Link to="/membership">
                        <span>♛</span>
                        Membership
                    </Link>
                </nav>

                <div className="seat-menu-title">ACCOUNT</div>

                <nav className="seat-sidebar-nav">
                    <Link to="/profile">
                        <span>◯</span>
                        My Profile
                    </Link>

                    <Link to="/payment-history">
                        <span>▤</span>
                        Payment History
                    </Link>
                </nav>

                <div className="seat-sidebar-bottom">
                    <div className="seat-library-status">
                        <span className="seat-status-dot"></span>

                        <div>
                            <strong>Library Open</strong>
                            <small>8:00 AM - 10:00 PM</small>
                        </div>
                    </div>

                    <Link to="/" className="seat-logout">
                        ↪ Logout
                    </Link>
                </div>
            </aside>

            <div className="seat-content">
                <header className="seat-topbar">
                    <div>
                        <span className="seat-top-label">
                            STUDENT PORTAL
                        </span>

                        <h1>Reserve a Seat</h1>
                    </div>

                    {/* Dynamic profile information */}
                    <Link to="/profile" className="seat-user">
                        <div className="seat-user-avatar">
                            {userInitial}
                        </div>

                        <div>
                            <strong>{userName}</strong>
                            <span>{userRole}</span>
                        </div>
                    </Link>
                </header>

                <main className="seat-main">
                    <div className="seat-breadcrumb">
                        <Link to="/dashboard">Dashboard</Link>
                        <span>/</span>
                        <strong>Reserve Seat</strong>
                    </div>

                    <section className="seat-intro">
                        <div>
                            <span>LIBRARY SEATING</span>

                            <h2>Find your perfect study spot</h2>

                            <p>
                                Select your preferred date, time and
                                available seat for your study session.
                            </p>
                        </div>
                    </section>

                    <section
                        className={`seat-membership-status ${
                            membershipLoading
                                ? ""
                                : membershipActive
                                    ? "active"
                                    : "locked"
                        }`}
                    >
                        <div className="seat-membership-status-icon">
                            {membershipLoading
                                ? "⏳"
                                : membershipActive
                                    ? "✓"
                                    : "🔒"}
                        </div>

                        <div className="seat-membership-status-content">
                            <strong>
                                {membershipLoading
                                    ? "Checking membership..."
                                    : membershipActive
                                        ? "Active Membership"
                                        : membership?.expiryDate
                                            ? "Membership Expired"
                                            : "Membership Required"}
                            </strong>

                            <p>
                                {membershipLoading
                                    ? "Please wait while we verify your membership."
                                    : membershipActive
                                        ? `Your membership is active${
                                            membership.expiryDate
                                                ? ` until ${formatDate(
                                                    membership.expiryDate
                                                )}`
                                                : ""
                                        }. You can reserve an available seat.`
                                        : "Purchase or renew your membership to unlock seat reservations."}
                            </p>

                            {membershipError && (
                                <p className="seat-membership-error">
                                    {membershipError}
                                </p>
                            )}
                        </div>

                        {!membershipLoading && !membershipActive && (
                            <Link
                                to="/membership"
                                className="seat-membership-button"
                            >
                                Buy / Renew Membership →
                            </Link>
                        )}

                        {membershipError && (
                            <button
                                type="button"
                                className="seat-membership-button"
                                onClick={loadMembership}
                                disabled={membershipLoading}
                            >
                                Try Again
                            </button>
                        )}
                    </section>

                    <section className="booking-settings">
                        <div className="setting-group">
                            <label>Reservation Date</label>

                            <div className="input-with-icon">
                                <span>📅</span>

                                <input
                                    type="date"
                                    value={date}
                                    min={new Date()
                                        .toISOString()
                                        .split("T")[0]}
                                    onChange={(e) =>
                                        handleDateChange(e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="setting-group">
                            <label>Start Time</label>

                            <div className="input-with-icon">
                                <span>🕐</span>

                                <select
                                    value={startTime}
                                    onChange={(e) =>
                                        handleStartTimeChange(e.target.value)
                                    }
                                >
                                    {timeOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="setting-group">
                            <label>Duration</label>

                            <div className="input-with-icon">
                                <span>⏱️</span>

                                <select
                                    value={duration}
                                    onChange={(e) =>
                                        handleDurationChange(e.target.value)
                                    }
                                >
                                    <option value="1">1 Hour</option>
                                    <option value="2">2 Hours</option>
                                    <option value="3">3 Hours</option>
                                    <option value="4">4 Hours</option>
                                    <option value="5">5 Hours</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <section className="seat-layout">
                        <div className="seat-map-card">
                            <div className="seat-card-header">
                                <div>
                                    <span>LIBRARY FLOOR</span>
                                    <h3>Select Your Seat</h3>
                                </div>

                                <span className="seat-capacity">
                                    20 Seats
                                </span>
                            </div>

                            <div className="library-entrance">
                                ENTRANCE
                            </div>

                            <div
                                className={`seat-grid ${
                                    membershipLocked
                                        ? "membership-locked"
                                        : ""
                                }`}
                            >
                                {rows.map((row) => (
                                    <div className="seat-row" key={row}>
                                        <span className="row-label">
                                            {row}
                                        </span>

                                        {Array.from(
                                            { length: seatsPerRow },
                                            (_, index) => {
                                                const seat =
                                                    `${row}${index + 1}`;

                                                const isReserved =
                                                    isSeatReserved(seat);

                                                const isSelected =
                                                    selectedSeat === seat;

                                                const isLocked =
                                                    membershipLocked;

                                                return (
                                                    <button
                                                        key={seat}
                                                        type="button"
                                                        disabled={
                                                            isReserved ||
                                                            loadingReservations ||
                                                            isLocked
                                                        }
                                                        className={`
                                                            library-seat
                                                            ${isReserved ? "reserved" : ""}
                                                            ${isSelected ? "selected" : ""}
                                                            ${isLocked ? "membership-locked" : ""}
                                                        `}
                                                        onClick={() =>
                                                            handleSeatClick(seat)
                                                        }
                                                        title={
                                                            isLocked
                                                                ? "Active membership required"
                                                                : isReserved
                                                                    ? "Seat reserved"
                                                                    : `Select seat ${seat}`
                                                        }
                                                    >
                                                        <span>{seat}</span>
                                                    </button>
                                                );
                                            }
                                        )}
                                    </div>
                                ))}
                            </div>

                            {!membershipLoading && !membershipActive && (
                                <div className="seat-locked-message">
                                    <span>🔒</span>

                                    <div>
                                        <strong>Seats are locked</strong>

                                        <p>
                                            An active membership is required
                                            before you can select a seat.
                                        </p>

                                        <Link to="/membership">
                                            View Membership Plans →
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {membershipLoading && (
                                <div className="seat-membership-loading">
                                    Checking membership access...
                                </div>
                            )}

                            <div className="study-tables">
                                <div>STUDY TABLE</div>
                                <div>STUDY TABLE</div>
                            </div>

                            <div className="seat-legend">
                                <div>
                                    <span className="legend-box available"></span>
                                    Available
                                </div>

                                <div>
                                    <span className="legend-box selected"></span>
                                    Selected
                                </div>

                                <div>
                                    <span className="legend-box reserved"></span>
                                    Reserved
                                </div>
                            </div>
                        </div>

                        <aside className="reservation-summary">
                            <div className="summary-header">
                                <span>RESERVATION SUMMARY</span>
                                <h3>Your Booking</h3>
                            </div>

                            <button
                                type="button"
                                className={`confirm-seat-button ${
                                    membershipLocked
                                        ? "membership-locked"
                                        : ""
                                }`}
                                onClick={handleReservation}
                                disabled={
                                    processing ||
                                    loadingReservations ||
                                    membershipLoading ||
                                    !membershipActive
                                }
                                title={
                                    !membershipActive
                                        ? "Active membership required"
                                        : "Confirm your reservation"
                                }
                            >
                                <span className="confirm-button-text">
                                    {membershipLoading
                                        ? "Checking Membership..."
                                        : processing
                                            ? "Reserving..."
                                            : !membershipActive
                                                ? "Membership Required"
                                                : "Confirm Reservation"}
                                </span>

                                <span className="confirm-button-arrow">
                                    →
                                </span>
                            </button>

                            {!membershipLoading && !membershipActive && (
                                <Link
                                    to="/membership"
                                    className="seat-membership-button"
                                >
                                    Buy / Renew Membership
                                </Link>
                            )}

                            <div className="summary-booking-info">
                                <div className="summary-date">
                                    <div className="summary-date-icon">
                                        📅
                                    </div>

                                    <div className="summary-date-content">
                                        <span>DATE</span>
                                        <strong>{formatDate(date)}</strong>
                                    </div>
                                </div>

                                <div className="summary-details">
                                    <div>
                                        <span>Seat</span>
                                        <strong>
                                            {selectedSeat || "Not selected"}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Start Time</span>
                                        <strong>
                                            {formatTime(startTime)}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Duration</span>
                                        <strong>
                                            {duration} Hour
                                            {duration !== "1" ? "s" : ""}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>End Time</span>
                                        <strong>
                                            {formatTime(getEndTime())}
                                        </strong>
                                    </div>
                                </div>

                                <div className="summary-divider"></div>

                                <div className="summary-note">
                                    <span>✓</span>

                                    <p>
                                        Your seat will be reserved exclusively
                                        for the selected time period.
                                    </p>
                                </div>

                                {message && (
                                    <div className="reservation-success-message">
                                        ✓ {message}
                                    </div>
                                )}

                                {error && (
                                    <div className="reservation-error-message">
                                        ⚠️ {error}
                                    </div>
                                )}
                            </div>

                            <Link
                                to="/dashboard"
                                className="cancel-booking"
                            >
                                ← Back to Dashboard
                            </Link>
                        </aside>
                    </section>
                </main>

                <footer className="seat-footer">
                    <strong>📚 LibraSpace</strong>

                    <span>
                        Smart Library Seat Reservation &amp;
                        Membership System
                    </span>

                    <span>© 2026 LibraSpace</span>
                </footer>
            </div>
        </div>
    );
}

export default SeatReservation;