import { api, Character, Clazz, Race } from '../../lib/Exports'

export class CharacterList {
    public characters: Character[] = [];

    readCharacterData(url: string, successCallback: Function, failureCallback: Function): void {
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {

            console.log(`Character | Reading data from ${url}`);

            if (request.readyState === 4) {
                if (request.status === 200)
                {
                    const data = JSON.parse(request.responseText);
                    this.characters = data.entries.map((character: any) => new Character(character.id, character.clazz, character.race, character.title, character.playerName));
                    console.log(this.characters);
                    successCallback();
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

    postCreateAdventureData(url: string, idLocation: number, successCallback: Function, failureCallback: Function): void {
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {

            console.log(`Create Adventure | Posting data to ${url}`);

            if (request.readyState === 4) {
                if (request.status === 200)
                {
                    console.log('Adventure created');
                    const response = JSON.parse(request.responseText);
                    successCallback(response.idEncounter);
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
        request.send(JSON.stringify( idLocation ));
    }

    getCharacters(): Character[] {
        return this.characters;
    }
}