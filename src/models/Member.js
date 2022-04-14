import ApiRequest from "../util/ApiRequest";

export default class Member {
  static login = async (username, password) => {
    return await ApiRequest.set('v1/member/login', "POST", {
      username: username,
      password: password
    });
  }

  getAll = async () => {
    return await ApiRequest.set("v1/members", "GET");
  }

  getById = async (id) => {
    return await ApiRequest.set(`v1/member/${id}`, "GET");
  }

  deleteMember = async (id) => {
    return await ApiRequest.set(`v1/member/${id}`, "DELETE");
  }

  approveMember = async (id) => {
    return await ApiRequest.set(`v1/member/approve/${id}`, "PATCH");
  }

  rejectMember = async (id, body) => {
    return await ApiRequest.set(`v1/member/reject/${id}`, "PATCH", body);
  }

  register = async (body) => {
    return await ApiRequest.set(`v1/member/register`, 'POST', body);
  }

  forgotPassword = async (body) => {
    return await ApiRequest.set(`v1/member/forgotPassword`, 'POST', body);
  }
  resetPassword = async (body) => {
    return await ApiRequest.set('v1/user/resetPassword',"POST", body);
  }

  static changePassword = async (body) => {
    return await ApiRequest.set(`v1/member/adminChangePassword`, 'POST', body);
  }

}
