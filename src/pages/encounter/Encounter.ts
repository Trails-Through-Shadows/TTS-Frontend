import { Character, Enemy, Obstacle } from "../../lib/Exports";

export class Encounter {
    readStoryData(url: string, successCallback: Function, failureCallback: Function): void {
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {

            console.log(`Story | Reading data from ${url}`);

            if (request.readyState === 4) {
                if (request.status === 200)
                {
                    const data = JSON.parse(request.responseText);
                    console.log(data);
                    successCallback(data.story);
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
    readDataCharacters(url: string, callback: Function): void {
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {

            console.log(`Characters | Reading data from ${url}`);

            if (request.readyState === 4) {
                if (request.status === 200)
                {
                    const data = JSON.parse(request.responseText);
                    this.characters = data.entries.map((character: any) => new Character(character.id, character.clazz, character.race, character.title, character.playerName));
                    console.log(this.characters);
                    callback();
                }
                else {
                    console.log('Error: ' + request.status);
                }
            }
        }

        request.open('GET', url, true);
        request.send();
    }

    readDataEnemies(url: string, callback: Function): void {
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {

            console.log(`Enemies | Reading data from ${url}`);

            if (request.readyState === 4) {
                if (request.status === 200)
                {
                    const data = JSON.parse(request.responseText);
                    this.enemies = data.enemies.map((enemy: any) => new Enemy(enemy.id, enemy.title, enemy.tag, enemy.description, enemy.baseHealth, enemy.baseDefence, enemy.baseInitiative));
                    console.log(this.enemies);
                    callback();
                }
                else {
                    console.log('Error: ' + request.status);
                }
            }
        }

        request.open('GET', url, true);
        request.send();
    }

    readDataObstacles(url: string, callback: Function): void {
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {

            console.log(`Obstacles | Reading data from ${url}`);

            if (request.readyState === 4) {
                if (request.status === 200)
                {
                    const data = JSON.parse(request.responseText);
                    this.obstacles = data.obstacles.map((obstacle: any) => new Obstacle(obstacle.id, obstacle.title, obstacle.tag, obstacle.description, obstacle.baseDamage, obstacle.baseHealth, obstacle.crossable));
                    console.log(this.obstacles);
                    callback();
                }
                else {
                    console.log('Error: ' + request.status);
                }
            }
        }

        request.open('GET', url, true);
        request.send();
    }
    */
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