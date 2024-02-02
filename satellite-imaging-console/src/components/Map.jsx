import React, { useRef, useState } from "react";
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "./map.css";
import "leaflet-draw/dist/leaflet.draw.css";

const Map = () => {
  const [center, setCenter] = useState({ lat: 14, lng: 78 });
  const [mapLayers, setMapLayers] = useState([]);
  const ZOOM_LEVEL = 6;
  const mapRef = useRef();

  const _onCreate = (e) => {
    console.log(e);
    const { layerType, layer } = e;
    if (layerType === "polygon") {
      const { _leaflet_id } = layer;

      setMapLayers((layers) => [
        ...layers,
        { id: _leaflet_id, latlngs: layer.getLatLngs()[0] },
      ]);
    }
  };
  const _onEdit = (e) => {
    console.log(e);
    const {
      layers: { _layers },
    } = e;

    Object.values(_layers).map(({ _leaflet_id, editing }) => {
      setMapLayers((layers) =>
        layers.map((l) =>
          l.id === _leaflet_id
            ? { ...l, latlngs: { ...editing.latlngs[0] } }
            : l
        )
      );
    });
  };
  const _onDelete = (e) => {
    console.log(e);
    const {
      layers: { _layers },
    } = e;

    Object.values(_layers).map(({ _leaflet_id }) => {
      setMapLayers((layers) => layers.filter((l) => l.id !== _leaflet_id));
    });
  };

  return (
    <>
      <div className="map-container">
        <MapContainer
          style={{ height: "80vh", width: "100%" }}
          center={center}
          zoom={ZOOM_LEVEL}
          ref={mapRef}
        >
          <FeatureGroup>
            <EditControl
              position="topright"
              onCreated={_onCreate}
              onEdited={_onEdit}
              onDeleted={_onDelete}
              draw={{
                rectangle: false,
                marker: false,
                polyline: false,
                circle: false,
                circlemarker: false,
              }}
            />
          </FeatureGroup>
          <TileLayer
            url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=PmlK6dPCAwu0d4Q6KjAt"
            attribution="https://api.maptiler.com/maps/basic-v2/256/tiles.json?key=PmlK6dPCAwu0d4Q6KjAt"
          />
        </MapContainer>
        <pre>{JSON.stringify(mapLayers, 0, 2)}</pre>
      </div>
    </>
  );
};

export default Map;
