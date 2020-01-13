import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  AsyncStorage,
  StyleSheet,
  Alert,
} from 'react-native';
import socketio from 'socket.io-client';

import SpotList from '../components/SpotList';

import logo from './../assets/logo.png';

export default function List({ navigation }) {
  const [techs, setTechs] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem('user').then(user_id => {
      const socket = socketio('http://192.168.0.109:3333', {
        query: { user_id },
      });

      socket.on('booking_response', booking => {
        console.log(booking)
        Alert.alert(
          `Sua reserva em ${booking.spot.company} em ${booking.date} foi ${
            booking.approved ? 'APROVADA' : 'REJEITADA'
          }`
        );
      });
    });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('techs').then(storagedTechs => {
      const techsArray = storagedTechs.split(',').map(t => t.trim());
      setTechs(techsArray);
    });
  }, []);

  async function handleLoggout() {
    await AsyncStorage.setItem('user', '');
    await AsyncStorage.setItem('techs', '');

    navigation.navigate('Login');
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.logo} source={logo} />

      <ScrollView>
        {techs.map(tech => (
          <SpotList key={tech} tech={tech} />
        ))}
      </ScrollView>

      <TouchableOpacity onPress={handleLoggout} style={styles.buttonLoggout}>
        <Text style={styles.buttonLoggoutText}>Sair</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo: {
    height: 32,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 10,
  },

  buttonLoggout: {
    height: 46,
    backgroundColor: '#888',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
  },
  buttonLoggoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
