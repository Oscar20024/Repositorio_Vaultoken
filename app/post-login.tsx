import { useEventListener } from "expo";
import { Asset } from "expo-asset";
import { router } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { PRELOAD } from "@/app/assets"; // ✅
import { getUnlockedMax } from "@/storage/progreso";

const src = require("../assets/videos/login.mp4");

async function preloadIndexAssets() {
  await Promise.all(PRELOAD.map((m) => Asset.fromModule(m).downloadAsync()));
}

export default function PostLogin() {
  const player = useVideoPlayer(src, (p) => {
    p.loop = false;
    p.play();
  });

  const [assetsReady, setAssetsReady] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        await Promise.all([preloadIndexAssets(), getUnlockedMax()]);
      } catch (e) {
        // no bloquees
      } finally {
        if (alive) setAssetsReady(true);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  useEventListener(player, "playToEnd", () => setVideoEnded(true));

  useEffect(() => {
    if (assetsReady && videoEnded) router.replace("/(tabs)");
  }, [assetsReady, videoEnded]);

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
