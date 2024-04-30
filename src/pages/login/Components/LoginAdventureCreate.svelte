<div class="col-xl-3 col-lg-4 col-md-6">
  <div class="small-card-container">
    <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#createModal">
      <img class="add-campaign-image" src="assets/add-campaign.svg" alt="Add adventure" />
    </button>
  </div>
</div>



<style>
  .small-card-container {
    height: 40vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .add-campaign-image {
    max-width: 120px;
    filter: invert(90%) sepia(0%) saturate(0%) hue-rotate(177deg) brightness(86%) contrast(84%);
  }

  .add-campaign-image:hover {
    filter: invert(0%) sepia(13%) saturate(5094%) hue-rotate(358deg) brightness(85%) contrast(73%);
  }
</style>