import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { removeToken } from "../services/auth";
import "./Dashboard.css";

function getDateOnly(dateValue) {
  if (!dateValue) {
    return "";
  }

  return dateValue.toString().split("T")[0].split(" ")[0];
}

function formatDate(dateValue) {
  const dateOnly = getDateOnly(dateValue);

  if (!dateOnly) {
    return "No date";
  }

  const [year, month, day] = dateOnly.split("-");

  return `${day}/${month}/${year}`;
}

function formatCurrency(amount) {
  return `RM ${Number(amount || 0).toFixed(2)}`;
}

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    setIsLoading(true);
    setError("");

    try {
      const [expensesResponse, categoriesResponse] = await Promise.all([
        api.get("/expenses/"),
        api.get("/categories/"),
      ]);

      setExpenses(expensesResponse.data);
      setCategories(categoriesResponse.data);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.detail ||
          "Unable to load dashboard information."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleLogout() {
    removeToken();

    navigate("/login/", {
      replace: true,
    });
  }

  function getCategoryName(expense) {
    if (expense.category?.name) {
      return expense.category.name;
    }

    const category = categories.find(
      (item) => item.id === expense.category_id
    );

    return category?.name || "Uncategorized";
  }

  const dashboardData = useMemo(() => {
    const today = new Date();

    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    const currentMonthString = String(currentMonth).padStart(2, "0");
    const currentYearString = String(currentYear);

    const totalSpending = expenses.reduce(
      (total, expense) => total + Number(expense.amount),
      0
    );

    const monthlyExpenses = expenses.filter((expense) => {
      const expenseDate = getDateOnly(expense.date);

      return expenseDate.startsWith(
        `${currentYearString}-${currentMonthString}`
      );
    });

    const monthlySpending = monthlyExpenses.reduce(
      (total, expense) => total + Number(expense.amount),
      0
    );

    const yearlyExpenses = expenses.filter((expense) => {
      const expenseDate = getDateOnly(expense.date);

      return expenseDate.startsWith(currentYearString);
    });

    const yearlySpending = yearlyExpenses.reduce(
      (total, expense) => total + Number(expense.amount),
      0
    );

    const categoryTotals = {};

    monthlyExpenses.forEach((expense) => {
      const categoryName = getCategoryName(expense);

      categoryTotals[categoryName] =
        (categoryTotals[categoryName] || 0) +
        Number(expense.amount);
    });

    const spendingByCategory = Object.entries(categoryTotals)
      .map(([name, amount]) => ({
        name,
        amount,
      }))
      .sort((categoryA, categoryB) => {
        return categoryB.amount - categoryA.amount;
      });

    const topCategory = spendingByCategory[0] || null;

    const recentExpenses = [...expenses]
      .sort((expenseA, expenseB) => {
        const dateComparison = getDateOnly(
          expenseB.date
        ).localeCompare(getDateOnly(expenseA.date));

        if (dateComparison !== 0) {
          return dateComparison;
        }

        return expenseB.id - expenseA.id;
      })
      .slice(0, 5);

    const monthTotals = Array.from({ length: 12 }, (_, index) => ({
      monthNumber: index + 1,
      monthName: new Date(currentYear, index, 1).toLocaleString(
        "en-MY",
        {
          month: "short",
        }
      ),
      amount: 0,
    }));

    yearlyExpenses.forEach((expense) => {
      const expenseDate = getDateOnly(expense.date);
      const monthNumber = Number(expenseDate.split("-")[1]);

      if (monthNumber >= 1 && monthNumber <= 12) {
        monthTotals[monthNumber - 1].amount += Number(
          expense.amount
        );
      }
    });

    const highestMonthlyAmount = Math.max(
      ...monthTotals.map((month) => month.amount),
      0
    );

    return {
      totalSpending,
      monthlySpending,
      yearlySpending,
      topCategory,
      spendingByCategory,
      recentExpenses,
      monthTotals,
      highestMonthlyAmount,
    };
  }, [expenses, categories]);

  const currentMonthName = new Date().toLocaleString("en-MY", {
    month: "long",
    year: "numeric",
  });

  const currentYear = new Date().getFullYear();

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div>
          <h2 className="logo">ExpenseTracker</h2>

          <nav className="navigation">
            <button className="nav-item active">
              Dashboard
            </button>

            <button
              className="nav-item"
              onClick={() => navigate("/expenses/")}
            >
              Expenses
            </button>

            <button
              className="nav-item"
              onClick={() => navigate("/categories/")}
            >
              Categories
            </button>
          </nav>
        </div>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
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
            onClick={() => navigate("/expenses/")}
          >
            Add Expense
          </button>
        </header>

        {error && <p className="dashboard-error">{error}</p>}

        {isLoading ? (
          <section className="panel dashboard-loading">
            <p>Loading dashboard...</p>
          </section>
        ) : (
          <>
            <section className="summary-grid">
              <article className="summary-card">
                <p>Total Spending</p>

                <h2>
                  {formatCurrency(dashboardData.totalSpending)}
                </h2>

                <span>
                  {expenses.length} recorded transaction
                  {expenses.length === 1 ? "" : "s"}
                </span>
              </article>

              <article className="summary-card">
                <p>This Month</p>

                <h2>
                  {formatCurrency(dashboardData.monthlySpending)}
                </h2>

                <span>{currentMonthName}</span>
              </article>

              <article className="summary-card">
                <p>This Year</p>

                <h2>
                  {formatCurrency(dashboardData.yearlySpending)}
                </h2>

                <span>January to December {currentYear}</span>
              </article>

              <article className="summary-card">
                <p>Top Category</p>

                <h2>
                  {dashboardData.topCategory?.name || "None"}
                </h2>

                <span>
                  {dashboardData.topCategory
                    ? `${formatCurrency(
                        dashboardData.topCategory.amount
                      )} spent this month`
                    : "No expenses this month"}
                </span>
              </article>
            </section>

            <section className="dashboard-grid">
              <article className="panel spending-panel">
                <div className="panel-header">
                  <div>
                    <h2>Monthly Spending</h2>
                    <p>{currentYear} spending overview</p>
                  </div>
                </div>

                <div className="monthly-chart">
                  {dashboardData.monthTotals.map((month) => {
                    const barHeight =
                      dashboardData.highestMonthlyAmount > 0
                        ? (month.amount /
                            dashboardData.highestMonthlyAmount) *
                          100
                        : 0;

                    return (
                      <div
                        className="monthly-chart-column"
                        key={month.monthNumber}
                      >
                        <div className="monthly-chart-area">
                          {month.amount > 0 && (
                            <div
                              className="monthly-chart-bar"
                              style={{
                                height: `${barHeight}%`,
                              }}
                              tabIndex={0}
                              aria-label={`${month.monthName}: ${formatCurrency(
                                month.amount
                              )}`}
                            >
                              <span className="monthly-chart-tooltip">
                                {formatCurrency(month.amount)}
                              </span>
                            </div>
                          )}
                        </div>

                        <span className="monthly-chart-label">
                          {month.monthName}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </article>

              <article className="panel category-panel">
                <div className="panel-header">
                  <div>
                    <h2>Spending by Category</h2>
                    <p>{currentMonthName}</p>
                  </div>
                </div>

                {dashboardData.spendingByCategory.length === 0 ? (
                  <div className="dashboard-empty">
                    <p>No category spending this month.</p>
                  </div>
                ) : (
                  <div className="category-list">
                    {dashboardData.spendingByCategory.map(
                      (category) => (
                        <div
                          className="category-row"
                          key={category.name}
                        >
                          <span>{category.name}</span>

                          <strong>
                            {formatCurrency(category.amount)}
                          </strong>
                        </div>
                      )
                    )}
                  </div>
                )}
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
                  onClick={() => navigate("/expenses/")}
                >
                  View All
                </button>
              </div>

              {dashboardData.recentExpenses.length === 0 ? (
                <div className="dashboard-empty">
                  <p>No expenses have been added yet.</p>

                  <button
                    className="primary-button"
                    onClick={() => navigate("/expenses/")}
                  >
                    Add your first expense
                  </button>
                </div>
              ) : (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Date</th>
                        <th>Amount</th>
                      </tr>
                    </thead>

                    <tbody>
                      {dashboardData.recentExpenses.map(
                        (expense) => (
                          <tr key={expense.id}>
                            <td>{expense.title}</td>

                            <td>
                              <span className="category-badge">
                                {getCategoryName(expense)}
                              </span>
                            </td>

                            <td>{formatDate(expense.date)}</td>

                            <td className="amount">
                              {formatCurrency(expense.amount)}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;