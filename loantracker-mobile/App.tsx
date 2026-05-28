import React, { useRef } from 'react';
import { ActivityIndicator, Animated, StatusBar, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { ScrollProvider, useScrollAnimation } from './src/contexts/ScrollContext';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { LoansScreen } from './src/screens/LoansScreen';
import { BorrowersScreen } from './src/screens/BorrowersScreen';
import { PaymentsScreen } from './src/screens/PaymentsScreen';
import { LoanDetailsScreen } from './src/screens/LoanDetailsScreen';
import { CreateLoanScreen } from './src/screens/CreateLoanScreen';
import { ChatScreen } from './src/screens/ChatScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { colors } from './src/theme/colors';
import { FloatingAssistantButton } from './src/components';
import { AuthStackParamList, AppStackParamList, AppTabParamList } from './src/types/navigation';
import { radius, spacing } from './src/theme/metrics';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();
const Tab = createBottomTabNavigator<AppTabParamList>();

const AuthStackScreen = () => (
  <AuthStack.Navigator
    screenOptions={{
      animation: 'slide_from_right',
      animationEnabled: true,
      gestureEnabled: true,
      gestureDirection: 'horizontal',
      headerStyle: { backgroundColor: colors.cardBackground },
      headerTintColor: colors.primary,
      headerShadowVisible: false,
      headerTitleStyle: { fontWeight: '700', fontSize: 18, color: colors.textPrimary },
      headerBackTitleVisible: false,
      headerBackTitle: '',
      headerLeftLabelVisible: false,
    }}
  >
    <AuthStack.Screen name="Login" component={LoginScreen} options={{ title: 'Sign In', headerShown: false }} />
    <AuthStack.Screen name="Register" component={RegisterScreen} options={{ title: 'Create Account' }} />
  </AuthStack.Navigator>
);

const AppTabs: React.FC<NativeStackScreenProps<AppStackParamList, 'MainTabs'>> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const tabBarBottom = Math.max(insets.bottom, 10);
  const tabBarHeight = 66 + tabBarBottom;
  const { tabBarTranslateY, resetScroll, setTabBarHeight } = useScrollAnimation();

  React.useEffect(() => {
    setTabBarHeight(tabBarHeight);
  }, [tabBarHeight, setTabBarHeight]);

  return (
    <View style={styles.authedRoot}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarHideOnKeyboard: true,
          sceneStyle: { paddingBottom: tabBarHeight + spacing.sm },
          tabBarStyle: [
            styles.tabBar,
            {
              height: tabBarHeight,
              paddingBottom: tabBarBottom,
              transform: [{ translateY: tabBarTranslateY }],
            },
          ],
          tabBarItemStyle: styles.tabItem,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarLabelStyle: styles.tabLabel,
          tabBarIcon: ({ color, size, focused }) => {
            const iconByRoute: Record<keyof AppTabParamList, React.ComponentProps<typeof MaterialCommunityIcons>['name']> = {
              Dashboard: 'view-dashboard-outline',
              Loans: 'file-document-outline',
              Borrowers: 'account-multiple-outline',
              Payments: 'receipt-text-outline',
              Profile: 'account-circle-outline',
            };
            return (
              <View style={[styles.iconWrap, focused ? styles.iconWrapActive : undefined]}>
                <MaterialCommunityIcons name={iconByRoute[route.name]} size={size} color={color} />
              </View>
            );
          },
          animation: 'shift',
        })}
      >
        <Tab.Screen 
          name="Dashboard" 
          component={DashboardScreen} 
          options={{ title: 'Dashboard' }}
          listeners={() => ({ 
            tabPress: () => { resetScroll(); } 
          })}
        />
        <Tab.Screen 
          name="Loans" 
          component={LoansScreen} 
          options={{ title: 'Loans' }}
          listeners={() => ({ 
            tabPress: () => { resetScroll(); } 
          })}
        />
        <Tab.Screen 
          name="Borrowers" 
          component={BorrowersScreen} 
          options={{ title: 'Borrowers' }}
          listeners={() => ({ 
            tabPress: () => { resetScroll(); } 
          })}
        />
        <Tab.Screen 
          name="Payments" 
          component={PaymentsScreen} 
          options={{ title: 'Payments' }}
          listeners={() => ({ 
            tabPress: () => { resetScroll(); } 
          })}
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ title: 'Profile' }}
          listeners={() => ({ 
            tabPress: () => { resetScroll(); } 
          })}
        />
      </Tab.Navigator>

      <FloatingAssistantButton
        onPress={() => navigation.navigate('ChatAssistant')}
        bottom={tabBarHeight + spacing.md}
      />
    </View>
  );
};

const AppStackScreen = () => (
  <AppStack.Navigator
    screenOptions={{
      animation: 'slide_from_right',
      animationEnabled: true,
      gestureEnabled: true,
      gestureDirection: 'horizontal',
      headerStyle: { backgroundColor: colors.cardBackground },
      headerTintColor: colors.primary,
      headerShadowVisible: false,
      headerTitleStyle: { fontWeight: '700', fontSize: 18, color: colors.textPrimary },
      headerBackTitleVisible: false,
      headerBackTitle: '',
      headerLeftLabelVisible: false,
    }}
  >
    <AppStack.Screen name="MainTabs" component={AppTabs} options={{ headerShown: false }} />
    <AppStack.Screen 
      name="LoanDetails" 
      component={LoanDetailsScreen} 
      options={{ title: 'Loan Details' }} 
    />
    <AppStack.Screen 
      name="CreateLoan" 
      component={CreateLoanScreen} 
      options={{ title: 'Create Loan' }} 
    />
    <AppStack.Screen 
      name="ChatAssistant" 
      component={ChatScreen} 
      options={{ title: 'Chat Assistant' }} 
    />
  </AppStack.Navigator>
);

const RootNavigator = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return isAuthenticated ? <AppStackScreen /> : <AuthStackScreen />;
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ScrollProvider>
          <NavigationContainer>
            <StatusBar barStyle="dark-content" backgroundColor={colors.cardBackground} />
            <RootNavigator />
          </NavigationContainer>
        </ScrollProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  authedRoot: {
    flex: 1,
  },
  tabBar: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.sm,
    borderTopWidth: 0,
    borderRadius: radius.lg,
    backgroundColor: colors.cardBackground,
    paddingTop: 8,
    shadowColor: colors.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  tabItem: {
    paddingVertical: 2,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  iconWrap: {
    width: 34,
    height: 28,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: '#CCFBF1',
  },
});
