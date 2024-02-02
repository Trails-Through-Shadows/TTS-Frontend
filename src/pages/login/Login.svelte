<script lang="ts">
  import './Login.css';
  import { navigate } from 'svelte-routing';

  let licenseNumber = '';
  let password = '';
  let isLoggedIn = false;

  function handleLogin() {
    if (licenseNumber === '0000' && password === 'admin') {
      navigate('/encounter');
    } else {
      alert('Login failed!');
    }
  }
</script>

<main>
  <div class="login-container">
    <h2>Login</h2>
    <form>
      <label>
        License Number:
        <input
          type="text"
          placeholder="0000-0000-0000-0000"
          bind:value={licenseNumber}
        />
      </label>
      <br />
      <label>
        Password:
        <input
          type="password"
          placeholder="Password"
          bind:value={password}
        />
      </label>
      <br />
      <button type="button" on:click={() => handleLogin()}>
        Login
      </button>
    </form>
  </div>
</main>
