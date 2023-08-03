//@ts-nocheck
import React, { useState, useRef} from 'react';
import { Map, Marker, InfoWindow, Polygon, GoogleApiWrapper } from 'google-maps-react';

import styles from './Map.module.scss'

type MarkerType = {
  showInfoWindow: boolean,
  activeMarker: any, 
  selectedPlace: any
}

const MapComponent = (props:any) => {
  const [markerCfg, setMarkerCfg] = useState<MarkerType>({ showInfoWindow: false, activeMarker: {}, selectedPlace: {} })
  const mapRef:any = useRef(null);


  const coords = { lat: 37.9516, lng:58.4307};
  const turkmenistanCoords = [
    { lat: 39.775, lng: 52.968 },
    { lat: 37.235, lng: 52.968 },
    { lat: 37.235, lng: 66.672 },
    { lat: 39.775, lng: 66.672 },
  ];

    // Define the bounds for Turkmenistan
    const turkmenistanBounds = new props.google.maps.LatLngBounds();
    turkmenistanCoords.forEach((coord) => {
      turkmenistanBounds.extend(coord);
    });

    // Set the restriction for the map to Turkmenistan bounds
    const restrictToTurkmenistan = {
      strictBounds: true,
      restriction: {
        latLngBounds: turkmenistanBounds
      },
    };

    const mapStyle = [
      {
        featureType: 'administrative.country',
        elementType: 'geometry',
        stylers: [{ visibility: 'off' }],
      },
    ];


    const onMarkerClick = (props: any, marker:any, e:any) => {
      setMarkerCfg({selectedPlace: props, activeMarker: marker, showInfoWindow: true})
    }
    const onMapClick = (props:any, map:any, event:any) => {
      if(markerCfg.showInfoWindow)
        setMarkerCfg(prev => ({...prev, showInfoWindow: false, activeMarker: null}))
    }

    const handleMapReady = (mapProps, map) => {
      mapRef.current = map;
      mapRef.current.addListener('click', onMapClick);
    };

  return (
    <div className={styles.map__container}>

      <Map
        onReady={handleMapReady}
        google={props.google}
        zoom={15}
        style={{
          width: 'auto',
          height: '825px',
          borderRadius: '15px'
        }}
        styles={mapStyle}
        restriction={restrictToTurkmenistan}
        initialCenter={coords}
        containerStyle={{
          position: 'relative',
          width: '100%',
          height: '100%'
        }}
        
      >
       <Polygon
          paths={turkmenistanCoords}
          strokeColor="#FF0000"
          strokeOpacity={0.8}
          strokeWeight={5}
          fillColor="transparent"
          fillOpacity={0.35}
      />
        <Marker position={coords} name={'Current location'} onClick={onMarkerClick}/>
          <InfoWindow
            google={props.google}
            map={props.google.maps}
            marker={markerCfg.activeMarker}
            visible={markerCfg.showInfoWindow}
          >
            <h1>{markerCfg.selectedPlace.name}</h1>
          </InfoWindow>
      </Map>
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: import.meta.env.VITE_API_MAP_API_KEY
})(MapComponent);