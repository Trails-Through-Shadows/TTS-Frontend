import { api, Character, Clazz, Race } from '../../lib/Exports'

export class CharacterList {
    public characters: Character[] = [];

    readData(url: string, callback: Function): void {
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {

            console.log(`Character | Reading data from ${url}`);

            if (request.readyState === 4) {
                if (request.status === 200)
                {
                    const data = JSON.parse(request.responseText);
                    this.characters = data.map((character: any) => new Character(character.id, character.clazz, character.race, character.title, character.playerName));
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

    getCharacters(): Character[] {
        return this.characters;
    }
}