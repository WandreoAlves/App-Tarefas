  import React, {useState, useCallback, useEffect} from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, StatusBar,
   FlatList, Modal, TextInput, Image } from 'react-native';
import {Ionicons} from '@expo/vector-icons'
import TarefaList from './src/components/Tarefalist'
import * as Animatatable from 'react-native-animatable'
import AsyncStorage  from  '@react-native-async-storage/async-storage'
import AppIntroSlider from 'react-native-app-intro-slider'
import {Picker} from '@react-native-picker/picker';


const AnimatatableBtn = Animatatable.createAnimatableComponent(TouchableOpacity)


export default function App(){
  const [tarefa, setTarefa] = useState([])
  const [open, setOpen] = useState(false)
  const [texto, setTexto] = useState('')
  const [app, setApp] = useState(false)

  const [pickerSelect, setPickerSelect] = useState('Simples')

  useEffect(() => { 
    async function LoadStorage(){
       const StorageTarefa = await AsyncStorage.getItem('@tarefas')
  
       if(StorageTarefa){
         setTarefa(JSON.parse(StorageTarefa))
       }
    }
  
    LoadStorage()
  }, [])
  
  useEffect(() => {
  async function SaveStorage(){
    await AsyncStorage.setItem('@tarefas', JSON.stringify(tarefa))
  }

  SaveStorage()

  }, [tarefa])


  useEffect(() => { 
    async function LoadApp(){
       const StorageIntro = await AsyncStorage.getItem('@intro')
  
       if(StorageIntro){
         setApp(JSON.parse(StorageIntro))
       }
    }
  
    LoadApp()
  }, [])

  useEffect(() => {
    async function SaveIntro(){
      await AsyncStorage.setItem('@intro', JSON.stringify(app))
    }
  
    SaveIntro()
  
    }, [app])

    // PRIMEIRA INICIALIZAÇÃO DO APP VAI APRESENTAR O SLIDE
    const slider = [
      {
          key: '1',
          title: 'Introdução',
          desc: 'Aplicativo simples para por as suas tarefas que, você precisa realizar no dia a dia!',
          image: require('./assets/intro1.png')
      },
      {
          key: '2',
          title: 'Como usar?',
          desc: 'Aperte o botão azul com o + para adicionar uma nova tarefa.',
          image: require('./assets/intro2.png')
      },
      {
          key: '3',
          title: 'Bom Uso',
          desc: 'Espero que goste de usar o aplicativo e não deixe de avaliar na play Store.',
          image: require('./assets/intro3.png')
      }
    ]

    // FUNÇÃO PARA ADICIONAR AS TAREFAS
    
  function addTarefa(){
      if (texto !== ''){
        const data = {
          key: texto + tarefa.length,
          tarefa: texto,
          important: pickerSelect
        }

        setTarefa([...tarefa, data])
        setTexto('')
        setPickerSelect('Simples')
        setOpen(false)
      }
  }

  const deletTarefa = useCallback(
    (data) => {
      const filter = tarefa.filter( r => r.key !== data.key)
      setTarefa(filter)
    }
  )

  const AppIntro = ({item})=>{
    return(
      <SafeAreaView style={{flex:1, alignItems:'center', backgroundColor:'#222'}}>
        <View style={{flex:1, alignItems:'center', backgroundColor:'#222'}}>
          <Image  source={item.image} style={{resizeMode: 'cover', marginTop:50}}/>
          <Text style={{fontSize: 40, fontWeight: 'bold', color:'#09acff',padding: 20}}>{item.title}</Text>
          <Text style={{color:'#aaa', fontSize:15, padding:10, textAlign:'center'}}>{item.desc}</Text>
        </View>
      </SafeAreaView>
    )
  }
  
    // AREA DA LISTA DE AFAZERES
  
  if(app){
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#212121" barStyle="light-content"/>
        <View style={styles.container}>
          <Animatatable.Text animation="bounceInDown" style={styles.title}>Lista de afazeres</Animatatable.Text>
          
          <FlatList
          showsHorizontalScrollIndicator={false}
          data={tarefa}
          keyExtractor={(item) => String(item.id)}
          renderItem={({item}) => <TarefaList data={item} deletTarefa={deletTarefa}/>}
          />
  
          <Modal animationType="slide"
          transparent={false}
          visible={open}>
            <SafeAreaView style={styles.modal}>
              <View style={styles.headermodal}>
                <TouchableOpacity onPress={() => setOpen(false)}>
                  <Ionicons style={{marginRight: 5, marginLeft: 5}} name="md-arrow-back" size={40} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.titlemodal}>Nova Tarefa</Text>
              </View>
              <Animatatable.View style={styles.bodymodal} animation="fadeInUp">
  
                <TextInput
                multiline={true}
                autoCorrect={false}
                placeholderTextColor="#747474"
              placeholder="O que devo fazer?"
              style={styles.inputadd}
              value={texto}
              onChangeText={(texto) => setTexto(texto)}
              />

          <View style={styles.dateModal}>
          <Ionicons name="alert-circle" size={30} color="black" />
          <Picker style={{width:300}}
          selectedValue={pickerSelect}
          onValueChange={(itemValue, itemIndex) => setPickerSelect(itemValue)}>
            <Picker.Item label="Simples" value="Simples" />
            <Picker.Item label="Importante" value="Importante" />
            <Picker.Item label="Muito Importante" value="Muito Importante" />
          </Picker>
            </View>

              <TouchableOpacity style={styles.btnadd} onPress={addTarefa}>
                <Text style={styles.textadd}>Adicionar Tarefa</Text>
              </TouchableOpacity>
  
              </Animatatable.View>
            </SafeAreaView>
          </Modal>
  
            <AnimatatableBtn
              style={styles.fab}
              animation="bounceIn"
              duration={150}
              onPress={() => setOpen(true)}>
                <Ionicons name="ios-add" size={45} color="#fff"/>
              </AnimatatableBtn>
        </View>
      </SafeAreaView>
    )
  } else{
   
    return(
      <AppIntroSlider
      renderItem={AppIntro}
      data={slider}
      dotStyle={{backgroundColor: 'rgba(255,255,255,0.2)',
    width:30,
    height: 3
  }}
        activeDotStyle={{
          backgroundColor: "#1ff",
          width: 30,
          height: 3
        }}
        renderNextButton={() => <Ionicons name="arrow-forward-circle" size={40} color="#00ffea" />}
        renderPrevButton={() => <Ionicons name="arrow-back-circle" size={40} color="#00ddff" />}
        renderDoneButton={() => <Ionicons name="md-checkmark-circle" size={40} color="#00ff00" />}
        onDone={() => setApp(true)}
        showPrevButton={true}
        showSkipButton={true}
        renderSkipButton={() => <Ionicons name="md-play-skip-forward-circle-sharp" size={40} color="#00ffea" />}
      />
    )
    
  }
}


