import { Character, Enemy, Obstacle } from "../../lib/Exports";

export class Encounter {

    readEncounterData(url: string, successCallback: Function, failureCallback: Function): void {
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {

            console.log(`Encounter | Reading data from ${url}`);

            if (request.readyState === 4) {
                if (request.status === 200)
                {
                    const data = JSON.parse(request.responseText);
                    console.log(data);
                    successCallback(data.object);
                }
                else {
                    console.log('Error: ' + request.status);
                    const response = JSON.parse(request.responseText);
                    failureCallback(response.message);
                }
            }
        }

        request.open('GET', url, true);
        request.send();
    }

    postInitiativeData(url: string, characters: {id: number, initiative: number}[], successCallback: Function, failureCallback: Function): void {
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {

            console.log(`Initiative | Posting data to ${url}`);

            if (request.readyState === 4) {
                if (request.status === 200)
                {
                    console.log('Initiative posted');
                    successCallback();
                }
                else {
                    console.log('Error: ' + request.status);
                    const response = JSON.parse(request.responseText);
                    failureCallback(response.message);
                }
            }
        }

        request.open('POST', url, true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify( characters ));
    }

    readInitiativeData(url: string, successCallback: Function, failureCallback: Function): void {
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {

            console.log(`Initiative | Reading data from ${url}`);

            if (request.readyState === 4) {
                if (request.status === 200)
                {
                    const data = JSON.parse(request.responseText);
                    console.log(data);
                    successCallback(data.object);
                }
                else {
                    console.log('Error: ' + request.status);
                    const response = JSON.parse(request.responseText);
                    failureCallback(response.message);
                }
            }
        }

        request.open('GET', url, true);
        request.send();
    }

    readPartsData(url: string, successCallback: Function, failureCallback: Function): void {
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {

            console.log(`Parts | Reading data from ${url}`);

            if (request.readyState === 4) {
                if (request.status === 200)
                {
                    const data = JSON.parse(request.responseText);
                    console.log(data);
                    successCallback(data);
                }
                else {
                    console.log('Error: ' + request.status);
                    const response = JSON.parse(request.responseText);
                    failureCallback(response.message);
                }
            }
        }

        request.open('GET', url, true);
        request.send();
    }

    postTurnData(url: string, successCallback: Function, failureCallback: Function): void {
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {

            console.log(`Turn | Posting data to ${url}`);

            if (request.readyState === 4) {
                if (request.status === 200)
                {
                    console.log('Turn posted');
                    successCallback();
                }
                else {
                    console.log('Error: ' + request.status);
                    const response = JSON.parse(request.responseText);
                    failureCallback(response.message);
                }
            }
        }

        request.open('POST', url, true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send();
    }

    postRoundEndData(url: string, successCallback: Function, failureCallback: Function): void {
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {

            console.log(`Round | Posting data to ${url}`);

            if (request.readyState === 4) {
                if (request.status === 200)
                {
                    console.log('Round posted');
                    successCallback();
                }
                else {
                    console.log('Error: ' + request.status);
                    const response = JSON.parse(request.responseText);
                    failureCallback(response.message);
                }
            }
        }

        request.open('POST', url, true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send();
    }

    postInteractionData(url: string, damage: number | null, successCallback: Function, failureCallback: Function): void {
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {

            console.log(`Interaction | Posting data to ${url}`);

            if (request.readyState === 4) {
                if (request.status === 200)
                {
                    console.log('Interaction posted');
                    const data = JSON.parse(request.responseText);
                    successCallback(data.object);
                }
                else {
                    console.log('Error: ' + request.status);
                    const response = JSON.parse(request.responseText);
                    failureCallback(response.message);
                }
            }
        }

        request.open('POST', url, true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify( {damage: damage} ));
    }

    postOpenDoorData(url: string, door: any, successCallback: Function, failureCallback: Function): void {
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {

            console.log(`Door | Posting data to ${url}`);

            if (request.readyState === 4) {
                if (request.status === 200)
                {
                    console.log('Door opened');
                    successCallback();
                }
                else {
                    console.log('Error: ' + request.status);
                    const response = JSON.parse(request.responseText);
                    failureCallback(response.message);
                }
            }
        }

        request.open('POST', url, true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify( door ));
    }
}