import axios from "axios";

const defaultHeaders = {
  "Content-Type": "application/json",
};

export const SpendWiseClient = axios.create({
  baseURL: "http://localhost:8181/",  // Taken from the swagger after booting up docker
  headers: defaultHeaders,
});
