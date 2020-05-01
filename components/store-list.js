import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import useSWR from "swr";
import StoreCard from "./store-card";

function fetcher(url) {
  return fetch(url).then((res) => res.json());
}

export default function StoresList({ location, filterBy }) {
  const {
    data: responseStores,
  } = useSWR(
    `https://tambo-api.herokuapp.com/nearest?currentLatitude=${location.coords.latitude}&currentLongitude=${location.coords.longitude}`,
    fetcher,
    { suspense: true }
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={responseStores.filter(filterBy)}
        renderItem={({ item: store, index }) => {
          const isFirst = index === 0;
          return (
            <View style={styles.cardExtraContainer}>
              <StoreCard key={store.id} store={store} isFirst={isFirst} />
            </View>
          );
        }}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardExtraContainer: {
    alignItems: "center",
  },
});
