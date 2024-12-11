import { request } from "@/request/axios";

async function UserRegister({ account, password }) {
  const result = await request({
    method: "post",
    url: "/user/create",
    data: { account, password },
  });
  return result.data;
}

async function UserLogin(data) {
  const result = await request({
    method: "post",
    url: "/user/find",
    data,
  });
  return result.data;
}

function UserClearStatus() {
  request({
    method: "get",
    url: "/user/clear",
  });
}

export { UserRegister, UserLogin, UserClearStatus };
