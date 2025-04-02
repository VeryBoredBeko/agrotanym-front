"use client";

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

import { Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import CommentMenu from "./comment-menu";
import MarkerMenu from "./marker-menu";

type MapViewProps = {
  fields: Field[];
  selectedField?: Field;
};

const createImageIcon = (url: string) =>
  new Icon({
    iconUrl: url,
    iconSize: [30, 30],
    className: "rounded",
  });

const polygonformSchema = z.object({
  name: z.string().min(8).max(255),
  crop: z.string().min(2).max(255),
  // hybrid: z.string().min(0).max(255).nullable(),
  // sowingDate: z.string().min(0).max(8).nullable(),
  // soilType: z.string().min(0).max(255).nullable(),
  // tillageType: z.string().min(0).max(255).nullable(),
  manager: z.string().min(8).max(255),
});

const markerformSchema = z.object({
  name: z.string().min(8).max(255),
  description: z.string().min(2).max(255),
  imageURL: z.string().min(8).max(255),
});

const MapView: React.FC<MapViewProps> = ({ fields, selectedField }) => {
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
        <div>
          <p>Координаталар:</p>
          <p>X: {position[0].toFixed(6)}</p>
          <p>Y: {position[1].toFixed(6)}</p>
        </div>
      </Popup>
    );
  };

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

          {/* <ClickHandler /> */}

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
        <Dialog open={isMarkerModalOpen} onOpenChange={setMarkerModalOpen}>
          <DialogContent className="flex flex-col">
            <DialogHeader>
              <DialogTitle>Егістік алқабына маркерді енгізу</DialogTitle>
              <DialogDescription>Маркер жайында деректер</DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={markerForm.handleSubmit(onMarkerFormSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={markerForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Маркер атауы</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ауруға шалдыққан өсімдік анықталды"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Маркерді қоюдың себебін атаңыз.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={markerForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Маркердің анықтамасы</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Қызанақ ауруға шалдыққан"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Маркердің анықтамасын енгізіңіз.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={markerForm.control}
                  name="imageURL"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Маркер суреті</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Маркер суретіне сілтеме"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Маркердің картада белгіленетін суретін таңдаңыз
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

      {selectedField && selectedField.markers && (
        <section className="overflow-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border border-gray-300">ID</th>
                <th className="p-2 border border-gray-300">Атауы</th>
                <th className="p-2 border border-gray-300">Анықтама</th>
                <th className="p-2 border border-gray-300">Маркер суреті</th>
              </tr>
            </thead>
            <tbody>
              {selectedField.markers.map((marker, idy) => (
                <tr key={idy} className="odd:bg-white even:bg-gray-50">
                  <td className="p-2 border border-gray-300">{marker.id}</td>
                  <td className="p-2 border border-gray-300">{marker.name}</td>
                  <td className="p-2 border border-gray-300">
                    {marker.description}
                  </td>
                  <td className="p-2 border border-gray-300">
                    <img
                      src={marker.imageURL}
                      alt={marker.name}
                      className="h-10 w-10 object-cover rounded"
                    />
                  </td>
                  <td className="p-2 border border-gray-300">
                    <MarkerMenu fieldId={selectedField.id!} markerId={marker.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
};

export default MapView;

const convertPolygonToCoordinates = (polygon: L.Polygon): Coordinate[] => {
  const geoJSON = polygon.toGeoJSON() as GeoJSON.Feature<GeoJSON.Polygon>;

  return geoJSON.geometry.coordinates[0].map(([lng, lat]) => ({
    latitude: lat,
    longitude: lng,
  }));
};

const convertMarkerToCoordinate = (marker: L.Marker): Coordinate => {
  const geoJSON = marker.toGeoJSON() as GeoJSON.Feature<GeoJSON.Point>;

  const coordinates = geoJSON.geometry.coordinates;
  const [lng, lat] = coordinates;

  return { latitude: lat, longitude: lng };
};
