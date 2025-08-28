import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';

import DashboardScreen from './screens/DashboardScreen';
import CampaignsScreen from './screens/CampaignsScreen';
import ContactsScreen from './screens/ContactsScreen';
import AnalyticsScreen from './screens/AnalyticsScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#f6ab00" />
      <Stack.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f6ab00',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Dashboard" 
          component={DashboardScreen}
          options={{ title: 'Total Audio Promo' }}
        />
        <Stack.Screen 
          name="Campaigns" 
          component={CampaignsScreen}
          options={{ title: 'Campaigns' }}
        />
        <Stack.Screen 
          name="Contacts" 
          component={ContactsScreen}
          options={{ title: 'Contacts' }}
        />
        <Stack.Screen 
          name="Analytics" 
          component={AnalyticsScreen}
          options={{ title: 'Analytics' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
