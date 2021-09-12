import * as React from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import * as Location from "expo-location";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import StoresList from "../components/StoreList";

function Loader() {
  return (
    <View style={styles.loader}>
      <ActivityIndicator size="large" color="#000" />
    </View>
  );
}

export default function App() {
  const [location, setLocation] =
    React.useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [refreshLocation, setRefreshLocation] = React.useState(true);
  const insets = useSafeAreaInsets();

  React.useEffect(() => {
    async function getLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
      }

      const newLocation = await Location.getCurrentPositionAsync({});
      setLocation(newLocation);
      setRefreshLocation(false);
    }
    if (refreshLocation) {
      getLocation();
    }
  }, [refreshLocation, setRefreshLocation]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: "#a74a93" }]}>Tambo+</Text>
        <Text style={styles.title}>cerca</Text>
      </View>
      {location ? (
        <React.Suspense fallback={<Loader />}>
          <StoresList
            location={location}
            refreshLocation={refreshLocation}
            setRefreshLocation={setRefreshLocation}
          />
        </React.Suspense>
      ) : (
        <Loader />
      )}
      {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5df53",
    alignItems: "center",
  },
  header: {
    marginVertical: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
  },
  loader: {
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
  },
  error: {
    fontSize: 18,
    paddingHorizontal: 50,
    marginVertical: 20,
    color: "red",
  },
});
