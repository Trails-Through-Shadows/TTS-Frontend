<script lang="ts">
  import ScrollingText from "../../../lib/Components/ScrollingText.svelte";

  export let entity: any;
  export let index: number;
  export let onTurn: number;
</script>


<div class="{index === onTurn ? 'col-2 big-card' : 'col-1'}">
  <div class="card entity-card border-0 m-1" data-entity-id={entity.entity.id} data-entity-type={entity.type}>
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
        <img class="class-image" src={entity.entity.url} alt="{entity.entity.title}" />
        <div class="position-absolute bottom-0 start-50 translate-middle-x">
          <div class="position-relative">
            <img class="stat-image" src="assets/heart.png" alt="Health" />
            <div class="stat-container">
              <h5>{entity.entity.health}</h5>
              {#if index === onTurn}
                <div class="stat-text">Health</div>
              {/if}
            </div>
          </div>
        </div>
        <div class="position-absolute bottom-0 end-0">
          <div class="position-relative">
            <img class="stat-image" src="assets/shield.png" alt="Defence" />
            <div class="stat-container">
              <h5>{entity.entity.defence}</h5>
              {#if index === onTurn}
                <div class="stat-text">Defence</div>
              {/if}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card-footer">
      <div class="effects-list">
        {#each entity.entity.activeEffects as effect}
          <p>{effect.type} {effect.strength} {effect.duration}</p>
        {/each}
      </div>
    </div>
  </div>
</div>


<style>
  .entity-card {
    background-color: #222;
    color: #bababa;
    border: 0;
  }

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

  .stat-container h5 {
    margin: 0;
    font-size: 1.6vw;
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

  .card-body {
    padding: 8px;
  }

  .stat-image {
    width: 2.4vw;
    margin-top: 0.5vw;
  }

  .big-card .stat-image {
    margin-top: -1.2vw;
  }

  .stat-text {
    color: #bababa;
    font-size: 0.75vw;
  }

  .big-card .stat-image {
    width: 3vw;
  }

  .big-card h5 {
    font-size: 2rem;
  }

  .big-card .stat-container h5 {
    font-size: 2vw;
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

  h5 {
    color: white;
  }
</style>