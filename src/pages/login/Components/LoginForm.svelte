<script lang="ts">
	import { api, Adventure, Campaign} from "../../../lib/Exports";
	import { getRequest, postRequest } from "../../../lib/Functions";
	import { Notify, Loading } from "notiflix";

	export let adventureList: any;
	export let campaignList: any;
	export let loggedIn: boolean;

	let licenseId = parseInt(sessionStorage.getItem('licenseId') || '0');
	let token = sessionStorage.getItem('token') || '';

	let licenseNumber = '';
	let password = '';

	if (licenseId === 0 || token === '') {
		sessionStorage.clear();
	} else {
		logIn();
	}

  function logIn() {
    Loading.dots('Loading...')

    getRequest(`${api}/adventures`, token,
      (data: any) => {
        adventureList = data.entries.map((adventure: any) => new Adventure(adventure.id, adventure.title, adventure.description, adventure.reputation, adventure.experience, adventure.gold, adventure.idCampaign));
        loggedIn = true;
        Loading.remove();
      },
      (data: any) => {
        sessionStorage.clear();
        Loading.remove();
        Notify.failure(data.message)
        if (data.message === 'Invalid session token!') {
          loggedIn = false;
        }
      }
    );

		getRequest(`${api}/campaigns`, token,
			(data: any) => {
				campaignList = data.entries.map((campaign: any) => new Campaign(campaign.id, campaign.title, campaign.description));
			},
			(data: any) => {
				sessionStorage.clear();
				Notify.failure(data.message)
				if (data.message === 'Invalid session token!') {
					loggedIn = false;
				}
			}
		);
  }

	function handleLogin() {
		Loading.dots('Loading...')

		postRequest(`${api}/session/login`, null, {key: licenseNumber, password: password},
			(data: any) => {
				licenseId = data.licenseId;
				token = data.token;

				sessionStorage.setItem('licenseId', licenseId.toString());
				sessionStorage.setItem('token', token);

				logIn();
			},
			(data: any) => {
				Loading.remove();
				Notify.failure(data.message)
			}
		);
  }

	function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      handleLogin();
    }
  }
</script>

<div class="container-fluid content" data-simplebar>
	<div class="container-fluid content">
		<div class="container d-flex align-items-center justify-content-center">
			<div class="card login-card">
				<div class="card-header text-center border-0">
					<h5 class="card-title"><b>Login</b></h5>
				</div>
				<div class="card-body">
					<form>
						<div class="form-group">
							<label for="licenseNumber">License Number</label>
							<input type="text" class="form-control" id="licenseNumber" placeholder="ABCD-0123-EFGH-4567" bind:value="{licenseNumber}" on:keypress="{handleKeyPress}">
						</div>
						<div class="form-group">
							<label for="password">Password</label>
							<input type="password" class="form-control" id="password" placeholder="password" bind:value="{password}" on:keypress="{handleKeyPress}">
						</div>
						<button type="button" class="btn btn-sm col-12 mt-3" on:click="{handleLogin}">Login</button>
					</form>
				</div>
			</div>
		</div>
	</div>
</div>


<style>
	.card {
    color: #bababa;
    border-radius: 5px;
    border: none;
  }

	.form-control {
    height: 2rem;
    background-color: #333;
    color: #bababa;
    border: none;
  }

  .form-control::placeholder {
    color: #757575;
  }

	.login-card {
		width: 20vw;
		min-width: 250px;
	}

	.login-card .card-header {
		background-color: #222;
	}

	.login-card .card-body {
		background-color: #222;
		border-radius: 0 0 5px 5px;
	}

	.login-card .btn {
		color: #bababa;
		border-color: #4fc780;
	}

	.login-card .btn:hover {
		color: #222;
		background-color: #4fc780;
	}
</style>