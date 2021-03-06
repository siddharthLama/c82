import React, { Component } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  TouchableHighlight,
  Alert,
  Image,
} from "react-native";
import db from "../config";
import firebase from "firebase";
import { RFValue } from "react-native-responsive-fontsize";
import { SearchBar, ListItem, Input } from "react-native-elements";

import MyHeader from "../components/MyHeader";
import { BookSearch } from "react-native-google-books";

export default class ExchangeScreen extends Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      ItemName: "",
      reasonToRequest: "",
      IsItemRequestActive: "",
      requestedItemName: "",
      ItemStatus: "",
      requestId: "",
      userDocId: "",
      docId: "",
      Imagelink: "#",
      dataSource: "",
      requestedImageLink: "",
      showFlatlist: false,
    };
  }

  createUniqueId() {
    return Math.random().toString(36).substring(7);
  }

  addRequest = async (ItemName, reasonToRequest) => {
    var userId = this.state.userId;
    var randomRequestId = this.createUniqueId();
    var items =  ItemName
     
    


    db.collection("requested_item").add({
      user_id: userId,
     item_name: itemName,
      reason_to_request: reasonToRequest,
      request_id: randomRequestId,
      item_status: "requested",
      date: firebase.firestore.FieldValue.serverTimestamp(),
      
    });

   await this.getItemRequest();
    db.collection("users")
      .where("email_id", "==", userId)
      .get()
      
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection("users").doc(doc.id).update({
            IsItemRequestActive: true,
          });
        });
      });

    this.setState({
      itemName: "",
      reasonToRequest: "",
      requestId: randomRequestId,
    });

    return alert("Item Requested Successfully");
  };

  receivedItems = (itemName) => {
    var userId = this.state.userId;
    var requestId = this.state.requestId;
    db.collection("received_items").add({
      user_id: userId,
      item_name: itemName,
      request_id: requestId,
      itemStatus: "received",
    });
  };

  getIsItemRequestActive() {
    db.collection("users")
      .where("email_id", "==", this.state.userId)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.setState({
            IsItemRequestActive: doc.data().IsItemRequestActive,
            userDocId: doc.id,
          });
        });
      });
  }

  getItemRequest = () => {
    // getting the requested item
    var itemRequest = db
      .collection("requested_items")
      .where("user_id", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().item_status !== "received") {
            this.setState({
              requestId: doc.data().request_id,
              requestedItemName: doc.data().item_name,
              itemStatus: doc.data().item_status,
              requestedImageLink: doc.data().image_link,
              docId: doc.id,
            });
          }
        });
      });
  };

  sendNotification = () => {
    //to get the first name and last name
    db.collection("users")
      .where("email_id", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var name = doc.data().first_name;
          var lastName = doc.data().last_name;

          // to get the donor id and item nam
          db.collection("all_notifications")
            .where("request_id", "==", this.state.requestId)
            .get()
            .then((snapshot) => {
              snapshot.forEach((doc) => {
                var donorId = doc.data().donor_id;
                var itemName = doc.data().item_name;

                //targert user id is the donor id to send notification to the user
                db.collection("all_notifications").add({
                  targeted_user_id: donorId,
                  message:
                    name + " " + lastName + " received the item " + itemName,
                  notification_status: "unread",
                  item_name: itemName,
                });
              });
            });
        });
      });
  };

  componentDidMount() {
    this.getItemRequest();
    this.getIsItemRequestActive();
  }

  updateItemRequestStatus = () => {
    //updating the Item status after receiving the item
    db.collection("requested_items").doc(this.state.docId).update({
      item_status: "received",
    });

    //getting the  doc id to update the users doc
    db.collection("users")
      .where("email_id", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          //updating the doc
          db.collection("users").doc(doc.id).update({
            IsItemRequestActive: false,
          });
        });
      });
  };

  async getItemsFromApi(itemName) {
    this.setState({ itemName: itemName });
    if (itemName.length > 2) {
      var items = await itemSearch.searchitem(
        itemName,
        "AIzaSyASyOjOtJla-X-b3io2eLoaUc_bIRFSIIc"
      );
      this.setState({
        dataSource: items.data,
        showFlatlist: true,
      });
    }
  }

  //render Items  functionto render the items from api
  renderItem = ({ item, i }) => {


    let obj = {
      title: item.volumeInfo.title,
      selfLink: item.selfLink,
      buyLink: item.saleInfo.buyLink,
      imageLink: item.volumeInfo.imageLinks,
    };

    return (
      <TouchableHighlight
        style={styles.touchableopacity}
        activeOpacity={0.6}
        underlayColor="#DDDDDD"
        onPress={() => {
          this.setState({
            showFlatlist: false,
            itemName: item.volumeInfo.title,
          });
        }}
        bottomDivider
      >
        <Text> {item.volumeInfo.title} </Text>
      </TouchableHighlight>
    );
  };

  render() {
    if (this.state.IsItemRequestActive === true) {
      return (
        <View style={{ flex: 1}}>
          <View
            style={{
              flex: 0.1,
            }}
          >
            <MyHeader title="Item Status" navigation={this.props.navigation} />
          </View>
          <View
            style={styles.ImageView}
          >
            <Image
              source={{ uri: this.state.requestedImageLink }}
              style={styles.imageStyle}
            />
          </View>
          <View
            style={styles.itemstatus}
          >
            <Text
              style={{
                fontSize: RFValue(20),

              }}
            >
              Name of the item
            </Text>
            <Text
              style={styles.requesteditemName}
            >
              {this.state.requestedItemName}
            </Text>
            <Text
              style={styles.status}
            >
              Status
            </Text>
            <Text
              style={styles.itemStatus}
            >
              {this.state.itemStatus}
            </Text>
          </View>
          <View
            style={styles.buttonView}
          >
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.sendNotification();
                this.updateItemRequestStatus();
                this.receivedItems(this.state.requestedItemName);
              }}
            >
              <Text
                style={styles.buttontxt}
              >
                Item Recived
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 0.1 }}>
          <MyHeader title="Request Item" navigation={this.props.navigation} />
        </View>
        <View style={{ flex: 0.9 }}>
          <Input
            style={styles.formTextInput}
            label={"Item Name"}
            placeholder={"Item name"}
            containerStyle={{ marginTop: RFValue(60) }}
            onChangeText={(text) => this.getItemsFromApi(text)}
            onClear={(text) => this.getItemsFromApi("")}
            value={this.state.itemName}
          />
          {this.state.showFlatlist ? (
            <FlatList
              data={this.state.dataSource}
              renderItem={this.renderItem}
              enableEmptySections={true}
              style={{ marginTop: RFValue(10) }}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : (
            <View style={{ alignItems: "center" }}>
              <Input
                style={styles.formTextInput}
                containerStyle={{ marginTop: RFValue(30) }}
                multiline
                numberOfLines={8}
                label={"Reason"}
                placeholder={"Why do you need the item"}
                onChangeText={(text) => {
                  this.setState({
                    reasonToRequest: text,
                  });
                }}
                value={this.state.reasonToRequest}
              />
              <TouchableOpacity
                style={[styles.button, { marginTop: RFValue(30) }]}
                onPress={() => {
                  this.addRequest(
                    this.state.itemName,
                    this.state.reasonToRequest
                  );
                }}
              >
                <Text
                  style={styles.requestbuttontxt}
                >
                  Request
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  
  formTextInput: {
    width: "75%",
    height: RFValue(35),
    borderWidth: 1,
    padding: 10,
  },
  ImageView:{
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
    marginTop:20
  },
  imageStyle:{
    height: RFValue(150),
    width: RFValue(150),
    alignSelf: "center",
    borderWidth: 5,
    borderRadius: RFValue(10),
  },
  itemstatus:{
    flex: 0.4,
    alignItems: "center",

  },
  requesteditemName:{
    fontSize: RFValue(30),
    fontWeight: "500",
    padding: RFValue(10),
   
    alignItems:'center',
    marginLeft:RFValue(60)
  },
  status:{
    fontSize: RFValue(20),
    marginTop: RFValue(30),
  },
  itemStatus:{
    fontSize: RFValue(30),
    fontWeight: "bold",
    marginTop: RFValue(10),
  },
  buttonView:{
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center",
  },
  buttontxt:{
    fontSize: RFValue(18),
    fontWeight: "bold",
    color: "#fff",
  },
  touchableopacity:{
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    width: "90%",
  },
  requestbuttontxt:{
    fontSize: RFValue(20),
    fontWeight: "bold",
    color: "#fff",
  },
  button: {
    width: "75%",
    height: RFValue(60),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RFValue(50),
    backgroundColor: "#32867d",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
});