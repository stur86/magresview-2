import './App.css';
import { useState } from 'react';

function App() {

  var [state, setState] = useState('red');

  console.log(state);

  function doThing() {
    if (state == 'red')
      setState('blue');
    else
      setState('red');
  }

  return (
    <div className={"App theme-" + state}>
      <div className="themedThing">

        Change theme:
        <input type="button" onClick={doThing} value="Click me"></input>
      </div>
    </div>
  );
}

export default App;
