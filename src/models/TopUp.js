import ApiRequest from "../util/ApiRequest";

export default class TopUp {
    getAll = async () => {
        return await ApiRequest.set("v1/topups", "GET");
    }
    approve = async (id) => {
        return await ApiRequest.set(`v1/topup/${id}`, "PATCH");
    }

}
