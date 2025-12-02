import { useEffect, useRef, useState } from "react";
import { Button, Card, Container, Form, Spinner } from "react-bootstrap";

const ExpenseForm = ({ onAddExpense, editingExpense }) => {
  const [loading, setLoading] = useState(false);

  const expenseRef = useRef();
  const descriptionRef = useRef();
  const categoryRef = useRef();

  useEffect(() => {
    if (editingExpense) {
      expenseRef.current.value = editingExpense.amount;
      descriptionRef.current.value = editingExpense.description;
      categoryRef.current.value = editingExpense.category;
    } else {
      expenseRef.current.value = "";
      descriptionRef.current.value = "";
      categoryRef.current.value = "";
    }
  }, [editingExpense]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const expenseData = {
      amount: Number(expenseRef.current.value),
      description: descriptionRef.current.value,
      category: categoryRef.current.value,
    };

    await onAddExpense(expenseData);

    setLoading(false);

    if (!editingExpense) {
      expenseRef.current.value = "";
      descriptionRef.current.value = "";
      categoryRef.current.value = "";
    }
  };

  return (
    <Container className="my-5" style={{ maxWidth: "400px" }}>
      <Card style={{ width: "22rem" }} className="py-3">
        <Card.Body>
          <Card.Title className="text-center mb-3">
            {editingExpense ? "Edit Expense" : "Expense Entry"}
          </Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Expense</Form.Label>
              <Form.Control
                type="number"
                placeholder="Expense"
                ref={expenseRef}
                min={0}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Description"
                ref={descriptionRef}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select ref={categoryRef} required>
                <option value="">Select Category</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Shopping">Shopping</option>
                <option value="Utilities">Utilities</option>
                <option value="Petrol">Petrol</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>

            <div className="d-grid gap-2">
              <Button
                type="submit"
                variant="primary"
                style={{ borderRadius: "20px" }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />{" "}
                    {editingExpense ? "Updating..." : "Adding..."}
                  </>
                ) : editingExpense ? (
                  "Update Expense"
                ) : (
                  "Add Expense"
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ExpenseForm;
