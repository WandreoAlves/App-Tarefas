import React, {useState} from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import {Ionicons} from '@expo/vector-icons'
import * as Animatatable from 'react-native-animatable'



export default function Tarefalist({data, deletTarefa}){
    return(
        <Animatatable.View style={styles.container}
        animation="bounceIn"
        useNativeDriver
        >
            <TouchableOpacity onPress={() => deletTarefa(data)}>
                <Ionicons name="md-checkmark-circle" size={30} color="#212121"/>
            </TouchableOpacity>
            <View>
                <Text style={styles.tarefa}>{data.tarefa}</Text>
            </View>

            <View>
                <Text style={styles.important}>{data.important}</Text>
            </View>
        </Animatatable.View>
    )
}

const styles = StyleSheet.create({
    container:{
     flex: 1,
     flexDirection: 'row',
     justifyContent: 'space-between',
     margin: 5,
     alignItems: 'center',
     backgroundColor: "#fff",
     borderRadius: 10,
     padding: 10,
     elevation: 1.5,
     shadowColor: '#000',
     shadowOpacity: 0.2,
    shadowOffset:{
      width: 1,
      height: 3
    },
    flexWrap: 'wrap'
    },
    tarefa:{
        color: '#212121',
        paddingLeft: 15,
        paddingRight: 40,
        fontSize: 20,
    },
    important:{
        color: '#888',
        paddingLeft: 5,
        paddingRight: 5,
        fontSize: 15,
    }
})