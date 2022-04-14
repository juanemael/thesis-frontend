import ApiRequest from "../util/ApiRequest";

export default class Content{
  getAll = async ()=>{
    return await ApiRequest.set(`v1/contents`,"GET")
  }

  create = async (body) =>{
    return await ApiRequest.set(`v1/content/create`, "POST", body)
  }

  update = async (id,body) =>{
    return await ApiRequest.set(`v1/content/${id}`,"PUT", body)
  }

  getById = async (id) => {
    return await ApiRequest.set(`v1/content/${id}`,"GET")
  }

  deleteContent = async (id) => {
    return await ApiRequest.set(`v1/content/${id}`,"DELETE")
  }

}
