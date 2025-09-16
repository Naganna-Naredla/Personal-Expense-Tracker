import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Reports({ token }) {
  const [monthly, setMonthly] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId || !token) {
      setError("Please log in to view reports");
      setLoading(false);
      return;
    }

    const fetchMonthlyExpenses = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/expenses/summary/monthly/${userId}`, {
          headers: { "x-auth-token": token },
          params: { year: selectedYear },
        });

        console.log("Raw API response:", res.data); // Check browser console

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const formattedData = (res.data || []).map((item) => {
          const monthNum = item.month || item._id?.month;
          const yearNum = item.year || item._id?.year;
          const total = item.total || 0;

          if (monthNum && yearNum) {
            return {
              month: `${months[monthNum - 1]} ${yearNum}`,
              total,
            };
          }
          return { month: "No Data", total: 0 };
        });

        console.log("Formatted data:", formattedData); // Check browser console

        setMonthly(formattedData);
        setError(null);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load data. Check console.");
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyExpenses();
  }, [userId, token, selectedYear]);

  return (
    <div className="reports-page">
      <h1>📊 Monthly Expense Report</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && monthly.length > 0 && (
        <>
          <section className="report-section">
            <h2>Monthly Overview for {selectedYear}</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthly.filter(d => d.month !== "No Data")}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                <Legend />
                <Bar dataKey="total" fill="#2a5298" />
              </BarChart>
            </ResponsiveContainer>
          </section>
          <section className="report-section">
            <h2>Summary for {selectedYear}</h2>
            <table className="expense-table">
              <thead><tr><th>Month</th><th>Total (₹)</th></tr></thead>
              <tbody>
                {monthly.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.month}</td>
                    <td>₹{entry.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}
      {!loading && !error && monthly.length === 0 && <p>No data for {selectedYear}.</p>}
    </div>
  );
}

export default Reports;