import { request } from "@/request/axios";

export const getSystemUsage = () =>
  request({ method: "get", url: "/system/usage" }).then(result => result.data);
