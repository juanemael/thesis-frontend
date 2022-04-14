import ApiRequest from "../util/ApiRequest";

export default class Consultation {
    getAll = async () => {
        return await ApiRequest.set("v1/consultations", "GET");
    }
}
