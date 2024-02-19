var ajaxCall = (clientId, clientSecret, APIUrl, authUrl, inputChat) => {

  //const APIUrl = "https://azure-openai-serv-i057149.cfapps.eu12.hana.ondemand.com/api/v1/completions";

  //const clientId = "sb-bd146afc-968c-47ea-b442-74bdfaf9500e!b224249|azure-openai-service-i057149-xs!b70230";
  //const clientSecret = "fd0a9aab-0e95-483c-b794-47ddc3dc9cfc$aYgedp9mKUOKdIq7GsXOmXj3Q84mV5TRAmpZ_vbQfzc=";
  //const authUrl = "https://demo19081.authentication.eu12.hana.ondemand.com/oauth/token";

  var accessToken = "";
  $.ajax({
    url: authUrl,
    type: 'GET',
    async: false,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: {
      'grant_type': 'client_credentials',
      'response_type': 'token',
      'client_id': clientId,
      'client_secret': clientSecret
    },
    success: function (response) {
      accessToken = response.access_token
    },
    error: function (xhr, status, error) {
      accessToken = ""
      console.log(error)
    }
  });


  return new Promise((resolve, reject) => {
    $.ajax({
      url: APIUrl,
      type: "POST",
      dataType: "json",
      data: JSON.stringify(inputChat),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      crossDomain: true,
      success: function (response, status, xhr) {
        console.log(response)
        resolve({ response, status, xhr });
      },
      error: function (xhr, status, error) {
        console.log(error)
        const err = new Error('xhr error');
        err.status = xhr.status;
        reject(err);
      },
    });
  });



};

(function () {
  const template = document.createElement("template");
  template.innerHTML = `
        <style>
        </style>
        <div id="root" style="width: 100%; height: 100%;">
        </div>
      `;
  class MainWebComponent extends HTMLElement {
    async post(clientId, clientSecret, APIUrl, authUrl, inputChat) {
      const { response } = await ajaxCall(
        clientId,
        clientSecret,
        APIUrl,
        authUrl,
        inputChat
      );
      console.log(response.choices[0].text);
      return response.choices[0].message.content;
    }
  }
  customElements.define("sac-cpi-openai", MainWebComponent);
})();