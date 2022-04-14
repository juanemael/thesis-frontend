import ApiRequest from "../util/ApiRequest";

export default class Users {
    getAll = async () => {
        return await ApiRequest.set("v1/relatives", "GET");
    }

}
