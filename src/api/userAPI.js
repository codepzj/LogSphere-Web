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

const uploadAvatar = async (avatar) => {
  const result = await request({
    method: "post",
    url: "/user/avatar-upload",
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: avatar
  })
  return result.data
}

export { UserRegister, UserLogin, UserClearStatus, uploadAvatar };
