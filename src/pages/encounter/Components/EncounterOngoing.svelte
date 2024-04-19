<script lang="ts">
  import { api } from "../../../lib/Exports";
  import { Notify, Loading } from "notiflix";
  import { postRequest, checkToken, getRequest } from "../../../lib/Functions";
  import interact from 'interactjs';

  import EncounterCharacter from './EncounterCharacter.svelte';
  import EncounterEnemy from './EncounterEnemy.svelte';
  import EncounterInteractionSlider from './EncounterInteractionSlider.svelte';
  import EncounterActionSlider from './EncounterActionSlider.svelte';

  export let entityList: any;
  export let selectedEnemies: any;
  export let onTurn: number;
  export let action: any;
  export let status: string;
  export let openDoor: Function;
  export let setBaseAction: Function;

  type effect = { type: string, strength: number, duration: number, description: string };

  let isActionSliderVisible = false;
  let selectedEffects: effect[] = [];

  let token = sessionStorage.getItem('token') ? sessionStorage.getItem('token') : '';

  const urlParams = new URLSearchParams(window.location.search);
  let encounterId = urlParams.get('id') ? parseInt(urlParams.get('id') as string) : 0;

  function getStatus(callback?: Function) {
    getRequest(`${api}/encounters/${encounterId}/status?token=${token}`,
      (data: any) => {
        data = data.object;
        console.log(data);

        if (data === "COMPLETED") {
          status = "COMPLETED";
        }
        else if (data === "FAILED") {
          status = "FAILED";
        }
        else {
          if (callback) {
            callback();
          }
        }
      },
      (data: any) => {
        Notify.failure(data.message);
        checkToken(data.message);
      }
    );
  }

  function deadOnTurn(entityId: number, entityType: string) {
    if (entityId == entityList[onTurn].id && entityType === entityList[onTurn].type) {
      entityList = entityList.filter((entity: any) => entity.id != entityId || entity.type != entityType);
      
      if (onTurn === entityList.length) {
        endRound();
      }
      else {
        if (entityList[onTurn].type === "CHARACTER") {
          startCharacterTurn();
        }
        else if (entityList[onTurn].type === "ENEMY") {
          startEnemyTurn();
        }
      }
    }
    else {
      entityList = entityList.filter((entity: any) => entity.id != entityId || entity.type != entityType);
    }
  }

  function startCharacterTurn() {
    getStatus(() => {
      postRequest(`${api}/encounters/${encounterId}/turn/character/${entityList[onTurn].id}/start?token=${token}`, {},
        (data: any) => {

          data = data.object;

          entityList[onTurn].entity.health = data.health;
          entityList[onTurn].entity.activeEffects = data.effects;

          if (data.status === "DEAD") {
            deadOnTurn(entityList[onTurn].id, entityList[onTurn].type);
          }

          entityList = entityList;

          setBaseAction();
          isActionSliderVisible = false;
        },
        (data: any) => {
          Notify.failure(data.message);
          checkToken(data.message);
        }
      );
    });
  }

  function startEnemyTurn() {
    getStatus(() => {
      postRequest(`${api}/encounters/${encounterId}/turn/enemy/${entityList[onTurn].id}/start?token=${token}`, {},
        (data: any) => {

          data = data.object;

          for (let i = 0; i < entityList[onTurn].entity.enemy.length; i++) {
            entityList[onTurn].entity.enemy[i].health = data.entities[i].health;
            entityList[onTurn].entity.enemy[i].activeEffects = data.entities[i].effects;

            if (data.entities[i].status === "DEAD") {
              entityList[onTurn].entity.enemy = entityList[onTurn].entity.enemy.filter((enemy: any) => enemy.id != entityList[onTurn].entity.enemy[i].id);
            }

            if (entityList[onTurn].entity.enemy.length === 0) {
              deadOnTurn(entityList[onTurn].id, entityList[onTurn].type);
            }
          }

          entityList = entityList;
          
          action = data.action;
          console.log(action);
          isActionSliderVisible = true;
        },
        (data: any) => {
          Notify.failure(data.message);
          checkToken(data.message);
        }
      );
    });
  }

  function endCharacterTurn() {
    postRequest(`${api}/encounters/${encounterId}/turn/character/${entityList[onTurn].id}/end?token=${token}`, {},
      (data: any) => {
        data = data.object;

        entityList[onTurn].entity.health = data.health;
        entityList[onTurn].entity.activeEffects = data.effects;
        
        onTurn++;

        if (onTurn === entityList.length) {
          endRound();
        }
        else {
          if (entityList[onTurn].type === "CHARACTER") {
            startCharacterTurn();
          }
          else if (entityList[onTurn].type === "ENEMY") {
            startEnemyTurn();
          }
        }
      },
      (data: any) => {
        Notify.failure(data.message);
        checkToken(data.message);
      }
    );
  }

  function endEnemyTurn() {
    postRequest(`${api}/encounters/${encounterId}/turn/enemy/${entityList[onTurn].id}/end?token=${token}`, {},
      (data: any) => {
        data = data.object;

        for (let i = 0; i < entityList[onTurn].entity.enemy.length; i++) {
          entityList[onTurn].entity.enemy[i].health = data[i].health;
          entityList[onTurn].entity.enemy[i].activeEffects = data[i].effects;
        }

        onTurn++;

        if (onTurn === entityList.length) {
          endRound();
        }
        else {
          if (entityList[onTurn].type === "CHARACTER") {
            startCharacterTurn();
          }
          else if (entityList[onTurn].type === "ENEMY") {
            startEnemyTurn();
          }
        }
      },
      (data: any) => {
        Notify.failure(data.message);
        checkToken(data.message);
      }
    );
  }

  function endRound() {
    getStatus(() => {
      onTurn = 0;

      postRequest(`${api}/encounters/${encounterId}/endRound?token=${token}`, {},
        (data: any) => {
          data = data.object;
          if (data.unlockedParts.length > 0) {
            Notify.success("New room has been unlocked.");
            Loading.dots('Loading...');

            openDoor(data);
          }
          if (entityList[onTurn].type === "CHARACTER") {
            startCharacterTurn();
          }
          else if (entityList[onTurn].type === "ENEMY") {
            startEnemyTurn();
          }
        },
        (data: any) => {
          Notify.failure(data.message);
          checkToken(data.message);
        }
      );
    });
  }

  function endTurn() {
    if (entityList[onTurn].type === "CHARACTER") {
      endCharacterTurn();
    }
    else if (entityList[onTurn].type === "ENEMY") {
      endEnemyTurn();
    }
  }

  interact('.entity-card').dropzone({
    ondrop(event) {
      let target = event.target;
      let entityId = target.dataset.entityId;
      let entityType = target.dataset.entityType;
      let damage = event.relatedTarget.querySelector('input').value;

      if (entityType === "CHARACTER") {
        postRequest(`${api}/encounters/${encounterId}/interaction/character/${entityId}?token=${token}`, { damage: parseInt(damage), effects: selectedEffects },
          (data: any) => {
            getStatus(() => {
              data = data.object;

              const entity = entityList.find((entity: any) => entity.id == entityId && entity.type == entityType);

              if (entity) {
                entity.entity.health = data.health;
                entity.entity.activeEffects = data.effects;

                if (data.status === "DEAD") {
                  deadOnTurn(entityId, entityType);
                }
              }

              entityList = entityList;

              Notify.success(`Attacked entity of type: ${entityType}, with ID: ${entityId}, with damage: ${damage}.`);
            });
          },
          (data: any) => {
            Notify.failure(data.message);
            checkToken(data.message);
          }
        );
      } else if (entityType === "ENEMY") {
        let selectedEnemy = target.querySelector('.enemies-menu').value;

        postRequest(`${api}/encounters/${encounterId}/interaction/enemy/${entityId}/${selectedEnemy}?token=${token}`, { damage: parseInt(damage), effects: selectedEffects },
          (data: any) => {
            getStatus(() => {
              data = data.object;

              const entity = entityList.find((entity: any) => entity.id == entityId && entity.type == entityType);

              if (entity) {
                let enemy = entity.entity.enemy.find((enemy: any) => enemy.id == selectedEnemy);

                enemy.health = data.health;
                enemy.activeEffects= data.effects;

                if (data.status === "DEAD") {
                  entity.entity.enemy = entity.entity.enemy.filter((enemy: any) => enemy.id != selectedEnemy);
                  
                  if (entity.entity.enemy.length === 0) {
                    deadOnTurn(entityId, entityType);
                  }
                }
              }

              entityList = entityList;

              Notify.success(`Attacked entity of type: ${entityType}, with ID: ${entityId} and enemy ID: ${selectedEnemy}, with damage: ${damage}.`);
            });
          },
          (data: any) => {
            Notify.failure(data.message);
            checkToken(data.message);
          }
        );
      }
    }
  });

  interact('.draggable').draggable({
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

</script>


<div class="row">
  {#each entityList as entity, index}
    {#if entity.type === 'CHARACTER'}
      <EncounterCharacter bind:entity={entity} index={index} onTurn={onTurn} />
    {:else if entity.type === 'ENEMY'}
      <EncounterEnemy bind:entity={entity} index={index} onTurn={onTurn} bind:selectedEnemies={selectedEnemies} />
    {/if}
  {/each}
  <div class="col-xl-12">
    <button class="btn btn-success" on:click={endTurn}>Next turn</button>
  </div>
</div>

<EncounterActionSlider bind:isActionSliderVisible={isActionSliderVisible} bind:action={action} />
<EncounterInteractionSlider bind:selectedEffects={selectedEffects} />