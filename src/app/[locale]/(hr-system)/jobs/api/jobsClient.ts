import axios from "axios";

export const jobsClient = axios.create({
  baseURL: "/api/jobs-proxy",
});

