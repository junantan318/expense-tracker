import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { removeToken } from "../services/auth";

function Dashboard() {
  const navigate = useNavigate();

  const recentExpenses = [
    {
      id: 1,
      description: "Groceries",
      category: "Food",
      amount: 85.5,
      date: "2026-07-12",
    },
    {
      id: 2,
      description: "Fuel",
      category: "Transport",
      amount: 60,
      date: "2026-07-11",
    },
    {
      id: 3,
      description: "Internet bill",
      category: "Utilities",
      amount: 120,
      date: "2026-07-10",
    },
  ];

function handleLogout() {
  removeToken();
  navigate("/login", {
    replace: true,
  });
}

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div>
          <h2 className="logo">ExpenseTracker</h2>

          <nav className="navigation">
            <button className="nav-item active">Dashboard</button>
            <button
              className="nav-item"
              onClick={() => navigate("/expenses")}
            >
              Expenses
            </button>
            <button
              className="nav-item"
              onClick={() => navigate("/categories")}
            >
              Categories
            </button>
          </nav>
        </div>

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Track and manage your spending.</p>
          </div>

          <button
            className="primary-button"
            onClick={() => navigate("/expenses/new")}
          >
            Add Expense
          </button>
        </header>

        <section className="summary-grid">
          <article className="summary-card">
            <p>Total Spending</p>
            <h2>RM 2,450.00</h2>
            <span>All recorded expenses</span>
          </article>

          <article className="summary-card">
            <p>This Month</p>
            <h2>RM 780.50</h2>
            <span>July 2026</span>
          </article>

          <article className="summary-card">
            <p>This Year</p>
            <h2>RM 6,920.30</h2>
            <span>January to July</span>
          </article>

          <article className="summary-card">
            <p>Top Category</p>
            <h2>Food</h2>
            <span>RM 1,250.00 spent</span>
          </article>
        </section>

        <section className="dashboard-grid">
          <article className="panel spending-panel">
            <div className="panel-header">
              <div>
                <h2>Monthly Spending</h2>
                <p>Your spending overview</p>
              </div>
            </div>

            <div className="chart-placeholder">
              <p>Chart will be added later</p>
            </div>
          </article>

          <article className="panel category-panel">
            <div className="panel-header">
              <div>
                <h2>Spending by Category</h2>
                <p>Current month</p>
              </div>
            </div>

            <div className="category-list">
              <div className="category-row">
                <span>Food</span>
                <strong>RM 320.00</strong>
              </div>

              <div className="category-row">
                <span>Transport</span>
                <strong>RM 180.00</strong>
              </div>

              <div className="category-row">
                <span>Utilities</span>
                <strong>RM 150.00</strong>
              </div>

              <div className="category-row">
                <span>Entertainment</span>
                <strong>RM 130.50</strong>
              </div>
            </div>
          </article>
        </section>

        <section className="panel recent-expenses">
          <div className="panel-header">
            <div>
              <h2>Recent Expenses</h2>
              <p>Your latest transactions</p>
            </div>

            <button
              className="secondary-button"
              onClick={() => navigate("/expenses")}
            >
              View All
            </button>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Amount</th>
                </tr>
              </thead>

              <tbody>
                {recentExpenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>{expense.description}</td>
                    <td>
                      <span className="category-badge">
                        {expense.category}
                      </span>
                    </td>
                    <td>{expense.date}</td>
                    <td className="amount">
                      RM {expense.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;