import { request } from "@/request/axios";

const UserRegister = ({ account, password }) =>
  request({
    method: "post",
    url: "/user/create",
    data: { account, password },
  }).then(result => result.data);
const UserLogin = data =>
  request({ method: "post", url: "/user/find", data }).then(
    result => result.data
  );
const UserClearStatus = () => request({ method: "get", url: "/user/clear" });
const UserEditProfile = data =>
  request({ method: "post", url: "/user/edit-profile", data }).then(
    result => result.data
  );
const uploadAvatar = (data) =>
  request({
    method: "post",
    url: "/user/avatar-upload",
    headers: { "Content-Type": "multipart/form-data" },
    data,
  }).then(result => result.data);

export {
  UserRegister,
  UserLogin,
  UserClearStatus,
  uploadAvatar,
  UserEditProfile,
};
