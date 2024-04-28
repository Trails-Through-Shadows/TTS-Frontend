<script lang="ts">
  let adventureId = sessionStorage.getItem('adventureId') ? parseInt(sessionStorage.getItem('adventureId') as string) : 0;
</script>


<div class="container-fluid content come-down">
  <div class="card">
    <div class="card-body d-flex flex-column justify-content-center align-items-center">
      <h1 class="card-title">Congratulations!</h1>
      <p class="card-text">May your further journeys be as successful as this one has.</p>
      <a class="btn btn-success" href="/adventure?id={adventureId}">Continue</a>
    </div>
  </div>
</div>


<style>
  .come-down {
    justify-content: center;
    align-items: center;
    animation: come-down 1s ease-out;
  }

  .card {
    height: 75vh;
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