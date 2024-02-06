<script lang="ts">
  import { api, Character } from '../../lib/Exports';
  import { Canvas } from '../../lib/hexGridMap/Canvas';
  import { HexGrid } from '../../lib/hexGridMap/HexGrid';
  import { CharList } from './Encounter';
  import { onMount } from 'svelte';

  let playing = false;
  let charList: Character[] = [];
  let initiativeList: Character[] = [];

  const creator = new CharList();
  creator.readData(`${api}/playerdata/characters?idAdventure=1`, () => charList = creator.getCharacters());

  let canvasRoot: HTMLCanvasElement | undefined;

  onMount(() => {
    if (!canvasRoot) {
      return;
    }

    const canvas = new Canvas(canvasRoot);

    const textureImage = new Image();
    textureImage.src = '/assets/map-texture-smol-light.jpg';

    const borderImage = new Image();
    borderImage.src = '/assets/map-texture-smol.jpg';

    const hexGrid = new HexGrid(canvas, 45, []);
    hexGrid.readData(`${api}/locations/1/parts/1`, textureImage, borderImage);

    canvas.setBackgroundImage('/assets/map-background.jpg', () => {
        canvas.clear();
        hexGrid.draw();
    });

    canvas.addOnSizeListener(() => {
        canvas.clear();
        hexGrid.draw();
    });
  });

  let isSliderVisible = false;

  function toggleSlider() {
    isSliderVisible = !isSliderVisible;
  }

  function startEncounter() {
    initiativeList = charList.sort((a, b) => b.clazz.baseInitiative - a.clazz.baseInitiative);
    playing = true;
  }

  function endEncounter() {
    playing = false;
  }
</script>


<nav class="navbar">
  <div class="logo-container">
    <img src="assets/logo-icon-small.png" alt="Logo" />
    Trails Through Shadows
  </div>
  <button class="btn" on:click={toggleSlider}>
    Map
  </button>
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
  <div class="slider" class:visible={isSliderVisible}>
    <canvas bind:this={canvasRoot}></canvas>
  </div>
  <div class="container-fluid">
    <div class="row">
      {#if !playing}
        {#each charList as character, index}
        <div class="col-xl-2 big-card">
          <div class="card border-0 m-1">
            <div class="card-header">
              <h5 id="card-name" class="m-0">{character.title}</h5>
              <p class="m-0">{character.playerName}</p>
            </div>
            <div class="card-body">
              <div class="position-relative">
                <img class="class-image" src="assets/chars/{character.race.title}-{character.clazz.title}.png" alt="{character.clazz.title}" />
                <div class="position-absolute bottom-0 start-50 translate-middle-x">
                  <div class="position-relative">
                    <div class="d-flex">
                      <input type="number" class="form-control form-control-sm stat-input" />
                      <input type="text" class="form-control form-control-sm stat-input-disabled" value={character.clazz.baseInitiative >= 0 ? '+' + character.clazz.baseInitiative : character.clazz.baseInitiative} disabled />
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
      {:else}
      {#each initiativeList as character, index}
        <div class="{index === 0 ? 'col-xl-2 big-card' : 'col-xl-1'}">
          <div class="card border-0 m-1">
            <div class="card-header">
              <h5 id="card-name" class="m-0">{character.title}</h5>
              <p class="m-0">{character.playerName}</p>
            </div>
            <div class="card-body">
              <div class="position-relative">
                <img class="class-image" src="assets/chars/{character.race.title}-{character.clazz.title}.png" alt="{character.clazz.title}" />
                <div class="position-absolute bottom-0 start-50 translate-middle-x">
                  <div class="position-relative">
                    <img class="stat-image" src="assets/heart.png" alt="Health" />
                    <div class="stat-container"><h5>{character.clazz.baseHealth}</h5></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/each}
      <div class="col-xl-12">
        <button class="btn btn-primary" on:click={endEncounter}>End encounter</button>
      </div>
      {/if}
    </div>
  </div>
</main>


<style>
  .slider {
    position: fixed;
    top: calc(-100% - 75px);
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    color: #fff;
    transition: top 0.5s ease;
    overflow: hidden;
    z-index: 999;
    margin-top: 75px;
  }

  .slider.visible {
    top: 0;
  }

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

  .class-image {
    width: 100%;
    border-radius: 50%;
  }

  .stat-image {
    width: 25px;
  }

  .big-card .stat-image {
    width: 50px;
  }

  .big-card h5 {
    font-size: 2rem;
  }

  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .stat-input {
    width: 35px;
    background-color: #fff;
    border-color: #222;
    color: #222;
    text-align: center;
    border-radius: 5px 0 0 5px;
  }

  .stat-input-disabled {
    width: 35px;
    background-color: #bababa;
    border-color: #222;
    color: #222;
    text-align: center;
    border-radius: 0 5px 5px 0;
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
</style>