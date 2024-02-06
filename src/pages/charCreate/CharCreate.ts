import { api, Character, Clazz, Race } from "../../lib/Exports";

export class CharCreate {
    public characters: Character[] = [];
    public clazzes: Clazz[] = [];
    public races: Race[] = [];

    constructor() {
        this.readDataClazzes();
        this.readDataRaces();
        this.characters = [];
    }

    readDataClazzes(): void {
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {

            console.log(`Character | Reading data from ${api}/background/classes`);
            
            if (request.readyState === 4) {
                if (request.status === 200)
                {
                    const data = JSON.parse(request.responseText);
                    this.clazzes = data.map((clazz: any) => new Clazz(clazz.id, clazz.title, clazz.tag, clazz.description, clazz.baseHealth, clazz.baseDefence, clazz.baseInitiative));
                    console.log(this.clazzes);
                }
                else {
                    console.log('Error: ' + request.status);
                }
            }
        }

        request.open('GET', `${api}/background/classes`, true);
        request.send();
    }

    readDataRaces(): void {
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {

            console.log(`Character | Reading data from ${api}/background/races`);

            if (request.readyState === 4) {
                if (request.status === 200)
                {
                    const data = JSON.parse(request.responseText);
                    this.races = data.map((race: any) => new Race(race.id, race.title, race.tag, race.description, race.baseInitiative));
                    console.log(this.races);
                }
                else {
                    console.log('Error: ' + request.status);
                }
            }
        }

        request.open('GET', `${api}/background/races`, true);
        request.send();
    }

    addCharacter(character: Character): void {
        if (this.characters.length < 6) {
            this.characters.push(character);
        }
    }

    addEmptyCharacter(): void {
        if (this.characters.length < 6) {
            this.characters.push(new Character(0, new Clazz(0, "", "", "", 0, 0, 0), new Race(0, "", "", "", 0), "", ""));
            console.log(this.characters);
        }
    }
    
    deleteCharacter(index: number): void {
        this.characters = this.characters.filter((_, i) => i !== index);
    }

    getCharacters(): Character[] {
        return this.characters;
    }

    getClazzes(): Clazz[] {
        return this.clazzes;
    }

    getRaces(): Race[] {
        return this.races;
    }
}