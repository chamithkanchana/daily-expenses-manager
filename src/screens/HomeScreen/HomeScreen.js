import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  FlatList,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Card, ListItem, Button, Icon} from 'react-native-elements';
import styles from './styles';
import {db, firebase} from '../../firebase/config';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

export default function HomeScreen(props) {
  const [entityText, setEntityText] = useState('');
  const [entities, setEntities] = useState([]);
  const [newEntity, setNewEntity] = useState([]);

  const entityRef = firebase.firestore().collection('entities');
  const userID = props.extraData.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        var snapshot = await entityRef.get();

        const newEntities = [];

        snapshot.forEach(doc => {
          const entity = doc.data();
          entity.id = doc.id;
          newEntities.push(entity);
        });
        setEntities(newEntities);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [newEntity]);

  const onAddButtonPress = () => {
    if (entityText && entityText.length > 0) {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      const data = {
        text: entityText,
        authorID: userID,
        createdAt: timestamp,
      };
      entityRef
        .add(data)
        .then(_doc => {
          setNewEntity(data);
          setEntityText('');
          Keyboard.dismiss();
        })
        .catch(error => {
          alert(error);
        });
    }
  };

  const renderEntity = ({item, index}) => {
    return (
      <View style={styles.entityContainer}>
        <Text style={styles.entityText}>
          {index}. {item.text}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <Button
        title="Go to Details"
        onPress={() => props.navigation.navigate('Income')}
      /> */}

      <TouchableOpacity
        onPress={() => props.navigation.navigate('Income')}
        style={{width: '100%'}}>
        <Card style={{flex: 1, width: 100}}>
          <Card.Title>INCOME MANAGEMENT</Card.Title>
          <Card.Divider />
          <Text style={{marginBottom: 10}}>Note down your all incomes</Text>
          <Button
            title="VIEW"
            onPress={() => props.navigation.navigate('Income')}
          />
        </Card>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => props.navigation.navigate('Income')}
        style={{width: '100%'}}>
        <Card>
          <Card.Title>EXPENSES MANAGEMENT</Card.Title>
          <Card.Divider />
          <Text style={{marginBottom: 10}}>Note down your all expenses</Text>
          <Button title="VIEW" />
        </Card>
      </TouchableOpacity>

      <View>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add new entity"
            placeholderTextColor="#aaaaaa"
            onChangeText={text => setEntityText(text)}
            value={entityText}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          <TouchableOpacity style={styles.button} onPress={onAddButtonPress}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>
        {entities && (
          <View style={styles.listContainer}>
            <FlatList
              data={entities}
              renderItem={renderEntity}
              keyExtractor={item => item.id}
              removeClippedSubviews={true}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
