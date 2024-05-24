<script lang="ts">
  let adventureId = sessionStorage.getItem('adventureId') ? parseInt(sessionStorage.getItem('adventureId') as string) : 0;

  export let story: string;
</script>


<div class="container-fluid content come-down" data-simplebar>
  <div class="container-fluid card">
    <div class="card-body d-flex flex-column justify-content-center align-items-center">
      <h1 class="card-title">Congratulations!</h1>
      <p class="card-text">{story}</p>
      <a class="btn btn-success" href="/adventure?id={adventureId}">Onward</a>
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

  .card-title {
    color: #4fc780;
    font-size: 5rem;
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