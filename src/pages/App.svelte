<script>
    import { Router, Route } from "svelte-routing";
    import Login from "./login/Login.svelte";
    import Encounter from "./encounter/Encounter.svelte";
    import CharacterCreation from "./character/CharacterCreation.svelte";
    import Adventure from "./adventure/Adventure.svelte";
</script>

<Router>
    <Route path="/encounter" component={Encounter} />
    <Route path="/characters" component={CharacterCreation} />
    <Route path="/adventure" component={Adventure} />
    <Route path="/" component={Login} />
    <Route ><h1>404</h1><br>You should not be here.</Route>
</Router>