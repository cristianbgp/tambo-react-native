import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";

import { MapPinIcon } from "./Icons";

type Coords = {
  latitude: string;
  longitude: string;
};

type StoreType = {
  address: string;
  coords: Coords;
  distance: number;
  gmapLink: number;
  id: string;
  name: string;
};

type StoreCardTypes = {
  store: StoreType;
  isFirst: boolean;
};

export default function StoreCard({ store, isFirst }: StoreCardTypes) {
  function handleOnPress() {
    Linking.openURL(
      `https://maps.google.com/?q=${store.coords.latitude},${store.coords.longitude}`
    );
  }

  return (
    <TouchableOpacity
      onPress={handleOnPress}
      style={[styles.container, isFirst && { marginTop: 10 }]}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={styles.title}>{store.name}</Text>
      </View>
      <View style={styles.divider} />
      <Text style={styles.distance}>
        {store.distance < 1000
          ? `${Math.floor(store.distance)}m`
          : `${(store.distance / 1000).toFixed(2)}km`}
      </Text>
      <Text style={styles.address}>{store.address.toLowerCase()}</Text>
      <View style={styles.iconsSection}>
        <View style={styles.iconContainer}>
          <MapPinIcon />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    //shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 5,
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: "#efefef",
    marginBottom: 5,
  },
  distance: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 5,
    textTransform: "capitalize",
  },
  address: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 5,
    textTransform: "capitalize",
  },
  iconsSection: {
    flexDirection: "row",
    justifyContent: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
