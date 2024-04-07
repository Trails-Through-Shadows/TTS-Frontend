<script lang="ts">
  import { api } from '../../lib/Exports';
  import { Canvas } from './hexGridMap/Canvas';
  import { HexGrid } from './hexGridMap/HexGrid';
  import { Hex } from './hexGridMap/Hex';
  import { CubeCoordinate } from './hexGridMap/Coordinate';
  import { getRequest, postRequest, checkToken } from '../../lib/Functions';
  import { Notify, Loading } from "notiflix";

  import Navbar from '../../lib/Components/Navbar.svelte';
  import LogoutButton from '../../lib/Components/LogoutButton.svelte';
  import EncounterMap from './Components/EncounterMap.svelte';
  import EncounterStart from './Components/EncounterStart.svelte';
  import EncounterOngoing from './Components/EncounterOngoing.svelte';

  Notify.init({
    clickToClose: true
  });

  Loading.dots('Loading...');

  let licenseId = sessionStorage.getItem('licenseId') ? parseInt(sessionStorage.getItem('licenseId') as string) : 0;
  let token = sessionStorage.getItem('token') ? sessionStorage.getItem('token') : '';
  
  if (licenseId === 0 || token === '') {
    sessionStorage.clear();
    window.location.href = "/";
  }

  const urlParams = new URLSearchParams(window.location.search);
  let encounterId = urlParams.get('id') ? parseInt(urlParams.get('id') as string) : 0;

  let onTurn: number = 0;
  let playing = false;

  let action: any;

  function setBaseAction() {
    action = {
      id: null,
      title: `It's ${entityList[onTurn].entity.title}'s turn.`,
      description: "Pick your card and play!",
      discard: null,
      levelReq: null,
      movement: null,
      skill: null,
      attack: null,
      restoreCards: null,
      summonActions: []
    }
  }

  type effect = { type: string, strength: number, duration: number, description: string };

  type baseCharacter = { id: number, title: string, playerName: string, health: number, defence: number, baseInitiative: number, activeEffects: effect[], url:string };
  type baseEnemy = { id: number, idGroup:number, title: string, health: number, initiative: number, url: string };
  type baseEnemyGroup = { id:number, enemy:baseEnemy[]};

  let locationId: number = 0;
  let partsId: number[] = [];

  let canvasRoot: HTMLCanvasElement;
  let canvas: Canvas;
  let hexGridList: HexGrid[] = [];
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

  let isMapSliderVisible = false;

  function receiveParts(part: number) {
    getRequest(`${api}/locations/${locationId}/parts/${part}`,
      (data: any) => {
        let hexGrid = new HexGrid(
          data.id,
          canvas,
          data.hexes.map((hex: any) => new Hex(hex.key.idPart, hex.key.id, new CubeCoordinate(hex.q, hex.r, hex.s))),
          textureImage,
          borderImage
        );

        for (let enemy of data.enemies) {
          if (enemy.startingHex.key.idPart === data.id) {
            hexGrid.addEntity({
              title: enemy.title,
              coords: new CubeCoordinate(enemy.startingHex.q, enemy.startingHex.r, enemy.startingHex.s),
              url: enemy.url,
              image: new Image()
            });
          }
        }

        if (data.doors) {
          let doors: Hex[] = [];
          for (let door of data.doors) {
            let tmpDoor = new Hex(door.key.idPartFrom, door.key.idPartTo, new CubeCoordinate(door.q, door.r, door.s));
            tmpDoor.isDoor = true;
            doors.push(tmpDoor);
          }
          hexGrid.addHexes(doors);
        }

        for (let startingHex of data.startingHexes) {
          hexGrid.addStartHex(new CubeCoordinate(startingHex.q, startingHex.r, startingHex.s));
        }

        hexGrid.getImages();

        hexGridList.push(hexGrid);

        if (hexGridList.length === partsId.length) {
          canvas.setLoading(false);
          hexGrid.draw();
          hexGrid.displayed = true;

          canvas.addOnSizeListener(() => {
            hexGrid.redraw();
          });
        }

        hexGridList = hexGridList;

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
            postRequest(`${api}/encounter/${encounterId}/openDoor?token=${token}`, door,
              () => {
                Notify.success("The door will open at the end of the round.");
              },
              (data: any) => {
                Notify.failure(data.message);
                checkToken(data.message);
              }
            );
          });
        });
      },
      (data: any) => {
        Notify.failure(data.message);
        checkToken(data.message);
      }
    );
  }

  function receiveInitiative(callback: Function = (data: any) => {}) {
    getRequest(`${api}/encounter/${encounterId}/initiative?token=${token}`,
      (data: any) => {
        data = data.object;
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

        data.entityList = entityList;

        callback(data);
      },
      (data: any) => {
        Notify.failure(data.message);
        checkToken(data.message);
      }
    );
  }

  function openDoor(data: any) {
    for (let part of data.unlockedParts) {
      receiveParts(part);
    }

    getRequest(`${api}/encounter/${encounterId}?token=${token}`,
      (data: any) => {
        data = data.object;

        characterList = data.characters;
        enemyList = data.enemies;

        enemyGroupList = [];

        for (let enemy of enemyList) {
          if (enemyGroupList.length === 0) {
            enemyGroupList.push({ id: enemy.idGroup, enemy: [enemy] });
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
              enemyGroupList.push({ id: enemy.idGroup, enemy: [enemy] });
            }
          }
        }

        receiveInitiative();
        Loading.remove();
      },
      (data: any) => {
        Loading.remove();
        Notify.failure(data.message);
        checkToken(data.message);
      }
    );
  }

  getRequest(`${api}/encounter/${encounterId}?token=${token}`,
    (data: any) => {
      data = data.object;
      locationId = data.idLocation;
      partsId = data.idParts;

      if (!canvasRoot)
      {
        Notify.failure("Canvas not found.");
        return;
      }
      
      canvas = new Canvas(canvasRoot);

      canvas.setLoading(true);

      for (let part of partsId) {
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

                    setBaseAction();
                    break;
                  }
                }
              }
              else if (data.active.type === "ENEMY") {
                for (let i = 0; i < entityList.length; i++) {
                  if (entityList[i].id === data.active.id && entityList[i].type === data.active.type) {
                    onTurn = i;

                    action = data.active.action;
                    break;
                  }
                }
              }
            }
            //TODO
            else if (data.next)
            {
              if (data.next.type === "CHARACTER") {
                for (let i = 0; i < entityList.length; i++) {
                  if (entityList[i].id === data.next.id && entityList[i].type === data.next.type) {
                    onTurn = i;

                    setBaseAction();
                    break;
                  }
                }
              }
              else if (data.next.type === "ENEMY") {
                for (let i = 0; i < entityList.length; i++) {
                  if (entityList[i].id === data.next.id && entityList[i].type === data.next.type) {
                    onTurn = i;

                    action = data.next.action;
                    break;
                  }
                }
              }
            }
          }
        );
      }
      
      Loading.remove();
    },
    (data: any) => {
      Notify.failure(data.message);
      if (data.message === "Encounter not found!") {
        window.location.href = "/adventure";
      }
      checkToken(data.message);
    }
  );

  function toggleMapSlider() {
    hexGridList[currentMap].redraw();
    isMapSliderVisible = !isMapSliderVisible;
  }

</script>


<Navbar title="To battle!">
  <button class="btn btn-success me-5" on:click={toggleMapSlider}>
    Map
  </button>
  <LogoutButton />
</Navbar>

<EncounterMap bind:isMapSliderVisible={isMapSliderVisible} bind:hexGridList={hexGridList} bind:currentMap={currentMap} bind:canvasRoot={canvasRoot} />

<main>
  <div class="container-fluid">
    {#if !playing}
      <EncounterStart bind:characterList={characterList} bind:entityList={entityList} bind:playing={playing} bind:action={action} receiveInitiative={receiveInitiative} setBaseAction={setBaseAction} />
    {:else}
      <EncounterOngoing bind:entityList={entityList} bind:onTurn={onTurn} bind:selectedEnemies={selectedEnemies} openDoor={openDoor} bind:action={action} setBaseAction={setBaseAction} />
    {/if}
  </div>
</main>