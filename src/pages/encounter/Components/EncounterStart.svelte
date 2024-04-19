<script lang="ts">
  import { api } from "../../../lib/Exports";
  import { Notify } from "notiflix";
  import { postRequest, checkToken } from "../../../lib/Functions";

  import ScrollingText from "../../../lib/Components/ScrollingText.svelte";

  export let characterList: any;
  export let entityList: any;
  export let status: string;
  export let action: any;
  export let receiveInitiative: Function;
  export let setBaseAction: Function;

  let token = sessionStorage.getItem('token') ? sessionStorage.getItem('token') : '';

  const urlParams = new URLSearchParams(window.location.search);
  let encounterId = urlParams.get('id') ? parseInt(urlParams.get('id') as string) : 0;

  let selectedOptions = Array(characterList.length).fill("");

  function handleSelectChange(event: any, index: any) {
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

    postRequest(`${api}/encounters/${encounterId}/initiative`, token, charInitiative,
      () => {
        receiveInitiative(
          (data: any) => {
            entityList = data.entityList;
            if (entityList[0].type === "CHARACTER") {
              postRequest(`${api}/encounters/${encounterId}/turn/character/${entityList[0].id}/start`, token, {},
                () => {
                  setBaseAction();
                },
                (data: any) => {
                  Notify.failure(data.message);
                  checkToken(data.message);
                }
              );
            }
            else if (entityList[0].type === "ENEMY") {
              postRequest(`${api}/encounters/${encounterId}/turn/enemy/${entityList[0].id}/start`, token, {},
                (data: any) => {
                  action = data.object.action;
                },
                (data: any) => {
                  Notify.failure(data.message);
                  checkToken(data.message);
                }
              );
            }
          }
        );

        status = "ONGOING";
      },
      (data: any) => {
        Notify.failure(data.message);
        checkToken(data.message);
      },
    );
  }
</script>

<div class="row">
  {#each characterList as character, index}
    <div class="col-xl-2 big-card">
      <div class="card border-0 m-1">
        <div class="card-header">
          <ScrollingText>
            <h5 id="card-name" class="m-0">{characterList[index].title}</h5>
          </ScrollingText>
          <ScrollingText>
            <p class="m-0">{characterList[index].playerName}</p>
          </ScrollingText>
        </div>
        <div class="card-body">
          <div class="position-relative">
            <img class="class-image" src="{characterList[index].url}" alt="{characterList[index].title}" />
            <div class="position-absolute bottom-0 end-0">
              <div class="position-relative">
                <div class="d-flex align-items-end">
                  <input type="text" class="form-control form-control-sm stat-input" value={characterList[index].baseInitiative} disabled />
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
</div>


<style>
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
    transition: background-color 0.2s, color 0.2s;
  }

  select.stat-input:hover {
    background-color: #4fc780;
    color: #333;
  }

  select.stat-input option {
    font-size: 1rem;
    background-color: #333;
    color: #4fc780;
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
</style>
