import ApiRequest from "../util/ApiRequest";

export default class Admin {
  static login = async (username, password) => {
    return await ApiRequest.set('v1/admin/login', "POST", {
      username: username,
      password: password
    });
  }

  getAll = async () => {
    return await ApiRequest.set("v1/admins", "GET");
  }

  getById = async (admin_id) => {
    return await ApiRequest.set(`v1/admin/${admin_id}`, "GET");
  }

  deleteAdmin = async (id) => {
    return await ApiRequest.set(`v1/admin/${id}`, "DELETE");
  }

  updateAdmin = async (id,body) => {
    return await ApiRequest.set(`v1/admin/${id}`, "PUT", body);
  }

  changePassword = async (id,body) => {
    return await ApiRequest.set(`v1/admin/${id}`, "POST", body);
  }

  register = async (body) => {
    return await ApiRequest.set(`v1/admin/register`, 'POST', body);
  }


}
