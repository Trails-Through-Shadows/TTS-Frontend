<script lang="ts">
  import { navigate } from 'svelte-routing';

  let licenseNumber = '';
  let password = '';

  function handleLogin() {
    if (licenseNumber === '0000' && password === 'admin') {
      navigate('/char');
    } else {
      alert('Login failed!');
    }
  }
</script>

<main>
  <div class="container d-flex align-items-center justify-content-center">
    <div class="row justify-content-center">
      <div class="col-12">
        <div class="card">
          <div class="card-header text-center border-0">
            <h5 class="card-title"><b>Login</b></h5>
          </div>
          <div class="card-body">
            <form>
              <div class="form-group">
                <label for="licenseNumber">License Number</label>
                <input type="text" class="form-control" id="licenseNumber" placeholder="ABCD-0123-EFGH-4567" bind:value="{licenseNumber}">
              </div>
              <div class="form-group">
                <label for="password">Password</label>
                <input type="password" class="form-control" id="password" placeholder="password" bind:value="{password}">
              </div>
              <button type="button" class="btn col-12 mt-3" on:click="{handleLogin}">Login</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>

<style>
  .row {
    width: 20vw;
  }

  .card {
    border-radius: 5px;
  }

  .form-control {
    border-radius: 3px;
    height: 2rem;
  }

  .card-header {
    background-color: #f0f0f0;
  }

  .card-body {
    background-color: #f0f0f0;
  }

  .btn {
    border-radius: 3px;
    height: 2rem;
  }
</style>