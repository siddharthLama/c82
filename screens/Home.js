import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { ListItem } from "react-native-elements";
import firebase from "firebase";
import db from "../config";
import MyHeader from "../components/MyHeader";

export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      requestedItemsList: [],
    };
    this.requestRef = null;
  }

  getRequestedItemsList = () => {
    this.requestRef = db
      .collection("requested_items")
      .onSnapshot((snapshot) => {
        var requestedItemsList = snapshot.docs.map((doc) => doc.data());
        this.setState({
          requestedItemsList: requestedItemsList,
        });
      });
  };

  componentDidMount() {
   this.getRequestedItemsList();
  }

  componentWillUnmount() {
  this.requestRef();
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, index }) => {
    console.log(item)
    return (
      <ListItem key={index} bottomDivider>
        <ListItem.Content>
          <ListItem.Title>{item.item_name}</ListItem.Title>
          <ListItem.Subtitle>{item.reason_to_request}</ListItem.Subtitle>
          <TouchableOpacity style={styles.button} onPress = {() => {this.props.navigation.navigate("RecieverDetails", {"details": item})}}>
            <Text style={{ color: "#FFFFFF" }}>View</Text>
          </TouchableOpacity>
        </ListItem.Content>
      </ListItem>
    );
  };

  render() {
    return (
      <View style={styles.view}>
        <MyHeader title="Donate Items" navigation={this.props.navigation} />
        <View style={{ flex: 1 }}>
          {this.state.requestedItemsList.length === 0 ? (
            <View style={styles.subContainer}>
              <Text style={{ fontSize: 20 }}>List Of All Requested Items</Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.requestedItemsList}
              renderItem={this.renderItem}
            />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  subContainer: {
    flex: 1,
    fontSize: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 100,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#32867d",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
  },
  view:{
    flex: 1,
    backgroundColor: "#fff"
  }
});