import { Audio } from "expo-av";

export const playClick = async () => {
  const { sound } = await Audio.Sound.createAsync(
    require("../assets/sonidos/click.wav")
  );
  await sound.playAsync();
};
