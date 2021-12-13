import React, { useState } from 'react';
import { StyleSheet, Text, Button, View, TextInput, ImageBackground } from 'react-native';

export default function App() {
  const [username, setUsername] = useState("Dylan");
  const [user, setUser] = useState({});
  const [name, onChangeName] = useState(null);
  const [loading, setLoading] = useState(false)
  const [showResult, setShowResult] = useState(false)


  async function search() {

    setLoading(true)

    console.log("name :", name)
    try {
      const response = await fetch(`http://aa5a-92-184-117-106.ngrok.io/api/users/${name}`); // creer nouveau ngrok à chaque fois
      const user = await response.json();
      console.log("user:", user)
      if(user.result === true){
        setShowResult(true)
        setUser(user)
      }

      setUser(user);
    } catch (error) {
      console.log(error.message);
    }
  }

  const image = { uri: "https://technotaught.com/wp-content/uploads/2019/07/github-logo.jpeg" };



let rendering = 
<View>
  <TextInput
    style={styles.input}
    onChangeText={onChangeName}
    value={name}
    placeholder="Enter your Github username"
  />
  <Button 
    onPress={search}
    title="Validate"
    color="black"
    style={styles.button}
  />
</View>

if (loading === true){
  rendering = <Text>Loading ...</Text>
}

if(showResult === true){
  rendering = 
  <View>
    <Text>Avatar url: </Text>
  </View>

}

  return (
    <View style={styles.container}>
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        {rendering}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  button: {
    backgroundColor: "black"
  }
});
