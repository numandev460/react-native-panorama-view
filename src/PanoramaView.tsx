import { useEffect, useRef, useState } from 'react';
import {
  Image,
  PanResponder,
  StyleSheet,
  View,
  type ImageSourcePropType,
  type LayoutChangeEvent,
  type ViewStyle,
} from 'react-native';

export type PanoramaViewProps = {
  /** A single wide panorama image (equirectangular/cylindrical works best). */
  image: ImageSourcePropType;
  style?: ViewStyle;
  /** Multiplier on drag distance; >1 spins faster than the finger moves. */
  sensitivity?: number;
  /**
   * Fraction (0-1] of the image's vertical extent shown at once. Equirectangular
   * photos cover a full 180° top-to-bottom, most of which is sky/ground that
   * looks heavily warped when flattened. Cropping to a narrower band around the
   * horizon (e.g. 0.4-0.6) approximates the field of view a real 360 viewer
   * shows and looks far closer to a normal photo.
   */
  verticalFov?: number;
};

export function PanoramaView({
  image,
  style,
  sensitivity = 1.5,
  verticalFov = 0.5,
}: PanoramaViewProps) {
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [offset, setOffset] = useState(0);
  const dragStartOffsetRef = useRef(0);

  useEffect(() => {
    const resolved = Image.resolveAssetSource(image);
    if (resolved?.width && resolved?.height) {
      setNaturalSize({ width: resolved.width, height: resolved.height });
      return;
    }

    if (typeof image === 'object' && 'uri' in image && image.uri) {
      Image.getSize(
        image.uri,
        (width, height) => setNaturalSize({ width, height }),
        () => {}
      );
    }
  }, [image]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: (_event, gestureState) =>
        Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
      onPanResponderGrant: () => {
        dragStartOffsetRef.current = offset;
      },
      onPanResponderMove: (_event, gestureState) => {
        setOffset(dragStartOffsetRef.current + gestureState.dx * sensitivity);
      },
    })
  ).current;

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerSize({ width, height });
  };

  const clampedFov = Math.min(Math.max(verticalFov, 0.05), 1);

  // Render the image tall enough that only `clampedFov` of its height ends up
  // visible inside the container, then re-center it vertically. This crops
  // out the extreme top/bottom (sky/ground) without stretching either axis,
  // so the visible band looks like a normal photo instead of a fisheye strip.
  const fullRenderedHeight =
    containerSize.height > 0 ? containerSize.height / clampedFov : 0;
  const renderedWidth =
    fullRenderedHeight > 0 && naturalSize.height > 0
      ? (naturalSize.width / naturalSize.height) * fullRenderedHeight
      : 0;
  const verticalOffset = -(fullRenderedHeight - containerSize.height) / 2;

  const normalizedOffset =
    renderedWidth > 0
      ? ((offset % renderedWidth) + renderedWidth) % renderedWidth
      : 0;

  return (
    <View
      style={[styles.container, style]}
      onLayout={onLayout}
      {...panResponder.panHandlers}
      testID="panorama-view"
    >
      {renderedWidth > 0 && (
        <>
          <Image
            source={image}
            resizeMode="stretch"
            style={[
              styles.image,
              {
                width: renderedWidth,
                height: fullRenderedHeight,
                top: verticalOffset,
                left: normalizedOffset - renderedWidth,
              },
            ]}
          />
          <Image
            source={image}
            resizeMode="stretch"
            style={[
              styles.image,
              {
                width: renderedWidth,
                height: fullRenderedHeight,
                top: verticalOffset,
                left: normalizedOffset,
              },
            ]}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 16 / 9,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  image: {
    position: 'absolute',
  },
});

export default PanoramaView;
