import { Tabs, router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from "react-native";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";
import ReactNativeModal from "react-native-modal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { setFilter } from "../features/filterSlice";
import { Product } from ".";
import { setSearchResults } from "../features/searchSlice";
import LoginScreen from "../screens/login";

export interface Category {
  id: number;
  name: string;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  const [isAuthorizedUser, setIsAuthorizedUser] = useState<boolean>(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleIsAuthorized = () => {
    const isAuthorized = useSelector(
      (state: RootState) => state.auth.isAuthorized
    );
    setIsAuthorizedUser(isAuthorized);
  };
  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "https://api.escuelajs.co/api/v1/categories"
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://api.escuelajs.co/api/v1/products/?title=${searchQuery}`
      );

      dispatch(setSearchResults(response.data));
      console.log("🚀 ~ handleSearch ~ response.data:", response.data);

      setIsSearchDrawerOpen(false);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };
  const selectedCategory = useSelector(
    (state: RootState) => state.filter.selectedCategory
  );
  const dispatch = useDispatch();

  // Modify handleFilterByCategory to dispatch setFilter action
  const handleFilterByCategory = (category: Category) => {
    dispatch(setFilter(category));
    setIsFilterDrawerOpen(false); // Close filter drawer
  };

  useEffect(() => {
    fetchCategories();
  }, [isAuthorizedUser]);

  return (
    <>
      {isAuthorizedUser ? (
        <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
          <ReactNativeModal
            isVisible={isFilterDrawerOpen}
            animationIn="slideInLeft"
            animationOut="slideOutLeft"
            onBackdropPress={() => setIsFilterDrawerOpen(false)}
          >
            <View style={styles.modalContainer}>
              <FlatList
                data={categories}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) =>
                  item.name === "Testing Category" ? null : (
                    <TouchableOpacity
                      style={styles.categoryItem}
                      onPress={() => handleFilterByCategory(item)}
                    >
                      <Text>{item.name}</Text>
                      {selectedCategory && selectedCategory.id === item.id && (
                        <MaterialIcons name="check" size={24} color="green" />
                      )}
                    </TouchableOpacity>
                  )
                }
              />
            </View>
          </ReactNativeModal>
          <ReactNativeModal
            isVisible={isSearchDrawerOpen}
            animationIn="slideInDown"
            animationOut="slideOutUp"
            onBackdropPress={() => setIsSearchDrawerOpen(false)}
          >
            <View style={styles.searchModalContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search for products..."
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
                onSubmitEditing={handleSearch}
              />
            </View>
          </ReactNativeModal>
          <Tabs
            screenOptions={{
              tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
              headerShown: true,
              header: ({ route }) => {
                return (
                  <View style={styles.headerContainer}>
                    {route.name !== "cart" ? (
                      <>
                        <TouchableOpacity
                          onPress={() => setIsFilterDrawerOpen(true)}
                        >
                          <MaterialIcons
                            name="filter-list"
                            size={24}
                            color="black"
                            style={{ marginLeft: 10 }}
                          />
                        </TouchableOpacity>
                        <Text
                          style={[
                            styles.headerTitle,
                            { textAlign: "center", flex: 1, paddingRight: 25 },
                          ]}
                        >
                          {"ECOM"}
                        </Text>
                        <TouchableOpacity
                          onPress={() => setIsSearchDrawerOpen(true)}
                        >
                          <MaterialIcons
                            name="search"
                            size={24}
                            color="black"
                            style={{ marginRight: 10 }}
                          />
                        </TouchableOpacity>
                      </>
                    ) : (
                      <Text
                        style={[
                          styles.headerTitle,
                          { textAlign: "center", flex: 1 },
                        ]}
                      >
                        Your Cart
                      </Text>
                    )}
                  </View>
                );
              },
            }}
          >
            <Tabs.Screen
              name="index"
              options={{
                title: "Products",
                tabBarIcon: ({ color, focused }) => (
                  <TabBarIcon
                    name={focused ? "grid" : "grid-outline"}
                    color={color}
                  />
                ),
              }}
            />

            <Tabs.Screen
              name="home"
              options={{
                title: "Home",
                tabBarIcon: ({ color, focused }) => (
                  <TabBarIcon
                    name={focused ? "home" : "home-outline"}
                    color={color}
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="cart"
              options={{
                title: "Cart",
                tabBarIcon: ({ color, focused }) => (
                  <TabBarIcon
                    name={focused ? "cart" : "cart-outline"}
                    color={color}
                  />
                ),
              }}
            />
          </Tabs>
        </SafeAreaView>
      ) : (
        <LoginScreen setIsAuthorizedUser={setIsAuthorizedUser} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
    backgroundColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 8,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 20,
  },
  searchModalContainer: {
    backgroundColor: "#fff",
    borderRadius: 5,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  searchResultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  categoryItem: {
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
