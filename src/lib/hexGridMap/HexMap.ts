import { Canvas } from "./Canvas";
import { CubeCoordinate } from "./Coordinate";
import { Hex, type Offset } from "./Hex";
import { HexGrid } from "./HexGrid";

import { Location } from "../Exports";

type HexEnemy = {
  title: string;
  tag: string | null;
  coords: CubeCoordinate;
  image: HTMLImageElement;
}

type HexObstacle = {
  title: string;
  tag: string | null;
  coords: CubeCoordinate;
  image: HTMLImageElement;
}

export class HexMap {
  private location: Location | null = null;
  private hexGridList: HexGrid[] = [];
  private startHexes: CubeCoordinate[] = [];

  constructor(
      private canvas: Canvas,
      private textureImage: HTMLImageElement,
      private borderImage: HTMLImageElement,
  ) {}

  readData(url: string, callback?: Function): void {
      const request = new XMLHttpRequest();
      request.onreadystatechange = () => {
          this.canvas.setLoading(true);
          const currentTime = new Date().getTime();

          console.log(`HexMap | Reading data from ${url}`);

          if (request.readyState === 4) {
              if (request.status === 200)
              {
                  const data = JSON.parse(request.responseText);
                  console.log(data);
                  this.location = new Location(data.id, data.title, data.tag, data.type, data.description);
                  this.hexGridList = data.parts.map((hexGrid: any) => new HexGrid(
                    hexGrid.id,
                    this.canvas,
                    hexGrid.hexes.map((hex: any) => new Hex(new CubeCoordinate(hex.q, hex.r, hex.s))),
                    hexGrid.enemies.map((enemy: any) => {
                      return {
                        title: enemy.title,
                        tag: enemy.tag,
                        coords: new CubeCoordinate(enemy.hex.q, enemy.hex.r, enemy.hex.s)
                    }}),
                    hexGrid.obstacles.map((obstacle: any) => {
                      return {
                        title: obstacle.title,
                        tag: obstacle.tag,
                        coords: new CubeCoordinate(obstacle.hex.q, obstacle.hex.r, obstacle.hex.s)
                    }}),
                    this.textureImage,
                    this.borderImage,
                  ));
                  this.startHexes = data.startHexes.map((coords: any) => new CubeCoordinate(coords.q, coords.r, coords.s));

                  const took = new Date().getTime() - currentTime;
                  console.log(`HexMap | Data read in ${took}ms`);

                  this.canvas.setLoading(false);

                  this.draw(0);

                  if (callback) callback();
              }
              else {
                  console.log('Error: ' + request.status);
              }
          }
      }

      request.open('GET', url, true);
      request.send();
  }

  draw(id: number): void {
    this.hexGridList[id].draw();
  }
}



