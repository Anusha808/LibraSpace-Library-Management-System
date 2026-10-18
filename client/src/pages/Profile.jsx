
import { Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import "./Profile.css";

const API_BASE = "http://localhost:5000/api";
const PROFILE_URL = `${API_BASE}/auth/profile`;
const MEMBERSHIP_URL = `${API_BASE}/memberships/my`;

const EMPTY_PROFILE = {
    fullName: "",
    email: "",
    phone: "",
    studentId: "",
    joinedDate: ""
};

const getToken = () => {
    const keys = ["token", "authToken", "accessToken", "jwt", "userToken"];

    for (const key of keys) {
        const value = localStorage.getItem(key);
        if (value) return value;
    }

    return null;
};

const getUserFromResponse = (result) =>
    result?.user ||
    result?.data?.user ||
    result?.data ||
    result;

const getMembershipFromResponse = (result) => {
    if (Array.isArray(result?.memberships)) {
        return result.memberships[0] || null;
    }

    if (Array.isArray(result?.data?.memberships)) {
        return result.data.memberships[0] || null;
    }

    if (Array.isArray(result?.data)) {
        return result.data[0] || null;
    }

    return result?.membership || result?.data?.membership || result?.data || result;
};

const formatDate = (value) => {
    if (!value) return "Not available";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "Not available";

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
};

const getMembershipStatus = (membership) => {
    if (!membership) return "No Membership";

    const rawStatus = String(membership.status || "").toLowerCase();

    if (["expired", "cancelled", "canceled", "inactive"].includes(rawStatus)) {
        return rawStatus === "cancelled" || rawStatus === "canceled"
            ? "Cancelled"
            : rawStatus === "inactive"
                ? "Inactive"
                : "Expired";
    }

    const expiry = membership.expiryDate || membership.endDate || membership.validUntil;

    if (expiry) {
        const expiryDate = new Date(expiry);

        if (!Number.isNaN(expiryDate.getTime())) {
            expiryDate.setHours(23, 59, 59, 999);

            if (expiryDate < new Date()) return "Expired";
        }
    }

    if (["active", "successful", "paid"].includes(rawStatus)) {
        return "Active";
    }

    return rawStatus
        ? rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1)
        : "Unknown";
};

