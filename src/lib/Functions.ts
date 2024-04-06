export function getRequest(url: string, successCallback: Function, failureCallback: Function): void {
  const request = new XMLHttpRequest();
  request.onreadystatechange = () => {
    console.log(`GET | ${url}`);

    if (request.readyState === 4) {
      if (request.status === 200) {
        console.log('Data received');
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
  request.send();
}

export function postRequest(url: string, data: any, successCallback: Function, failureCallback: Function): void {
  const request = new XMLHttpRequest();
  request.onreadystatechange = () => {

    console.log(`POST | ${url}`);

    if (request.readyState === 4) {
      if (request.status === 200) {
        console.log('Data sent');
        if (request.responseText) {
          const response = JSON.parse(request.responseText);
          console.log(response);
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
  request.send(JSON.stringify(data));
}

export function putRequest(url: string, data: any, successCallback: Function, failureCallback: Function): void {
  const request = new XMLHttpRequest();
  request.onreadystatechange = () => {

    console.log(`PUT | ${url}`);

    if (request.readyState === 4) {
      if (request.status === 200) {
        console.log('Data sent');
        if (request.responseText) {
          const response = JSON.parse(request.responseText);
          console.log(response);
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
  request.send(JSON.stringify(data));
}

export function deleteRequest(url: string, successCallback: Function, failureCallback: Function): void {
  const request = new XMLHttpRequest();
  request.onreadystatechange = () => {
    console.log(`DELETE | ${url}`);

    if (request.readyState === 4) {
      if (request.status === 200) {
        console.log('Data deleted');
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
  request.send();
}

export function checkToken(m: string): void {
  if (m === 'Invalid session token!') {
      sessionStorage.clear();
      window.location.href = "/";
  }
} 