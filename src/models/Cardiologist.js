import ApiRequest from "../util/ApiRequest";

export default class Cardiologist {
    getAll = async () => {
        return await ApiRequest.set("v1/cardiologists", "GET");
    }

    approve = async (id) => {
        return await ApiRequest.set(`v1/cardiologist/verify/${id}`, "PUT");
    }
}
