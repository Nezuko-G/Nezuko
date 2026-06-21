import axios from "axios";

export const jobsClient = axios.create({
  baseURL: "https://nezuko0hr.alwaysdata.net/api", 
  withCredentials: true,
});

