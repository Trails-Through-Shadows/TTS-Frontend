<script lang="ts">
  import { Character, Clazz, Race } from "../../../lib/Exports";

  export let characterList: Character[];

  function handleAddCharacter() {
    if (characterList.length < 6) {
      characterList.push(new Character(0, new Clazz(0, "", "", "", 0, 0, 0), new Race(0, "", "", "", 0), "", ""));
      characterList = characterList;
    }
  }
</script>


<div class="col-md-4">
  <div class="small-card-container">
    <button class="btn btn-success" on:click={handleAddCharacter}>
      <img class="add-character-image" src="assets/add-character.svg" alt="Add character" />
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

  .small-card-container .btn:hover img {
    filter: invert(0%) sepia(13%) saturate(5094%) hue-rotate(358deg) brightness(85%) contrast(73%);
  }

  .add-character-image {
    max-width: 120px;
    filter: invert(90%) sepia(0%) saturate(0%) hue-rotate(177deg) brightness(86%) contrast(84%);
  }

  .add-character-image:hover {
    filter: invert(0%) sepia(13%) saturate(5094%) hue-rotate(358deg) brightness(85%) contrast(73%);
  }
</style>