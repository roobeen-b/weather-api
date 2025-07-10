import axios from "axios";
import axiosRetry from "axios-retry";

const axiosWithRetry = axios.create();

axiosRetry(axiosWithRetry, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    const status = error?.response?.status;
    if (!status) {
      return false;
    }
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      status === 429 ||
      (status >= 500 && status < 600)
    );
  },
});

export default axiosWithRetry;
