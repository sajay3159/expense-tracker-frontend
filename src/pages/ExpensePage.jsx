import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Toast } from "react-bootstrap";
import ExpenseForm from "../components/Expense/ExpenseForm";
import ExpenseTable from "../components/Expense/ExpenseTable";
import { expensesActions } from "../store/expensesSlice";

const ExpensePage = () => {
  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.expenses.items);
  const idToken = useSelector((state) => state.auth.token);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });
  const [loading, setLoading] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  // Fetch all expenses
  const fetchExpenses = async () => {
    if (!idToken) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://expense-tracker-backend-ut31.onrender.com/api/expenses`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${idToken}` },
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch expenses");

      // Map _id to id
      const loadedExpenses = data.map((exp) => ({
        id: exp._id,
        ...exp,
      }));

      dispatch(expensesActions.setExpenses(loadedExpenses));
    } catch (err) {
      console.error("Fetch error:", err.message);
    }
    setLoading(false);
  };

  // Add or update expense
  const saveExpenseHandler = async (expenseData) => {
    if (!idToken) return;
    setLoading(true);

    const isUpdate = !!editingExpense?.id;
    const url = isUpdate
      ? `https://expense-tracker-backend-ut31.onrender.com/api/expenses/${editingExpense.id}`
      : `https://expense-tracker-backend-ut31.onrender.com/api/expenses`;
    const method = isUpdate ? "PATCH" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expenseData),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to save expense");

      setToast({
        show: true,
        message: isUpdate
          ? "Expense updated successfully"
          : "Expense added successfully",
        variant: "success",
      });

      if (isUpdate) {
        dispatch(
          expensesActions.updateExpense({
            id: editingExpense.id,
            ...expenseData,
          })
        );
      } else {
        // MongoDB returns _id
        dispatch(expensesActions.addExpense({ id: data._id, ...expenseData }));
      }

      setEditingExpense(null);
    } catch (err) {
      console.error("Save error:", err.message);
    }
    setLoading(false);
  };

  // Edit expense locally
  const editExpenseHandler = (id) => {
    const editing = expenses.find((e) => e.id === id);
    if (editing) setEditingExpense(editing);
  };

  // Delete expense
  const deleteExpenseHandler = async (id) => {
    if (!idToken) return;
    setLoading(true);

    try {
      const response = await fetch(
        `https://expense-tracker-backend-ut31.onrender.com/api/expenses/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${idToken}` },
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to delete expense");

      dispatch(expensesActions.deleteExpense(id));
      setToast({
        show: true,
        message: "Expense deleted successfully",
        variant: "danger",
      });
    } catch (err) {
      console.error("Delete error:", err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExpenses();
  }, [idToken]);

  return (
    <Container className="my-4">
      <ExpenseForm
        onAddExpense={saveExpenseHandler}
        editingExpense={editingExpense}
      />
      <ExpenseTable
        expenses={expenses}
        loading={loading}
        onDeleteExpense={deleteExpenseHandler}
        onEditExpense={editExpenseHandler}
      />
      <Toast
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        delay={4000}
        autohide
        bg={toast.variant}
        style={{ position: "fixed", top: 20, right: 20, zIndex: 9999 }}
      >
        <Toast.Body className="text-white">{toast.message}</Toast.Body>
      </Toast>
    </Container>
  );
};

export default ExpensePage;
