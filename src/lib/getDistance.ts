const rad = function (x: number) {
  return (x * Math.PI) / 180;
};

export interface LatLng {
  lat: number;
  lng: number;
}

export const getDistance = function (from: LatLng, to: LatLng): number {
  var R = 6378137; // Earth’s mean radius in meter
  var dLat = rad(to.lat - from.lat);
  var dLong = rad(to.lng - from.lng);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(from.lat)) *
      Math.cos(rad(to.lat)) *
      Math.sin(dLong / 2) *
      Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d; // returns the distance in meter
};
