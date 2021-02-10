import Canvas from './canvas'
import Room from './room'
import Lobby from './lobby'
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Canvas />
      <Router>
        <Switch>
          <Route exact path="/">
            <Lobby />
          </Route>
          <Route path="/room">
            <Room />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
