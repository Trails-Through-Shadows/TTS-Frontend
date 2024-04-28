<script lang="ts">
  import ScrollingText from "../../../lib/Components/ScrollingText.svelte";

  export let adventureList: any;
  export let index: number;
</script>

<div class="col-xl-3 col-lg-4 col-md-6">
  <div class="card adventure-card border-0 m-3">
    <div class="card-header">
      <div class="d-flex justify-content-between">
        <div class="title-container" data-simplebar>
          <ScrollingText>
            <h5>{adventureList[index].title}</h5>
          </ScrollingText>
        </div>
        <button class="btn btn-sm" data-bs-toggle="modal" data-bs-target="#editModal{index}">Edit</button>
      </div>
    </div>
    <div class="card-body adventure-description" data-simplebar>
      <p>{adventureList[index].description}</p>
    </div>
    <div class="card-body adventure-resources">
      <div class="row text-center align-items-center">
        <div class="col-4">
          <label for="reputation" class="">Reputation</label>
          <input type="text" class="resources-input form-control align-self-center" disabled value={adventureList[index].reputation} />
        </div>
        <div class="col-4">
          <label for="gold" class="">Gold</label>
          <input type="text" class="resources-input form-control align-self-center" disabled value={adventureList[index].gold} />
        </div>
        <div class="col-4">
          <label for="experience" class="">Experience</label>
          <input type="text" class="resources-input form-control align-self-center" disabled value={adventureList[index].experience} />
        </div>
      </div>
    </div>
    <div class="card-footer">
      <a class="btn btn-xl w-100 continue-button" href="/adventure" on:click={() => { sessionStorage.setItem('adventureId', adventureList[index].id.toString()) }}>Continue</a>
    </div>
  </div>
</div>

<style>
  .card {
    color: #bababa;
    border-radius: 5px;
    border: none;
    background-color: #222;
  }

  .card-header {
    color: #fff;
  }

  .title-container {
    overflow: hidden;
    white-space: nowrap;
    width: 85%;
  }

  .adventure-description {
    height: 20vh;
    background-color: #333;
  }

  .adventure-resources {
    border-top: 1px solid #1c1c1c;
    margin: 0;
    padding: 0 10px 0 10px;
  }

  .continue-button {
    color: #bababa;
    border-color: #4fc780;
    box-shadow: 0 0 0 0.5rem #222;
  }

  .continue-button:hover {
    color: #222;
    background-color: #4fc780;
  }

  .resources-input {
    max-width: 75px;
    background-color: #333;
    border-color: #1c1c1c;
    text-align: center;
    margin: 0 auto 10px auto;
  }

  .form-control {
    height: 2rem;
    background-color: #333;
    color: #bababa;
    border: none;
  }

  .form-control::placeholder {
    color: #757575;
  }
</style>