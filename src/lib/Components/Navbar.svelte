<script lang="ts">
  export let url: string | null = null;


</script>

<nav class="navbar">
  <div class="logo-container">
    {#if url}
      <a class="btn btn-success" href="/">
        <i class="bi bi-chevron-left" />
        <span class="d-none d-md-inline">
          Back
        </span>
      </a>
    {/if}
    <a class="logo-href" href="/">
      <img src="assets/logo-icon-small.png" alt="Logo" />
      Trails Through Shadows
    </a>
  </div>
  <div class="navbar-links">
    <slot />
  </div>
</nav>



<style>
  .navbar {
    background-color: #222;
    color: #4fc780;
    text-align: center;
    padding: 12.5px;
    height: auto;
    z-index: 1000;
  }

  .navbar .logo-href {
    padding-right: 20px;
    text-decoration: none;
    color: #4fc780;
  }

  .navbar img {
    width: 50px;
    height: 50px;
  }
</style>