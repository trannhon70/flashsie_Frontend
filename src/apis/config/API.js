import { config } from "@/config";
import { SessionStore } from "@/config/sesstionStore";

const METHOD = {
  POST: "POST",
  GET: "GET",
  PUT: "PUT",
  DELETE: "DELETE",
  PATCH: "PATCH",
};

export const ApiGet = (props) => {
  const { link, params } = props;
  let url = new URL(`${config.REACT_APP_BASE_URL}${link}`);
  if (params) {
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );
  }
  return fetch(url, {
    method: METHOD.GET,
    headers: {
      Authorization: "Bearer " + SessionStore?.getUserSession()?.accessToken,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => console.error("Fetch Error:", error));
};

export const ApiPOST = (props) => {
  const { link, body } = props;
  let url = new URL(`${config.REACT_APP_BASE_URL}${link}`);
  return fetch(url, {
    method: METHOD.POST,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + SessionStore?.getUserSession()?.accessToken,
    },
    body: JSON.stringify(body),
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => console.error("Fetch Error:", error));
};

export const ApiPOST_FORMDATA = (props) => {
  const { link, body } = props;
  let url = new URL(`${config.REACT_APP_BASE_URL}${link}`);
  return fetch(url, {
    method: METHOD.POST,
    headers: {
      Authorization: "Bearer " + SessionStore?.getUserSession()?.accessToken,
    },
    body: body,
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => console.error("Fetch Error:", error));
};

export const ApiPUT_FORMDATA = (props) => {
  const { link, body } = props;
  let url = new URL(`${config.REACT_APP_BASE_URL}${link}`);
  return fetch(url, {
    method: METHOD.PUT,
    headers: {
      Authorization: "Bearer " + SessionStore?.getUserSession()?.accessToken,
    },
    body: body,
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => console.error("Fetch Error:", error));
};


export const ApiPOSTNoToken = (props) => {
  const { link, body } = props;
  let url = new URL(`${config.REACT_APP_BASE_URL}${link}`);
  return fetch(url, {
    method: METHOD.POST,
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer" + `${SessionStore?.getUserSession()?.accessToken}`,
    },
    body: JSON.stringify(body),
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => console.error("Fetch Error:", error));
};

export const ApiPUTNoToken = (props) => {
  const { link, body } = props;
  let url = new URL(`${config.REACT_APP_BASE_URL}${link}`);
  return fetch(url, {
    method: METHOD.PUT,
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer" + `${SessionStore?.getUserSession()?.accessToken}`,
    },
    body: JSON.stringify(body),
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => console.error("Fetch Error:", error));
};

export const ApiPUT = (props) => {
  const { link, body } = props;
  const url = `${config.REACT_APP_BASE_URL}${link}`;

  return fetch(url, {
    method: METHOD.PUT,
    headers: {
      // "Content-Type": "application/json",
      Authorization: "Bearer " + SessionStore?.getUserSession()?.accessToken,
    },
    body: body,
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => console.error("Fetch Error:", error));
};

export const ApiPATCH = (props) => {
  const { link, body } = props;
  const url = `${config.REACT_APP_BASE_URL}${link}`;

  return fetch(url, {
    method: METHOD.PATCH,
    headers: {
      // "Content-Type": "application/json",
      Authorization: "Bearer " + SessionStore?.getUserSession()?.accessToken,
    },
    body: body,
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => console.error("Fetch Error:", error));
};


export const ApiDELETE = (props) => {
  const { link } = props;
  const url = `${config.REACT_APP_BASE_URL}${link}`;

  return fetch(url, {
    method: METHOD.DELETE,
    headers: {
      // "Content-Type": "application/json",
      Authorization: "Bearer " + SessionStore?.getUserSession()?.accessToken,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => console.error("Fetch Error:", error));
};
