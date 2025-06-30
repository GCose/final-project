const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDatabase } = require("./config/database");
const { runSeeders } = require("./seeders");
const routes = require("./routes/index");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", routes);

app.get("/", (_req, res) => {
  res.json({
    message: "Role-Based Authentication API is running.",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

const startServer = async () => {
  try {
    await connectDatabase();

    await runSeeders();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
