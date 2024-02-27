//export const api:string = 'https://api.tts-game.fun';
export const api:string = 'http://localhost:8080';

export class Clazz {
    constructor (
        public id: number,
        public title: string,
        public tag: string | null,
        public description: string | null,
        public baseHealth: number,
        public baseDefence: number,
        public baseInitiative: number,
    ) {}
}

export class Race {
    constructor (
        public id: number,
        public title: string,
        public tag: string | null,
        public description: string | null,
        public baseInitiative: number,
    ) {}
}

export class Character {
    constructor(
        public id: number,
        public clazz: Clazz,
        public race: Race,
        public title: string,
        public playerName: string | null,
        public url: string | null = null,
    ) {}
}

export class LazyCharacter {
    constructor(
        public id: number,
        public clazz: number,
        public race: number,
        public title: string,
        public playerName: string | null,
        public baseInitiative: number | null = null,
    ) {}
}

export class Enemy {
    constructor(
        public id: number,
        public title: string,
        public tag: string | null,
        public description: string | null,
        public baseHealth: number,
        public baseDefence: number,
        public baseInitiative: number,
        public url: string | null = null,
    ) {}
}

export class Obstacle {
    constructor(
        public id: number,
        public title: string,
        public tag: string | null,
        public description: string | null,
        public baseDamage: number,
        public baseHealth: number,
        public crossable: boolean,
        public url: string | null = null,
    ) {}
}

export class Adventure {
    constructor(
        public id: number | null,
        public title: string,
        public description: string | null,
        public reputation: number,
        public experience: number,
        public gold: number,
        public idCampaign: number = 0,
    ) {}
}

export class Campaign {
    constructor(
        public id: number,
        public title: string,
        public description: string | null,
    ) {}
}

export class Part {
    constructor(
        public id: number,
        public title: string,
        public tag: string | null,
    ) {}
}

export class Location {
    constructor(
        public id: number,
        public title: string,
        public tag: string | null,
        public type: string,
        public description: string | null,
    ) {}
}

export function checkToken(m: string): void {
    if (m === 'Invalid session token!') {
        sessionStorage.clear();
        window.location.href = "/";
    }
} 