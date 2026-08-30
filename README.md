# react-native-panorama-view

Drag-to-look-around viewer for equirectangular panorama photos in React Native

## Installation


```sh
npm install react-native-panorama-view
```


## Usage

```jsx
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
  container: { flex: 1, padding: 24 },
  panorama: { borderRadius: 12 },
});
```

Drag horizontally to look around. The image loops seamlessly, so the left
and right edges of the source photo should line up (a standard equirectangular
panorama export already satisfies this).

### Props

| Prop           | Type                 | Default | Description                                                                                     |
| -------------- | -------------------- | ------- | ------------------------------------------------------------------------------------------------- |
| `image`        | `ImageSourcePropType`| —       | The panorama photo (equirectangular/cylindrical works best).                                     |
| `style`        | `ViewStyle`          | —       | Style for the viewer container.                                                                  |
| `sensitivity`  | `number`             | `1.5`   | Multiplier on drag distance; higher values spin faster than the finger moves.                    |
| `verticalFov`  | `number`             | `0.5`   | Fraction (0-1] of the image's vertical extent shown at once — crops out the extreme sky/ground.  |


## Contributing

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)
- [Code of conduct](CODE_OF_CONDUCT.md)

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
