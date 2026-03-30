import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Colors} from '../theme/colors';
import {Spacing} from '../theme/spacing';

// Placeholder screens - will be replaced with actual screens
const CommunityScreen = () => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderText}>{'\ud83c\udf10'} 커뮤니티</Text>
  </View>
);
const CreateScreen = () => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderText}>{'\ud83c\udfa8'} 음악 만들기</Text>
  </View>
);
const LibraryScreen = () => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderText}>{'\ud83d\udcda'} 라이브러리</Text>
  </View>
);
const SettingsScreen = () => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderText}>{'\u2699\ufe0f'} 설정</Text>
  </View>
);

const Tab = createBottomTabNavigator();

const tabIcons: Record<string, string> = {
  Community: '\ud83c\udf10',
  Create: '\u2795',
  Library: '\ud83d\udcda',
  Settings: '\u2699\ufe0f',
};

const tabLabels: Record<string, string> = {
  Community: '커뮤니티',
  Create: '만들기',
  Library: '라이브러리',
  Settings: '설정',
};

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

const CustomTabBar: React.FC<CustomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  return (
    <View style={tabBarStyles.container}>
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;
        const isCreate = route.name === 'Create';

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={0.7}
            style={[
              tabBarStyles.tab,
              isCreate && tabBarStyles.createTab,
            ]}>
            {isCreate ? (
              <View style={tabBarStyles.createButton}>
                <Text style={tabBarStyles.createIcon}>{'\u2795'}</Text>
              </View>
            ) : (
              <>
                <Text
                  style={[
                    tabBarStyles.icon,
                    isFocused && tabBarStyles.iconActive,
                  ]}>
                  {tabIcons[route.name]}
                </Text>
                <Text
                  style={[
                    tabBarStyles.label,
                    isFocused && tabBarStyles.labelActive,
                  ]}>
                  {tabLabels[route.name]}
                </Text>
              </>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{headerShown: false}}>
      <Tab.Screen name="Community" component={CommunityScreen} />
      <Tab.Screen name="Create" component={CreateScreen} />
      <Tab.Screen name="Library" component={LibraryScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    backgroundColor: Colors.bgDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: Colors.text1,
    fontSize: 18,
  },
});

const tabBarStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.cardDark,
    borderTopWidth: 1,
    borderTopColor: Colors.borderDark,
    paddingBottom: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xs,
  },
  createTab: {
    marginTop: -20,
  },
  createButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  createIcon: {
    color: Colors.text1,
    fontSize: 20,
  },
  icon: {
    fontSize: 20,
    marginBottom: 2,
  },
  iconActive: {
    opacity: 1,
  },
  label: {
    fontSize: 11,
    color: Colors.text3,
  },
  labelActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
});
