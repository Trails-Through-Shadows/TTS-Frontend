<script lang="ts">
  let adventureId = sessionStorage.getItem('adventureId') ? parseInt(sessionStorage.getItem('adventureId') as string) : 0;
</script>


<div class="container-fluid content come-up">
  <div class="card">
    <div class="card-body d-flex flex-column justify-content-center align-items-center">
      <h1 class="card-title">You Failed</h1>
      <p class="card-text">Now back where you came from!</p>
      <a class="btn btn-danger" href="/adventure?id={adventureId}">Try Again</a>
    </div>
  </div>
</div>


<style>
  .come-up {
    display: flex;
    justify-content: center;
    align-items: center;
    animation: come-up 1s ease-out;
  }

  .card {
    height: 75vh;
    width: calc(100vw - 20vh);
    background-color: rgba(0, 0, 0, 0.8);
    border-radius: 25px;
  }

  .card-title {
    color: #c23737;
    font-size: 5rem;
  }

  .card-text {
    color: #c23737;
    font-size: 2rem;
  }

  @keyframes come-up {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
</style>