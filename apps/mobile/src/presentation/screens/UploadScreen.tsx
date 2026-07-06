import { useTheme } from "@app-fitness/theme";
import { Button, Header, Input, PhotoUploader } from "@app-fitness/ui";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

import { useTodayChallenges, useUploadChallengePhoto } from "../hooks/useChallenges";
import { useActiveGroup } from "../hooks/useGroups";

export function UploadScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const router = useRouter();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { group } = useActiveGroup();
  const { data: challenges } = useTodayChallenges(group?.id);
  const challenge = challenges?.find((c) => c.id === id);
  const uploadPhoto = useUploadChallengePhoto();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [caption, setCaption] = useState("");

  const publish = async () => {
    if (!photoUri || !challenge) return;
    await uploadPhoto.mutateAsync({ challengeId: challenge.id, localUri: photoUri });
    router.back();
  };

  return (
    <View style={styles.container}>
      <Header title="Comprovar" subtitle={challenge?.title ?? ""} back onBack={() => router.back()} />
      <View style={styles.content}>
        <PhotoUploader photoUri={photoUri} onCapture={setPhotoUri} onRemove={() => setPhotoUri(null)} height={340} />
        {photoUri && (
          <>
            <Input
              placeholder="Escreva uma legenda (opcional)…"
              value={caption}
              onChangeText={setCaption}
            />
            <View style={styles.actions}>
              <View style={{ flex: 1 }}>
                <Button variant="secondary" onPress={() => setPhotoUri(null)}>
                  Refazer
                </Button>
              </View>
              <View style={{ flex: 2 }}>
                <Button icon="send" loading={uploadPhoto.isPending} onPress={publish}>
                  Publicar check-in
                </Button>
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>["theme"]) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    content: { padding: theme.spacing.base, gap: theme.spacing.md },
    actions: { flexDirection: "row", gap: 10 },
  });
}