// CSS (STYLES)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212121',
    alignItems: 'center',
  },
  title:{
     margin: 30,
    fontSize: 40,
    color: '#fff',
  },
  fab:{
    position:  'absolute',
    backgroundColor: '#0090ff',
    width: 80,
    height: 80,
    borderRadius: 60,
    bottom: 15,
    right:  -60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    zIndex: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset:{
      width: 1,
      height: 3
    },
  },
  modal:{
    flex: 1,
    backgroundColor: '#212121',
  },
  headermodal:{
    marginTop: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titlemodal:{
    fontSize: 25,
    color: '#fff',
  },
  bodymodal:{
    marginTop: 15,
  },
  inputadd:{
    fontSize: 15,
    marginRight: 10,
    marginLeft: 10,
    marginTop: 30,
    padding: 10,
    backgroundColor: '#fff',
    height: 85,
    textAlignVertical: 'top',
    color: '#000',
    borderRadius: 10,
  },
  btnadd:{
    backgroundColor: '#0090ff',
    marginTop: 10,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  textadd:{
    fontSize: 18,
    color: '#fff'
  },

  dateModal:{
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginRight: 10,
    marginLeft: 10,
    marginTop: 10,
    padding: 10,
    alignContent: 'center',
    justifyContent: 'space-between',
    borderRadius: 10
  },
  datetext:{
    fontSize: 18
  }
});
