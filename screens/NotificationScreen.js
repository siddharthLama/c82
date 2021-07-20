import React, { Component } from 'react';
import { StyleSheet, View, FlatList,Text,Image } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';

import MyHeader from '../components/MyHeader';
import SwipeableFlatlist from '../components/SwipeableFlatlist';
import db from '../config';
import firebase from 'firebase';
export default class NotificationScreen extends Component{
  constructor(props) {
    super(props)

    this.state = {
      userId :  firebase.auth().currentUser.email,
      allNotifications : []
    }

    this.notificationRef = null;
  }

 
  getNotifications = () => {
    this.notificationRef = db.collection("all_notifications")
      .where("notification_status", "==", "unread")
      .where("targeted_user_id", "==", this.state.userId)
      .onSnapshot(snapshot => {
        var allNotifications = [];
        snapshot.docs.map(doc => {
          var notification = doc.data();
          notification["doc_id"] = doc.id;
          allNotifications.push(notification);
        });
        this.setState({
          allNotifications: allNotifications
        });
      });
  }

  componentDidMount(){
    this.getNotifications();
  }


  componentWillUnmount() {
    this.notificationRef();
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({item,index}) =>{
    return (
      <ListItem
        key={index}
       
        bottomDivider> 
        <ListItem.Content>
        <ListItem.Title>
        {item.item_name}
        </ListItem.Title>
        <ListItem.Subtitle>
        {item.message}
        </ListItem.Subtitle>
       
        </ListItem.Content>
        </ListItem>
    
    )
}


  render(){
    return(
      <View style={styles.container}>
        <View style={{flex:0.13}}>
          <MyHeader title={"Notifications"} navigation={this.props.navigation}/>
        </View>
        <View style={{flex:0.8}}>
          {
            this.state.allNotifications.length === 0
            ?(
              <View style={styles.imageView}>
               
             
                <Text style={{fontSize:25}}>You have no notifications</Text>
              </View>
            )
            :(
              <SwipeableFlatlist allNotifications={this.state.allNotifications}/>
            )
          }
        </View>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container : {
    flex : 1,
    backgroundColor:'#deeeed'
  },
  imageView:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  LiTitle:{
    color: 'black',
    fontWeight: 'bold'
  }
})