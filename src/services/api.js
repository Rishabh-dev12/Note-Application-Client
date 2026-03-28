import axios from "axios";
import { BASE_URL_PATH } from "../utils/constants";

export const getToken = () => {
  const authData = localStorage.getItem("persist:root");

  if (authData) {
    try {
      const parsedAuth = JSON.parse(authData);
      const tokenData = JSON.parse(parsedAuth.auth);
      return tokenData.token;
    } catch (error) {
      console.error("Failed to parse auth token:", error);
      return undefined;
    }
  }
  return undefined;
};

const baseURL = import.meta.env.VITE_APP_URL;

const networkRequest = ({
  signal,
  headers: headerParameter,
  token,
  content_type = true,
  timeOutTime = 30000,
  BASE_URL,
} = {}) => {
  let headers = {
    "Content-Type": content_type ? "application/json" : "multipart/form-data",
    // authorization: `Basic ${authKey || ""}`,
    "ngrok-skip-browser-warning": "true",
    "bypass-tunnel-reminder": "true",
  };

  console.log(BASE_URL_PATH, "BASE_URL_PATH");
  console.log(BASE_URL, "BASE_URL");
  console.log(baseURL, "baseUrl");
  if (headerParameter) {
    headers = {
      ...headers,
      ...headerParameter,
    };
  }

  if (!token) {
    token = getToken();
  }

  if (token) {
    headers["accessToken"] = token;
  }

  const axiosInstance = axios.create({
    baseURL: BASE_URL || baseURL,
    timeout: timeOutTime,
    headers,
    signal,
  });

  axiosInstance.interceptors.request.use((request) => {
    const locale = localStorage.getItem("i18nextLng") || "en";
    request.headers["locale"] = locale;
    return request;
  });

  createAxiosResponseInterceptor(axiosInstance);

  return axiosInstance;
};

function createAxiosResponseInterceptor(axiosInstance) {
  const interceptor = axiosInstance.interceptors.response.use(
    (response) => {
      if (response?.data?.success === 4) {
        axiosInstance.interceptors.response.eject(interceptor);
        localStorage.removeItem("persist:root");
        window.location.href = `${BASE_URL_PATH}/login`;
      }
      return response;
    },
    async (error) => {
      const status = error?.response?.status;
      const successCode = error?.response?.data?.success;

      if (status === 401 && successCode === 4) {
        axiosInstance.interceptors.response.eject(interceptor);
        localStorage.removeItem("persist:root");
        window.location.href = `${BASE_URL_PATH}/login`;
      }

      if (status === 403 && successCode === 4) {
        axiosInstance.interceptors.response.eject(interceptor);
        window.location.href = `${BASE_URL_PATH}/login`;
      }

      if (status === 401) {
        axiosInstance.interceptors.response.eject(interceptor);
      }

      return Promise.reject(error);
    },
  );
}

export default networkRequest;
