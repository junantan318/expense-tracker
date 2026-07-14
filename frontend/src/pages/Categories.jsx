import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Categories.css";

const initialFormData = {
  name: "",
};

function Categories() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(initialFormData);

  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    setIsLoading(true);
    setError("");

    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.detail ||
          "Unable to load categories. Please try again."
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
    setEditingCategoryId(null);
    setFormData(initialFormData);
    setError("");
    setIsFormOpen(true);
  }

  function openEditForm(category) {
    setEditingCategoryId(category.id);

    setFormData({
      name: category.name,
    });

    setError("");
    setIsFormOpen(true);
  }

  function closeForm() {
    setEditingCategoryId(null);
    setFormData(initialFormData);
    setIsFormOpen(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const trimmedName = formData.name.trim();

    if (!trimmedName) {
      setError("Category name is required.");
      return;
    }

    const categoryData = {
      name: trimmedName,
    };

    setIsSubmitting(true);

    try {
      if (editingCategoryId) {
        const response = await api.put(
          `/categories/${editingCategoryId}`,
          categoryData
        );

        setCategories((currentCategories) =>
          currentCategories.map((category) =>
            category.id === editingCategoryId
              ? response.data
              : category
          )
        );
      } else {
        const response = await api.post("/categories", categoryData);

        setCategories((currentCategories) => [
          ...currentCategories,
          response.data,
        ]);
      }

      closeForm();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.detail ||
          "Unable to save the category."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(category) {
    const confirmed = window.confirm(
      `Delete the category "${category.name}"?`
    );

    if (!confirmed) {
      return;
    }

    setDeletingCategoryId(category.id);
    setError("");

    try {
      await api.delete(`/categories/${category.id}`);

      setCategories((currentCategories) =>
        currentCategories.filter(
          (currentCategory) =>
            currentCategory.id !== category.id
        )
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.detail ||
          "Unable to delete this category. It may still be used by an expense."
      );
    } finally {
      setDeletingCategoryId(null);
    }
  }

  return (
    <div className="categories-page">
      <aside className="categories-sidebar">
        <div>
          <h2 className="categories-logo">ExpenseTracker</h2>

          <nav className="categories-navigation">
            <button onClick={() => navigate("/dashboard")}>
              Dashboard
            </button>

            <button onClick={() => navigate("/expenses")}>
              Expenses
            </button>

            <button className="active">
              Categories
            </button>
          </nav>
        </div>
      </aside>

      <main className="categories-content">
        <header className="categories-header">
          <div>
            <h1>Categories</h1>
            <p>Organize your expenses into spending groups.</p>
          </div>

          <button
            className="categories-primary-button"
            onClick={openAddForm}
          >
            Add Category
          </button>
        </header>

        {error && (
          <p className="categories-error">{error}</p>
        )}

        <section className="categories-summary">
          <div>
            <span>Total categories</span>
            <strong>{categories.length}</strong>
          </div>
        </section>

        <section className="categories-card">
          {isLoading ? (
            <p className="categories-status">
              Loading categories...
            </p>
          ) : categories.length === 0 ? (
            <div className="categories-empty-state">
              <h2>No categories yet</h2>

              <p>
                Create categories such as Food, Transport, or
                Utilities.
              </p>

              <button
                className="categories-primary-button"
                onClick={openAddForm}
              >
                Add your first category
              </button>
            </div>
          ) : (
            <div className="categories-grid">
              {categories.map((category) => (
                <article
                  className="category-card"
                  key={category.id}
                >
                  <div className="category-card-header">
                    <div className="category-icon">
                      {category.name
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <h2>{category.name}</h2>

                      <p>
                        {category.expense_count !== undefined
                          ? `${category.expense_count} expenses`
                          : "Expense category"}
                      </p>
                    </div>
                  </div>

                  <div className="category-card-actions">
                    <button
                      className="category-edit-button"
                      onClick={() =>
                        openEditForm(category)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="category-delete-button"
                      onClick={() =>
                        handleDelete(category)
                      }
                      disabled={
                        deletingCategoryId === category.id
                      }
                    >
                      {deletingCategoryId === category.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {isFormOpen && (
        <div
          className="category-modal-backdrop"
          onMouseDown={closeForm}
        >
          <section
            className="category-modal"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <div className="category-modal-header">
              <div>
                <h2>
                  {editingCategoryId
                    ? "Edit Category"
                    : "Add Category"}
                </h2>

                <p>
                  Choose a clear name for this spending group.
                </p>
              </div>

              <button
                className="category-modal-close"
                type="button"
                onClick={closeForm}
              >
                ×
              </button>
            </div>

            <form
              className="category-form"
              onSubmit={handleSubmit}
            >
              <div className="category-form-group">
                <label htmlFor="name">
                  Category name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="For example, Food"
                  maxLength={50}
                  autoFocus
                  required
                />
              </div>

              <div className="category-form-actions">
                <button
                  className="categories-cancel-button"
                  type="button"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button
                  className="categories-primary-button"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Saving..."
                    : editingCategoryId
                      ? "Save changes"
                      : "Add category"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default Categories;