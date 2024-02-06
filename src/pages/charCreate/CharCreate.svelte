<script lang="ts">
  import { CharCreate} from './CharCreate';

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

  function confirmCharacters() {
    // TODO: Save characters to the database
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
  <div class="container-fluid">
    <div class="row">
      {#each charList as character, index}
        <div class="col-xl-4">
          <div class="card border-0 m-3">
            <div class="card-header">
              <input class="form-control" type="text" placeholder="The name of the hero" bind:value={character.title} />
              <input class="form-control" type="text" placeholder="The name of the puppeteer" bind:value={character.playerName} />
            </div>
            <div class="card-body">
              <div class="d-flex">
                <div class="col-5 class-image-container">
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
                <div class="col-7 container-fluid">
                  <div class="d-flex">
                    <select class="form-control" bind:value={character.race}>
                      <option value="" selected disabled hidden>Hero's race</option>
                      {#each creator.getRaces() as race}
                        <option value={race}>{race.title}</option>
                      {/each}
                    </select>
                    <select class="form-control" bind:value={character.clazz}>
                      <option value="" selected disabled hidden>Hero's class</option>
                      {#each creator.getClazzes() as clazz}
                        <option value={clazz}>{clazz.title}</option>
                      {/each}
                    </select>
                  </div>
                </div>
              </div>
              <button class="btn btn-danger position-absolute bottom-0 end-0 m-3" on:click={() => deleteCharacter(index)}>Delete</button>
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
  }

  .class-image {
    width: 100%;
    border-radius: 50%;
  }

  .stat-image {
    width: 50px;
  }

  .card {
    height: 40vh;
  }

  .card-header {
    background-color: #222;
  }

  .card-body {
    background-color: #222;
    border-radius: 0 0 5px 5px;
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

  h1 {
    color: white;
  }
</style>