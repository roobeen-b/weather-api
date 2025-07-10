# [Weather api](https://roadmap.sh/projects/weather-api-wrapper-service)
This project fetches and returns weather data from a 3rd party API.

## How to run the project?
- Clone the repo
- Use "npm install" to install the required dependencies
- Get the Weather API key from [Visual Crossing’s API](https://www.visualcrossing.com/weather-api)
- Configure redis server for caching and start the redis server ([Redis](https://redis.io/](https://redis.io/docs/latest/operate/oss_and_stack/install/archive/install-redis/install-redis-on-windows/)))
- Set the required environment variables as provided in .env.example in new ".env" file
- Run the project using "npm run dev"
- The api can be accessed through http://localhost:4000/api/v1/weather/[location]/[startDate]/[endDate]
- E.g. http://localhost:4000/api/v1/weather/Kathmandu/2025-07-01/2025-07-10  (startData and endDate is optional whereas location field is required)
