export const CHANGE_INPUT_FIELD = 'CHANGE_INPUT_FIELD';
export const CHANGE_IMAGE_URL = 'CHANGE_IMAGE_URL';
export const CLARIFAI_REQUEST_PENDING = 'CLARIFAI_REQUEST_PENDING';
export const CHANGE_BOX_LOCATION_DATA = 'CHANGE_BOX_LOCATION_DATA';

export const setInputField = text => ({
   type: CHANGE_INPUT_FIELD,
   text,
});

export const setImageUrl = url => ({
   type: CHANGE_IMAGE_URL,
   url,
});

export const clarifaiRequestIsPending = isPending => ({
   type: CLARIFAI_REQUEST_PENDING,
   isPending,
});

export const setBoxValue = boxData => ({
   type: CHANGE_BOX_LOCATION_DATA,
   boxData,
});

export const makeClarifaiCall = imageUrl => dispatch => {
   dispatch(setImageUrl(imageUrl));
   fetch('https://shrouded-falls-91037.herokuapp.com/imageurl', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
         input: imageUrl,
      }),
   })
      .then(response => {
         dispatch(clarifaiRequestIsPending(true));
         return response.json();
      })
      .then(
         response => {
            const box = calculateFacebox(response);
            dispatch(setBoxValue(box));
         }
         //    {
         //    if (response) {
         //       fetch('https://shrouded-falls-91037.herokuapp.com/image', {
         //          method: 'PUT',
         //          headers: { 'Content-Type': 'application/json' },
         //          body: JSON.stringify({
         //             id: this.state.user.id,
         //          }),
         //       })
         //          .then(response => response.json())
         //          .then(count => {
         //             this.setState(
         //                Object.assign(this.state.user, { entries: count })
         //             );
         //          })
         //          .catch(console.log);
         //    }
         //    this.displayFaceBox(this.calculateFaceLocation(response));
         // }
      )
      .catch(err => console.log(err));
};

const calculateFacebox = data => {
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
