import React, { Component } from 'react';
import { View, StyleSheet, Text,Image, FlatList,TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../components/MyHeader';
import { RFValue } from "react-native-responsive-fontsize";

export default class MyReceivedBooksScreen extends Component{
  constructor(){
    super()
    this.state = {
      userId  : firebase.auth().currentUser.email,
      receivedItemsList : []
    }
  this.requestRef= null
  }

  getReceivedItemsList =()=>{
    this.requestRef = db.collection("requested_items")
    .where('user_id','==',this.state.userId)
    .where("item_status", '==','received')
    .onSnapshot((snapshot)=>{
      var receivedItemsList = snapshot.docs.map((doc) => doc.data())
      this.setState({
        receivedItemsList : receivedItemsList
      });
    })
  }

  componentDidMount(){
    this.getReceivedItemsList()
  }

  componentWillUnmount(){
    this.requestRef();
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ( {item, i} ) =>{
    return (
      <ListItem
        key={i}
       
        bottomDivider>
          <ListItem.Content>
         <ListItem.Title>
           {item.item_name}
         </ListItem.Title>
        <ListItem.Subtitle>
        {item.itemStatus}
          </ListItem.Subtitle>
        
          <Image
            style={styles.LiImage}
            source={{
              uri: item.image_link,
            }}
            />
          
          </ListItem.Content>
        </ListItem>
      
    )
  }

  render(){
    return(
      <View style={{flex:1}}>
        <MyHeader title="Barters" navigation ={this.props.navigation}/>
        <View style={{flex:1}}>
          {
            this.state.receivedItemsList.length === 0
            ?(
              <View style={styles.subContainer}>
                <Text style={{ fontSize: 20}}>List Of All Barters</Text>
              </View>
            )
            :(
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.receiveditemsList}
                renderItem={this.renderItem}
              />
            )
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  subContainer:{
    flex:1,
    fontSize: 20,
    justifyContent:'center',
    alignItems:'center'
  },
  button:{
    width:100,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     }
  },
  LiImage:{
    height:RFValue(50),
    width:RFValue(50)
  },
  titlestyle:
  {
  color: 'black',
  fontWeight: 'bold'
},

})