<script lang="ts">
  import './CharCreate.css';
  import { CharCreate, Character, Clazz, Race } from './CharCreate';

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
</script>

<main>
  <nav class="navbar">
    <div class="logo-container">
      <img src="assets/logo-icon-small.png" alt="Logo" class="logo-icon" />
      <div class="logo">Trails Through Shadows</div>
    </div>
    <div class="dropdown">
      <button class="navbar-button">Menu</button>
      <div class="dropdown-content">
        <a href="/">Login</a>
        <a href="/encounter">Encounter</a>
      </div>
    </div>
  </nav>
  <div class="wrapper">
    <div class="grid">
      {#each charList as character, index}
        <div class="card">
          <input class="name-input" type="text" placeholder="The name of the hero" bind:value={character.name} />
          <input class="name-input" type="text" placeholder="The name of the pupetteer" bind:value={character.playerName} />
          <div class="class-select-container">
            <img class="class-image" src="assets/classes/{character.clazz.name}.png" alt="Barbarian" />
            <div class="select-container">
              <select class="select-input" bind:value={character.race}>
                <option value="" selected disabled hidden>Hero's race</option>
                {#each creator.getRaces() as race}
                  <option value={race}>{race.name}</option>
                {/each}
              </select>
              <select class="select-input" bind:value={character.clazz}>
                <option value="" selected disabled hidden>Hero's class</option>
                {#each creator.getClazzes() as clazz}
                  <option value={clazz}>{clazz.name}</option>
                {/each}
              </select>
            </div>
          </div>
          <button on:click={() => deleteCharacter(index)}>Delete</button>
        </div>
      {/each}
      {#if charList.length < 6}
      <div class="small-card-div">
        <div class="small-card">
          <button on:click={handleAddCharacter}>Add Player</button>
        </div>
      </div>
    {/if}
    </div>
  </div>
</main>
