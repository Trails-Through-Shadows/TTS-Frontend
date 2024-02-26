<script lang="ts">
  import { api } from '../../lib/Exports';
  import { Canvas } from '../../lib/hexGridMap/Canvas';
  import { HexGrid } from '../../lib/hexGridMap/HexGrid';
  import { Hex } from '../../lib/hexGridMap/Hex';
  import { CubeCoordinate } from '../../lib/hexGridMap/Coordinate';
  import { Encounter } from './Encounter';
  import { Notify, Loading } from "notiflix";

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

  type baseCharacter = { id: number, title: string, playerName: string, health: number, defence: number, baseInitiative: number, url:string };
  type baseEnemy = { id: number, idGroup:number, title: string, health: number, initiative: number, url: string };
  type baseEnemyGroup = { id:number, enemy:baseEnemy[]};

  let idLocation: number = 0;
  let idParts: number[] = [];

  let canvasRoot: HTMLCanvasElement | undefined;
  let hexGridMap: HexGrid[] = [];

  const textureImage = new Image();
  textureImage.src = '/assets/map-texture-smol-light.jpg';

  const borderImage = new Image();
  borderImage.src = '/assets/map-texture-smol.jpg';

  let characterList: baseCharacter[] = [];
  let enemyList: baseEnemy[] = [];
  let enemyGroupList: baseEnemyGroup[] = [];
  let entityList: { id:number, initiative: number, type: string, entity: (baseCharacter | baseEnemyGroup) }[] = [];

  let creator = new Encounter();

  creator.readEncounterData(`${api}/encounter/${idEncounter}?token=${token}`,
    (data: any) => {
      idLocation = data.idLocation;
      idParts = data.idParts;

      if (!canvasRoot)
      {
        Notify.failure("Canvas not found.");
        return;
      }
      
      let canvas = new Canvas(canvasRoot);
      canvas.setLoading(true);

      for (let part of idParts) {
        creator.readPartsData(`${api}/parts/${part}`,
          (dataParts: any) => {
            let hexGrid = new HexGrid(
              dataParts.id,
              canvas,
              dataParts.hexes.map((hex: any) => new Hex(hex.key.idPart, hex.key.id, new CubeCoordinate(hex.q, hex.r, hex.s))),
              textureImage,
              borderImage
            );

            //add entities to hexGrid
            for (let enemy of data.enemies) {
              if (enemy.startingHex.key.idPart === dataParts.id) {
                //entityImage.src = enemy.url;
                hexGrid.addEntity({
                  title: enemy.title,
                  coords: new CubeCoordinate(enemy.startingHex.q, enemy.startingHex.r, enemy.startingHex.s),
                  url: enemy.url,
                  image: new Image()
                });
              }
            }

            hexGrid.getImages();

            hexGridMap.push(hexGrid);

            if (hexGridMap.length === idParts.length) {
              canvas.setLoading(false);
              console.log(hexGridMap);
              hexGridMap[0].draw();

              canvas.setBackgroundImage('/assets/map-background.jpg', () => {
                canvas.clear();
                hexGridMap[0].draw();
              });

              canvas.addOnSizeListener(() => {
                canvas.clear();
                hexGridMap[0].draw();
              });
            }
          },
          (m: string) => {
            Notify.failure(m);
          }
        );
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

      console.log(enemyGroupList);
    },
    (m: string) => {
      Notify.failure(m);
      if (m === 'Invalid session token!') {
        sessionStorage.clear();
        window.location.href = "/";
      }
    }
  );

  let isSliderVisible = false;

  function toggleSlider() {
    isSliderVisible = !isSliderVisible;
  }

  let selectedOptions = Array(characterList.length).fill("");

  function handleChange(event: any, index: any) {
    selectedOptions[index] = event.target.value;
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
        creator.readInitiativeData(`${api}/encounter/${idEncounter}/initiative?token=${token}`,
          (data: any) => {
            let initiativeList: { id: number, initiative: number, type: string }[] = data;

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
            console.log(entityList);

            if (entityList[0].type === "CHARACTER") {
              creator.postTurnStartCharacterData(`${api}/encounter/${idEncounter}/turn/character/${entityList[0].id}/start?token=${token}`,
                () => {},
                (m: string) => {
                  Notify.failure(m);
                }
              );
            }
            else if (entityList[0].type === "ENEMY") {
              creator.postTurnStartEnemyData(`${api}/encounter/${idEncounter}/turn/enemy/${entityList[0].id}/start?token=${token}`,
                () => {},
                (m: string) => {
                  Notify.failure(m);
                }
              );
            }
          },
          (m: string) => {
            Notify.failure(m);
          }
        );
        playing = true;
      },
      (m: string) => {
        Notify.failure(m);
      }
    );
  }

  function endTurn() {
    if (entityList[onTurn].type === "CHARACTER") {
      creator.postTurnEndCharacterData(`${api}/encounter/${idEncounter}/turn/character/${entityList[onTurn].id}/end?token=${token}`,
        () => {
          onTurn++;
          if (onTurn === entityList.length) {
            onTurn = 0;
            creator.postRoundEndData(`${api}/encounter/${idEncounter}/end?token=${token}`,
              () => {},
              (m: string) => {
                Notify.failure(m);
              }
            );
          }
          if (entityList[onTurn].type === "CHARACTER") {
            creator.postTurnStartEnemyData(`${api}/encounter/${idEncounter}/turn/character/${entityList[onTurn].id}/start?token=${token}`,
              () => {
                entityList = entityList;
              },
              (m: string) => {
                Notify.failure(m);
              }
            );
          }
          else if (entityList[onTurn].type === "ENEMY") {
            creator.postTurnStartCharacterData(`${api}/encounter/${idEncounter}/turn/enemy/${entityList[onTurn].id}/start?token=${token}`,
              () => {
                entityList = entityList;
              },
              (m: string) => {
                Notify.failure(m);
              }
            );
          }
        },
        (m: string) => {
          Notify.failure(m);
        }
      );
    } else if (entityList[onTurn].type === "ENEMY") {
      creator.postTurnEndEnemyData(`${api}/encounter/${idEncounter}/turn/enemy/${entityList[onTurn].id}/end?token=${token}`,
        () => {
          onTurn++;
          if (onTurn === entityList.length) {
            onTurn = 0;
            creator.postRoundEndData(`${api}/encounter/${idEncounter}/end?token=${token}`,
              () => {},
              (m: string) => {
                Notify.failure(m);
              }
            );
          }
          if (entityList[onTurn].type === "CHARACTER") {
            creator.postTurnStartEnemyData(`${api}/encounter/${idEncounter}/turn/character/${entityList[onTurn].id}/start?token=${token}`,
              () => {
                entityList = entityList;
              },
              (m: string) => {
                Notify.failure(m);
              }
            );
          }
          else if (entityList[onTurn].type === "ENEMY") {
            creator.postTurnStartCharacterData(`${api}/encounter/${idEncounter}/turn/enemy/${entityList[onTurn].id}/start?token=${token}`,
              () => {
                entityList = entityList;
              },
              (m: string) => {
                Notify.failure(m);
              }
            );
          }
        },
        (m: string) => {
          Notify.failure(m);
        }
      );
    }
  }
