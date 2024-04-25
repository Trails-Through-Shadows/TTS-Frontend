export function getRequest(url: string, token: string | null, successCallback: Function, failureCallback: Function): void {
  const request = new XMLHttpRequest();

  console.log(`GET | ${url}`);

  request.onreadystatechange = () => {
    if (request.readyState === 4) {
      if (request.status === 200) {
        const response = JSON.parse(request.responseText);
        successCallback(response);
      }
      else {
        console.log('Error: ' + request.status);
        const response = JSON.parse(request.responseText);
        failureCallback(response);
      }
    }
  }

  request.open('GET', url, true);
  if (token) {
    request.setRequestHeader('Authorization', `Basic ${token}`);
  }
  request.send();
}

export function postRequest(url: string, token: string | null, data: any, successCallback: Function, failureCallback: Function): void {
  const request = new XMLHttpRequest();

  console.log(`POST | ${url}`);

  request.onreadystatechange = () => {
    if (request.readyState === 4) {
      if (request.status === 200) {
        if (request.responseText) {
          const response = JSON.parse(request.responseText);
          successCallback(response);
        }
        else {
          successCallback();
        }
      }
      else {
        console.log('Error: ' + request.status);
        const response = JSON.parse(request.responseText);
        failureCallback(response);
      }
    }
  }

  request.open('POST', url, true);
  request.setRequestHeader('Content-Type', 'application/json');
  request.setRequestHeader('Accept', 'application/json');
  if (token) {
    request.setRequestHeader('Authorization', `Basic ${token}`);
  }
  request.send(JSON.stringify(data));
}

export function putRequest(url: string, token: string | null, data: any, successCallback: Function, failureCallback: Function): void {
  const request = new XMLHttpRequest();

  console.log(`PUT | ${url}`);

  request.onreadystatechange = () => {
    if (request.readyState === 4) {
      if (request.status === 200) {
        if (request.responseText) {
          const response = JSON.parse(request.responseText);
          successCallback(response);
        }
        else {
          successCallback();
        }
      }
      else {
        console.log('Error: ' + request.status);
        const response = JSON.parse(request.responseText);
        failureCallback(response);
      }
    }
  }

  request.open('PUT', url, true);
  request.setRequestHeader('Content-Type', 'application/json');
  request.setRequestHeader('Accept', 'application/json');
  if (token) {
    request.setRequestHeader('Authorization', `Basic ${token}`);
  }
  request.send(JSON.stringify(data));
}

export function deleteRequest(url: string, token: string | null, successCallback: Function, failureCallback: Function): void {
  const request = new XMLHttpRequest();

  console.log(`DELETE | ${url}`);
  
  request.onreadystatechange = () => {
    if (request.readyState === 4) {
      if (request.status === 200) {
        successCallback();
      }
      else {
        console.log('Error: ' + request.status);
        const response = JSON.parse(request.responseText);
        failureCallback(response);
      }
    }
  }

  request.open('DELETE', url, true);
  if (token) {
    request.setRequestHeader('Authorization', `Basic ${token}`);
  }
  request.send();
}

export function checkToken(m: string): void {
  if (m === 'Invalid session token!') {
      sessionStorage.clear();
      window.location.href = "/";
  }
} 