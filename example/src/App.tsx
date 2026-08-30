import { View, StyleSheet } from 'react-native';
import { PanoramaView } from 'react-native-panorama-view';

const panoramaImage = require('./assets/panorama.jpg');

export default function App() {
  return (
    <View style={styles.container}>
      <PanoramaView image={panoramaImage} style={styles.panorama} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  panorama: {
    borderRadius: 12,
  },
});
