export class Clazz {
    constructor (
        public id: number,
        public name: string,
        public baseHealth: number,
        public baseDefence: number,
        public baseInitiative: number,
    ) {}
}

export class Race {
    constructor (
        public id: number,
        public name: string,
        public baseInitiative: number,
    ) {}
}

export class Character {
    constructor(
        public id: number,
        public name: string,
        public playerName: string | null,
        public clazz: Clazz,
        public race: Race,
    ) {}
}

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
            if (request.readyState === 4) {
                if (request.status === 200)
                {
                    const data = JSON.parse(request.responseText);
                    this.clazzes = data.map((clazz: any) => new Clazz(clazz.id, clazz.name, clazz.baseHealth, clazz.baseDefence, clazz.baseInitiative));
                    console.log(this.clazzes);
                }
                else {
                    console.log('Error: ' + request.status);
                }
            }
        }

        request.open('GET', 'https://api.tts-game.fun/background/classes', true);
        request.send();
    }

    readDataRaces(): void {
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {
            if (request.readyState === 4) {
                if (request.status === 200)
                {
                    const data = JSON.parse(request.responseText);
                    this.races = data.map((race: any) => new Race(race.id, race.name, race.baseInitiative));
                    console.log(this.races);
                }
                else {
                    console.log('Error: ' + request.status);
                }
            }
        }

        request.open('GET', 'https://api.tts-game.fun/background/races', true);
        request.send();
    }

    addCharacter(character: Character): void {
        if (this.characters.length < 6) {
            this.characters.push(character);
        }
    }

    addEmptyCharacter(): void {
        if (this.characters.length < 6) {
            this.characters.push(new Character(0, '', '', this.clazzes[0], this.races[0]));
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