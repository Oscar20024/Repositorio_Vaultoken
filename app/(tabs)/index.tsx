import { ImageBackground, ScrollView, useWindowDimensions } from "react-native";

const mapa = require("../../assets/images/mapa-niveles.png");
const { width: iw, height: ih } =
  require("react-native").Image.resolveAssetSource(mapa);

export default function Home() {
  const { width } = useWindowDimensions();
  const height = (width * ih) / iw;

  return (
    <ScrollView>
      <ImageBackground
        source={mapa}
        style={{ width, height }}
        resizeMode="contain"
      />
    </ScrollView>
  );
}
