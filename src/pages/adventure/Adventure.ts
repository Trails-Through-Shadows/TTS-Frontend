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
                    this.characters = data.entries.map((character: any) => new Character(character.id, character.clazz, character.race, character.title, character.playerName, character.url));
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

    postCreateEncounterData(url: string, successCallback: Function, failureCallback: Function): void {
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {

            console.log(`Create Encounter | Posting data to ${url}`);

            if (request.readyState === 4) {
                if (request.status === 200)
                {
                    console.log('Encounter created');
                    const response = JSON.parse(request.responseText);
                    successCallback(response.id);
                }
                else {
                    console.log('Error: ' + request.status);
                    const response = JSON.parse(request.responseText);
                    failureCallback(response.message);
                }
            }
        }

        request.open('POST', url, true);
        request.send();
    }

    getCharacters(): Character[] {
        return this.characters;
    }
}