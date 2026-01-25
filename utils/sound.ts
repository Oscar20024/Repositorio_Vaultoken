import { Audio } from "expo-av";
Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

const click = require("../assets/sonidos/click.wav"); // ajusta la ruta real

export async function playClick() {
  const { sound } = await Audio.Sound.createAsync(click);
  await sound.playAsync();
  sound.setOnPlaybackStatusUpdate(
    (s) => s.isLoaded && s.didJustFinish && sound.unloadAsync(),
  );
}
