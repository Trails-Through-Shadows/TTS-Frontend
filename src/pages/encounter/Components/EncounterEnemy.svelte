<script lang="ts">
  import ScrollingText from "../../../lib/Components/ScrollingText.svelte";

  export let entity: any;
  export let index: number;
  export let onTurn: number;

  export let dragging: boolean;
</script>


<div class="{index === onTurn ? 'col-2 big-card' : 'col-1'}">
  <div class="card enemy-card drop-card border-0 m-1 {dragging ? 'drop-active' : ''}" data-entity-id={entity.entity.id} data-entity-type={entity.type}>
    <div class="card-header">
    <ScrollingText>
      <h5 id="card-name" class="m-0">{entity.entity.enemy[0].title}</h5>
    </ScrollingText>
    </div>
    <div class="card-body">
      <img class="class-image" src="{entity.entity.enemy[0].url}" alt="{entity.entity.enemy[0].title}" />
    </div>
    {#each entity.entity.enemy as enemy}
    <div class="card-footer dropzone" data-entity-id={entity.entity.id} data-entity-type="{entity.type}" data-enemy-id={enemy.id}>
      <div class="row">
        <div class="{index === onTurn ? 'col-4' : 'col-5'} position-relative">
          <div class="position-absolute">
            <h5 class="stat-text">{enemy.id}</h5>
            <img class="stat-image" src="assets/heart.png" alt="Health" />
            <div class="stat-container">
              <h5>{enemy.health}</h5>
            </div>
          </div>
          <div class="position-absolute end-0">
            <img class="stat-image" src="assets/shield.png" alt="Defence" />
            <div class="stat-container">
              <h5>{enemy.defence}</h5>
            </div>
          </div>
        </div>
        <div class="{index === onTurn ? 'col-8' : 'col-7'}">
          {#each enemy.activeEffects as effect}
            <p>{effect.type} {effect.strength} {effect.duration}</p>
          {/each}
        </div>
      </div>
    </div>
    {/each}
  </div>
</div>


<style>
  .enemy-card {
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

  .stat-text {
    position: absolute;
    font-size: 1.2vw;
    left: -35%;
    top: -35%;
  }

  .big-card .stat-text {
    font-size: 1.8vw;
    left: -25%;
    top: -25%;
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