import { request } from "@/request/axios";

export const createProgram = data => request({ url: "/program/create", method: "post", data }).then(result => result.data)

export const findProgramsByID = async id => request({ url: `/program/find/${id}`, method: "get" }).then(result => result.data)
