<script lang="ts">
  import { api } from "../../../lib/Exports";
  import interact from 'interactjs';

  import EncounterCharacter from './EncounterCharacter.svelte';
  import EncounterEnemy from './EncounterEnemy.svelte';
  import EncounterInteractionSlider from './EncounterInteractionSlider.svelte';
  import EncounterActionSlider from './EncounterActionSlider.svelte';

  export let entityList: any;
  export let selectedEnemies: any;
  export let onTurn: number;

  type effect = { type: string, strength: number, duration: number, description: string };

  let isActionSliderVisible = false;
  let selectedEffects: effect[] = [];

  let token = sessionStorage.getItem('token') ? sessionStorage.getItem('token') : '';

  const urlParams = new URLSearchParams(window.location.search);
  let encounterId = urlParams.get('id') ? parseInt(urlParams.get('id') as string) : 0;

  function endTurn() {
    let url0 = "";
    let url1 = "";
    let pos = 0;

    if (entityList[onTurn].type === "CHARACTER") {
      url0 = `${api}/encounter/${encounterId}/turn/character/${entityList[onTurn].id}/end?token=${token}`;
    } else if (entityList[onTurn].type === "ENEMY") {
      url0 = `${api}/encounter/${encounterId}/turn/enemy/${entityList[onTurn].id}/end?token=${token}`;
    }

    if (!entityList[onTurn + 1]) {
      pos = 0;
    }
    else {
      pos = onTurn + 1;
    }

    if (entityList[pos].type === "CHARACTER") {
      url1 = `${api}/encounter/${encounterId}/turn/character/${entityList[pos].id}/start?token=${token}`;
      isActionSliderVisible = false;
    } else if (entityList[pos].type === "ENEMY") {
      url1 = `${api}/encounter/${encounterId}/turn/enemy/${entityList[pos].id}/start?token=${token}`;
      isActionSliderVisible = true;
    }

    creator.postTurnData(url0,
      () => {
        onTurn++;
        if (onTurn === entityList.length) {
          onTurn = 0;
          creator.postRoundEndData(`${api}/encounter/${encounterId}/endRound?token=${token}`,
            (data: any) => {
              if (data.unlockedParts.length > 0) {
                Notify.success("New room has been unlocked.");
                Loading.dots('Loading...');

                for (let part of data.unlockedParts) {
                  receiveParts(part);
                }

                creator.readEncounterData(`${api}/encounter/${encounterId}?token=${token}`,
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
      let damage = event.relatedTarget.querySelector('input').value;

      if (entityType === "CHARACTER") {
        creator.postInteractionData(`${api}/encounter/${encounterId}/interaction/character/${entityId}?token=${token}`, parseInt(damage), selectedEffects,
          (data: any) => {
            const entity = entityList.find((entity) => entity.id == entityId && entity.type == entityType);
            if (entity) {
              entity.entity.health = data.health;
              if (data.status === "DEAD") {
                if (entityId == entityList[onTurn].id && entityType === entityList[onTurn].type) {
                  console.log(`I am dead: ${entityId}`);
                  onTurn++;
                  creator.postTurnData(`${api}/encounter/${encounterId}/turn/character/${entityList[onTurn].id}/start?token=${token}`,
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
        creator.postInteractionData(`${api}/encounter/${encounterId}/interaction/enemy/${entityId}/${selectedEnemy}?token=${token}`, parseInt(damage), selectedEffects,
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
<EncounterInteractionSlider bind:selectedEffects={selectedEffects} />
<EncounterActionSlider bind:isActionSliderVisible={isActionSliderVisible} />