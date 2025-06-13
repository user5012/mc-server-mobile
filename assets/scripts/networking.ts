import * as Network from 'expo-network';

export const IpAddress = Network.getIpAddressAsync().then(ipAddress => {
  console.log("Device IP Address: ", ipAddress);
  return ipAddress;
});