/*
                    {
                        "id": 1,
                        "title": "Dungeon 1",
                        "tag": "l-dng1",
                        "type": "DUNGEON",
                        "description": "This is the first dungeon",
                        "parts": [
                          {
                            "id": 1,
                            "tag": "p-square",
                            "title": "Square",
                            "hexes": [
                              {
                                "key": {
                                  "idPart": 1,
                                  "id": 1
                                },
                                "q": 2,
                                "r": 0,
                                "s": -2
                              },
                              {
                                "key": {
                                  "idPart": 1,
                                  "id": 2
                                },
                                "q": -3,
                                "r": 1,
                                "s": 2
                              },
                              {
                                "key": {
                                  "idPart": 1,
                                  "id": 3
                                },
                                "q": -2,
                                "r": 1,
                                "s": 1
                              },
                              {
                                "key": {
                                  "idPart": 1,
                                  "id": 4
                                },
                                "q": -1,
                                "r": 1,
                                "s": 0
                              },
                              {
                                "key": {
                                  "idPart": 1,
                                  "id": 5
                                },
                                "q": 0,
                                "r": 1,
                                "s": -1
                              },
                              {
                                "key": {
                                  "idPart": 1,
                                  "id": 6
                                },
                                "q": 1,
                                "r": 1,
                                "s": -2
                              },
                              {
                                "key": {
                                  "idPart": 1,
                                  "id": 7
                                },
                                "q": -3,
                                "r": 2,
                                "s": 1
                              },
                              {
                                "key": {
                                  "idPart": 1,
                                  "id": 8
                                },
                                "q": -2,
                                "r": 2,
                                "s": 0
                              },
                              {
                                "key": {
                                  "idPart": 1,
                                  "id": 9
                                },
                                "q": -1,
                                "r": 2,
                                "s": -1
                              },
                              {
                                "key": {
                                  "idPart": 1,
                                  "id": 10
                                },
                                "q": 0,
                                "r": 2,
                                "s": -2
                              },
                              {
                                "key": {
                                  "idPart": 1,
                                  "id": 11
                                },
                                "q": 1,
                                "r": 2,
                                "s": -3
                              },
                              {
                                "key": {
                                  "idPart": 1,
                                  "id": 12
                                },
                                "q": -4,
                                "r": 3,
                                "s": 1
                              },
                              {
                                "key": {
                                  "idPart": 1,
                                  "id": 13
                                },
                                "q": -3,
                                "r": 3,
                                "s": 0
                              },
                              {
                                "key": {
                                  "idPart": 1,
                                  "id": 14
                                },
                                "q": -2,
                                "r": 3,
                                "s": -1
                              },
                              {
                                "key": {
                                  "idPart": 1,
                                  "id": 15
                                },
                                "q": -1,
                                "r": 3,
                                "s": -2
                              },
                              {
                                "key": {
                                  "idPart": 1,
                                  "id": 16
                                },
                                "q": 0,
                                "r": 3,
                                "s": -3
                              },
                              {
                                "key": {
                                  "idPart": 1,
                                  "id": 17
                                },
                                "q": -2,
                                "r": -1,
                                "s": 3
                              },
                              {
                                "key": {
                                  "idPart": 1,
                                  "id": 18
                                },
                                "q": -1,
                                "r": -1,
                                "s": 2
                              },
                              {
                                "key": {
                                  "idPart": 1,
                                  "id": 19
                                },
                                "q": 0,
                                "r": -1,
                                "s": 1
                              },
                              {
                                "key": {
                                  "idPart": 1,
                                  "id": 20
                                },
                                "q": 1,
                                "r": -1,
                                "s": 0
                              },
                              {
                                "key": {
                                  "idPart": 1,
                                  "id": 21
                                },
                                "q": 2,
                                "r": -1,
                                "s": -1
                              },
                              {
                                "key": {
                                  "idPart": 1,
                                  "id": 22
                                },
                                "q": -2,
                                "r": 0,
                                "s": 2
                              },
                              {
                                "key": {
                                  "idPart": 1,
                                  "id": 23
                                },
                                "q": -1,
                                "r": 0,
                                "s": 1
                              },
                              {
                                "key": {
                                  "idPart": 1,
                                  "id": 24
                                },
                                "q": 0,
                                "r": 0,
                                "s": 0
                              },
                              {
                                "key": {
                                  "idPart": 1,
                                  "id": 25
                                },
                                "q": -4,
                                "r": 2,
                                "s": 2
                              },
                              {
                                "key": {
                                  "idPart": 1,
                                  "id": 26
                                },
                                "q": -3,
                                "r": 0,
                                "s": 3
                              },
                              {
                                "key": {
                                  "idPart": 1,
                                  "id": 72
                                },
                                "q": 1,
                                "r": 0,
                                "s": -1
                              }
                            ],
                            "usages": 2,
                            "rotation": 0,
                            "enemies": [
                              {
                                "id": 1,
                                "title": "Zombie",
                                "baseHealth": 10,
                                "baseDefence": 2,
                                "tag": "e-zombie",
                                "usages": 1,
                                "effects": [
                                  {
                                    "id": null,
                                    "target": "ONE",
                                    "type": "POISON",
                                    "duration": 3,
                                    "strength": 5
                                  },
                                  {
                                    "id": null,
                                    "target": "SELF",
                                    "type": "POISON_RESISTANCE",
                                    "duration": 3,
                                    "strength": 0
                                  }
                                ],
                                "actions": [
                                  {
                                    "title": "Tiny bite",
                                    "description": "This bite is so weak it does nothing.",
                                    "discard": "NEVER",
                                    "summonActions": []
                                  },
                                  {
                                    "title": "Summon a Mother Rat",
                                    "description": "It can summon little ones.",
                                    "discard": "NEVER",
                                    "summonActions": [
                                      {
                                        "id": {},
                                        "summon": {
                                          "id": 2,
                                          "title": "Mother Rat",
                                          "duration": 10,
                                          "health": 10,
                                          "tag": null,
                                          "action": {
                                            "id": 4,
                                            "title": "Summon a little myšítko",
                                            "description": "In a non recursive way.",
                                            "discard": "NEVER",
                                            "summonActions": [
                                              {
                                                "id": {},
                                                "summon": {
                                                  "id": 3,
                                                  "title": "Little myšítko",
                                                  "duration": 10,
                                                  "health": 10,
                                                  "tag": null,
                                                  "action": {
                                                    "id": 5,
                                                    "title": "Tiny bite",
                                                    "description": "This bite is so weak it does nothing.",
                                                    "discard": "NEVER",
                                                    "summonActions": []
                                                  },
                                                  "effects": [],
                                                  "rawEffects": [],
                                                  "hibernateLazyInitializer": {}
                                                },
                                                "idAction": 4,
                                                "range": 1
                                              }
                                            ]
                                          },
                                          "effects": [],
                                          "rawEffects": [],
                                          "hibernateLazyInitializer": {}
                                        },
                                        "idAction": 6,
                                        "range": 3
                                      }
                                    ]
                                  }
                                ],
                                "hex": {
                                  "key": {
                                    "idPart": 1,
                                    "id": 1
                                  },
                                  "q": 2,
                                  "r": 0,
                                  "s": -2
                                }
                              }
                            ],
                            "obstacles": [
                              {
                                "id": 1,
                                "title": "Pit Trap",
                                "damage": 10,
                                "health": 0,
                                "crossable": false,
                                "usages": 1,
                                "effects": [
                                  {
                                    "id": null,
                                    "target": "SELF",
                                    "type": "POISON_RESISTANCE",
                                    "duration": 3,
                                    "strength": 0
                                  },
                                  {
                                    "id": null,
                                    "target": "ONE",
                                    "type": "POISON",
                                    "duration": 3,
                                    "strength": 5
                                  }
                                ],
                                "tag": "o-trapPit",
                                "hex": {
                                  "key": {
                                    "idPart": 1,
                                    "id": 4
                                  },
                                  "q": -1,
                                  "r": 1,
                                  "s": 0
                                }
                              }
                            ]
                          },
                          {
                            "id": 2,
                            "tag": "p-hexagon",
                            "title": "Hexagon",
                            "hexes": [
                              {
                                "key": {
                                  "idPart": 2,
                                  "id": 1
                                },
                                "q": 2,
                                "r": -2,
                                "s": 0
                              },
                              {
                                "key": {
                                  "idPart": 2,
                                  "id": 2
                                },
                                "q": -1,
                                "r": -1,
                                "s": 2
                              },
                              {
                                "key": {
                                  "idPart": 2,
                                  "id": 3
                                },
                                "q": 2,
                                "r": -1,
                                "s": -1
                              },
                              {
                                "key": {
                                  "idPart": 2,
                                  "id": 4
                                },
                                "q": -2,
                                "r": 0,
                                "s": 2
                              },
                              {
                                "key": {
                                  "idPart": 2,
                                  "id": 5
                                },
                                "q": 0,
                                "r": 0,
                                "s": 0
                              },
                              {
                                "key": {
                                  "idPart": 2,
                                  "id": 6
                                },
                                "q": 2,
                                "r": 0,
                                "s": -2
                              },
                              {
                                "key": {
                                  "idPart": 2,
                                  "id": 7
                                },
                                "q": -2,
                                "r": 1,
                                "s": 1
                              },
                              {
                                "key": {
                                  "idPart": 2,
                                  "id": 8
                                },
                                "q": 1,
                                "r": 1,
                                "s": -2
                              },
                              {
                                "key": {
                                  "idPart": 2,
                                  "id": 9
                                },
                                "q": -2,
                                "r": 2,
                                "s": 0
                              },
                              {
                                "key": {
                                  "idPart": 2,
                                  "id": 10
                                },
                                "q": -1,
                                "r": 2,
                                "s": -1
                              },
                              {
                                "key": {
                                  "idPart": 2,
                                  "id": 11
                                },
                                "q": 0,
                                "r": 2,
                                "s": -2
                              },
                              {
                                "key": {
                                  "idPart": 2,
                                  "id": 12
                                },
                                "q": -1,
                                "r": 0,
                                "s": 1
                              },
                              {
                                "key": {
                                  "idPart": 2,
                                  "id": 13
                                },
                                "q": 1,
                                "r": 0,
                                "s": -1
                              },
                              {
                                "key": {
                                  "idPart": 2,
                                  "id": 14
                                },
                                "q": 0,
                                "r": -2,
                                "s": 2
                              },
                              {
                                "key": {
                                  "idPart": 2,
                                  "id": 15
                                },
                                "q": -1,
                                "r": 1,
                                "s": 0
                              },
                              {
                                "key": {
                                  "idPart": 2,
                                  "id": 16
                                },
                                "q": 0,
                                "r": 1,
                                "s": -1
                              },
                              {
                                "key": {
                                  "idPart": 2,
                                  "id": 17
                                },
                                "q": 1,
                                "r": -1,
                                "s": 0
                              },
                              {
                                "key": {
                                  "idPart": 2,
                                  "id": 18
                                },
                                "q": 0,
                                "r": -1,
                                "s": 1
                              },
                              {
                                "key": {
                                  "idPart": 2,
                                  "id": 71
                                },
                                "q": 1,
                                "r": -2,
                                "s": 1
                              }
                            ],
                            "usages": 2,
                            "rotation": 0,
                            "enemies": [],
                            "obstacles": []
                          }
                        ],
                        "doors": [
                          {
                            "idLocation": 1,
                            "idPartFrom": 1,
                            "idPartTo": 2,
                            "idHex": 3
                          }
                        ],
                        "startHexes": [],
                        "paths": [
                          {
                            "idCampaign": 1,
                            "idStart": 1,
                            "idEnd": 2
                          }
                        ],
                        "enemies": [
                          {
                            "key": {
                              "idEnemy": 1,
                              "idHex": 1,
                              "idLocation": 1,
                              "idPart": 1
                            },
                            "enemy": {
                              "id": 1,
                              "title": "Zombie",
                              "baseHealth": 10,
                              "baseDefence": 2,
                              "tag": "e-zombie",
                              "usages": 1,
                              "effects": [
                                {
                                  "id": 1,
                                  "target": "ONE",
                                  "type": "POISON",
                                  "duration": 3,
                                  "strength": 5
                                },
                                {
                                  "id": 2,
                                  "target": "SELF",
                                  "type": "POISON_RESISTANCE",
                                  "duration": 3,
                                  "strength": 0
                                }
                              ],
                              "actions": [
                                {
                                  "id": 5,
                                  "title": "Tiny bite",
                                  "description": "This bite is so weak it does nothing.",
                                  "discard": "NEVER",
                                  "summonActions": []
                                },
                                {
                                  "id": 6,
                                  "title": "Summon a Mother Rat",
                                  "description": "It can summon little ones.",
                                  "discard": "NEVER",
                                  "summonActions": [
                                    {
                                      "id": {},
                                      "summon": {
                                        "id": 2,
                                        "title": "Mother Rat",
                                        "duration": 10,
                                        "health": 10,
                                        "tag": null,
                                        "action": {
                                          "id": 4,
                                          "title": "Summon a little myšítko",
                                          "description": "In a non recursive way.",
                                          "discard": "NEVER",
                                          "summonActions": [
                                            {
                                              "id": {},
                                              "summon": {
                                                "id": 3,
                                                "title": "Little myšítko",
                                                "duration": 10,
                                                "health": 10,
                                                "tag": null,
                                                "action": {
                                                  "id": 5,
                                                  "title": "Tiny bite",
                                                  "description": "This bite is so weak it does nothing.",
                                                  "discard": "NEVER",
                                                  "summonActions": []
                                                },
                                                "effects": [],
                                                "rawEffects": [],
                                                "hibernateLazyInitializer": {}
                                              },
                                              "idAction": 4,
                                              "range": 1
                                            }
                                          ]
                                        },
                                        "effects": [],
                                        "rawEffects": [],
                                        "hibernateLazyInitializer": {}
                                      },
                                      "idAction": 6,
                                      "range": 3
                                    }
                                  ]
                                }
                              ]
                            }
                          }
                        ],
                        "obstacles": [
                          {
                            "key": {
                              "idObstacle": 1,
                              "idHex": 4,
                              "idPart": 1,
                              "idLocation": 1
                            },
                            "obstacle": {
                              "id": 1,
                              "title": "Pit Trap",
                              "damage": 10,
                              "health": 0,
                              "crossable": false,
                              "usages": 1,
                              "effects": [
                                {
                                  "id": 1,
                                  "target": "ONE",
                                  "type": "POISON",
                                  "duration": 3,
                                  "strength": 5
                                },
                                {
                                  "id": 2,
                                  "target": "SELF",
                                  "type": "POISON_RESISTANCE",
                                  "duration": 3,
                                  "strength": 0
                                }
                              ],
                              "tag": "o-trapPit",
                              "hibernateLazyInitializer": {}
                            }
                          }
                        ]
                      }
                      */