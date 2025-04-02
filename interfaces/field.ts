export interface Field {
    id: number,
    name: string,
    crop: string,
    hybrid: string,
    sowingDate: string,
    area: number,
    soilType: string,
    tillageType: string,
    manager: string,
    coordinates: Coordinate[],
    markers: Marker[],
};

export interface Marker {
    id: number,
    name: string,
    description: string,
    imageURL: string,
    coordinate: Coordinate,
}

export interface Coordinate {
    latitude: number,
    longitude: number
}