//here we import the react
import React, {
    Component
} from 'react';

class App extends Component {

    // app construction
    constructor(props) {
        super(props);
        this.state = {
            myplaces: [
                // represent the places
                {
                    name: "Jaisalmer Fort",
                    type: "Fort",
                    Address: "Fort Road, Near Gopa Chowk, Amar Sagar Pol, Jaisalmer, Rajasthan 345001,india",
                    latitude: 26.911661,
                    longitude: 70.922928
                },
                {
                    name: "Golkonda Fort",
                    type: "Fort",
                    streetAddress: "Golconda Fort, Hyderabad, Telangana, India ",
                    latitude: 17.382330,
                    longitude: 78.401604
                },
                {
                    name: "Mehrangarh Fort",
                    type: "Fort",
                    streetAddress: "The Fort, Jodhpur, Rajasthan 342006,India",
                    latitude: 26.298074,
                    longitude: 73.018407
                },
                {
                    name: "City Palace",
                    type: " Palace",
                    streetAddress: " City Palace, Jaipur,India",
                    latitude: 26.925771,
                    longitude: 75.823658
                },
                {
                    name: "Red Fort",
                    type: "Fort",
                    streetAddress: "Netaji Subhash Marg, Lal Qila, Chandni Chowk, New Delhi, Delhi 110006,India",
                    latitude: 28.656027,
                    longitude: 77.240731
                },
                {
                    name: "Bangalore Fort",
                    type: "Fort",
                    streetAddress: "KR Road, New Tharagupet, Bengaluru, Karnataka 560002,India",
                    latitude: 12.962901,
                    longitude: 77.576046
                },
                {
                    name: "ISKCON Temple",
                    type: "Temple",
                    streetAddress: "Hare Krishna Hill, Chord Rd, Rajaji Nagar, Bengaluru, Karnataka 560010,India",
                    latitude: 13.009833,
                    longitude: 77.551096

                },
                {
                    name: "Gwalior junction",
                    type: "Junction",
                    streetAddress: "Gwalior, Madhya Pradesh 474008,India",
                    latitude: 26.218287,
                    longitude: 78.182831

                },

            ],
            'map': '',
            'infowindow': '',

        };


        // retain object instance when used in the function

        this.initMap = this.initMap.bind(this);
        this.openInfoWindow = this.openInfoWindow.bind(this);
        this.closeInfoWindow = this.closeInfoWindow.bind(this);
    }


    //Once the script is loaded then initialising the map

    initMap() {
        let self = this;
        let viewmap = document.getElementById('map');
        viewmap.style.height = window.innerHeight + "px";
        let map = new window.google.maps.Map(viewmap, {
            zoom: 5,
            center: {
                lat: 20.5937,
                lng: 78.9629
            },
            mapTypeControl: false
        });

        let InfoWindow = new window.google.maps.InfoWindow({});

        window.google.maps.event.addListener(InfoWindow, 'closeclick', function() {
            self.closeInfoWindow();
        });

        this.setState({
            'map': map,
            'infowindow': InfoWindow
        });

        window.google.maps.event.addDomListener(window, "resize", function() {
            let center = map.getCenter();
            window.google.maps.event.trigger(map, "resize");
            self.state.map.setCenter(center);
        });

        window.google.maps.event.addListener(map, 'click', function() {
            self.closeInfoWindow();
        });

        //here we are diplaying the mylocation details at the search box 
        let myplaces = [];
        this.state.myplaces.forEach(function(location) {
            let name = location.name + "-" + location.type;
            let marker = new window.google.maps.Marker({
                position: new window.google.maps.LatLng(location.latitude, location.longitude),
                animation: window.google.maps.Animation.DROP,
                map: map
            });

            marker.addListener('click', function() {
                self.openInfoWindow(marker);
            });

            location.name = name;
            location.marker = marker;
            location.display = true;
            myplaces.push(location);
        });
        this.setState({
            'myplaces': myplaces
        });
    }

    componentDidMount() {
        //here we Connect the initMap() function within this class to the global window context,
        // so Google Maps can invoke it
        window.initMap = this.initMap;
        // now we are added asynchronously load the Google Maps script, passing in the callback reference
        loadMapJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyC6UfEEwpW4rYPsOcz9jHeYisZHFalO2EI&callback=initMap')

    }


    //Retrive the location data from the foursquare api for the marker and display it in the infowindow


