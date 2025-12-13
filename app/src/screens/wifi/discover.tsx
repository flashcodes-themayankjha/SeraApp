import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../theme';

export default function WifiDiscoverScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Wi-Fi Discovery Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  text: {
    color: theme.colors.textPrimary,
    fontSize: 20,
  },
});
