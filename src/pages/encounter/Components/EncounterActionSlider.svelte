<script lang="ts">
  export let isActionSliderVisible: boolean;
  export let action: any;

  function toggleActionSlider() {
    isActionSliderVisible = !isActionSliderVisible;
  }
</script>


<div class="card bottom-slider action-slider" class:visible={isActionSliderVisible}>
  <button class="btn btn-success btn-toggle" on:click={toggleActionSlider}>
    <i class="bi" class:bi-chevron-compact-down={isActionSliderVisible} class:bi-chevron-compact-up={!isActionSliderVisible}></i>
  </button>
  <button class="btn card-header d-flex justify-content-center p-0" on:click={toggleActionSlider}>Enemy Actions</button>
  <div class="card-body">
    <div class="row card-text">
      {#if action}
        <h3>{action.title}</h3>
        <p>{action.description}</p>
        {#if action.movement}
          <div class="col sub-action">
            <p><b>Movement</b><br>
            type: {action.movement.type}<br>
            range:{action.movement.range}</p>
            {#if action.movement.effects.length > 0}
              effects:<br>
                {#each action.movement.effects as effect}
                  <div class="effects">
                    <p>type: {effect.effect.type}<br>
                    target: {effect.effect.target}<br>
                    {#if effect.effect.strength > 0}
                      strength: {effect.effect.strength}<br>
                    {/if}
                    {#if effect.effect.duration > 0}
                      duration: {effect.effect.duration}
                    {/if}
                    </p>
                  </div>
                {/each}
            {/if}
          </div>
        {/if}
        {#if action.skill}
          <div class="col sub-action">
            <p><b>Skill:</b><br>
            range: {action.skill.range}<br>
            {#if action.skill.area > 0}
              area: {action.skill.area}<br>
            {/if}
            target: {action.skill.target}<br>
            {#if action.skill.effects.length > 0}
              effects:<br>
              {#each action.skill.effects as effect}
                <div class="effects">
                  <p>type: {effect.effect.type}<br>
                  target: {effect.effect.target}<br>
                  {#if effect.effect.strength > 0}
                    strength: {effect.effect.strength}<br>
                  {/if}
                  {#if effect.effect.duration > 0}
                    duration: {effect.effect.duration}
                  {/if}
                  </p>
                </div>
              {/each}
            {/if}
          </div>
        {/if}
        {#if action.attack}
          <div class="col sub-action">
            <p><b>Attack:</b><br>
            range: {action.attack.range}<br>
            damage: {action.attack.damage}<br>
            {#if action.attack.area > 0}
              area: {action.attack.area}<br>
            {/if}
            target: {action.attack.target}<br>
            {#if action.attack.numAttacks > 1}
              numAttacks: {action.attack.numAttacks}<br>
            {/if}
            {#if action.attack.effects.length > 0}
              effects:<br>
              {#each action.attack.effects as effect}
                <div class="effects">
                  <p>type: {effect.effect.type}<br>
                  target: {effect.effect.target}<br>
                  {#if effect.effect.strength > 0}
                    strength: {effect.effect.strength}<br>
                  {/if}
                  {#if effect.effect.duration > 0}
                    duration: {effect.effect.duration}
                  {/if}
                  </p>
                </div>
              {/each}
            {/if}
          </div>
        {/if}
      {/if}
    </div>
  </div>
</div>


<style>
  .bottom-slider {
    position: fixed;
    bottom: calc(-40% + 43px);
    min-height: calc(40% + 30px);
    transition: bottom 0.5s ease;
    z-index: 998;
    border: 0;
    background: 0;
  }

  .bottom-slider .btn-toggle {
    margin: 0 auto;
    min-height: 30px;
    width: 50px;
    border-radius: 5px 5px 0 0;
    border-bottom: 0;
    font-size: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .bottom-slider .card-header {
    border-radius: 5px 5px 0 0;
    color: #bababa;
    font-size: 1.75rem;
  }

  .bottom-slider.visible {
    bottom: 0;
  }

  .bottom-slider .card-body {
    border-radius: 0;
  }

  .action-slider {
    right: 50%;
    transform: translateX(50%);
    width: 500px;
    max-width: 100%;
  }

  .card-body {
    padding: 8px;
  }

  .card-header {
    background-color: #222;
    color: #bababa;
  }

  .card-body {
    background-color: #222;
    color: #bababa;
    border-radius: 0 0 5px 5px;
  }

  .card-text {
    padding: 8px;
  }

  .sub-action {
    padding: 8px;
    border: 1px solid #333;
    border-radius: 5px;
    margin: 8px 0;
  }

  .effects {
    padding: 8px;
    border: 1px solid #333;
    border-radius: 5px;
    margin: 8px 0;
  }

  .effects p {
    margin: 0;
  }
</style>