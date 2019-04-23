import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';

const app = new Clarifai.App({
   apiKey: 'd1c5c7c8e62f4011a799e1376eeea1c9',
});

const particlesOptions = {
   particles: {
      number: {
         value: 50,
         density: {
            enable: true,
            value_area: 800,
         },
      },
   },
};

const initialState = {
   input: '',
   imageUrl: '',
   box: {},
   route: 'signin',
   isSignedIn: false,
   user: {
      id: '',
      name: '',
      email: '',
      entries: 0,
      joined: '',
   },
};

class App extends Component {
   constructor() {
      super();
      this.state = initialState;
   }

   loadUser = userData => {
      this.setState({
         user: {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            entries: userData.entries,
            joined: userData.joined,
         },
      });
   };

   calculateFaceLocation = data => {
      //TODO: Update this to create boxes for ALL faces, not just one
      const clarifaiBoundingBox =
         data.outputs[0].data.regions[0].region_info.bounding_box;
      const image = document.getElementById('inputImage');
      const imageWidth = Number(image.width);
      const imageHeight = Number(image.height);
      return {
         leftCol: clarifaiBoundingBox.left_col * imageWidth,
         topRow: clarifaiBoundingBox.top_row * imageHeight,
         rightCol: imageWidth - clarifaiBoundingBox.right_col * imageWidth,
         bottomRow: imageHeight - clarifaiBoundingBox.bottom_row * imageHeight,
      };
   };

   displayFaceBox = box => {
      this.setState({ box: box });
   };

   onInputChange = event => {
      this.setState({ input: event.target.value });
   };

   onImageSubmit = () => {
      this.setState({ imageUrl: this.state.input });
      app.models
         .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
         .then(response => {
            if (response) {
               fetch('http://localhost:3000/image', {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                     id: this.state.user.id,
                  }),
               })
                  .then(response => response.json())
                  .then(count => {
                     this.setState(
                        Object.assign(this.state.user, { entries: count })
                     );
                  })
                  .catch(console.log);
            }
            this.displayFaceBox(this.calculateFaceLocation(response));
         })
         .catch(err => console.log(err));
   };

   onRouteChange = route => {
      if (route === 'signout') {
         this.setState(initialState);
      } else if (route === 'home') {
         this.setState({ isSignedIn: true });
      }
      this.setState({
         route: route,
      });
   };

   render() {
      const { isSignedIn, imageUrl, route, box } = this.state;
      return (
         <div className="App">
            <Particles className="particles" params={particlesOptions} />
            <Navigation
               isSignedIn={isSignedIn}
               onRouteChange={this.onRouteChange}
            />
            {route === 'home' ? (
               <div>
                  <Logo />
                  <Rank
                     name={this.state.user.name}
                     entries={this.state.user.entries}
                  />
                  <ImageLinkForm
                     onInputChange={this.onInputChange}
                     onImageSubmit={this.onImageSubmit}
                  />
                  <FaceRecognition imageUrl={imageUrl} box={box} />
               </div>
            ) : route === 'signin' ? (
               <Signin
                  loadUser={this.loadUser}
                  onRouteChange={this.onRouteChange}
               />
            ) : (
               <Register
                  loadUser={this.loadUser}
                  onRouteChange={this.onRouteChange}
               />
            )}
         </div>
      );
   }
}

export default App;
