import React from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Picker,
  Platform,
  ActivityIndicator,
} from "react-native";
import Constants from "expo-constants";
import * as Location from "expo-location";
import StoresList from "./components/store-list";
const statusBarHeight = Constants.statusBarHeight;

function Loader() {
  return (
    <View style={styles.loader}>
      <ActivityIndicator size="large" color="#000" />
    </View>
  );
}

export default function App() {
  const [selectedFilter, setSelectedFilter] = React.useState("");
  const [location, setLocation] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState(null);
  const [refreshLocation, setRefreshLocation] = React.useState(true);

  React.useEffect(() => {
    async function getLocation() {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setRefreshLocation(false);
    }
    if (refreshLocation) {
      getLocation();
    }
  }, [refreshLocation, setRefreshLocation]);

  function filterBy(store) {
    if (selectedFilter !== "") {
      return store[selectedFilter];
    } else {
      return true;
    }
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        Platform.OS === "android" && { marginTop: statusBarHeight },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: "#a74a93" }]}>Tambo+</Text>
        <Text style={styles.title}>cerca</Text>
      </View>
      {location ? (
        <>
          <View style={styles.filter}>
            <Text style={styles.subTitle}>Filter by:</Text>
            <Picker
              selectedValue={selectedFilter}
              style={styles.picker}
              itemStyle={styles.pickerItem}
              onValueChange={(itemValue) => setSelectedFilter(itemValue)}
            >
              <Picker.Item label="None" value="" />
              <Picker.Item label="24 hours" value="allday" />
              <Picker.Item label="ATM" value="atm" />
            </Picker>
          </View>
          <React.Suspense fallback={<Loader />}>
            <StoresList
              location={location}
              filterBy={filterBy}
              refreshLocation={refreshLocation}
              setRefreshLocation={setRefreshLocation}
            />
          </React.Suspense>
        </>
      ) : (
        <Loader />
      )}
      {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
    </SafeAreaView>
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
  filter: {
    alignItems: "center",
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "500",
  },
  picker: {
    width: 200,
    height: Platform.OS === "ios" ? 88 : 44,
  },
  pickerItem: {
    height: Platform.OS === "ios" ? 88 : 44,
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
