<script lang="ts">
  import { onMount } from "svelte";
  import ScrollingText from "../../../lib/Components/ScrollingText.svelte";

  export let entity: any;
  export let index: number;
  export let onTurn: number;
  export let dragging: boolean;
  export let getEffectImage: Function;

  onMount(() => {
    getEffectImage(entity);
  });

</script>


<div class="{index === onTurn ? 'col-2 big-card' : 'col-1'}">
  <div class="card character-card dropzone border-0 m-1 {dragging ? 'drop-active' : ''}" data-entity-id={entity.entity.id} data-entity-type={entity.type}>
    <div class="card-header">
    <ScrollingText>
      <h5 id="card-name" class="m-0">{entity.entity.title}</h5>
    </ScrollingText>
    <ScrollingText>
      <p class="m-0">{entity.entity.playerName}</p>
    </ScrollingText>
    </div>
    <div class="card-body">
      <div class="position-relative">
        <img class="class-image" src="{entity.entity.url}" alt="{entity.entity.title}" />
      </div>
    </div>
    <div class="card-footer">
      <div class="row">
        <div class="{index === onTurn ? 'col-4' : 'col-5'} position-relative">
          <div class="position-absolute">
            <img class="stat-image" src="assets/heart.png" alt="Health" />
            <div class="stat-container">
              <h5>{entity.entity.health}</h5>
            </div>
          </div>
          <div class="position-absolute end-0">
            <img class="stat-image" src="assets/shield.png" alt="Defence" />
            <div class="stat-container">
              <h5>{entity.entity.defence}</h5>
            </div>
          </div>
        </div>
        <div class="row {index === onTurn ? 'col-8' : 'col-7'}" id="characterEffectHolder{entity.entity.id}">
        </div>
      </div>
    </div>
  </div>
</div>


<style>
  .character-card {
    background-color: #222;
    color: #bababa;
    border: 2px solid transparent !important;
    transition: border 0.2s;
  }

  .drop-active {
    border: 2px solid #c23737 !important;
  }

  .stat-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    position: absolute;
    bottom: 0%;
    left: 50%;
    transform: translateX(-50%);
  }

  .stat-container h5 {
    margin: 0;
    font-size: 1.6vw;
  }

  .big-card .stat-container h5 {
    font-size: 2vw;
  }

  .stat-image {
    width: 2vw;
  }

  .big-card .stat-image {
    width: 3vw;
  }

  .card-body {
    padding: 8px;
  }

  .big-card h5 {
    font-size: 2rem;
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

  .big-card .card-footer {
    min-height: 3.5vw;
  }

  .card-footer {
    min-height: 2.5vw;
  }

  h5 {
    color: white;
  }

  .col-1 {
    width: 15%;
  }

  .col-2 {
    width: 25%;
  }

  @media (max-width: 1200px) {
    .col-1 {
      width: 17.64%;
    }

    .col-2 {
      width: 29.4%;
    }
  }

  @media (max-width: 992px) {
    .col-1 {
      width: 21.42%;
    }

    .col-2 {
      width: 35.7%;
    }
  }

  @media (max-width: 768px) {
    .col-1 {
      width: 27.27%;
    }

    .col-2 {
      width: 45.45%;
    }
  }

  @media (max-width: 576px) {
    .col-1 {
      width: 60%;
    }

    .col-2 {
      width: 100%;
    }
  }
</style>