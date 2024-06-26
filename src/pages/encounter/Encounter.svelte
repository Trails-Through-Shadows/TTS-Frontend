<script lang="ts">
  import { api } from '../../lib/Exports';
  import { Canvas } from './HexGridMap/Canvas';
  import { HexGrid } from './HexGridMap/HexGrid';
  import { Hex } from './HexGridMap/Hex';
  import { CubeCoordinate } from './HexGridMap/Coordinate';
  import { getRequest, postRequest, checkToken } from '../../lib/Functions';
  import { Notify, Loading } from "notiflix";
  import { generateCard } from './Cards/Card';

  import Navbar from '../../lib/Components/Navbar.svelte';
  import LogoutButton from '../../lib/Components/LogoutButton.svelte';
  import ConfirmModal from '../../lib/Components/ConfirmModal.svelte';
  import EncounterMap from './Components/EncounterMap.svelte';
  import EncounterStart from './Components/EncounterStart.svelte';
  import EncounterOngoing from './Components/EncounterOngoing.svelte';
  import EncounterFailed from './Components/EncounterFailed.svelte';
  import EncounterCompleted from './Components/EncounterCompleted.svelte';
  import EncounterStory from './Components/EncounterStory.svelte';

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
  let status: string = "NEW";

  let action: any;

  let size: number;

  function setBaseAction() {
    action = {
      id: null,
      title: `It's ${(entityList[onTurn].entity as baseCharacter).title}'s turn.`,
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

  type effect = { type: string, strength: number, duration: number, description: string, url: string };

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
  textureImage.src = '/assets/tile-texture.png';

  const borderImage = new Image();
  borderImage.src = '/assets/tile-border.png';

  let characterList: baseCharacter[] = [];
  let enemyList: baseEnemy[] = [];
  let enemyGroupList: baseEnemyGroup[] = [];
  let entityList: { id:number, initiative: number, type: string, entity: (baseCharacter | baseEnemyGroup) }[] = [];

  let isMapSliderVisible = false;
  let isStoryVisible = false;

  let showConfirmModal = false;

  type door = { key: { idPartFrom: number, idPartTo: number }, q: number, r: number, s: number };

  let openedDoor: door;
  let openedDoors: door[] = [];

  let story: string = "";

  function receiveParts(part: number) {
    getRequest(`${api}/locations/${locationId}/parts/${part}`, token,
      (data: any) => {
        let hexGrid = new HexGrid(
          data.id,
          canvas,
          data.hexes.map((hex: any) => new Hex(hex.key.idPart, hex.key.id, new CubeCoordinate(hex.q, hex.r, hex.s), size)),
          textureImage,
          borderImage,
          size
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

        for (let obstacles of data.obstacles) {
          if (obstacles.hex.key.idPart === data.id) {
            console.log(obstacles);
            hexGrid.addEntity({
              title: obstacles.title,
              coords: new CubeCoordinate(obstacles.hex.q, obstacles.hex.r, obstacles.hex.s),
              url: obstacles.url,
              image: new Image()
            });
          }
        }

        if (data.doors) {
          let doors: Hex[] = [];
          for (let door of data.doors) {
            let tmpDoor = new Hex(door.key.idPartFrom, door.key.idPartTo, new CubeCoordinate(door.q, door.r, door.s), size);
            tmpDoor.isDoor = true;
            doors.push(tmpDoor);
          }
          hexGrid.addHexes(doors);
        }

        if (data.startingHexes) {
          for (let startingHex of data.startingHexes) {
            hexGrid.addStartHex(new CubeCoordinate(startingHex.q, startingHex.r, startingHex.s));
          }
        }

        hexGrid.getImages();

        hexGridList.push(hexGrid);

        if (hexGridList.length === partsId.length) {
          canvas.setLoading(false);

          let height = canvas.getHeight();
          let width = canvas.getWidth();

          if (width < height) {
            size = canvas.getWidth() / 15;
          } else {
            size = canvas.getHeight() / 15;
          }

          hexGrid.setHexSize(size);

          hexGrid.draw();
          hexGrid.displayed = true;

          currentMap = hexGridList.length - 1;
        }

        canvas.addOnSizeListener(() => {
          let height = canvas.getHeight();
          let width = canvas.getWidth();

          if (width < height) {
            size = canvas.getWidth() / 15;
          } else {
            size = canvas.getHeight() / 15;
          }

          hexGrid.setHexSize(size);

          if (hexGrid.displayed === true) {
            hexGrid.redraw();
          }
        });

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

            openedDoor = door;
            showConfirmModal = true;
          },
          (hex: Hex) => {
            let hexGrid = hexGridList.find((hexGrid) => hexGrid.id === hex.id);

            if (hexGrid) {
              display(hexGridList.indexOf(hexGrid));
            }
          });
        });

        openDoors();
      },
      (data: any) => {
        Notify.failure(data.message);
        checkToken(data.message);
      }
    );
  }

  function openDoor() {
    postRequest(`${api}/encounters/${encounterId}/openDoor`, token, openedDoor,
      () => {
        Notify.success("The door will open at the end of the round.");
      },
      (data: any) => {
        Notify.failure(data.message);
        checkToken(data.message);
      }
    );
  }

  function openDoors() {
    for (let door of openedDoors) {
      let hexGrid = hexGridList.find((hexGrid) => hexGrid.id === door.key.idPartFrom);

      if (hexGrid) {
        let hex = hexGrid.getHexAt(new CubeCoordinate(door.q, door.r, door.s));

        if (hex !== undefined) {
          hexGrid.openDoor(hex);
        }
      }
    }
  }

  function receiveInitiative(callback: Function = (data: any) => {}) {
    getRequest(`${api}/encounters/${encounterId}/initiative`, token,
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

        data.entityList = entityList;

        callback(data);
      },
      (data: any) => {
        Notify.failure(data.message);
        checkToken(data.message);
      }
    );
  }

  function revealRoom(data: any) {
    isMapSliderVisible = true;

    for (let part of data.unlockedParts) {
      receiveParts(part);
    }

    getRequest(`${api}/encounters/${encounterId}`, token,
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

        openedDoors = [];
        for (let door of data.doors) {
          if (door.opened) {
            openedDoors.push(door);
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

  function getStory() {
    getRequest(`${api}/encounters/${encounterId}/story`, token,
      (data: any) => {
        story = data.object.story;
      },
      (data: any) => {
        Notify.failure(data.message);
        checkToken(data.message);
      }
    );
  }
  
  getRequest(`${api}/encounters/${encounterId}`, token,
    (data: any) => {
      data = data.object;
      locationId = data.idLocation;
      partsId = data.idParts;

      if (data.state === "NEW") {
        getStory();
        isStoryVisible = true;
      }
      else if (data.state === "ONGOING") {
        status = "ONGOING";
      }
      else if (data.state === "COMPLETED") {
        getStory();
        status = "COMPLETED";
      }
      else if (data.state === "FAILED") {
        getStory();
        status = "FAILED";
      }

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
        isStoryVisible = false;
        status = "ONGOING";

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
                    console.log(action);
                    generateCard(action.id, "cardHolder");
                    break;
                  }
                }
              }
            }
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
      else if (data.state === "COMPLETED") {
        status = "COMPLETED";
      }
      else if (data.state === "FAILED") {
        status = "FAILED";
      }

      openedDoors = [];
      for (let door of data.doors) {
        if (door.opened) {
          openedDoors.push(door);
        }
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
    hexGridList[currentMap].setHexSize(size);
    hexGridList[currentMap].redraw();
    isMapSliderVisible = !isMapSliderVisible;
  }

  function display(id: number) {
    hexGridList[currentMap].setDisplayed(false);

    currentMap = id;

    hexGridList[id].setDisplayed(true);
    hexGridList[id].redraw();
  }

</script>


<Navbar title="To battle!">
  <button class="btn btn-success me-5" on:click={toggleMapSlider}>
    Map
  </button>
  <LogoutButton />
</Navbar>


<EncounterMap bind:isMapSliderVisible={isMapSliderVisible} bind:hexGridList={hexGridList} bind:canvasRoot={canvasRoot} display={display} />


<main>
  {#if isStoryVisible}
    <EncounterStory {story} bind:isStoryVisible={isStoryVisible} />
  {:else}
    {#if status === "NEW"}
      <EncounterStart bind:characterList={characterList} bind:entityList={entityList} bind:status={status} bind:action={action} receiveInitiative={receiveInitiative} setBaseAction={setBaseAction} />
    {:else if status === "ONGOING"}
      <EncounterOngoing bind:entityList={entityList} bind:onTurn={onTurn} bind:action={action} bind:status={status} revealRoom={revealRoom} setBaseAction={setBaseAction} getStory={getStory} />
    {:else if status === "COMPLETED"}
      <EncounterCompleted {story} />
    {:else if status === "FAILED"}
      <EncounterFailed {story} />
    {/if}
  {/if}
</main>


<ConfirmModal title="Open door" body="Are you sure you want to open the door?" buttonText="Open" onConfirm={openDoor} bind:showConfirmModal={showConfirmModal} />


<style>
  @media (max-width: 576px) {
    .me-5 {
      margin-right: 1rem !important;
    }
  }
</style>