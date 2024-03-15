<script lang="ts">
  import { api, checkToken, Character } from "../../lib/Exports";
  import { CharacterList } from "./Adventure";
  import { Notify, Loading } from "notiflix";

  let idLicense = sessionStorage.getItem('idLicense') ? parseInt(sessionStorage.getItem('idLicense') as string) : 0;
  let token = sessionStorage.getItem('token') ? sessionStorage.getItem('token') : '';
  
  if (idLicense === 0 || token === '') {
    sessionStorage.clear();
    window.location.href = "/";
  }

  Loading.dots('Loading characters...');

  const urlParams = new URLSearchParams(window.location.search);
  let idAdventure = urlParams.get('id') ? parseInt(urlParams.get('id') as string) : 0;

  if (idAdventure === 0) {
    Notify.failure('Something went wrong.');
  }

  let idLocation = 1;

  let charList: Character[] = [];

  const creator = new CharacterList();
  creator.readCharacterData(`${api}/adventures/${idAdventure}/characters?token=${token}&lazy=false`,
    () => {
      charList = creator.getCharacters();
      Loading.remove();
      if (charList.length === 0) {
        Notify.failure('No characters found.');
        window.location.href = `/char?id=${idAdventure}`;
      }
    },
    (m: string) => {
      Notify.failure(m);
      Loading.remove();
      checkToken(m);
    }
  );

  function handleContinue() {
    Loading.dots('Creating encounter...');
    creator.postCreateEncounterData(`${api}/encounter/${idAdventure}?token=${token}&idLocation=${idLocation}`,
      (idEncounter: number) => {
        Loading.remove();
        window.location.href = `/encounter?id=${idEncounter}`;
      },
      (m: string) => {
        Loading.remove();
        Notify.failure(m);
        checkToken(m);
      }
    );
  }
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


<main>
  <div class="container-fluid" data-simplebar>
    <div class="row">
      {#each charList as character, index}
        <div class="col-xl-4 col-lg-6">
          <div class="row m-3">
            <div class="col-2 d-flex align-items-center justify-content-center p-0">
              <div class="card border-0 side-card left-card">
                <div class="card-body">
                  <div class="item-container">
                    <img class="item-image" src="assets/sword.png" alt="Weapon" />
                  </div>
                  <div class="item-container">
                    <img class="item-image" src="assets/pendant.png" alt="Accessory" />
                  </div>
                  <div class="item-container">
                    <img class="item-image" src="assets/potion.png" alt="Consumable" />
                  </div>
                  <div class="item-container">
                    <img class="item-image" src="assets/potion.png" alt="Consumable" />
                  </div>
                </div>
              </div>
            </div>
            <div class="col-8 p-0">
              <div class="card border-0 m-0">
                <div class="card-header text-center">
                  <h5 id="card-name" class="m-0">{character.race.title}-{character.clazz.title} </h5>
                </div>
                <div class="card-body">
                  <div class="row">
                    <div class="col-9">
                      <div class="class-image-container">
                        <img class="class-image" src="{character.url}" alt="{character.clazz.title}" />
                      </div>
                    </div>
                    <div class="col-3 position-relative">
                      <div class="position-absolute top-0 start-50 translate-middle-x">
                        <div class="position-relative">
                          <img class="stat-image" src="assets/heart.png" alt="Health" />
                          <div class="stat-container">
                            <h1>{character.clazz.baseHealth}</h1>
                          </div>
                        </div>
                      </div>
                      <div class="position-absolute top-50 start-50 translate-middle">
                        <div class="position-relative">
                          <img class="stat-image" src="assets/shield.png" alt="Defence" />
                          <div class="stat-container">
                            <h1>{character.clazz.baseDefence + character.race.baseInitiative}</h1>
                          </div>
                        </div>
                      </div>
                      <div class="position-absolute bottom-0 start-50 translate-middle-x">
                        <img class="stat-image" src="assets/speed.png" alt="Initiative" />
                        <div class="stat-container">
                          <h1>{character.clazz.baseInitiative}</h1>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="card-footer text-center p-0">
                  <h2>{character.title}</h2>
                </div>
              </div>
            </div>
            <div class="col-2 d-flex align-items-center justify-content-center p-0">
              <div class="card border-0 side-card right-card">
                <div class="card-body">
                  <div class="item-container">
                    <img class="item-image" src="assets/helmet.png" alt="Helmet" />
                  </div>
                  <div class="item-container">
                    <img class="item-image" src="assets/chestplate.png" alt="Chestplate" />
                  </div>
                  <div class="item-container">
                    <img class="item-image" src="assets/leggings.png" alt="Leggings" />
                  </div>
                  <div class="item-container">
                    <img class="item-image" src="assets/boots.png" alt="Boots" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/each}
      <div class="col-xl-12">
        <button class="btn btn-success" on:click="{handleContinue}">Start encounter</button>
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
    height: 100%;
  }

  .class-image {
    width: 100%;
    border-radius: 25%;
  }

  .stat-image {
    width: 50px;
  }

  .card {
    height: 40vh;
    background-color: #222;
  }

  .card-header {
    background-color: #222;
    color: #bababa;
  }

  .card-body {
    background-color: #222;
  }

  .card-footer {
    background-color: #222;
    color: #bababa;
  }

  h1 {
    color: white;
  }

  h2 {
    color: white;
  }

  .side-card {
    height: 80%;
    width: 100%;
    background-color: #1c1c1c;
  }

  .side-card .card-body {
    background-color: #1c1c1c;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 15px;
  }

  .left-card .card-body {
    border-radius: 5px 0 0 5px;
  }

  .right-card .card-body {
    border-radius: 0 5px 5px 0;
  }

  .item-container {
    height: 100%;
    margin: 2px;
    border-radius: 25%;
    border: #333 2px solid;
    background-color: #222;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    aspect-ratio: 1;
  }

  .item-image {
    width: 100%;
    height: 100%;
  }
</style>