/*import { useEventListener } from "expo";
import { router } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { StyleSheet, View } from "react-native";

const src = require("../assets/videos/login.mp4");

export default function PostLogin() {
  const player = useVideoPlayer(src, (p) => {
    p.loop = false;
    p.play();
  });

  useEventListener(player, "playToEnd", () => router.replace("/(tabs)"));

  return (
    <View style={s.c}>
      <VideoView
        player={player}
        style={s.v}
        contentFit="cover"
        nativeControls={false}
      />
    </View>
  );
}

const s = StyleSheet.create({
  c: { flex: 1, backgroundColor: "black" },
  v: { flex: 1 },
});
*/
