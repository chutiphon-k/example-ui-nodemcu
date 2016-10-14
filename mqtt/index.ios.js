/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  AsyncStorage
} from 'react-native'

import { initMqtt } from 'react_native_mqtt'
import {
  Button,
  Heading,
  View,
  Tile,
  Overlay,
  Title,
  Subtitle,
  Text,
  Icon,
  Image,
  NavigationBar,
  Spinner,
  TextInput,
  Caption
} from '@shoutem/ui'

let client, x

export default class mqtt extends Component {

  // constructor(props) {
  //   super(props)
  // }

  state = {
    connectionStatus : 'unconnected',
    ledStatus : 'Loading...'
  }

  componentWillMount(){
    initMqtt({
        size: 10000,
        storageBackend: AsyncStorage,
        defaultExpires: 1000 * 3600 * 24,
        enableCache: true,
        sync : {}
    })
    client = new Paho.MQTT.Client('192.168.2.42', 9001, 'Eieiza')
    client.onConnectionLost = this.onConnectionLost
    client.onMessageArrived = this.onMessageArrived.bind(this)
    client.connect({
      // useSSL: true,
      // userName: 'TEST',
      // password: '12345',
      onSuccess: () => {
        this.setState({ connectionStatus : 'connected' })
        client.subscribe("/ESP/LED");
        this.onConnect()
      },
      onFailure: () => {
        console.log(client.isConnected())
      }
    })
  }

  onConnect() {
    console.log("onConnect");
    let message = new Paho.MQTT.Message("GET")
    message.destinationName = "/ESP/LED"
    client.send(message)
  }

  onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:"+responseObject.errorMessage)
    }
  }

  onMessageArrived(payload) {
    console.log('aaa')
    let msg = payload.payloadString
    if(msg == 'LEDON' || msg == 'LEDOFF'){
      this.setState({ ledStatus :  ( msg == 'LEDON') ? 'LEDOFF' : 'LEDON' })      
    }
    console.log("onMessageArrived:", payload.payloadString)
  }

  mqttSend() {
    let msg = (this.state.ledStatus == 'Loading...') ? 'GET' : this.state.ledStatus
    let message = new Paho.MQTT.Message(msg)
    message.destinationName = "/ESP/LED"
    client.send(message)
  }

  render() {
    return ( 
        <Tile styleName="text-centric">
          <NavigationBar
            centerComponent={<Title>Main</Title>}
          />
          <Heading>Test MQTT ON-OFF LED</Heading>
          <Title>Status : { this.state.connectionStatus }</Title>
          <Button styleName="dark md-gutter-top" onPress={ () => this.mqttSend() } disabled={ !client.isConnected() }><Icon name="ic_bell"/>
            <Text>{ this.state.ledStatus }</Text>
          </Button>
          <Caption>by Chutiphon Kongsompot</Caption>
        </Tile>
    );
  }
}


AppRegistry.registerComponent('mqtt', () => mqtt);
