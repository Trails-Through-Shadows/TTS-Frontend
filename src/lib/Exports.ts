export const api:string = import.meta.env.VITE_API_URL;

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

export class Effect {
    constructor(
        public type: string,
        public strength: number,
        public duration: number,
        public description: string | null,
    ) {}
}

export class EffectType {
    constructor(
        public title: string,
        public displayTitle: string,
        public description: string,
        public hasDuration: boolean,
        public hasStrength: boolean,
        public isResistance: boolean,
        public url: string,
    ) {}
}