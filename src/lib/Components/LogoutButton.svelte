<script lang="ts">
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

<button class="btn btn-danger" on:click={logout}>
  Logout
</button>

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