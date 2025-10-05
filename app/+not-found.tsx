import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// Component màn hình Not Found
export default function NotFoundScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">This screen does not exist.</ThemedText>
      <Link href="/" style={styles.link}>
        <ThemedText type="link">Go to home screen!</ThemedText>
      </Link>
    </ThemedView>
  );
}

// Cấu hình Stack.Screen nếu muốn đặt title
NotFoundScreen.options = {
  title: 'Oops!',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
