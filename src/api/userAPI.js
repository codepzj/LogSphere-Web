import { request } from "@/request/axios";

export const UserRegister = ({ account, password }) =>
  request({
    method: "post",
    url: "/user/create",
    data: { account, password },
  }).then(result => result.data);

export const UserLogin = data =>
  request({ method: "post", url: "/user/find", data }).then(
    result => result.data
  );

export const getUserInfo = account_id =>
  request({
    method: "get",
    url: "/user/get",
    params: { account_id: account_id },
  }).then(result => result.data);

export const UserClearStatus = () =>
  request({ method: "get", url: "/user/clear" });

export const UserEditProfile = data =>
  request({ method: "post", url: "/user/edit-profile", data }).then(
    result => result.data
  );

export const uploadAvatar = data =>
  request({
    method: "post",
    url: "/user/avatar-upload",
    headers: { "Content-Type": "multipart/form-data" },
    data,
  }).then(result => result.data);

export const getAllUser = () =>
  request({ method: "get", url: "/user/all" }).then(result => result.data);
