import { useEffect, useState } from "react";
import { Container, Card, Spinner, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";

const SummaryPage = () => {
  const idToken = useSelector((state) => state.auth.token);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSummary = async () => {
    if (!idToken) return;
    setLoading(true);

    try {
      const response = await fetch(
        "https://expense-tracker-backend-ut31.onrender.com/api/expenses/summary",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${idToken}` },
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch summary");
      setSummary(data);
    } catch (err) {
      console.error("Summary fetch error:", err.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchSummary();
  }, [idToken]);

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status" />
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center">Monthly Expense Summary</h2>
      {summary.length === 0 ? (
        <p className="text-center">No expenses recorded this month.</p>
      ) : (
        <Row className="g-3">
          {summary.map((s) => (
            <Col key={s.category} xs={12} sm={6} md={4}>
              <Card className="shadow-sm h-100 text-center p-3">
                <Card.Body>
                  <Card.Title className="mb-2">{s.category}</Card.Title>
                  <Card.Text className="fs-5 fw-bold">${s.total}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default SummaryPage;
