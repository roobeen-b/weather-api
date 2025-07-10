import express from "express";
import { getWeather } from "../controllers/weatherController";

const router = express.Router();

router.get("/weather/:location", getWeather);
router.get("/weather/:location/:date1", getWeather);
router.get("/weather/:location/:date1/:date2", getWeather);

export default router;