    getMarkerInfo(marker) {
        //assign this to the self
        let self = this;
        //here we are adding Idclient foursquarelink
        let Idclient = "GWTSXDMH3JXCD024UKGSAGSV0YRXPLW3CXNPDRSM3OJUUD4Q";
        //here we are adding Secretclient foursquarelink
        let Secretclient = "FWVEKMDXRYHZMCB4R0IQ2USGIIEEHCRWXOAP5XT4NHIQFPHX";
        let url = "https://api.foursquare.com/v2/venues/search?client_id=" + Idclient + "&client_secret=" + Secretclient + "&v=20130815&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng() + "&limit=1";

        fetch(url)
            .then(
                function(response) {
                    //if connection error is occured below data can be diplayed
                    if (response.status !== 200) {
                        self.state.infowindow.setContent("Data cannot be loaded");
                        return;
                    }

                    // Examine the response of test

                    response.json().then(function(data) {
                        let location_data = data.response.venues[0];
                        //If the server is online the below data is displayed
                        let readMore = '<a href="https://foursquare.com/v/' + location_data.id + '" target="_blank">All the data about this location available in foursqare</a>'
                        self.state.infowindow.setContent(readMore);
                    });
                }
            )

            //if sever is offline then Data canot be loaded is displayed
            .catch(function(err) {
                self.state.infowindow.setContent("Data cannot be loaded");
            });
    }


    //Open infowindow for marker

    openInfoWindow(marker) {
        this.closeInfoWindow();
        this.state.infowindow.open(this.state.map, marker);
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        this.setState({
            'prevmarker': marker
        });
        this.state.map.setCenter(marker.getPosition());
        this.state.map.panBy(0, -200);
        this.getMarkerInfo(marker);
    }

    // Rendering the function

    render() {
        return ( 
            <div >
            {/*write the heading for reactmap
          here we are adding the my places data i.e both the openwindow and closed window*/}
            <h2 > NEIGHBOURHOOD MAP < /h2>
           
            <div>
            <MyPlacesdata key = "100"
            myplaces = {
                this.state.myplaces
            }
            openInfoWindow = {
                this.openInfoWindow
            }
            closeInfoWindow = {
                this.closeInfoWindow
            }
            /> 
            <div id = "map" > < /div> 
            </div> 
            </div>
        );
    }



    //Closing infowindow for marker
    // @param {object} location marker
    //adding the animation

    closeInfoWindow() {
        if (this.state.prevmarker) {
            this.state.prevmarker.setAnimation(null);
        }
        this.setState({
            'prevmarker': ''
        });
        this.state.infowindow.close();
    }

}


export default App;
class MyPlacesdata extends Component {

    constructor(props) {
        super(props);
        this.state = {
            'places': '',
            'query': '',
            'suggestions': true,
        };

        this.filterplaces = this.filterplaces.bind(this);
        this.toggleSuggestions = this.toggleSuggestions.bind(this);
    }

    // it is based on query of filter location
    //adding a places to filterlocation
    filterplaces(event) {
        this.props.closeInfoWindow();
        const {
            value
        } = event.target;
        let places = [];
        this.props.myplaces.forEach(function(location) {
            if (location.name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                location.marker.setVisible(true);
                places.push(location);
            } else {
                location.marker.setVisible(false);
            }
        });

        this.setState({
            'places': places,
            'query': value
        });
    }

    componentWillMount() {
        this.setState({
            'places': this.props.myplaces
        });
    }
    // Show and hide suggestions   
    //by clicking on the show and hide places button then it can be perform their actions.   
    toggleSuggestions() {
        this.setState({
            'suggestions': !this.state.suggestions
        });
    }

    // Rendering the  function of MyPlacesdata
    //Myplaces are displayed in the serachbox by using the below data
    render() {
        let MyPlacesdata = this.state.places.map(function(listItem, index) {
            return ( 
                <Myitems key = {
                    index
                }
                openInfoWindow = {
                    this.props.openInfoWindow.bind(this)
                }
                data = {
                    listItem
                }
                />
            );
        }, this);

        return ( 
            <div className = "box1">
            <input role = "box1" aria-label = "Search Here" id = "look-field"
            className = "list-view"
            type = "text"
            placeholder = "Search Here"
            value = {
                this.state.query
            }
            onChange = {
                this.filterplaces
            }
            /> 
            <ul className = "box2" > {
                this.state.suggestions && MyPlacesdata
            } 
            </ul> 
            <button className = "box3"
            onClick = {
                this.toggleSuggestions
            } > Show & Hide places < /button> 
            </div>
        );
    }
}
class Myitems extends React.Component {

    // Render function of Myitems

    render() {
        return ( <
            li role = "button"
            className = "select"
            onClick = {
                this.props.openInfoWindow.bind(this, this.props.data.marker)
            } > {
                this.props.data.name
            } < /li>
        );
    }
}

/**
 * Load the google maps Asynchronously
 * @param {url} url of the google maps script
 */
function loadMapJS(src) {
    let ref = window.document.getElementsByTagName("script")[0];
    let script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    script.onerror = function() {
        document.write("Google Maps can't be loaded");
    };
    ref.parentNode.insertBefore(script, ref);
}
