<script lang="ts">
  import { api, checkToken } from '../../lib/Exports';
  import { Canvas } from './hexGridMap/Canvas';
  import { HexGrid } from './hexGridMap/HexGrid';
  import { Hex } from './hexGridMap/Hex';
  import { CubeCoordinate } from './hexGridMap/Coordinate';
  import { Encounter } from './Encounter';
  import { Notify, Loading } from "notiflix";
  import interact from 'interactjs';
  import Navbar from '../../lib/Components/Navbar.svelte';
  import LogoutButton from '../../lib/Components/LogoutButton.svelte';
  import ScrollingText from '../../lib/Components/ScrollingText.svelte';

  Notify.init({
    clickToClose: true
  });

  Loading.dots('Loading...');

  let idLicense = sessionStorage.getItem('idLicense') ? parseInt(sessionStorage.getItem('idLicense') as string) : 0;
  let token = sessionStorage.getItem('token') ? sessionStorage.getItem('token') : '';
  
  if (idLicense === 0 || token === '') {
    sessionStorage.clear();
    window.location.href = "/";
  }

  const urlParams = new URLSearchParams(window.location.search);
  let idEncounter = urlParams.get('id') ? parseInt(urlParams.get('id') as string) : 0;

  let onTurn: number = 0;
  let playing = false;

  type effect = { type: string, strength: number, duration: number };
  type baseCharacter = { id: number, title: string, playerName: string, health: number, defence: number, baseInitiative: number, activeEffects: effect[], url:string };
  type baseEnemy = { id: number, idGroup:number, title: string, health: number, initiative: number, url: string };
  type baseEnemyGroup = { id:number, enemy:baseEnemy[]};

  let idLocation: number = 0;
  let idParts: number[] = [];

  let canvasRoot: HTMLCanvasElement | undefined;
  let canvas: Canvas;
  let hexGridMap: HexGrid[] = [];
  let currentMap: number = 0;

  const textureImage = new Image();
  textureImage.src = '/assets/map-texture-new-smol.png';

  const borderImage = new Image();
  borderImage.src = '/assets/map-texture-new-smol-dark.png';

  let characterList: baseCharacter[] = [];
  let enemyList: baseEnemy[] = [];
  let enemyGroupList: baseEnemyGroup[] = [];
  let entityList: { id:number, initiative: number, type: string, entity: (baseCharacter | baseEnemyGroup) }[] = [];
  let selectedEnemies: number[] = [];

  let creator = new Encounter();

  function receiveParts(part: number) {
    creator.readPartsData(`${api}/locations/${idLocation}/parts/${part}`,
      (dataParts: any) => {
        let hexGrid = new HexGrid(
          dataParts.id,
          canvas,
          dataParts.hexes.map((hex: any) => new Hex(hex.key.idPart, hex.key.id, new CubeCoordinate(hex.q, hex.r, hex.s))),
          textureImage,
          borderImage
        );

        //add entities to hexGrid
        for (let enemy of dataParts.enemies) {
          if (enemy.startingHex.key.idPart === dataParts.id) {
            hexGrid.addEntity({
              title: enemy.title,
              coords: new CubeCoordinate(enemy.startingHex.q, enemy.startingHex.r, enemy.startingHex.s),
              url: enemy.url,
              image: new Image()
            });
          }
        }

        //add doors as new hexes to hexGrid
        if (dataParts.doors) {
          let doors: Hex[] = [];
          for (let door of dataParts.doors) {
            let tmpDoor = new Hex(door.key.idPartFrom, door.key.idPartTo, new CubeCoordinate(door.q, door.r, door.s));
            tmpDoor.isDoor = true;
            doors.push(tmpDoor);
          }
          hexGrid.addHexes(doors);
        }

        //add startingHexes to hexGrid
        for (let startingHex of dataParts.startingHexes) {
          hexGrid.addStartHex(new CubeCoordinate(startingHex.q, startingHex.r, startingHex.s));
        }

        hexGrid.getImages();

        hexGridMap.push(hexGrid);

        if (hexGridMap.length === idParts.length) {
          canvas.setLoading(false);
          hexGrid.draw();
          hexGrid.displayed = true;

          canvas.addOnSizeListener(() => {
            hexGrid.redraw();
          });
        }

        hexGridMap = hexGridMap;

        canvas.addOnMouseClickListener((x: number, y: number) => {
          hexGrid.onClick(x, y, (hex: Hex) => {
            let door = {
              key: {
                idPartFrom: hex.idPart,
                idPartTo: hex.id
              },
              q: hex.coords.q,
              r: hex.coords.r,
              s: hex.coords.s
            };
            creator.postOpenDoorData(`${api}/encounter/${idEncounter}/openDoor?token=${token}`, door,
              () => {
                Notify.success("The door will open at the end of the round.");
              },
              (m: string) => {
                Notify.failure(m);
                checkToken(m);
              }
            );
          });
        });
      },
      (m: string) => {
        Notify.failure(m);
      }
    );
  }

  function receiveInitiative(callback: Function = (data: any) => {}) {
    creator.readInitiativeData(`${api}/encounter/${idEncounter}/initiative?token=${token}`,
      (data: any) => {
        let initiativeList: { id: number, initiative: number, type: string }[] = data.initiatives;

        entityList = [];

        for (let entity of initiativeList) {
          if (entity.type === "CHARACTER") {
            for (let character of characterList) {
              if (character.id === entity.id) {
                entityList.push({ id: entity.id, initiative: entity.initiative, type: "CHARACTER", entity: character });
                break;
              }
            }
          } else if (entity.type === "ENEMY") {
            for (let enemyGroup of enemyGroupList) {
                if (enemyGroup.id === entity.id) {
                  entityList.push({ id: entity.id, initiative: entity.initiative, type: "ENEMY", entity: enemyGroup });
                  break;
                }
              }
          }
        }

        entityList = entityList;

        selectedEnemies = Array(entityList.length).fill(0);

        callback(data);
      },
      (m: string) => {
        Notify.failure(m);
        checkToken(m);
      }
    );
  }

  creator.readEncounterData(`${api}/encounter/${idEncounter}?token=${token}`,
    (data: any) => {
      idLocation = data.idLocation;
      idParts = data.idParts;

      if (!canvasRoot)
      {
        Notify.failure("Canvas not found.");
        return;
      }
      
      canvas = new Canvas(canvasRoot);

      canvas.setLoading(true);

      for (let part of idParts) {
        receiveParts(part);
      }

      characterList = data.characters;
      enemyList = data.enemies;

      for (let enemy of enemyList) {
        if (enemyGroupList.length === 0) {
          enemyGroupList.push({id:enemy.idGroup, enemy:[enemy]});
        } else {
          let added = false;
          for (let i = 0; i < enemyGroupList.length; i++) {
            if (enemyGroupList[i].id === enemy.idGroup) {
              enemyGroupList[i].enemy.push(enemy);
              added = true;
              break;
            }
          }
          if (!added) {
            enemyGroupList.push({id:enemy.idGroup, enemy:[enemy]});
          }
        }
      }

      if (data.state === "ONGOING") {
        playing = true;
        receiveInitiative(
          (data: any) => {
            if (data.active) {
              if (data.active.type === "CHARACTER") {
                for (let i = 0; i < entityList.length; i++) {
                  if (entityList[i].id === data.active.id && entityList[i].type === data.active.type) {
                    onTurn = i;
                    break;
                  }
                }
              }
              else if (data.active.type === "ENEMY") {
                for (let i = 0; i < entityList.length; i++) {
                  if (entityList[i].id === data.active.id && entityList[i].type === data.active.type) {
                    onTurn = i;
                    break;
                  }
                }
              }
            }
          }
        );
      }
    },
    (m: string) => {
      Notify.failure(m);
      if (m === "Encounter not found!") {
        window.location.href = "/adventure";
      }
      checkToken(m);
    }
  );

  let isSliderVisible = false;

  function toggleSlider() {
    hexGridMap[currentMap].redraw();
    isSliderVisible = !isSliderVisible;
  }

  function draw(id: number) {
    for (let hexGrid of hexGridMap) {
      hexGrid.displayed = false;
    }
    currentMap = id;
    hexGridMap[id].displayed = true;
    hexGridMap[id].redraw();
  }

  let selectedOptions = Array(characterList.length).fill("");

  function handleSelectChange(event: any, index: any) {
    selectedOptions[index] = event.target.value;
  }

  function handleEnemyChange(event: any, index: any) {
    selectedEnemies[index] = event.target.value - 1;
  }

  function startEncounter() {
    let charInitiative: { id: number, initiative: number }[] = [];

    for (let i = 0; i < characterList.length; i++) {
      if (isNaN(selectedOptions[i]) && selectedOptions[i] !== "CRIT" && selectedOptions[i] !== "MISS") {
        Notify.failure("All characters must have an initiative value.");
        return;
      }
      charInitiative.push({ id: characterList[i].id, initiative: selectedOptions[i] === "CRIT" ? 10 : selectedOptions[i] === "MISS" ? -10 : parseInt(selectedOptions[i]) });
    }

    creator.postInitiativeData(`${api}/encounter/${idEncounter}/initiative?token=${token}`, charInitiative,
      () => {
        receiveInitiative(
          () => {
            if (entityList[0].type === "CHARACTER") {
              creator.postTurnData(`${api}/encounter/${idEncounter}/turn/character/${entityList[0].id}/start?token=${token}`,
                () => {},
                (m: string) => {
                  Notify.failure(m);
                  checkToken(m);
                }
              );
            }
            else if (entityList[0].type === "ENEMY") {
              creator.postTurnData(`${api}/encounter/${idEncounter}/turn/enemy/${entityList[0].id}/start?token=${token}`,
                () => {},
                (m: string) => {
                  Notify.failure(m);
                  checkToken(m);
                }
              );
            }
          }
        );
        playing = true;
      },
      (m: string) => {
        Notify.failure(m);
        checkToken(m);
      }
    );
  }

  function endTurn() {
    let url0 = "";
    let url1 = "";
    let pos = 0;

    if (entityList[onTurn].type === "CHARACTER") {
      url0 = `${api}/encounter/${idEncounter}/turn/character/${entityList[onTurn].id}/end?token=${token}`;
    } else if (entityList[onTurn].type === "ENEMY") {
      url0 = `${api}/encounter/${idEncounter}/turn/enemy/${entityList[onTurn].id}/end?token=${token}`;
    }

    if (!entityList[onTurn + 1]) {
      pos = 0;
    }
    else {
      pos = onTurn + 1;
    }

    if (entityList[pos].type === "CHARACTER") {
      url1 = `${api}/encounter/${idEncounter}/turn/character/${entityList[pos].id}/start?token=${token}`;
    } else if (entityList[pos].type === "ENEMY") {
      url1 = `${api}/encounter/${idEncounter}/turn/enemy/${entityList[pos].id}/start?token=${token}`;
    }

    creator.postTurnData(url0,
      () => {
        onTurn++;
        if (onTurn === entityList.length) {
          onTurn = 0;
          creator.postRoundEndData(`${api}/encounter/${idEncounter}/endRound?token=${token}`,
            (data: any) => {
              if (data.unlockedParts.length > 0) {
                Notify.success("New room has been unlocked.");
                Loading.dots('Loading...');

                for (let part of data.unlockedParts) {
                  receiveParts(part);
                }

                creator.readEncounterData(`${api}/encounter/${idEncounter}?token=${token}`,
                  (data: any) => {
                    characterList = data.characters;
                    enemyList = data.enemies;
                    
                    enemyGroupList = [];

                    for (let enemy of enemyList) {
                      if (enemyGroupList.length === 0) {
                        enemyGroupList.push({id:enemy.idGroup, enemy:[enemy]});
                      } else {
                        let added = false;
                        for (let i = 0; i < enemyGroupList.length; i++) {
                          if (enemyGroupList[i].id === enemy.idGroup) {
                            enemyGroupList[i].enemy.push(enemy);
                            added = true;
                            break;
                          }
                        }
                        if (!added) {
                          enemyGroupList.push({id:enemy.idGroup, enemy:[enemy]});
                        }
                      }
                    }

                    receiveInitiative();
                    Loading.remove();
                  },
                  (m: string) => {
                    Loading.remove();
                    Notify.failure(m);
                    checkToken(m);
                  }
                );
              }
              creator.postTurnData(url1,
                () => {
                  entityList = entityList;
                },
                (m: string) => {
                  Notify.failure(m);
                  checkToken(m);
                }
              );
            },
            (m: string) => {
              Notify.failure(m);
              checkToken(m);
            }
          );
        }
        else {
          creator.postTurnData(url1,
            () => {
              entityList = entityList;
            },
            (m: string) => {
              Notify.failure(m);
              checkToken(m);
            }
          );
        }
      },
      (m: string) => {
        Notify.failure(m);
        checkToken(m);
      }
    );
  }

  interact('.entity-card').dropzone({
    ondrop(event) {
      let target = event.target;
      let entityId = target.dataset.entityId;
      let entityType = target.dataset.entityType;
      let damage = event.relatedTarget.value;

      if (entityType === "CHARACTER") {
        creator.postInteractionData(`${api}/encounter/${idEncounter}/interaction/character/${entityId}?token=${token}`, parseInt(damage),
          (data: any) => {
            const entity = entityList.find((entity) => entity.id == entityId && entity.type == entityType);
            if (entity) {
              entity.entity.health = data.health;
              if (data.status === "DEAD") {
                if (entityId == entityList[onTurn].id && entityType === entityList[onTurn].type) {
                  console.log(`I am dead: ${entityId}`);
                  onTurn++;
                  creator.postTurnData(`${api}/encounter/${idEncounter}/turn/character/${entityList[onTurn].id}/start?token=${token}`,
                    () => {
                      entityList = entityList.filter((entity) => entity.id != entityId || entity.type != entityType);
                    },
                    (m: string) => {
                      Notify.failure(m);
                      checkToken(m);
                    }
                  );
                }
                else {
                  entityList = entityList.filter((entity) => entity.id != entityId || entity.type != entityType);
                }
              }
            }

            entityList = entityList;
            
            Notify.success(`Attacked entity of type: ${entityType}, with ID: ${entityId}, with damage: ${damage}.`);
          },
          (m: string) => {
            Notify.failure(m);
            checkToken(m);
          }
        );
      } else if (entityType === "ENEMY") {
        let selectedEnemy = target.querySelector('.enemies-menu').value;
        creator.postInteractionData(`${api}/encounter/${idEncounter}/interaction/enemy/${entityId}/${selectedEnemy}?token=${token}`, parseInt(damage),
          (data: any) => {
            const entity = entityList.find((entity) => entity.id == entityId && entity.type == entityType);
            if (entity) {
              entity.entity.enemy.find((enemy) => enemy.id == selectedEnemy).health = data.health;
              if (data.status === "DEAD") {
                entity.entity.enemy = entity.entity.enemy.filter((enemy) => enemy.id != selectedEnemy);
                if (entity.entity.enemy.length === 0) {
                  entityList = entityList.filter((entity) => entity.id != entityId || entity.type != entityType);
                }
              }
            }

            entityList = entityList;

            Notify.success(`Attacked entity of type: ${entityType}, with ID: ${entityId} and enemy ID: ${selectedEnemy}, with damage: ${damage}.`);
          },
          (m: string) => {
            Notify.failure(m);
            checkToken(m);
          }
        );
      }
    }
  });

  interact('.dragabble').draggable({
    listeners: {
      move(event) {
        let target = event.target;
        let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
        let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        target.style.transform = `translate(${x}px, ${y}px)`;
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
      },
      end(event) {
        let target = event.target;
        target.style.transform = 'translate(0px, 0px)';
        target.setAttribute('data-x', 0);
        target.setAttribute('data-y', 0);
      }
    }
  });

  Loading.remove();