</script>


<nav class="navbar">
  <div class="logo-container">
    <img src="assets/logo-icon-small.png" alt="Logo" />
    Trails Through Shadows
  </div>
  <button class="btn" on:click={toggleSlider}>
    Map
  </button>
  <div class="dropdown">
    <button class="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
      Temporary link menu
    </button>
    <ul class="dropdown-menu">
      <li><a class="dropdown-item" href="/">Login</a></li>
      <li><a class="dropdown-item" href="/encounter">Encounter</a></li>
      <li><a class="dropdown-item" href="/char">Characters</a></li>
    </ul>
  </div>
</nav>


<main>
  <div class="slider" class:visible={isSliderVisible}>
    <canvas bind:this={canvasRoot}></canvas>
  </div>
  <div class="container-fluid">
    <div class="row">
      {#if !playing}
        {#each characterList as character, index}
          <div class="col-xl-2 big-card">
            <div class="card border-0 m-1">
              <div class="card-header">
                <h5 id="card-name" class="m-0">{character.title}</h5>
                <p class="m-0">{character.playerName}</p>
              </div>
              <div class="card-body">
                <div class="position-relative">
                  <img class="class-image" src="{character.url}" alt="{character.title}" />
                  <div class="position-absolute bottom-0 end-0">
                    <div class="position-relative">
                      <div class="d-flex align-items-end">
                        <input type="text" class="form-control form-control-sm stat-input" value={character.baseInitiative} disabled />
                        <select class="form-control stat-input {selectedOptions[index] === 'CRIT' || selectedOptions[index] === 'MISS' ? 'small-font' : ''}" on:change={(e) => handleChange(e, index)}>
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
              <div class="card border-0 m-1">
                <div class="card-header">
                  <h5 id="card-name" class="m-0">{entity.entity.title}</h5>
                  <p class="m-0">{entity.entity.playerName}</p>
                </div>
                <div class="card-body">
                  <div class="position-relative">
                    <img class="class-image" src={entity.entity.url} alt="{entity.entity.title}" />
                    <div class="position-absolute bottom-0 start-50 translate-middle-x">
                      <div class="position-relative">
                        <img class="stat-image" src="assets/heart.png" alt="Health" />
                        <div class="stat-container"><h5>{entity.entity.health}</h5></div>
                      </div>
                    </div>
                    <div class="position-absolute bottom-0 end-0">
                      <div class="position-relative">
                        <img class="stat-image" src="assets/shield.png" alt="Defence" />
                        <div class="stat-container"><h5>{entity.entity.defence}</h5></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          {:else if entity.type === 'ENEMY'}
            <div class="{index === onTurn ? 'col-xl-2 big-card' : 'col-xl-1'}">
              <div class="card border-0 m-1">
                <div class="card-header">
                  <h5 id="card-name" class="m-0">{entity.entity.enemy[0].title}</h5>
                  <select class="btn btn-sm enemies-menu">
                    <i class="bi bi-arrow-bar-down" />
                  </select>
                </div>
                <div class="card-body">
                  <div class="position-relative">
                    <img class="class-image" src="{entity.entity.enemy[0].url}" alt="{entity.entity.enemy[0].title}" />
                    <div class="position-absolute bottom-0 start-50 translate-middle-x">
                      <div class="position-relative">
                        <img class="stat-image" src="assets/heart.png" alt="Health" />
                        <div class="stat-container"><h5>{entity.entity.enemy[0].health}</h5></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          {/if}
        {/each}
        <div class="col-xl-12">
          <button class="btn btn-primary" on:click={endTurn}>Next turn</button>
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
    background-color: rgba(0, 0, 0, 0.8);
    color: #fff;
    transition: top 0.5s ease;
    overflow: hidden;
    z-index: 999;
  }

  .slider.visible {
    top: 0;
  }

  .stat-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    position: absolute;
    bottom: -10%;
    left: 50%;
    transform: translateX(-50%);
  }

  .class-image {
    width: 100%;
    border-radius: 25%;
  }

  .stat-image {
    width: 25px;
  }

  .big-card .stat-image {
    width: 3rem;
  }

  .big-card h5 {
    font-size: 2rem;
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
</style>
