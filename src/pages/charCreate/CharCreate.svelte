<script lang="ts">
  import { CharCreate } from './CharCreate';
  import { LazyCharacter } from '../../lib/Exports';
  import { api, checkToken } from '../../lib/Exports';
  import { Notify, Loading } from 'notiflix';

  let idLicense = sessionStorage.getItem('idLicense') ? parseInt(sessionStorage.getItem('idLicense') as string) : 0;
  let token = sessionStorage.getItem('token') ? sessionStorage.getItem('token') : '';
  
  if (idLicense === 0 || token === '') {
    sessionStorage.clear();
    window.location.href = "/";
  }

  const urlParams = new URLSearchParams(window.location.search);
  let idAdventure = urlParams.get('id') ? parseInt(urlParams.get('id') as string) : 0;

  const creator = new CharCreate();
  let charList = creator.getCharacters();
  
  function handleAddCharacter() {
    creator.addEmptyCharacter();
    charList = creator.getCharacters();
  }

  function deleteCharacter(index: number) {
    creator.deleteCharacter(index);
    charList = creator.getCharacters();
  }

  function handleConfirm() {
    creator.postDataCreateCharacters(`${api}/adventures/${idAdventure}/characters?token=${token}`, charList,
      () => {
        window.location.href = `/adventure?id=${idAdventure}`;
      },
      (m: string) => {
        Notify.failure(m);
        checkToken(m);
      }
    );
  }

  let mobile = window.innerWidth < 500;
  window.addEventListener('resize', () => {
    mobile = window.innerWidth < 500;
  });
</script>


<nav class="navbar">
  <div class="logo-container">
    <img src="assets/logo-icon-small.png" alt="Logo" />
    Trails Through Shadows
  </div>
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


<main data-simplebar>
  <div class="container-fluid">
    <div class="row">
      {#each charList as character, index}
        <div class="col-xl-4 col-lg-6">
          <div class="card border-0 m-3">
            <div class="card-header">
              <input class="form-control character-input" type="text" placeholder="The name of the hero" bind:value={character.title} />
              <input class="form-control character-input mt-1" type="text" placeholder="The name of the puppeteer" bind:value={character.playerName} />
            </div>
            <div class="card-body">
              <div class="{mobile ? '' : 'd-flex'}">
                <div class="class-image-container {mobile ? 'mobile' : ''}">
                  <img class="class-image" src="{api}/images/characters/{character.race.title}-{character.clazz.title}.png" alt="{character.race.title}-{character.clazz.title}" />
                  <div class="position-absolute bottom-0 start-0">
                    <div class="position-relative">
                      <img class="stat-image" src="assets/heart.png" alt="Health" />
                      <div class="stat-container">
                        <h1>{character.clazz.baseHealth}</h1>
                      </div>
                    </div>
                  </div>
                  <div class="position-absolute bottom-0 start-50 translate-middle-x">
                    <div class="position-relative">
                      <img class="stat-image" src="assets/shield.png" alt="Defence" />
                      <div class="stat-container">
                        <h1>{character.clazz.baseDefence + character.race.baseInitiative}</h1>
                      </div>
                    </div>
                  </div>
                  <div class="position-absolute bottom-0 end-0">
                    <img class="stat-image" src="assets/speed.png" alt="Initiative" />
                    <div class="stat-container">
                      <h1>{character.clazz.baseInitiative}</h1>
                    </div>
                  </div>
                </div>
                <div class="container-fluid">
                  <div class="row">
                    <div class="col-6 bordered-right">
                      <select class="form-control character-input mb-1" bind:value={character.race}>
                        {#each creator.getRaces() as race}
                          <option value={race}>{race.title}</option>
                        {/each}
                        <option value={character.race} selected disabled hidden>Hero's race</option>
                      </select>
                    </div>
                    <div class="col-6">
                      <select class="form-control character-input mb-1" bind:value={character.clazz}>
                        {#each creator.getClazzes() as clazz}
                          <option value={clazz}>{clazz.title}</option>
                        {/each}
                        <option value={character.clazz} selected disabled hidden>Hero's class</option>
                      </select>
                    </div>
                  </div>
                  <div class="row">
                    <div class = "col-6 textarea-container bordered-right">
                      <p class="form-control description" data-simplebar>{character.race.description}</p>
                    </div>
                    <div class = "col-6 textarea-container">
                      <p class="form-control description" data-simplebar>{character.clazz.description}</p>
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
      {/each}
      {#if charList.length < 6}
        <div class="col-md-4">
          <div class="small-card-container">
            <button class="btn btn-success" on:click={handleAddCharacter}>
              <img class="scroll-image" src="assets/scroll.png" alt="Add character" />
            </button>
          </div>
        </div>
      {/if}
      <div class="col-xl-12">
        <button class="btn btn-success" on:click={handleConfirm}>Confirm</button>
      </div>
    </div>
  </div>
</main>


<style>
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

  .small-card-container {
    height: 40vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .scroll-image {
    width: 120px;
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

  .textarea-container {
    height: 20vh;
  }

  .textarea-container .description {
    background-color: #222;
    color: #bababa;
    border: none;
    height: 100%;
    resize: none;
  }

  .bordered-right {
    border-right: 1px solid #1c1c1c;
  }
</style>