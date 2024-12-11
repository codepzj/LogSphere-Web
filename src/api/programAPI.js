import { request } from "@/request/axios";

const createProgram = async data => {
  console.log(data);
  const result = await request({
    url: "/program/create",
    method: "post",
    data,
  });
  return result.data;
};

const findProgramsByID = async id => {
  const result = await request({
    url: `/program/find/${id}`,
    method: "get",
  });
  return result.data;
};

export { createProgram, findProgramsByID };
