import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./AdminBooks.css";

function AdminBooks() {
  const location = useLocation();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");

  const [books, setBooks] = useState([
    {
      id: 1,
      title: "Atomic Habits",
      author: "James Clear",
      category: "Self Help",
      isbn: "9780735211292",
      copies: 25,
      available: 18,
      status: "Available",
    },
    {
      id: 2,
      title: "The Psychology of Money",
      author: "Morgan Housel",
      category: "Finance",
      isbn: "9780857197689",
      copies: 20,
      available: 12,
      status: "Available",
    },
    {
      id: 3,
      title: "Clean Code",
      author: "Robert C. Martin",
      category: "Technology",
      isbn: "9780132350884",
      copies: 15,
      available: 5,
      status: "Low Stock",
    },
    {
      id: 4,
      title: "The Alchemist",
      author: "Paulo Coelho",
      category: "Fiction",
      isbn: "9780061122415",
      copies: 30,
      available: 22,
      status: "Available",
    },
    {
      id: 5,
      title: "Rich Dad Poor Dad",
      author: "Robert Kiyosaki",
      category: "Business",
      isbn: "9781612681139",
      copies: 18,
      available: 0,
      status: "Out of Stock",
    },
    {
      id: 6,
      title: "Introduction to Algorithms",
      author: "Thomas H. Cormen",
      category: "Technology",
      isbn: "9780262046305",
      copies: 12,
      available: 3,
      status: "Low Stock",
    },
    {
      id: 7,
      title: "Think and Grow Rich",
      author: "Napoleon Hill",
      category: "Self Help",
      isbn: "9781585424337",
      copies: 22,
      available: 16,
      status: "Available",
    },
    {
      id: 8,
      title: "Ikigai",
      author: "Héctor García",
      category: "Self Help",
      isbn: "9780143130727",
      copies: 16,
      available: 9,
      status: "Available",
    },
  ]);

  const [showModal, setShowModal] = useState(false);

  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    category: "Technology",
    isbn: "",
    copies: "",
  });

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase()) ||
      book.isbn.includes(search);

    const matchesCategory =
      category === "All Categories" ||
      book.category === category;

    return matchesSearch && matchesCategory;
  });

  const totalBooks = books.length;

  const totalCopies = books.reduce(
    (total, book) => total + book.copies,
    0
  );

  const availableCopies = books.reduce(
    (total, book) => total + book.available,
    0
  );

  const lowStockBooks = books.filter(
    (book) => book.status === "Low Stock"
  ).length;

  const outOfStockBooks = books.filter(
    (book) => book.status === "Out of Stock"
  ).length;

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (confirmDelete) {
      setBooks(books.filter((book) => book.id !== id));
    }
  };

  const handleAddBook = (e) => {
    e.preventDefault();

    if (
      !newBook.title ||
      !newBook.author ||
      !newBook.isbn ||
      !newBook.copies
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const copies = Number(newBook.copies);

    let status = "Available";

    if (copies === 0) {
      status = "Out of Stock";
    } else if (copies <= 5) {
      status = "Low Stock";
    }

    const book = {
      id: Date.now(),
      title: newBook.title,
      author: newBook.author,
      category: newBook.category,
      isbn: newBook.isbn,
      copies: copies,
      available: copies,
      status: status,
    };

    setBooks([...books, book]);

    setNewBook({
      title: "",
      author: "",
      category: "Technology",
      isbn: "",
      copies: "",
    });

    setShowModal(false);
  };

  const getStatusClass = (status) => {
    if (status === "Available") {
      return "status-available";
    }

    if (status === "Low Stock") {
      return "status-low";
    }

    return "status-out";
  };

  const handleEdit = (book) => {
    alert(
      `Edit feature for "${book.title}" will be connected to the backend later.`
    );
  };

  return (
    <div className="admin-books-page">

      {/* SIDEBAR */}
      <aside className="admin-sidebar">

        <div className="admin-sidebar-logo">
          <div className="admin-logo-icon">
            📚
          </div>

          <div>
            <h2>LibraSpace</h2>
            <span>Admin Portal</span>
          </div>
        </div>

        <nav className="admin-navigation">

          <div className="admin-nav-section">
            <span className="admin-nav-title">
              MAIN
            </span>

            <Link
              to="/admin/dashboard"
              className={
                location.pathname === "/admin/dashboard"
                  ? "admin-nav-link active"
                  : "admin-nav-link"
              }
            >
              <span className="nav-icon">▦</span>
              Dashboard
            </Link>

            <Link
              to="/admin/books"
              className={
                location.pathname === "/admin/books"
                  ? "admin-nav-link active"
                  : "admin-nav-link"
              }
            >
              <span className="nav-icon">📚</span>
              Manage Books
            </Link>

            <Link
              to="/admin/seats"
              className={
                location.pathname === "/admin/seats"
                  ? "admin-nav-link active"
                  : "admin-nav-link"
              }
            >
              <span className="nav-icon">💺</span>
              Manage Seats
            </Link>

            <Link
              to="/admin/reservations"
              className="admin-nav-link"
            >
              <span className="nav-icon">📅</span>
              Reservations
            </Link>
          </div>

          <div className="admin-nav-section">

            <span className="admin-nav-title">
              MANAGEMENT
            </span>

            <Link
              to="/admin/members"
              className="admin-nav-link"
            >
              <span className="nav-icon">👥</span>
              Members
            </Link>

            <Link
              to="/admin/memberships"
              className="admin-nav-link"
            >
              <span className="nav-icon">💳</span>
              Memberships
            </Link>

            <Link
              to="/admin/payments"
              className="admin-nav-link"
            >
              <span className="nav-icon">₹</span>
              Payments
            </Link>

            <Link
              to="/admin/reports"
              className="admin-nav-link"
            >
              <span className="nav-icon">📊</span>
              Reports
            </Link>
          </div>

          <div className="admin-nav-section">

            <span className="admin-nav-title">
              SYSTEM
            </span>

            <Link
              to="/admin/settings"
              className="admin-nav-link"
            >
              <span className="nav-icon">⚙</span>
              Settings
            </Link>

          </div>

        </nav>

        <div className="admin-sidebar-bottom">

         
          <Link
            to="/admin/login"
            className="admin-bottom-link logout"
          >
            <span>↪</span>
            Logout
          </Link>

        </div>

      </aside>


      {/* MAIN CONTENT */}
      <main className="admin-books-main">

        {/* TOPBAR */}
        <header className="admin-topbar">

          <div className="admin-topbar-left">

            <div className="mobile-admin-logo">
              📚
            </div>

            <div>
              <span className="admin-page-label">
                ADMINISTRATION
              </span>

              <h3>
                Library Resources
              </h3>
            </div>

          </div>

          <div className="admin-topbar-right">

            <button
              className="admin-notification"
              onClick={() =>
                alert("You have 3 new notifications.")
              }
            >
              🔔
              <span className="notification-dot"></span>
            </button>

            <div className="admin-profile">

              <div className="admin-avatar">
                A
              </div>

              <div className="admin-profile-info">
                <strong>Administrator</strong>
                <span>admin@libraspace.com</span>
              </div>

            </div>

          </div>

        </header>


        {/* CONTENT */}
        <div className="admin-books-content">

          {/* BREADCRUMB */}
          <div className="admin-breadcrumb">
            <Link to="/admin/dashboard">
              Dashboard
            </Link>

            <span>›</span>

            <span>Manage Books</span>
          </div>


          {/* PAGE HEADER */}
          <div className="books-page-header">

            <div>

              <span className="books-eyebrow">
                📚 LIBRARY RESOURCES
              </span>

              <h1>
                Manage Books
              </h1>

              <p>
                Add, update and manage books available
                in your library.
              </p>

            </div>

            <button
              className="add-book-btn"
              onClick={() => setShowModal(true)}
            >
              <span>＋</span>
              Add New Book
            </button>

          </div>


          {/* STAT CARDS */}
          <section className="book-stats-grid">

            <div className="book-stat-card">

              <div className="book-stat-icon total">
                📚
              </div>

              <div className="book-stat-content">

                <span>Total Books</span>

                <strong>
                  {totalBooks}
                </strong>

                <small>
                  Library titles
                </small>

              </div>

            </div>


            <div className="book-stat-card">

              <div className="book-stat-icon copies">
                📦
              </div>

              <div className="book-stat-content">

                <span>Total Copies</span>

                <strong>
                  {totalCopies}
                </strong>

                <small>
                  Physical copies
                </small>

              </div>

            </div>


            <div className="book-stat-card">

              <div className="book-stat-icon available">
                ✓
              </div>

              <div className="book-stat-content">

                <span>Available Copies</span>

                <strong>
                  {availableCopies}
                </strong>

                <small>
                  Ready to issue
                </small>

              </div>

            </div>


            <div className="book-stat-card">

              <div className="book-stat-icon warning">
                ⚠
              </div>

              <div className="book-stat-content">

                <span>Low Stock</span>

                <strong>
                  {lowStockBooks}
                </strong>

                <small>
                  Need attention
                </small>

              </div>

            </div>

          </section>


          {/* BOOK MANAGEMENT PANEL */}
          <section className="books-panel">

            <div className="books-panel-header">

              <div>

                <h2>
                  Book Inventory
                </h2>

                <p>
                  {filteredBooks.length} books displayed
                </p>

              </div>

              <div className="inventory-summary">
                <span className="summary-dot"></span>
                Library Inventory
              </div>

            </div>


            {/* SEARCH AND FILTER */}
            <div className="books-toolbar">

              <div className="book-search">

                <span>
                  🔍
                </span>

                <input
                  type="text"
                  placeholder="Search by title, author or ISBN..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </div>


              <select
                className="book-category-filter"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
              >
                <option>
                  All Categories
                </option>

                <option>
                  Technology
                </option>

                <option>
                  Self Help
                </option>

                <option>
                  Finance
                </option>

                <option>
                  Fiction
                </option>

                <option>
                  Business
                </option>
              </select>


              <button
                className="filter-reset"
                onClick={() => {
                  setSearch("");
                  setCategory("All Categories");
                }}
              >
                Reset
              </button>

            </div>


            {/* TABLE */}
            <div className="books-table-wrapper">

              <table className="books-table">

                <thead>

                  <tr>

                    <th>
                      BOOK
                    </th>

                    <th>
                      AUTHOR
                    </th>

                    <th>
                      CATEGORY
                    </th>

                    <th>
                      ISBN
                    </th>

                    <th>
                      COPIES
                    </th>

                    <th>
                      AVAILABLE
                    </th>

                    <th>
                      STATUS
                    </th>

                    <th>
                      ACTIONS
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredBooks.length > 0 ? (

                    filteredBooks.map((book) => (

                      <tr key={book.id}>

                        <td>

                          <div className="book-title-cell">

                            <div className="book-cover">
                              📖
                            </div>

                            <div>
                              <strong>
                                {book.title}
                              </strong>

                              <small>
                                Book ID #{book.id}
                              </small>
                            </div>

                          </div>

                        </td>


                        <td>
                          <span className="author-name">
                            {book.author}
                          </span>
                        </td>


                        <td>
                          <span className="category-badge">
                            {book.category}
                          </span>
                        </td>


                        <td>
                          <span className="isbn">
                            {book.isbn}
                          </span>
                        </td>


                        <td>
                          <strong className="copy-number">
                            {book.copies}
                          </strong>
                        </td>


                        <td>

                          <div className="available-count">

                            <strong>
                              {book.available}
                            </strong>

                            <span>
                              / {book.copies}
                            </span>

                          </div>

                        </td>


                        <td>

                          <span
                            className={`book-status ${getStatusClass(
                              book.status
                            )}`}
                          >
                            <span></span>
                            {book.status}
                          </span>

                        </td>


                        <td>

                          <div className="book-actions">

                            <button
                              className="book-action edit"
                              title="Edit Book"
                              onClick={() =>
                                handleEdit(book)
                              }
                            >
                              ✏
                            </button>

                            <button
                              className="book-action delete"
                              title="Delete Book"
                              onClick={() =>
                                handleDelete(book.id)
                              }
                            >
                              🗑
                            </button>

                          </div>

                        </td>

                      </tr>

                    ))

                  ) : (

                    <tr>

                      <td
                        colSpan="8"
                        className="no-books"
                      >

                        <div>
                          📚
                        </div>

                        <strong>
                          No books found
                        </strong>

                        <span>
                          Try changing your search or filter.
                        </span>

                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>


            {/* TABLE FOOTER */}
            <div className="books-table-footer">

              <span>
                Showing{" "}
                <strong>
                  {filteredBooks.length}
                </strong>{" "}
                of{" "}
                <strong>
                  {books.length}
                </strong>{" "}
                books
              </span>

              <div className="pagination">

                <button
                  className="pagination-btn disabled"
                  disabled
                >
                  ‹
                </button>

                <button className="pagination-btn active">
                  1
                </button>

                <button className="pagination-btn">
                  2
                </button>

                <button className="pagination-btn">
                  3
                </button>

                <button className="pagination-btn">
                  ›
                </button>

              </div>

            </div>

          </section>


          {/* LOW STOCK ALERT */}
          {(lowStockBooks > 0 || outOfStockBooks > 0) && (

            <section className="inventory-alert">

              <div className="inventory-alert-icon">
                ⚠
              </div>

              <div className="inventory-alert-content">

                <strong>
                  Inventory Attention Required
                </strong>

                <p>
                  {lowStockBooks} book
                  {lowStockBooks !== 1 ? "s are" : " is"} low
                  on stock and {outOfStockBooks} book
                  {outOfStockBooks !== 1 ? "s are" : " is"} out
                  of stock.
                </p>

              </div>

              <button
                onClick={() => {
                  setSearch("");
                  setCategory("All Categories");
                }}
              >
                Review Inventory →
              </button>

            </section>

          )}


          {/* FOOTER */}
          <footer className="admin-books-footer">

            <span>
              © 2026 LibraSpace. All Rights Reserved.
            </span>

            <span>
              Library Administration System
            </span>

          </footer>

        </div>

      </main>


      {/* ADD BOOK MODAL */}
      {showModal && (

        <div
          className="book-modal-overlay"
          onClick={() => setShowModal(false)}
        >

          <div
            className="book-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="book-modal-header">

              <div>

                <span>
                  📚
                </span>

                <div>

                  <h2>
                    Add New Book
                  </h2>

                  <p>
                    Add a new book to the library.
                  </p>

                </div>

              </div>

              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>

            </div>


            <form
              className="add-book-form"
              onSubmit={handleAddBook}
            >

              <div className="form-row">

                <div className="admin-book-form-group">

                  <label>
                    Book Title *
                  </label>

                  <input
                    type="text"
                    placeholder="Enter book title"
                    value={newBook.title}
                    onChange={(e) =>
                      setNewBook({
                        ...newBook,
                        title: e.target.value,
                      })
                    }
                  />

                </div>


                <div className="admin-book-form-group">

                  <label>
                    Author *
                  </label>

                  <input
                    type="text"
                    placeholder="Enter author name"
                    value={newBook.author}
                    onChange={(e) =>
                      setNewBook({
                        ...newBook,
                        author: e.target.value,
                      })
                    }
                  />

                </div>

              </div>


              <div className="form-row">

                <div className="admin-book-form-group">

                  <label>
                    Category *
                  </label>

                  <select
                    value={newBook.category}
                    onChange={(e) =>
                      setNewBook({
                        ...newBook,
                        category: e.target.value,
                      })
                    }
                  >
                    <option>
                      Technology
                    </option>

                    <option>
                      Self Help
                    </option>

                    <option>
                      Finance
                    </option>

                    <option>
                      Fiction
                    </option>

                    <option>
                      Business
                    </option>
                  </select>

                </div>


                <div className="admin-book-form-group">

                  <label>
                    ISBN *
                  </label>

                  <input
                    type="text"
                    placeholder="Enter ISBN"
                    value={newBook.isbn}
                    onChange={(e) =>
                      setNewBook({
                        ...newBook,
                        isbn: e.target.value,
                      })
                    }
                  />

                </div>

              </div>


              <div className="admin-book-form-group">

                <label>
                  Number of Copies *
                </label>

                <input
                  type="number"
                  min="0"
                  placeholder="Enter number of copies"
                  value={newBook.copies}
                  onChange={(e) =>
                    setNewBook({
                      ...newBook,
                      copies: e.target.value,
                    })
                  }
                />

              </div>


              <div className="modal-form-actions">

                <button
                  type="button"
                  className="modal-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="modal-submit"
                >
                  ＋ Add Book
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminBooks;