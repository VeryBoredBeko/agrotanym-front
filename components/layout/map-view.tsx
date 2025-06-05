"use client";
// This component is a client-side, because Leaflet map drawing only works in client-components

import { useState, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  useMapEvents,
  Popup,
  Marker,
} from "react-leaflet";
import L, { Icon, LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";

import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";

import { Field, Coordinate } from "@/interfaces/field";
import { Marker as marker } from "@/interfaces/field";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CreateMarkerModal } from "./create-marker-modal";

// This component asks for list of fields, to draw it on map and the selected field to highlight it
type MapViewProps = {
  fields: Field[];
  selectedField?: Field;
};

// This function is used when showing the list of marker's icon
const createImageIcon = (url: string) =>
  new Icon({
    iconUrl: url,
    iconSize: [30, 30],
    className: "rounded",
  });

// Client-side validated form schema for creating a new polygon and uploading it
const polygonformSchema = z.object({
  name: z.string().min(8).max(255),
  crop: z.string().min(2).max(255),
  // hybrid: z.string().min(0).max(255).nullable(),
  // sowingDate: z.string().min(0).max(8).nullable(),
  // soilType: z.string().min(0).max(255).nullable(),
  // tillageType: z.string().min(0).max(255).nullable(),
  manager: z.string().min(8).max(255),
});

// Client-side validated form schema for creating a new marker and uploading it
const markerformSchema = z.object({
  name: z.string().min(8).max(255),
  description: z.string().min(2).max(255),
  imageURL: z.string().min(8).max(255),
});

const MapView: React.FC<MapViewProps> = ({ fields, selectedField }) => {
  /**
   * Describes position where user had clicked in [latitude, longitude] format
   */ 
  const [position, setPosition] = useState<[number, number] | null>(null);

  const [map, setMap] = useState<L.Map | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);

  const [features, setFeatures] = useState<any[]>([]);

  const [userCreatedElems, setUserCreatedElems] = useState<
    Field | marker[] | null
  >(null);

  const [userCreatedPolygon, SetUserCreatedPolygon] = useState<Field>();

  const [userCreatedPolygonCoordinates, setUserCreatedPolygonCoordinates] =
    useState<Coordinate[]>([]);
  const [isPolygonModalOpen, setPolygonModalOpen] = useState<boolean>(false);

  const [userCreatedMarkerCoordinates, setUserCreatedMarkerCoordinates] =
    useState<Coordinate>();
  const [isMarkerModalOpen, setMarkerModalOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof polygonformSchema>>({
    resolver: zodResolver(polygonformSchema),
    defaultValues: {
      name: "",
      crop: "",
      // hybrid: "",
      // sowingDate: "",
      // soilType: "",
      // tillageType: "",
      manager: "",
    },
  });

  const markerForm = useForm<z.infer<typeof markerformSchema>>({
    resolver: zodResolver(markerformSchema),
    defaultValues: {
      name: "",
      description: "",
      imageURL: "",
    },
  });

  async function onSubmit(values: z.infer<typeof polygonformSchema>) {
    const userCreatedField: Field = {
      id: 0,
      name: values.name,
      crop: values.crop,
      hybrid: "",
      sowingDate: "",
      area: 0,
      soilType: "",
      tillageType: "",
      manager: values.manager,
      coordinates: userCreatedPolygonCoordinates,
      markers: [],
    };

    const result = await fetch("/api/farm/fields", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userCreatedField),
    });

    if (result.ok) {
      window.location.reload();
    }
  }

  async function onMarkerFormSubmit(values: z.infer<typeof markerformSchema>) {
    const userCreatedMarker: marker = {
      id: 0,
      name: values.name,
      description: values.description,
      imageURL: values.imageURL,
      coordinate: userCreatedMarkerCoordinates!,
    };

    const result = await fetch(
      `/api/farm/fields/${selectedField?.id}/markers`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userCreatedMarker),
      }
    );

    if (result.ok) {
      window.location.reload();
    }
  }

  useEffect(() => {
    if (!map) return;

    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    drawnItemsRef.current = drawnItems;

    const drawControl = new L.Control.Draw({
      edit: { featureGroup: drawnItems },
      draw: {
        polygon: {},
        polyline: false,
        rectangle: false,
        circle: false,
        marker: {},
        circlemarker: false,
      },
    });

    map.addControl(drawControl);

    map.on("draw:created", (event) => {
      const createdEvent = event as L.DrawEvents.Created;
      const layer = createdEvent.layer;

      if (layer instanceof L.Polygon) {
        const polygonCoordinates: Coordinate[] =
          convertPolygonToCoordinates(layer);
        setUserCreatedPolygonCoordinates(polygonCoordinates);

        drawnItems.addLayer(layer);

        setPolygonModalOpen(true);
      } else if (layer instanceof L.Marker) {
        const markerCoordinates: Coordinate = convertMarkerToCoordinate(layer);
        setUserCreatedMarkerCoordinates(markerCoordinates);

        drawnItems.addLayer(layer);

        setMarkerModalOpen(true);
      } else {
        return;
      }
    });

    map.on("draw:deleted", (event) => {
      setUserCreatedElems(null);
      setFeatures([]);
    });

    return () => {
      map.off("draw:created");
      map.off("draw:deleted");
    };
  }, [map]);

  function LocationMarker() {
    const [position, setPosition] = useState<LatLng | null>(null);
    const map = useMapEvents({
      click() {
        map.locate();
      },
      locationfound(e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      },
    });

    return position === null ? null : (
      <Marker position={position}>
        <Popup>Сіз осындасыз!</Popup>
      </Marker>
    );
  }

  const ClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
      },
    });

    return position === null ? null : (
      <Popup position={position}>
        <div className="text-xs text-gray-700 leading-tight space-x-2">
          <span className="font-medium">Координаталар:</span>
          <span>X: {position[0].toFixed(6)}</span>
          <span>Y: {position[1].toFixed(6)}</span>
        </div>
      </Popup>
    );
  };

  const [imageUploadOption, setImageUploadOption] = useState(false);

  return (
    <div className="grid grid-row gap-4">
      <div className="flex grow h-120 w-128 shadow-xl z-0">
        <MapContainer
          center={[50.2839, 57.166]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          ref={setMap}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* <LocationMarker /> */}

          <ClickHandler />

          {fields &&
            fields.map((field, idx) => {
              const positions = field.coordinates.map((coord) => ({
                lat: coord.latitude,
                lng: coord.longitude,
              }));

              if (field.id === selectedField?.id) {
                return (
                  <Polygon
                    key={`polygon-${idx}`}
                    positions={positions}
                    pathOptions={{
                      color: "yellow",
                      fillOpacity: 0.4,
                    }}
                  >
                    <Popup>
                      <strong>{field.name}</strong>
                      <br />
                      {field.crop}
                    </Popup>

                    {selectedField.markers &&
                      selectedField.markers.map((marker, idy) => {
                        return (
                          <Marker
                            key={`marker-${idy}`}
                            position={[
                              marker.coordinate.latitude,
                              marker.coordinate.longitude,
                            ]}
                            icon={createImageIcon(marker.imageURL)}
                          >
                            <Popup autoPan={false} closeOnClick={false}>
                              <strong>{field.name}</strong>
                              <br />
                              {marker.name}
                              <br />
                              {marker.description}
                            </Popup>
                          </Marker>
                        );
                      })}
                  </Polygon>
                );
              }

              return (
                <Polygon
                  key={`polygon-${idx}`}
                  positions={positions}
                  pathOptions={{
                    color: "green",
                    fillOpacity: 0.4,
                  }}
                >
                  <Popup>
                    <strong>{field.name}</strong>
                    <br />
                    {field.crop}
                  </Popup>
                </Polygon>
              );
            })}
        </MapContainer>
      </div>

      <section>
        <Dialog open={isPolygonModalOpen} onOpenChange={setPolygonModalOpen}>
          <DialogContent className="flex flex-col">
            <DialogHeader>
              <DialogTitle>Егістік алқабын енгізу</DialogTitle>
              <DialogDescription>
                Егістік алқабының деректері:
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Алқап атауы</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Алқап #1 - Украинка ауданы"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Бұл Сіздің егістік алқабыңыздың атауы.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="crop"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Дақыл түрі</FormLabel>
                      <FormControl>
                        <Input placeholder="Қызанақ" {...field} />
                      </FormControl>
                      <FormDescription>
                        Егістік алқабында өсетін дақыл атауы.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="manager"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Басқарушы атауы</FormLabel>
                      <FormControl>
                        <Input placeholder="Өтемісов Асқар" {...field} />
                      </FormControl>
                      <FormDescription>
                        Егістікті бақылаушының есімі
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Қабылдау</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </section>

      <section>
        <CreateMarkerModal
          isMarkerModalOpen={isMarkerModalOpen}
          setMarkerModalOpen={setMarkerModalOpen}
          selectedFieldId={selectedField?.id}
          userCreatedMarkerCoordinates={userCreatedMarkerCoordinates}
        />
      </section>
    </div>
  );
};

export default MapView;

// This function converts GeoJSON values into array of Coordinate,
// to upload it to backend
const convertPolygonToCoordinates = (polygon: L.Polygon): Coordinate[] => {
  const geoJSON = polygon.toGeoJSON() as GeoJSON.Feature<GeoJSON.Polygon>;

  return geoJSON.geometry.coordinates[0].map(([lng, lat]) => ({
    latitude: lat,
    longitude: lng,
  }));
};

// This function converts GeoJSON values into object of Coordinate,
// to upload it to backend
const convertMarkerToCoordinate = (marker: L.Marker): Coordinate => {
  const geoJSON = marker.toGeoJSON() as GeoJSON.Feature<GeoJSON.Point>;

  const coordinates = geoJSON.geometry.coordinates;
  const [lng, lat] = coordinates;

  return { latitude: lat, longitude: lng };
};
