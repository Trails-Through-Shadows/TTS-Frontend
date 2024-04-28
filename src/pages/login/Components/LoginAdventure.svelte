<script lang="ts">
  import type { Adventure, Campaign } from "../../../lib/Exports";
  import LoginAdventureCard from "./LoginAdventureCard.svelte";
  import LoginAdventureCreate from "./LoginAdventureCreate.svelte";
  import LoginAdventureEditModal from "./LoginAdventureEditModal.svelte";

  export let adventureList: Adventure[] = [];
  export let campaignList: Campaign[] = [];
</script>

<div class="container-fluid content">
  <div class="row w-100">
    {#each adventureList as adventure, index}
      <LoginAdventureCard bind:adventureList={adventureList} index={index} />
    {/each}
    {#if adventureList.length < 8}
      <LoginAdventureCreate bind:adventureList={adventureList} bind:campaignList={campaignList} />
    {/if}
  </div>
</div>

{#each adventureList as adventure, index}
  <LoginAdventureEditModal bind:adventureList={adventureList} index={index} />
{/each}