import { request } from "@/request/axios";

export const getAllRecordsByWebsitID = websiteId => request({ url: "/track/get-all-records", params: { websiteId } }).then(result => result.data);

