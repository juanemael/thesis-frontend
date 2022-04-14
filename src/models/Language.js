import ApiRequest from "../util/ApiRequest";

export default class Language {
  static login = async (username, password) => {
    return await ApiRequest.set('v1/language/login', "POST", {
      username: username,
      password: password
    });
  }

  getAll = async () => {
    return await ApiRequest.set("v1/languages", "GET");
  }

  getById = async (language_id) => {
    return await ApiRequest.set(`v1/language/${language_id}`, "GET");
  }

  deleteLanguage = async (id) => {
    return await ApiRequest.set(`v1/language/${id}`, "DELETE");
  }

  updateLanguage = async (id,body) => {
    return await ApiRequest.set(`v1/language/${id}`, "PUT", body);
  }

  create = async (body) => {
    return await ApiRequest.set(`v1/language/create`, 'POST', body);
  }


}
