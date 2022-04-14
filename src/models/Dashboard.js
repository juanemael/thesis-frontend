import ApiRequest from '../util/ApiRequest'

export default class Dashboard {

  getDashboardHighlights = async (body) => {
    return await ApiRequest.set("v1/dashboard/highlights", "GET", body);
  }

}
