import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../../theme';
import { useMusicStore } from '../../stores';

const QUICK_GENRES = [
  'K-Pop', 'Hip-Hop', 'R&B', 'Ballad', 'Rock', 'EDM', 'Lo-Fi', 'Jazz',
];

const QUICK_MOODS = [
  '신나는', '슬픈', '편안한', '로맨틱', '에너지틱', '몽환적', '잔잔한', '강렬한',
];

const SimpleMode: React.FC = () => {
  const { setGenerateParams } = useMusicStore();

  const [description, setDescription] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const toggleMood = (mood: string) => {
    setSelectedMoods((prev) =>
      prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]
    );
  };

  useEffect(() => {
    setGenerateParams({
      mode: 'simple',
      description,
      genres: selectedGenres,
      moods: selectedMoods,
    });
  }, [description, selectedGenres, selectedMoods]);

  return (
    <View style={styles.container}>
      {/* 설명 입력 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>어떤 음악을 만들고 싶나요?</Text>
        <TextInput
          style={styles.descriptionInput}
          placeholder="원하는 음악을 자유롭게 설명해주세요... (예: 비 오는 날 카페에서 듣고 싶은 잔잔한 재즈)"
          placeholderTextColor={Colors.textTertiary}
          value={description}
          onChangeText={setDescription}
          multiline
          textAlignVertical="top"
        />
        <Text style={styles.hint}>
          AI가 설명을 분석하여 장르, 분위기, BPM 등을 자동으로 설정합니다.
        </Text>
      </View>

      {/* 장르 빠른 선택 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>장르 (선택)</Text>
        <View style={styles.chipGrid}>
          {QUICK_GENRES.map((genre) => (
            <TouchableOpacity
              key={genre}
              style={[
                styles.chip,
                selectedGenres.includes(genre) && styles.chipSelected,
              ]}
              onPress={() => toggleGenre(genre)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedGenres.includes(genre) && styles.chipTextSelected,
                ]}
              >
                {genre}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 분위기 빠른 선택 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>분위기 (선택)</Text>
        <View style={styles.chipGrid}>
          {QUICK_MOODS.map((mood) => (
            <TouchableOpacity
              key={mood}
              style={[
                styles.chip,
                selectedMoods.includes(mood) && styles.chipSelected,
              ]}
              onPress={() => toggleMood(mood)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedMoods.includes(mood) && styles.chipTextSelected,
                ]}
              >
                {mood}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.subtitle,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  descriptionInput: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    color: Colors.textPrimary,
    ...Typography.body,
    minHeight: 120,
    maxHeight: 200,
  },
  hint: {
    ...Typography.caption,
    color: Colors.textTertiary,
    marginTop: Spacing.xs,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipSelected: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  chipText: {
    ...Typography.body2,
    color: Colors.textSecondary,
  },
  chipTextSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
});

export default SimpleMode;
