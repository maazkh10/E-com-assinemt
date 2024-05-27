import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Button,
  Alert,
} from "react-native";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../features/cartSlice";
import { RootState } from "../store"; // Assuming you have RootState type defined

export interface Product {
  id: number;
  title: string;
  price: number;
  images: string[];
}

interface ProductListingScreenProps {
  searchResults: Product[];
}

const ProductListingScreen: React.FC<ProductListingScreenProps> = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const searchResults = useSelector(
    (state: RootState) => state.search.searchResults
  );
  const selectedCategory = useSelector(
    (state: RootState) => state.filter.selectedCategory
  );

  useEffect(() => {
    console.log("🚀 ~ searchResults:", searchResults);

    if (searchResults && searchResults.length > 0) {
      setProducts(searchResults);
      setLoading(false);
    } else {
      axios
        .get<Product[]>(
          `https://api.escuelajs.co/api/v1/products/${
            selectedCategory ? `?categoryId=${selectedCategory.id}` : ""
          }`
        )
        .then((response) => {
          setProducts(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    }
  }, [selectedCategory, searchResults]);

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product));
    Alert.alert(
      "Added to Cart",
      `${product.title} has been added to your cart.`
    );
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productContainer}>
      <Image
        source={{ uri: item.images[0] }}
        style={styles.productImage}
        onError={(e: any) => {
          e.target.src = "https://via.placeholder.com/200";
        }}
      />
      <Text style={styles.productName}>{item.title}</Text>
      <Text style={styles.productPrice}>${item.price}</Text>
      <Button title="Add to Cart" onPress={() => handleAddToCart(item)} />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderProduct}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 16,
  },
  productContainer: {
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2,
    padding: 8,
  },
  productImage: {
    width: "100%",
    height: 200,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
  },
  productPrice: {
    fontSize: 16,
    color: "#888",
    marginBottom: 8,
  },
});

export default ProductListingScreen;
