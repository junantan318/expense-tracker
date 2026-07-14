import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Expenses.css";

const initialFormData = {
  title: "",
  description: "",
  amount: "",
  date: "",
  category_id: "",
};

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

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState(initialFormData);
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadPageData();
  }, []);

  async function loadPageData() {
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
          "Unable to load expenses. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  function openAddForm() {
    setEditingExpenseId(null);
    setFormData(initialFormData);
    setError("");
    setIsFormOpen(true);
  }

function openEditForm(expense) {
  setEditingExpenseId(expense.id);

  setFormData({
    title: expense.title ?? "",
    description: expense.description ?? "",
    amount: expense.amount?.toString() ?? "",
    date: getDateOnly(expense.date),
    category_id: expense.category_id?.toString() ?? "",
  });

  setError("");
  setIsFormOpen(true);
}

  function closeForm() {
    setEditingExpenseId(null);
    setFormData(initialFormData);
    setIsFormOpen(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (Number(formData.amount) <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }

    const expenseData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      amount: Number(formData.amount),
      date: formData.date,
      category_id: Number(formData.category_id),
    };

    setIsSubmitting(true);

    try {
    const payload = {
        ...expenseData,
        amount: Number(expenseData.amount),
        category_id:
        expenseData.category_id === "" ||
        Number(expenseData.category_id) === 0
            ? null
            : Number(expenseData.category_id),
    };

    if (editingExpenseId) {
        const response = await api.put(
        `/expenses/${editingExpenseId}`,
        payload
        );

        setExpenses((currentExpenses) =>
        currentExpenses.map((expense) =>
            expense.id === editingExpenseId ? response.data : expense
        )
        );
    } else {
        const response = await api.post("/expenses/", payload);

        setExpenses((currentExpenses) => [
        response.data,
        ...currentExpenses,
        ]);
    }

    closeForm();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.detail ||
          "Unable to save the expense. Check the form and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(expenseId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/expenses/${expenseId}`);

      setExpenses((currentExpenses) =>
        currentExpenses.filter((expense) => expense.id !== expenseId)
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.detail ||
          "Unable to delete the expense."
      );
    }
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

  const filteredExpenses = useMemo(() => {
    const normalizedSearch = searchFilter.trim().toLowerCase();

    return expenses
      .filter((expense) => {
        const expenseDate = getDateOnly(expense.date);

        const matchesCategory =
          !categoryFilter ||
          expense.category_id === Number(categoryFilter);

        const matchesStartDate =
          !startDateFilter || expenseDate >= startDateFilter;

        const matchesEndDate =
          !endDateFilter || expenseDate <= endDateFilter;

        const matchesSearch =
          !normalizedSearch ||
          [expense.title, expense.description]
            .filter(Boolean)
            .some((value) =>
              value
                .toString()
                .toLowerCase()
                .includes(normalizedSearch)
            );

        return (
          matchesCategory &&
          matchesStartDate &&
          matchesEndDate &&
          matchesSearch
        );
      })
      .sort((expenseA, expenseB) => {
        const dateComparison = getDateOnly(expenseB.date).localeCompare(
          getDateOnly(expenseA.date)
        );

        if (dateComparison !== 0) {
          return dateComparison;
        }

        return expenseB.id - expenseA.id;
      });
  }, [
    expenses,
    categoryFilter,
    searchFilter,
    startDateFilter,
    endDateFilter,
  ]);

  const totalFilteredAmount = filteredExpenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0
  );

  return (
    <div className="expenses-page">
      <aside className="expenses-sidebar">
        <div>
          <h2 className="expenses-logo">ExpenseTracker</h2>

          <nav className="expenses-navigation">
            <button onClick={() => navigate("/dashboard/")}>
              Dashboard
            </button>

            <button className="active">Expenses</button>

            <button onClick={() => navigate("/categories/")}>
              Categories
            </button>
          </nav>
        </div>
      </aside>

      <main className="expenses-content">
        <header className="expenses-header">
          <div>
            <h1>Expenses</h1>
            <p>Add, review, and manage your spending.</p>
          </div>

          <button
            className="expenses-primary-button"
            onClick={openAddForm}
          >
            Add Expense
          </button>
        </header>

        {error && <p className="expenses-error">{error}</p>}

        <section className="expenses-summary-card">
          <div>
            <span>Filtered total</span>
            <strong>RM {totalFilteredAmount.toFixed(2)}</strong>
          </div>

          <div>
            <span>Transactions</span>
            <strong>{filteredExpenses.length}</strong>
          </div>
        </section>

        <section className="expenses-filters">
          <div className="expense-filter-group">
            <label htmlFor="searchFilter">Search</label>

            <input
              id="searchFilter"
              type="text"
              placeholder="Search title or description"
              value={searchFilter}
              onChange={(event) => setSearchFilter(event.target.value)}
            />
          </div>

          <div className="expense-filter-group">
            <label htmlFor="categoryFilter">Category</label>

            <select
              id="categoryFilter"
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(event.target.value)
              }
            >
              <option value="">All categories</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="expense-filter-group">
            <label htmlFor="startDate">Start date</label>

            <input
              id="startDate"
              type="date"
              value={startDateFilter}
              onChange={(event) =>
                setStartDateFilter(event.target.value)
              }
            />
          </div>

          <div className="expense-filter-group">
            <label htmlFor="endDate">End date</label>

            <input
              id="endDate"
              type="date"
              value={endDateFilter}
              onChange={(event) =>
                setEndDateFilter(event.target.value)
              }
            />
          </div>

          <button
            className="expenses-clear-button"
            onClick={() => {
              setCategoryFilter("");
              setSearchFilter("");
              setStartDateFilter("");
              setEndDateFilter("");
            }}
          >
            Clear filters
          </button>
        </section>

        <section className="expenses-table-card">
          {isLoading ? (
            <p className="expenses-status">Loading expenses...</p>
          ) : filteredExpenses.length === 0 ? (
            <div className="expenses-empty-state">
              <h2>No expenses found</h2>
              <p>Add an expense or change the current filters.</p>

              <button
                className="expenses-primary-button"
                onClick={openAddForm}
              >
                Add your first expense
              </button>
            </div>
          ) : (
            <div className="expenses-table-wrapper">
              <table className="expenses-table">
                <thead>
                <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Actions</th>
                </tr>
                </thead>

                <tbody>
                  {filteredExpenses.map((expense) => (
                <tr key={expense.id}>
                <td>{expense.title}</td>

                <td>
                    {expense.description ? (
                    expense.description
                    ) : (
                    <span className="expense-muted">No description</span>
                    )}
                </td>

                <td>
                    <span className="expense-category-badge">
                    {getCategoryName(expense)}
                    </span>
                </td>

                <td>{formatDate(expense.date)}</td>

                <td className="expense-amount">
                    RM {Number(expense.amount).toFixed(2)}
                </td>

                <td>
                    <div className="expense-action-buttons">
                    <button
                        className="expense-edit-button"
                        onClick={() => openEditForm(expense)}
                    >
                        Edit
                    </button>

                    <button
                        className="expense-delete-button"
                        onClick={() => handleDelete(expense.id)}
                    >
                        Delete
                    </button>
                    </div>
                </td>
                </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {isFormOpen && (
        <div
          className="expense-modal-backdrop"
          onMouseDown={closeForm}
        >
          <section
            className="expense-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="expense-modal-header">
              <div>
                <h2>
                  {editingExpenseId
                    ? "Edit Expense"
                    : "Add Expense"}
                </h2>

                <p>
                  Enter the transaction details below.
                </p>
              </div>

              <button
                className="expense-modal-close"
                type="button"
                onClick={closeForm}
              >
                ×
              </button>
            </div>

            <form
              className="expense-form"
              onSubmit={handleSubmit}
            >
            <div className="expense-form-group">
            <label htmlFor="title">Title</label>

            <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="For example, Groceries"
                required
            />
            </div>

            <div className="expense-form-group">
            <label htmlFor="description">
                Description <span className="optional-label">(optional)</span>
            </label>

            <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Add extra details"
                rows="4"
            />
            </div>

              <div className="expense-form-group">
                <label htmlFor="amount">Amount</label>

                <input
                  id="amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleInputChange}
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="expense-form-group">
                <label htmlFor="date">Date</label>

                <input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="expense-form-group">
                <label htmlFor="category_id">Category</label>

                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                >
                  <option value="">Select a category</option>

                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="expense-form-actions">
                <button
                  className="expenses-cancel-button"
                  type="button"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button
                  className="expenses-primary-button"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Saving..."
                    : editingExpenseId
                      ? "Save changes"
                      : "Add expense"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default Expenses;