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

    /*
    getCharacters(): Character[] {
        return this.characters;
    }

    getEnemies(): Enemy[] {
        return this.enemies;
    }

    getObstacles(): Obstacle[] {
        return this.obstacles;
    }
    */
}