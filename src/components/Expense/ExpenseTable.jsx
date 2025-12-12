import { useState } from "react";
import { Button, Spinner, Table } from "react-bootstrap";

const ExpenseTable = ({
  expenses,
  loading,
  onDeleteExpense,
  onEditExpense,
}) => {
  const totalExpense = expenses.reduce(
    (sum, exp) => sum + Number(exp.amount || 0),
    0
  );

  const [currPage, setCurrPage] = useState(1);
  const itemPerPage = 3;

  const startIndex = (currPage - 1) * itemPerPage;
  const expenseData = expenses.slice(startIndex, startIndex + itemPerPage);

  const downloadCSV = () => {
    if (!expenses.length) return;

    const headers = ["S.No", "Expense", "Description", "Category"];

    // CSV rows
    const rows = expenses.map((exp, idx) => [
      idx + 1,
      exp.amount,
      exp.description,
      exp.category,
    ]);

    // Combine headers and rows
    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");

    // Create a blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Expense_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (expenses.length === 0) {
    return <p className="text-center">No expenses added yet.</p>;
  }

  return (
    <>
      <div className="text-end">
        <Button
          variant="success"
          className="rounded-pill px-4 mb-3 shadow-sm"
          onClick={downloadCSV}
        >
          Download Report
        </Button>
      </div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Expense (₹)</th>
            <th>Description</th>
            <th>Category</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {expenseData.map((exp, idx) => (
            <tr key={exp.id}>
              <td>{idx + 1}</td>
              <td>{exp.amount}</td>
              <td>{exp.description}</td>
              <td>{exp.category}</td>
              <td>
                <Button
                  variant="info"
                  className="me-3"
                  onClick={() => onEditExpense(exp.id)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => onDeleteExpense(exp.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan="5" className="text-end fw-bold">
              Total Spent: ₹{totalExpense}
            </td>
          </tr>
          <tr>
            <td colSpan="5" className="text-end fw-bold"></td>
          </tr>
        </tbody>
      </Table>
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Button
          onClick={() => setCurrPage((p) => p - 1)}
          disabled={currPage === 1}
        >
          Previous
        </Button>
        <span>
          Page{currPage} of {Math.ceil(expenses.length / itemPerPage)}
        </span>
        <Button
          onClick={() => setCurrPage((p) => p + 1)}
          disabled={startIndex + itemPerPage >= expenses.length}
        >
          Next
        </Button>
      </div>
    </>
  );
};

export default ExpenseTable;
