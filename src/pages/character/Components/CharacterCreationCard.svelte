<script lang="ts">
  import { api, Character, Race, Clazz } from "../../../lib/Exports";
  import { Notify } from "notiflix";
  import { getRequest } from "../../../lib/Functions";

  export let characterList: Character[];
  export let index: number;

  let races: Race[] = [];
  let classes: Clazz[] = [];

  let mobile = window.innerWidth < 500;

  function refreshTooltip() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
  }

  getRequest(`${api}/races`,
    (data: any) => {
      races = data.entries.map((race: any) => new Race(race.id, race.title, race.tag, race.description, race.baseInitiative));
    },
    (data: any) => {
      Notify.failure(data.message)
    }
  );

  getRequest(`${api}/classes`,
    (data: any) => {
      classes = data.entries.map((clazz: any) => new Clazz(clazz.id, clazz.title, clazz.tag, clazz.description, clazz.baseHealth, clazz.baseDefence, clazz.baseInitiative));
    },
    (data: any) => {
      Notify.failure(data.message)
    }
  );

  function deleteCharacter(index: number) {
    characterList.splice(index, 1);
    characterList = characterList;
  }

  window.addEventListener('resize', () => {
    mobile = window.innerWidth < 500;
  });
</script>


<div class="col-xl-4 col-lg-6">
  <div class="card border-0 m-3">
    <div class="card-header">
      <input class="form-control character-input" type="text" placeholder="The name of the hero" bind:value={characterList[index].title} />
      <input class="form-control character-input mt-1" type="text" placeholder="The name of the puppeteer" bind:value={characterList[index].playerName} />
    </div>
    <div class="card-body">
      <div class="{mobile ? '' : 'd-flex'}">
        <div class="class-image-container {mobile ? 'mobile' : ''}">
            <img class="class-image" src="{api}/images/characters/{characterList[index].race.title.toLowerCase()}-{characterList[index].clazz.title.toLowerCase()}.png" alt="{characterList[index].race.title} {characterList[index].clazz.title}" />
          <div class="position-absolute bottom-0 start-0">
            <div class="position-relative">
              <img class="stat-image" src="assets/heart.png" alt="Health" />
              <div class="stat-container">
                <h1>{characterList[index].clazz.baseHealth}</h1>
                <div class="stat-text">Health</div>
              </div>
            </div>
          </div>
          <div class="position-absolute bottom-0 start-50 translate-middle-x">
            <div class="position-relative">
              <img class="stat-image" src="assets/shield.png" alt="Defence" />
              <div class="stat-container">
                <h1>{characterList[index].clazz.baseDefence}</h1>
                <div class="stat-text">Defence</div>
              </div>
            </div>
          </div>
          <div class="position-absolute bottom-0 end-0">
            <img class="stat-image" src="assets/speed.png" alt="Initiative" />
            <div class="stat-container">
              <h1>{characterList[index].clazz.baseInitiative + characterList[index].race.baseInitiative}</h1>
              <div class="stat-text">Initiative</div>
            </div>
          </div>
        </div>
        <div class="container-fluid">
          <div class="row background-container">
            <div class="col-6 bordered-right">
              <select class="form-control character-input mb-1" bind:value={characterList[index].race} on:change={refreshTooltip}>
                {#each races as race}
                  <option value={race}>{race.title}</option>
                {/each}
                <option value={characterList[index].race} selected disabled hidden>Hero's race</option>
              </select>
              <div class="background-image-container {mobile ? 'mobile' : ''}">
                <img class="background-image" src="{api}/images/races/{characterList[index].race.title.toLowerCase()}.png?size=300" alt="{characterList[index].race.title}" />
              </div>
              <button class="btn btn-sm btn-success lore" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-html="true" title="{characterList[index].race.description}">Lore</button>
            </div>
            <div class="col-6">
              <select class="form-control character-input mb-1" bind:value={characterList[index].clazz} on:change={refreshTooltip}>
                {#each classes as clazz}
                  <option value={clazz}>{clazz.title}</option>
                {/each}
                <option value={characterList[index].clazz} selected disabled hidden>Hero's class</option>
              </select>
              <div class="background-image-container {mobile ? 'mobile' : ''}">
                <img class="background-image" src="{api}/images/classes/{characterList[index].clazz.title.toLowerCase()}.png?size=300" alt="{characterList[index].clazz.title}" />
              </div>
              <button class="btn btn-sm btn-success lore" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-html="true" title="{characterList[index].clazz.description}">Lore</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card-footer d-flex justify-content-end">
      <button class="btn btn-danger" on:click={() => deleteCharacter(index)}>Delete</button>
    </div>
  </div>
</div>


<style>
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

  .stat-container h1 {
    margin: 0;
  }

  .class-image-container {
    position: relative;
    height: 25vh;
    min-width: 25vh;
  }

  .class-image-container.mobile {
    width: 100%;
    height: auto;
    aspect-ratio: 1;
    margin-bottom: 1rem;
  }

  .class-image {
    max-height: 100%;
    width: auto;
    border-radius: 25%;
  }

  .stat-image {
    width: 50px;
    margin-top: -20px;
  }

  .stat-text {
    color: #bababa;
  }

  .background-container {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .background-image-container {
    margin-top: 1rem;
    width: 100%;
  }

  .background-image-container.mobile {
    width: 100%;
    height: auto;
    aspect-ratio: 1;
  }

  .background-image {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    border-radius: 25%;
  }

  .background-image {
    max-height: 100%;
    width: auto;
  }

  .lore {
    margin-top: 1rem;
  }

  .card-header {
    background-color: #222;
  }

  .card-body {
    background-color: #222;
  }

  .card-footer {
    background-color: #222;
  }

  .character-input {
    background-color: #333;
    color: #bababa;
    border: none;
  }

  .character-input::placeholder {
    color: #757575;
  }

  h1 {
    color: white;
  }

  .bordered-right {
    border-right: 1px solid #1c1c1c;
  }
</style>