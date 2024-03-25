<script lang="ts">
  export let url: string | null = null;

  let showLogoutModal = false;

  function logout() {
    showLogoutModal = true;
  }

  function confirmLogout() {
    sessionStorage.setItem('idLicense', '');
    sessionStorage.setItem('token', '');

    window.location.href = '/';
  }
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
    <button class="btn btn-danger" on:click={logout}>
      Logout
    </button>
  </div>
</nav>

{#if showLogoutModal}
  <div id="logoutModal" class="modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Logout</h5>
        </div>
        <div class="modal-body">
          Are you sure you want to logout?
        </div>
        <div class="modal-footer justify-content-between">
          <button type="button" class="btn btn-success" on:click={() => showLogoutModal = false}>Cancel</button>
          <button type="button" class="btn btn-danger" on:click={confirmLogout}>Logout</button>
        </div>
      </div>
    </div>
  </div>
{/if}

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

.modal {
  display: flex;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content{
  color: #bababa;
  background-color: #222;
}

.modal-content > div {
  border-color: #1c1c1c;
}

</style>