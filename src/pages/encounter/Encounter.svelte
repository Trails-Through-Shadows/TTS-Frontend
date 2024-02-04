<script lang="ts">
  import { Canvas } from '../../lib/hexGridMap/Canvas';
  import { HexGrid } from '../../lib/hexGridMap/HexGrid';
  import { CharList } from './Encounter';
  import { onMount } from 'svelte';

  let canvasRoot: HTMLCanvasElement | undefined;
  let characterColumn: HTMLDivElement;

  onMount(() => {
    if (!canvasRoot) {
      return;
    }

    const canvas = new Canvas(canvasRoot, undefined);

    const textureImage = new Image();
    textureImage.src = '/assets/map-texture-smol-light.jpg';

    const borderImage = new Image();
    borderImage.src = '/assets/map-texture-smol.jpg';

    const hexGrid = new HexGrid(canvas, 45, []);
    hexGrid.readData('https://api.tts-game.fun/parts/4', textureImage, borderImage);

    canvas.setBackgroundImage('/assets/map-background.jpg', () => {
        canvas.clear();
        hexGrid.draw();
    });

    canvas.addOnSizeListener(() => {
        canvas.clear();
        hexGrid.draw();
    });

    const charList = new CharList( characterColumn, 'https://api.tts-game.fun/playerdata/characters?idAdventure=1');
  });

  let isSliderVisible = false;

  function toggleSlider() {
    isSliderVisible = !isSliderVisible;
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
      <div class="col-md-6">
        <div class="character-column">
          <div bind:this={characterColumn}></div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="status-column"></div>
      </div>
    </div>
  </div>
</main>


<style>
  .slider {
    position: fixed;
    top: -100%;
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
</style>