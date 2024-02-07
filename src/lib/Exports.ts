export const api:string = 'https://api.tts-game.fun';

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
    ) {}
}

export class Adventure {
    constructor(
        public id: number,
        public title: string,
        public description: string | null,
        public reputation: number,
        public experience: number,
        public gold: number,
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