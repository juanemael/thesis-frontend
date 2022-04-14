import ApiRequest from "../util/ApiRequest";

export default class Specialization {
  static login = async (username, password) => {
    return await ApiRequest.set('v1/specialization/login', "POST", {
      username: username,
      password: password
    });
  }

  getAll = async () => {
    return await ApiRequest.set("v1/specializations", "GET");
  }

  getById = async (specialization_id) => {
    return await ApiRequest.set(`v1/specialization/${specialization_id}`, "GET");
  }

  deleteSpecialization = async (id) => {
    return await ApiRequest.set(`v1/specialization/${id}`, "DELETE");
  }

  updateSpecialization = async (id,body) => {
    return await ApiRequest.set(`v1/specialization/${id}`, "PUT", body);
  }

  create = async (body) => {
    return await ApiRequest.set(`v1/specialization/create`, 'POST', body);
  }


}
