<script lang="ts">
  import { api, Character } from "../../lib/Exports";
  import { CharacterList } from "./Adventure";

  let charList: Character[] = [];

  const creator = new CharacterList();
  creator.readData(`${api}/playerdata/characters?idAdventure=1`, () => charList = creator.getCharacters());
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
<div class="container-fluid">
  <div class="row">
  {#each charList as character, index}
    <div class="col-xl-4">
      <div class="card border-0 m-3">
        <div class="card-header">
          <h2 id="card-name" class="m-0">{character.title}</h2>
          <h5 class="m-0">{character.playerName}</h5>
        </div>
        <div class="card-body">
          <div class="d-flex">
            <div class="col-3 container-fluid">
              <div class="d-flex">
                <div class="col-3">
                  <div class="item-container item-container-small">
                    <img class="item-image" src="assets/scroll.png" alt="Helmet" />
                  </div>
                  <div class="item-container item-container-small">
                    <img class="item-image" src="assets/scroll.png" alt="Chestplate" />
                  </div>
                  <div class="item-container item-container-small">
                    <img class="item-image" src="assets/scroll.png" alt="Leggings" />
                  </div>
                  <div class="item-container item-container-small">
                    <img class="item-image" src="assets/scroll.png" alt="Boots" />
                  </div>
                </div>
              </div>
            </div>
            <div class="col-4 class-image-container">
              <img class="class-image" src="assets/chars/{character.race.title}-{character.clazz.title}.png" alt="{character.clazz.title}" />
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
            <div class="col-3 container-fluid">
              <div class="d-flex">
                <div class="col-3">
                  <div class="item-container item-container-small">
                    <img class="item-image" src="assets/scroll.png" alt="Weapon" />
                  </div>
                  <div class="item-container item-container-small">
                    <img class="item-image" src="assets/scroll.png" alt="Accesory" />
                  </div>
                  <div class="item-container item-container-small">
                    <img class="item-image" src="assets/scroll.png" alt="Consumable" />
                  </div>
                  <div class="item-container item-container-small">
                    <img class="item-image" src="assets/scroll.png" alt="Consumable" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/each}
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
  }

  .card-header {
    background-color: #222;
    color: #bababa;
  }

  .card-body {
    background-color: #222;
    border-radius: 0 0 5px 5px;
  }

  h1 {
    color: white;
  }

  h2 {
    color: white;
  }

  .item-container {
    width: 60px;
    height: 60px;
  }

  .item-image {
    width: 100%;
    height: 100%;
  }
</style>