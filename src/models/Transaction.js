import ApiRequest from "../util/ApiRequest";

export default class Transaction {

  getAll = async () => {
    return await ApiRequest.set("v1/memberships", "GET");
  }

}
