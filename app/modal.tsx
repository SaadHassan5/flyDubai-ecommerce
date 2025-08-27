import { StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native';
import { WP, HP } from '../src/constants/spacing';

export default function ModalScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Modal</Text>
        <View style={styles.separator} />
        <Text style={styles.description}>
          This is a modal screen. You can close it by pressing the back button or swiping down.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: WP(5),
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: HP(6),
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: HP(2.5),
  },
  separator: {
    marginVertical: HP(3.75),
    height: 1,
    width: '80%',
    backgroundColor: '#eee',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
  },
});
