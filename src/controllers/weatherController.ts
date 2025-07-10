import { Request, Response } from "express";
import axiosWithRetry from "../utils/axiosWithRetry";
import redisClient from "../utils/redisClient";

const getWeather = async (req: Request, res: Response) => {
  try {
    if (!process.env.WEATHER_API_KEY) {
      res
        .status(500)
        .json({ success: false, message: "Server error: Missing API key" });
      return;
    }

    const { location, date1, date2 } = req.params;
    if (!location) {
      res.status(400).json({
        success: false,
        message: "Location is required",
      });
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const start = date1 ?? today;
    const end = date2 ?? start;

    const cacheKey = `${location}:${start}:${end}`;
    const cached = await redisClient.get(cacheKey);

    if (cached) {
      console.log("🔁 Cache hit");
      res.status(200).json({
        success: true,
        message: "Success (from cache)",
        data: JSON.parse(cached),
      });
    }

    console.log("🌐 Cache miss – fetching from API");
    const response = await axiosWithRetry.get(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/${start}/${end}?key=${process.env.WEATHER_API_KEY}`
    );

    await redisClient.setEx(
      cacheKey,
      60 * 60 * 12,
      JSON.stringify(response.data)
    );

    res.status(200).json({
      success: true,
      message: "Success (from API)",
      data: response.data,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    } else if (typeof error === "string") {
      console.error("Caught a string error:", error);
    } else if (
      typeof error === "object" &&
      error !== null &&
      "message" in error
    ) {
      console.error(
        "Caught an object error with message:",
        (error as { message: string }).message
      );
    } else {
      console.error("An unknown error occurred:", error);
    }
    res.status(500).json({
      success: false,
      message: `Error occurred while fetching weather data: ${error}`,
    });
  }
};

export { getWeather };
