import * as React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import useSWR from "swr";
import type * as Location from "expo-location";
import { stringify } from "qs";

import StoreCard from "./StoreCard";

function fetcher(url: string) {
  return fetch(url).then((res) => res.json());
}

type StoreListTypes = {
  location: Location.LocationObject;
  refreshLocation: boolean;
  setRefreshLocation: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function StoresList({
  location,
  refreshLocation,
  setRefreshLocation,
}: StoreListTypes) {
  const {
    data: { data: responseStores },
    mutate,
  } = useSWR(
    `https://tambo.cristianbgp.com/api/nearest?${stringify({
      currentLatitude: location.coords.latitude,
      currentLongitude: location.coords.longitude,
    })}`,
    fetcher,
    { suspense: true }
  );

  function onRefresh() {
    setRefreshLocation(true);
    mutate();
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={responseStores}
        renderItem={({ item: store, index }) => {
          const isFirst = index === 0;
          return (
            <View style={styles.cardExtraContainer}>
              <StoreCard key={store.id} store={store} isFirst={isFirst} />
            </View>
          );
        }}
        keyExtractor={(item) => item.id}
        onRefresh={onRefresh}
        refreshing={refreshLocation}
        contentContainerStyle={{ paddingTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  cardExtraContainer: {
    alignItems: "center",
  },
});
