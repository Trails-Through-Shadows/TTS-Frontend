<script lang="ts">
  import { Character } from "../../../lib/Exports";

  export let charList: Character[];
  export let index: number;
</script>

<div class="col-xl-4 col-lg-6 col-md-6 col-sm-12">
  <div class="d-flex justify-content-center">
    <div class="card secondary-card border-0 mt-3">
      <div class="card-header text-center">
        <h5 id="card-name" class="m-0">{charList[index].race.title}-{charList[index].clazz.title} </h5>
      </div>
    </div>
  </div>
  <div class="card main-card border-0 m-0">
    <div class="card-body">
      <div class="row">
        <div class="col-2 side-card">
          <div class="item-container">
            <img class="item-image" src="assets/sword.png" alt="Weapon" />
          </div>
          <div class="item-container">
            <img class="item-image" src="assets/pendant.png" alt="Accessory" />
          </div>
          <div class="item-container">
            <img class="item-image" src="assets/potion.png" alt="Consumable" />
          </div>
          <div class="item-container">
            <img class="item-image" src="assets/potion.png" alt="Consumable" />
          </div>
        </div>
        <div class="col-7">
          <div class="class-image-container d-flex justify-content-center">
            <img class="class-image" src="{charList[index].url}" alt="{charList[index].clazz.title}" />
          </div>
        </div>
        <div class="col-1 position-relative">
          <div class="position-absolute top-0 start-50 translate-middle-x">
            <div class="position-relative">
              <img class="stat-image" src="assets/heart.png" alt="Health" />
              <div class="stat-container">
                <h1>{charList[index].clazz.baseHealth}</h1>
                <div class="stat-text">Health</div>
              </div>
            </div>
          </div>
          <div class="position-absolute top-50 start-50 translate-middle">
            <div class="position-relative">
              <img class="stat-image" src="assets/shield.png" alt="Defence" />
              <div class="stat-container">
                <h1>{charList[index].clazz.baseDefence}</h1>
                <div class="stat-text">Defence</div>
              </div>
            </div>
          </div>
          <div class="position-absolute bottom-0 start-50 translate-middle-x">
            <img class="stat-image" src="assets/speed.png" alt="Initiative" />
            <div class="stat-container">
              <h1>{charList[index].clazz.baseInitiative + charList[index].race.baseInitiative}</h1>
              <div class="stat-text">Initiative</div>
            </div>
          </div>
        </div>
        <div class="col-2 side-card">
          <div class="item-container">
            <img class="item-image" src="assets/helmet.png" alt="Helmet" />
          </div>
          <div class="item-container">
            <img class="item-image" src="assets/chestplate.png" alt="Chestplate" />
          </div>
          <div class="item-container">
            <img class="item-image" src="assets/leggings.png" alt="Leggings" />
          </div>
          <div class="item-container">
            <img class="item-image" src="assets/boots.png" alt="Boots" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="d-flex justify-content-center">
    <div class="card secondary-card border-0">
      <div class="card-footer text-center p-0">
        <h2>{charList[index].title}</h2>
      </div>
    </div>
  </div>
</div>


<style>
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

  .stat-container h1 {
    margin: 0;
  }

  .class-image-container {
    position: relative;
    min-height: 263px;
    height: 28vh;
    overflow: hidden;
    border-radius: 50px;
  }

  .class-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
    border-radius: 50px;
  }

  .stat-image {
    margin: 20px;
    width: 50px;
  }

  .stat-text {
    color: #bababa;
  }

  .card {
    background-color: #222;
  }

  .secondary-card {
    width: 75%;
  }

  .card-header {
    background-color: #1c1c1c;
    color: #bababa;
  }

  .card-body {
    background-color: #222;
    border-radius: 5px;
  }

  .card-footer {
    background-color: #1c1c1c;
    color: #bababa;
  }

  h1 {
    color: white;
  }

  h2 {
    color: white;
  }

  .side-card {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .item-container {
    flex: 1 0;
    height: 100%;
    width: 63px;
    margin: 2px;
    border-radius: 25%;
    border: #333 2px solid;
    background-color: #1c1c1c;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    aspect-ratio: 1;
  }

  .item-image {
    width: 100%;
    height: 100%;
  }
</style>