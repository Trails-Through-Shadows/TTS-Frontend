<script lang="ts">
  export let story: string;
  export let isStoryVisible: boolean;
</script>


<div class="container-fluid content come-down" data-simplebar>
  <div class="container-fluid card d-flex flex-column justify-content-center align-items-center">
    <div class="card-body d-flex flex-column justify-content-center align-items-center">
      <p class="card-text">{story}</p>
      <button class="btn btn-success" on:click={() => isStoryVisible = false}>Onward</button>
    </div>
  </div>
</div>


<style>
  .come-down {
    display: flex;
    justify-content: center;
    align-items: center;
    animation: come-down 1s ease-out;
    padding-top: 10vh;
  }

  .card {
    width: calc(100vw - 20vh);
    background-color: rgba(0, 0, 0, 0.8);
    border-radius: 25px;
  }

  .card-text {
    color: #4fc780;
    font-size: 2rem;
    text-align: center;
    padding: 0 3vw;
  }

  @keyframes come-down {
    from {
      transform: translateY(-100%);
    }
    to {
      transform: translateY(0);
    }
  }
</style>