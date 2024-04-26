<script lang="ts">
  export let title: string | null = null;
</script>

<nav class="navbar">
  <div class="logo-container">
    <a class="logo-href" href="/">
      <img src="assets/logo-icon-small.png" alt="Logo" />
      <div class="logo-text">
        Trails Through<br>Shadows
      </div>
    </a>
    {#if title}
      <h3 class="title">{title}</h3>
    {/if}
  </div>
  <div class="navbar-links">
    <slot />
  </div>
</nav>

<style>
.navbar {
  background-color: #222;
  color: #4fc780;
  padding: 12.5px;
  height: auto;
  z-index: 1000;
}

.logo-container {
  display: flex;
  align-items: center;
}

.navbar .logo-href {
  text-decoration: none;
  color: #4fc780;
  display: flex;
  align-items: center;
}

.navbar img {
  width: 50px;
  height: 50px;
}

.logo-text {
  margin-left: 15px;
}

.navbar .title {
  color: #bababa;
  margin-left: 100px;
}

@media (max-width: 576px) {
  .logo-text {
    display: none;
  }

  .navbar .title {
    margin-left: 15px;
  }
}
</style>