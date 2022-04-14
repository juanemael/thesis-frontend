import apiConfig from "./apiConfig";

export default class ApiRequest {
  static set = async (endpoint, method, body) => {

    // let token = sessionStorage.token || localStorage.token;

    // console.log('API ACCESS: ' + token);
    console.log('BODY' + JSON.stringify(body));
    let request = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        // Authorization: token ? `bearer ${token}` : null,
        Accept: 'application/json',
      },
      body: JSON.stringify(body)
      // body: "afdadsf"

    };

    let response = await fetch(apiConfig.base_url + endpoint, request);

    if (response.ok) {
      return response.json();
    }

    let error = await response.json();
    console.log(error)
    console.log(error.msg)

    // if (error.code === 'JWT_EXPIRED' || error.code === 'NO_TOKEN_PROVIDED' || error.code === 'INVALID_TOKEN' || error.code === 'BAD_TOKEN_FORMAT' || error.code === 'NO_SECRET_DEFINED' || error.error_message === 'JWT_MALFORMED' || error.error_message?.msg === 'JWT_MALFORMED' || error.error_message === 'JWT_EXPIRED' || error.code === "SUBSCRIPTION_EXPIRED") {
    //   delete sessionStorage.token;
    //   delete localStorage.token;
    //   // alert('Login timeout')
    //   window.location.reload();
    //   throw error;
    // }

    throw error;
  };

  static setMultipart = async (endpoint, method, body) => {
    // let token = sessionStorage.token || localStorage.token;

    let response = await fetch(apiConfig.base_url + endpoint, {
      method: method,
      headers: {
        // Authorization: token ? `bearer ${token}` : null,
        'Access-Control-Allow-Origin': '*',
      },
      body: body
      // body: "afdadsf"
    });

    if(response.ok){
      console.log(response)

      return response.json()
    }else{

      let error = await response.json()

      console.log(error)

      throw error

    }


  }
}
