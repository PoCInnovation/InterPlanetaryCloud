import React from 'react';
import UploadButton from '../components/button/UploadButton.js'

class App extends React.Component {
    render() {
      return (
          <div className="App">
              <h1>Inter Planetary Cloud</h1>
              <h3>Upload a file</h3>
              <UploadButton/>
          </div>
      );
    }
}

export default App;
