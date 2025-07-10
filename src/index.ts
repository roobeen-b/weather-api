import express from "express";
import dotenv from "dotenv";
dotenv.config();
import redisClient from "./utils/redisClient";
import weatherRoutes from "./routes/weatherRoutes";
import errorHandler from "./middlewares/errorhandler";
import weatherLimiter from "./middlewares/rateLimiter";

const app = express();
const PORT = "4000";

(async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log("✅ Redis connected");
    }
  } catch (err) {
    console.error("❌ Redis connection failed:", err);
  }
})();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Success",
  });
});

app.use("/api/v1", weatherLimiter, weatherRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
