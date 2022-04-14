import ApiRequest from "../util/ApiRequest";

export default class Attachment {

  addAttachment = async (file) => {

    console.error("AASDAS", file.name)
    let formData = new FormData();

    formData.append('upload', file, file.name);
    return await ApiRequest.setMultipart('v1/upload/file', 'POST', formData);
  }

  addAttachmentGoogleDrive = async (file) => {

    let formData = new FormData();

    formData.append('upload', file, file.name);
    const response = await ApiRequest.setMultipart('/v1/course/upload_video', 'POST', formData);

    console.log(response)
    return response;

  }
}
