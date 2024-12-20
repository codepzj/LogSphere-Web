import { request } from "@/request/axios";

export const getAllRecordsByWebsitID = websiteId => request({ url: "/track/get-all-records", params: { websiteId } }).then(result => result.data);

export const getAnalyse = websiteId => request({ url: "/track/analyse", params: { websiteId } }).then(result => result.data);

