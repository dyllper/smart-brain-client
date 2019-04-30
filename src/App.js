import React, { Component } from 'react';
import { connect } from 'react-redux';
import Particles from 'react-particles-js';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';

import { setInputField, makeClarifaiCall } from './actions/images';

const mapStateToProps = state => {
   return {
      input: state.input,
      imageUrl: state.imageUrl,
      box: state.boxData,
   };
};

const mapDispatchToProps = dispatch => {
   return {
      onInputChange: event => dispatch(setInputField(event.target.value)),
      onImageSubmit: () => dispatch(makeClarifaiCall(this.props.imageUrl)),
   };
};

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
      const { onInputChange, onImageSubmit, box, imageUrl } = this.props;
      const { isSignedIn, route } = this.state;
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
                     onInputChange={onInputChange}
                     onImageSubmit={onImageSubmit}
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

export default connect(
   mapStateToProps,
   mapDispatchToProps
)(App);
