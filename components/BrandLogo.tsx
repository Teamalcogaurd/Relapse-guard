import React from 'react';
import { Image, ImageStyle, StyleProp, Text, View, ViewStyle } from 'react-native';

type BrandLogoProps = {
  size?: number;
  showWordmark?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
};

export default function BrandLogo({
  size = 88,
  showWordmark = false,
  containerStyle,
  imageStyle,
}: BrandLogoProps) {
  return (
    <View
      style={[
        {
          alignItems: 'center',
          justifyContent: 'center',
        },
        containerStyle,
      ]}
    >
      <Image
        source={require('../assets/images/relapsegaurd-logo.png')}
        style={[
          {
            width: size,
            height: size,
            resizeMode: 'contain',
          },
          imageStyle,
        ]}
      />

      {showWordmark ? (
        <Text
          style={{
            marginTop: 10,
            fontSize: Math.max(18, size * 0.22),
            fontWeight: '800',
            color: '#2E1F1B',
            letterSpacing: -0.6,
          }}
        >
          RelapseGaurd
        </Text>
      ) : null}
    </View>
  );
}