</script>


<Navbar title="To battle!">
  <button class="btn btn-success me-5" on:click={toggleSlider}>
    Map
  </button>
  <LogoutButton />
</Navbar>

<div class="slider" class:visible={isSliderVisible}>
  <div class="canvas-container">
    <canvas bind:this={canvasRoot}></canvas>
  </div>
  <div class="button-container">
    {#each hexGridMap as hexGrid}
      <button class="btn btn-success" on:click={() => draw(hexGridMap.indexOf(hexGrid))}>
        {hexGrid.id}
      </button>
    {/each}
  </div>
</div>

<main>
  <div class="container-fluid">
    <div class="row">
      {#if !playing}
        {#each characterList as character, index}
          <div class="col-xl-2 big-card">
            <div class="card border-0 m-1">
              <div class="card-header">
                <ScrollingText>
                  <h5 id="card-name" class="m-0">{character.title}</h5>
                </ScrollingText>
                <ScrollingText>
                  <p class="m-0">{character.playerName}</p>
                </ScrollingText>
              </div>
              <div class="card-body">
                <div class="position-relative">
                  <img class="class-image" src="{character.url}" alt="{character.title}" />
                  <div class="position-absolute bottom-0 end-0">
                    <div class="position-relative">
                      <div class="d-flex align-items-end">
                        <input type="text" class="form-control form-control-sm stat-input" value={character.baseInitiative} disabled />
                        <select class="form-control stat-input {selectedOptions[index] === 'CRIT' || selectedOptions[index] === 'MISS' ? 'small-font' : ''}" on:change={(e) => handleSelectChange(e, index)}>
                          <option value="" selected disabled hidden>?</option>
                          {#each ["CRIT", "+5", "+4", "+3", "+2", "+1", "+0", "-1", "-2", "-3", "MISS"] as value}
                          <option value={value}>{value}</option>
                          {/each}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/each}
        <div class="col-xl-12">
          <button class="btn btn-success" on:click={startEncounter}>Start encounter</button>
        </div>
      {:else}
        {#each entityList as entity, index}
          {#if entity.type === 'CHARACTER'}
            <div class="{index === onTurn ? 'col-xl-2 big-card' : 'col-xl-1'}">
              <div class="card entity-card border-0 m-1" data-entity-id={entity.entity.id} data-entity-type={entity.type}>
                <div class="card-header">
                <ScrollingText>
                  <h5 id="card-name" class="m-0">{entity.entity.title}</h5>
                </ScrollingText>
                <ScrollingText>
                  <p class="m-0">{entity.entity.playerName}</p>
                </ScrollingText>
                </div>
                <div class="card-body">
                  <div class="position-relative">
                    <img class="class-image" src={entity.entity.url} alt="{entity.entity.title}" />
                    <div class="position-absolute bottom-0 start-50 translate-middle-x">
                      <div class="position-relative">
                        <img class="stat-image" src="assets/heart.png" alt="Health" />
                        <div class="stat-container">
                          <h5>{entity.entity.health}</h5>
                          {#if index === onTurn}
                            <div class="stat-text">Health</div>
                          {/if}
                        </div>
                      </div>
                    </div>
                    <div class="position-absolute bottom-0 end-0">
                      <div class="position-relative">
                        <img class="stat-image" src="assets/shield.png" alt="Defence" />
                        <div class="stat-container">
                          <h5>{entity.entity.defence}</h5>
                          {#if index === onTurn}
                            <div class="stat-text">Defence</div>
                          {/if}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="card-footer">
                  <div class="effects-list">
                    {#each entity.entity.activeEffects as effect}
                      <p>{effect.type} {effect.strength} {effect.duration}</p>
                    {/each}
                  </div>
                </div>
              </div>
            </div>
          {:else if entity.type === 'ENEMY'}
            <div class="{index === onTurn ? 'col-xl-2 big-card' : 'col-xl-1'}">
              <div class="card entity-card border-0 m-1" data-entity-id={entity.entity.id} data-entity-type={entity.type}>
                <div class="card-header">
                <ScrollingText>
                  <h5 id="card-name" class="m-0">{entity.entity.enemy[selectedEnemies[index]].title}</h5>
                </ScrollingText>
                  <select class="btn btn-sm enemies-menu" on:change={(e) => handleEnemyChange(e, index)}>
                    <i class="bi bi-arrow-bar-down" />
                    {#each entity.entity.enemy as enemy}
                      <option value={enemy.id}>{enemy.id}</option>
                    {/each}
                  </select>
                </div>
                <div class="card-body">
                  <div class="position-relative">
                    <img class="class-image" src="{entity.entity.enemy[selectedEnemies[index]].url}" alt="{entity.entity.enemy[selectedEnemies[index]].title}" />
                    <div class="position-absolute bottom-0 start-50 translate-middle-x">
                      <div class="position-relative">
                        <img class="stat-image" src="assets/heart.png" alt="Health" />
                        <div class="stat-container">
                          <h5>{entity.entity.enemy[selectedEnemies[index]].health}</h5>
                          {#if index === onTurn}
                            <div class="stat-text">Health</div>
                          {/if}
                        </div>
                      </div>
                    </div>
                    <div class="position-absolute bottom-0 end-0">
                      <div class="position-relative">
                        <img class="stat-image" src="assets/shield.png" alt="Defence" />
                        <div class="stat-container">
                          <h5>{entity.entity.enemy[selectedEnemies[index]].defence}</h5>
                          {#if index === onTurn}
                            <div class="stat-text">Defence</div>
                          {/if}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="card-footer">
                  <div class="effects-list">
                    {#each entity.entity.enemy[selectedEnemies[index]].activeEffects as effect}
                      <p>{effect.type} {effect.strength} {effect.duration}</p>
                    {/each}
                  </div>
                </div>
              </div>
            </div>
          {/if}
        {/each}
        <div class="col-xl-12">
          <button class="btn btn-success" on:click={endTurn}>Next turn</button>
        </div>
        <div class="col-xl-12">
          <input type="number" class="btn btn-danger dragabble" />
        </div>
      {/if}
    </div>
  </div>
</main>


<style>
  .slider {
    position: fixed;
    top: -100%;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('/assets/map.png');
    background-size: cover;
    color: #fff;
    transition: top 0.5s ease;
    overflow: hidden;
    z-index: 999;
    display: flex;
  }

  .slider.visible {
    top: 0;
  }

  .canvas-container {
    flex: 1;
  }

  .button-container {
    padding-top: 75px;
    display: flex;
    flex-direction: column;
  }

  .button-container button {
    margin: 5px;
  }

  .entity-card {
    background-color: #222;
    color: #bababa;
    border: 0;
  }

  .stat-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    position: absolute;
    bottom: -10%;
    left: 50%;
    transform: translateX(-50%);
  }

  .stat-container h5 {
    margin: 0;
    font-size: 1.6vw;
  }

  .col-xl-1 {
    width: 16%;
  }

  @media (max-width: 1200px) {
    .col-xl-1 {
      width: 19.05%;
    }
  }

  @media (max-width: 992px) {
    .col-xl-1 {
      width: 23.53%;
    }
  }

  @media (max-width: 768px) {
    .col-xl-1 {
      width: 30.77%;
    }
  }

  @media (max-width: 576px) {
    .col-xl-1 {
      width: 80%;
    }
  }

  .col-xl-2 {
    width: 20%;
  }

  @media (max-width: 1200px) {
    .col-xl-2 {
      width: 23.81%;
    }
  }

  @media (max-width: 992px) {
    .col-xl-2 {
      width: 29.41%;
    }
  }

  @media (max-width: 768px) {
    .col-xl-2 {
      width: 38.46%;
    }
  }

  @media (max-width: 576px) {
    .col-xl-2 {
      width: 100%;
    }
  }

  .card-body {
    padding: 8px;
  }

  .stat-image {
    width: 2.4vw;
    margin-top: 0.5vw;
  }

  .big-card .stat-image {
    margin-top: -1.2vw;
  }

  .stat-text {
    color: #bababa;
    font-size: 0.75vw;
  }

  .big-card .stat-image {
    width: 3vw;
  }

  .big-card h5 {
    font-size: 2rem;
  }

  .big-card .stat-container h5 {
    font-size: 2vw;
  }

  .class-image {
    width: 100%;
    border-radius: 25%;
  }

  .stat-input {
    width: 50px;
    height: 50px;
    background-color: #333;
    color: #bababa;
    text-align: center;
    justify-content: center;
    border: none;
    border-radius: 5px 5px 5px 0;
    font-size: 1.5rem;
    padding: 0;
  }

  select.stat-input {
    border: 1px solid #4fc780;
    color: #4fc780;
  }

  select.stat-input option {
    font-size: 1rem;
  }
  
  select.stat-input.small-font {
    font-size: 1rem;
  }

  .stat-input:disabled {
    width: 30px;
    height: 30px;
    border-radius: 5px 0 0 5px;
    background-color: #333;
    font-size: 1rem;
  }

  .card-header {
    background-color: #222;
    color: #bababa;
  }

  .card-body {
    background-color: #222;
    border-radius: 0 0 5px 5px;
  }

  h5 {
    color: white;
  }

  .enemies-menu {
    color: #bababa;
    border: none;
    padding: 0;
  }

  .enemies-menu option {
    color: #222;
  }

  .enemies-menu:hover {
    color: #222;
  }
</style>
