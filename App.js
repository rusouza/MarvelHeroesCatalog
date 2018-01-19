import React from 'react';
import { StatusBar, Platform } from "react-native";
import Home from "./src/screens/Home.js";
import Descricao from "./src/screens/Descricao.js";
import { StackNavigator } from 'react-navigation';

const App = StackNavigator({
  Home: {
    screen: Home
  },
  Descricao: {
    screen: Descricao
  },
},
{
  cardStyle: {
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
  }
})

export default App