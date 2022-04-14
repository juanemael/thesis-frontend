import ApiRequest from "../util/ApiRequest";

export default class WithdrawalRequest {
  getAll = async () => {
    return await ApiRequest.set("v1/withdrawal_requests", "GET");
  }

  uploadImage = async (image) => {

    let formData = new FormData();

    formData.append('upload', image, image.name);

    return await ApiRequest.setMultipart(`v1/upload/topup/image`, "POST", formData);
  }

  update = async (id, body) => {
    return await ApiRequest.set("v1/withdrawal_request/" + id, "PUT", body);
  }
}