function Profile() {
    const [profile, setProfile] = useState(EMPTY_PROFILE);
    const [membership, setMembership] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [membershipError, setMembershipError] = useState("");

    const [originalProfile, setOriginalProfile] = useState(EMPTY_PROFILE);

    const getHeaders = () => {
        const token = getToken();

        return {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        };
    };

    const request = async (url, options = {}) => {
        const response = await fetch(url, {
            ...options,
            credentials: "include",
            headers: {
                ...getHeaders(),
                ...(options.body ? { "Content-Type": "application/json" } : {}),
                ...options.headers
            }
        });

        const result = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(
                result?.message ||
                result?.error ||
                `Request failed (${response.status}).`
            );
        }

        return result;
    };

    const loadProfile = useCallback(async () => {
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const result = await request(PROFILE_URL);
            const user = getUserFromResponse(result);

            if (!user || typeof user !== "object" || Array.isArray(user)) {
                throw new Error("The profile API did not return a user object.");
            }

            const loadedProfile = {
                fullName: user.fullName || user.name || "",
                email: user.email || "",
                phone: user.phone || user.phoneNumber || "",
                studentId: user.studentId || user.memberId || user._id || "",
                joinedDate: formatDate(
                    user.createdAt || user.joinedDate || user.registrationDate
                )
            };

            setProfile(loadedProfile);
            setOriginalProfile(loadedProfile);
        } catch (err) {
            setError(err.message || "Unable to load your profile.");
        } finally {
            setLoading(false);
        }
    }, []);

    const loadMembership = useCallback(async () => {
        setMembershipError("");

        try {
            const result = await request(MEMBERSHIP_URL);
            const item = getMembershipFromResponse(result);

            setMembership(
                item && typeof item === "object" && !Array.isArray(item)
                    ? item
                    : null
            );
        } catch (err) {
            setMembership(null);
            setMembershipError(err.message || "Unable to load membership details.");
        }
    }, []);

    useEffect(() => {
        loadProfile();
        loadMembership();
    }, [loadProfile, loadMembership]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setProfile((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleCancel = () => {
        setProfile(originalProfile);
        setIsEditing(false);
        setError("");
        setMessage("");
    };

    const handleSave = async () => {
        setSaving(true);
        setError("");
        setMessage("");

        try {
            const result = await request(PROFILE_URL, {
                method: "PUT",
                body: JSON.stringify({
                    fullName: profile.fullName.trim(),
                    name: profile.fullName.trim(),
                    email: profile.email.trim(),
                    phone: profile.phone.trim()
                })
            });

            const updatedUser = getUserFromResponse(result);

            const savedProfile = {
                ...profile,
                fullName:
                    updatedUser?.fullName ||
                    updatedUser?.name ||
                    profile.fullName.trim(),
                email: updatedUser?.email || profile.email.trim(),
                phone:
                    updatedUser?.phone ||
                    updatedUser?.phoneNumber ||
                    profile.phone.trim()
            };

            setProfile(savedProfile);
            setOriginalProfile(savedProfile);
            setIsEditing(false);
            setMessage("Profile updated successfully.");
        } catch (err) {
            setError(err.message || "Unable to save profile changes.");
        } finally {
            setSaving(false);
        }
    };

    const membershipPlan =
        membership?.planId?.name ||
        membership?.plan?.name ||
        membership?.planName ||
        membership?.name ||
        "Membership not available";

    const membershipFee =
        membership?.amount ??
        membership?.price ??
        membership?.planId?.price ??
        membership?.plan?.price;

    const membershipExpiry =
        membership?.expiryDate ||
        membership?.endDate ||
        membership?.validUntil;

    const membershipStatus = getMembershipStatus(membership);

    const avatarLetter = profile.fullName.trim()
        ? profile.fullName.trim().charAt(0).toUpperCase()
        : "U";

    return (
        <div className="profile-page">
            <aside className="profile-sidebar">
                <div className="profile-sidebar-logo">
                    <div className="profile-logo-icon">📚</div>
                    <div>
                        <strong>LibraSpace</strong>
                        <span>Smart Library</span>
                    </div>
                </div>

                <div className="profile-menu-title">MAIN MENU</div>

                <nav className="profile-sidebar-nav">
                    <Link to="/dashboard"><span>⌂</span>Dashboard</Link>
                    <Link to="/seats"><span>💺</span>Reserve Seat</Link>
                    <Link to="/reservations"><span>▣</span>My Reservations</Link>
                    <Link to="/membership"><span>♛</span>Membership</Link>
                </nav>

                <div className="profile-menu-title">ACCOUNT</div>

                <nav className="profile-sidebar-nav">
                    <Link to="/profile" className="active">
                        <span>◯</span>My Profile
                    </Link>
                    <Link to="/payment-history">
                        <span>▤</span>Payment History
                    </Link>
                </nav>

                <div className="profile-sidebar-bottom">
                    <div className="profile-library-status">
                        <span className="profile-status-dot"></span>
                        <div>
                            <strong>Library Open</strong>
                            <small>8:00 AM - 10:00 PM</small>
                        </div>
                    </div>

                    <Link to="/" className="profile-logout">↪ Logout</Link>
                </div>
            </aside>

            <div className="profile-content">
                <header className="profile-topbar">
                    <div>
                        <span className="profile-top-label">STUDENT PORTAL</span>
                        <h1>My Profile</h1>
                    </div>

                    <div className="profile-top-user">
                        <div className="profile-top-avatar">{avatarLetter}</div>
                        <div className="profile-top-user-info">
                            <strong>{profile.fullName || "Library Member"}</strong>
                            <span>Library Member</span>
                        </div>
                    </div>
                </header>

                <main className="profile-main">
                    <div className="profile-breadcrumb">
                        <Link to="/dashboard">Dashboard</Link>
                        <span>/</span>
                        <strong>My Profile</strong>
                    </div>

                    <section className="profile-page-header">
                        <div>
                            <span>ACCOUNT SETTINGS</span>
                            <h2>My Profile</h2>
                            <p>
                                Manage your personal information and library account details.
                            </p>
                        </div>

                        {!isEditing && (
                            <button
                                type="button"
                                className="profile-edit-button"
                                onClick={() => {
                                    setMessage("");
                                    setError("");
                                    setIsEditing(true);
                                }}
                                disabled={loading || Boolean(error)}
                            >
                                ✎ Edit Profile
                            </button>
                        )}
                    </section>

                    {loading && (
                        <div className="profile-info-notice">
                            <div className="profile-notice-icon">⏳</div>
                            <div>
                                <strong>Loading your profile</strong>
                                <p>Please wait while we retrieve your account information.</p>
                            </div>
                        </div>
                    )}

                    {!loading && error && (
                        <div className="profile-info-notice" role="alert">
                            <div className="profile-notice-icon">⚠️</div>
                            <div>
                                <strong>Unable to load profile</strong>
                                <p>{error}</p>
                                <button
                                    type="button"
                                    className="profile-edit-button"
                                    onClick={() => {
                                        loadProfile();
                                        loadMembership();
                                    }}
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    )}

                    {message && (
                        <div className="profile-info-notice" role="status">
                            <div className="profile-notice-icon">✓</div>
                            <div>
                                <strong>{message}</strong>
                            </div>
                        </div>
                    )}

                    {!loading && !error && (
                        <>
                            <section className="profile-overview">
                                <div className="profile-card profile-main-card">
                                    <div className="profile-card-header">
                                        <div>
                                            <span>PERSONAL INFORMATION</span>
                                            <h3>Profile Details</h3>
                                        </div>
                                        <div className="profile-large-avatar">
                                            {avatarLetter}
                                        </div>
                                    </div>

                                    <div className="profile-form-grid">
                                        <div className="profile-form-group">
                                            <label htmlFor="profile-fullName">Full Name</label>
                                            <input
                                                id="profile-fullName"
                                                type="text"
                                                name="fullName"
                                                value={profile.fullName}
                                                onChange={handleChange}
                                                disabled={!isEditing || saving}
                                                required
                                            />
                                        </div>

                                        <div className="profile-form-group">
                                            <label htmlFor="profile-email">Email Address</label>
                                            <input
                                                id="profile-email"
                                                type="email"
                                                name="email"
                                                value={profile.email}
                                                onChange={handleChange}
                                                disabled={!isEditing || saving}
                                                required
                                            />
                                        </div>

                                        <div className="profile-form-group">
                                            <label htmlFor="profile-phone">Phone Number</label>
                                            <input
                                                id="profile-phone"
                                                type="tel"
                                                name="phone"
                                                value={profile.phone}
                                                onChange={handleChange}
                                                disabled={!isEditing || saving}
                                            />
                                        </div>

                                        <div className="profile-form-group">
                                            <label htmlFor="profile-studentId">Student / Member ID</label>
                                            <input
                                                id="profile-studentId"
                                                type="text"
                                                name="studentId"
                                                value={profile.studentId}
                                                disabled
                                            />
                                        </div>
                                    </div>

                                    {isEditing && (
                                        <div className="profile-form-actions">
                                            <button
                                                type="button"
                                                className="profile-cancel-button"
                                                onClick={handleCancel}
                                                disabled={saving}
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                type="button"
                                                className="profile-save-button"
                                                onClick={handleSave}
                                                disabled={saving || !profile.fullName.trim() || !profile.email.trim()}
                                            >
                                                {saving ? "Saving..." : "✓ Save Changes"}
                                            </button>
                                        </div>
                                    )}

                                    {isEditing && error && (
                                        <p role="alert">{error}</p>
                                    )}
                                </div>

                                <div className="profile-card profile-membership-card">
                                    <div className="profile-membership-icon">♛</div>
                                    <span className="profile-membership-label">MEMBERSHIP</span>

                                    <h3>{membershipPlan}</h3>

                                    <span className="profile-membership-status">
                                        {membershipStatus === "Active"
                                            ? "✓ Active"
                                            : membershipStatus}
                                    </span>

                                    {membershipError && (
                                        <p>{membershipError}</p>
                                    )}

                                    <div className="profile-membership-details">
                                        <div>
                                            <span>Membership Fee</span>
                                            <strong>
                                                {membershipFee !== undefined && membershipFee !== null
                                                    ? `₹${Number(membershipFee).toLocaleString("en-IN")}`
                                                    : "Not available"}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>Valid Until</span>
                                            <strong>{formatDate(membershipExpiry)}</strong>
                                        </div>
                                    </div>

                                    <Link
                                        to="/membership"
                                        className="profile-membership-button"
                                    >
                                        Manage Membership →
                                    </Link>
                                </div>
                            </section>

                            <section className="profile-account-section">
                                <div className="profile-section-heading">
                                    <span>ACCOUNT INFORMATION</span>
                                    <h3>Account Details</h3>
                                </div>

                                <div className="profile-account-grid">
                                    <div className="profile-info-card">
                                        <div className="profile-info-icon">🆔</div>
                                        <div>
                                            <span>Student / Member ID</span>
                                            <strong>{profile.studentId || "Not available"}</strong>
                                        </div>
                                    </div>

                                    <div className="profile-info-card">
                                        <div className="profile-info-icon">📅</div>
                                        <div>
                                            <span>Member Since</span>
                                            <strong>{profile.joinedDate || "Not available"}</strong>
                                        </div>
                                    </div>

                                    <div className="profile-info-card">
                                        <div className="profile-info-icon">✓</div>
                                        <div>
                                            <span>Account Status</span>
                                            <strong className="profile-active-text">
                                                {profile.fullName ? "Registered" : "Unknown"}
                                            </strong>
                                        </div>
                                    </div>

                                    <div className="profile-info-card">
                                        <div className="profile-info-icon">🔐</div>
                                        <div>
                                            <span>Account Security</span>
                                            <strong>Password Protected</strong>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="profile-security-card">
                                <div className="profile-security-icon">🔒</div>
                                <div className="profile-security-content">
                                    <span>ACCOUNT SECURITY</span>
                                    <h3>Keep your account secure</h3>
                                    <p>
                                        Change your password regularly to keep your
                                        LibraSpace account protected.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="profile-password-button"
                                    onClick={() =>
                                        alert("Password change feature will be added later.")
                                    }
                                >
                                    Change Password
                                </button>
                            </section>

                            <section className="profile-info-notice">
                                <div className="profile-notice-icon">💡</div>
                                <div>
                                    <strong>Profile Information</strong>
                                    <p>
                                        Your profile information is used to manage seat
                                        reservations, membership services and payment
                                        records within LibraSpace.
                                    </p>
                                </div>
                            </section>
                        </>
                    )}
                </main>

                <footer className="profile-footer">
                    <div>
                        <strong>📚 LibraSpace</strong>
                        <span>
                            Smart Library Seat Reservation &amp; Membership System
                        </span>
                    </div>
                    <span>© 2026 LibraSpace</span>
                </footer>
            </div>
        </div>
    );
}

export default Profile;
