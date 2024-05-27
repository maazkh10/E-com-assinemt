import React from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { MaterialIcons } from '@expo/vector-icons';
import { RootState } from "../store";
import { removeFromCart } from "../features/cartSlice";

const CartScreen: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

  const handleRemoveFromCart = (productId: number) => {
    dispatch(removeFromCart(productId));
  };

  const renderCartItem = ({ item }: { item: any }) => (
    <View style={styles.cartItemContainer}>
      <Image source={{ uri: item.images[0] }} style={styles.cartItemImage} />
      <View style={styles.cartItemDetails}>
        <Text style={styles.cartItemName}>{item.title}</Text>
        <Text style={styles.cartItemPrice}>${item.price}</Text>
      </View>
      <TouchableOpacity
        onPress={() => handleRemoveFromCart(item.id)}
        style={styles.removeButton}
      >
        <MaterialIcons name="cancel" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cart Items</Text>
      {cartItems.length === 0 ? (
        <Text style={styles.emptyText}>Your cart is empty.</Text>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCartItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
  listContainer: {
    paddingBottom: 16,
  },
  cartItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2,
  },
  cartItemImage: {
    width: 100,
    height: 100,
  },
  cartItemDetails: {
    flex: 1,
    padding: 8,
    justifyContent: "center",
  },
  cartItemName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cartItemPrice: {
    fontSize: 16,
    color: "#888",
  },
  removeButton: {
    padding: 8,
  },
});

export default CartScreen;
