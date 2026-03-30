import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Switch,
} from 'react-native';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors, Typography, Spacing, Radius } from '../../theme';
import { useMusicStore } from '../../stores';
import { musicApi } from '../../api';

const VOCAL_TYPES = [
  { key: 'male', label: '남성 보컬' },
  { key: 'female', label: '여성 보컬' },
  { key: 'instrumental', label: '인스트루멘탈' },
];

const MOODS = [
  '신나는', '슬픈', '편안한', '에너지틱', '로맨틱',
  '우울한', '희망적', '몽환적', '강렬한', '잔잔한',
  '어두운', '밝은',
];

const GENRES = [
  'K-Pop', 'Hip-Hop', 'R&B', 'Ballad', 'Rock',
  'EDM', 'Jazz', 'Classical', 'Acoustic', 'Lo-Fi',
  'Funk', 'Reggae',
];

const MODELS = [
  { key: 'default', label: '기본 모델' },
  { key: 'v2', label: 'V2 모델' },
  { key: 'v3', label: 'V3 모델 (실험적)' },
];

const INSTRUMENTS = [
  '피아노', '기타', '드럼', '베이스', '신디사이저',
  '바이올린', '첼로', '트럼펫', '플루트', '색소폰',
];

const CustomMode: React.FC = () => {
  const { setGenerateParams } = useMusicStore();

  const [title, setTitle] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [bpm, setBpm] = useState(120);
  const [autoBpm, setAutoBpm] = useState(false);
  const [vocalType, setVocalType] = useState('female');
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [lyrics, setLyrics] = useState('');
  const [tags, setTags] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedModel, setSelectedModel] = useState('default');
  const [negativeTags, setNegativeTags] = useState('');
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([]);
  const [isGeneratingLyrics, setIsGeneratingLyrics] = useState(false);

  const toggleMood = (mood: string) => {
    setSelectedMoods((prev) =>
      prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]
    );
  };

  const toggleInstrument = (inst: string) => {
    setSelectedInstruments((prev) =>
      prev.includes(inst) ? prev.filter((i) => i !== inst) : [...prev, inst]
    );
  };

  const handleGenerateLyrics = async () => {
    setIsGeneratingLyrics(true);
    try {
      const result = await musicApi.generateLyrics({
        genre: selectedGenre,
        mood: selectedMoods,
        vocalType,
      });
      if (result?.lyrics) {
        setLyrics(result.lyrics);
      }
    } catch (_e) {
      // 에러 처리는 상위에서
    } finally {
      setIsGeneratingLyrics(false);
    }
  };

  // 파라미터 변경 시 스토어에 동기화
  useEffect(() => {
    setGenerateParams({
      mode: 'custom',
      title,
      genre: selectedGenre,
      bpm: autoBpm ? undefined : bpm,
      vocalType,
      moods: selectedMoods,
      lyrics,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      model: selectedModel,
      negativeTags: negativeTags.split(',').map((t) => t.trim()).filter(Boolean),
      instruments: selectedInstruments,
    });
  }, [
    title, selectedGenre, bpm, autoBpm, vocalType,
    selectedMoods, lyrics, tags, selectedModel,
    negativeTags, selectedInstruments,
  ]);

  return (
    <View style={styles.container}>
      {/* 제목 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>제목</Text>
        <TextInput
          style={styles.textInput}
          placeholder="곡 제목을 입력하세요"
          placeholderTextColor={Colors.textTertiary}
          value={title}
          onChangeText={setTitle}
        />
      </View>

      {/* 장르 그리드 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>장르</Text>
        <View style={styles.chipGrid}>
          {GENRES.map((genre) => (
            <TouchableOpacity
              key={genre}
              style={[
                styles.chip,
                selectedGenre === genre && styles.chipSelected,
              ]}
              onPress={() =>
                setSelectedGenre(genre === selectedGenre ? null : genre)
              }
            >
              <Text
                style={[
                  styles.chipText,
                  selectedGenre === genre && styles.chipTextSelected,
                ]}
              >
                {genre}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* BPM 슬라이더 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            BPM: {autoBpm ? '자동' : bpm}
          </Text>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>자동 BPM</Text>
            <Switch
              value={autoBpm}
              onValueChange={setAutoBpm}
              trackColor={{ false: Colors.border, true: Colors.primaryLight }}
              thumbColor={autoBpm ? Colors.primary : Colors.textTertiary}
            />
          </View>
        </View>
        {!autoBpm && (
          <Slider
            style={styles.slider}
            minimumValue={60}
            maximumValue={200}
            step={1}
            value={bpm}
            onValueChange={setBpm}
            minimumTrackTintColor={Colors.primary}
            maximumTrackTintColor={Colors.border}
            thumbTintColor={Colors.primary}
          />
        )}
      </View>

      {/* 보컬 타입 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>보컬 타입</Text>
        <View style={styles.chipGrid}>
          {VOCAL_TYPES.map((v) => (
            <TouchableOpacity
              key={v.key}
              style={[
                styles.chip,
                vocalType === v.key && styles.chipSelected,
              ]}
              onPress={() => setVocalType(v.key)}
            >
              <Text
                style={[
                  styles.chipText,
                  vocalType === v.key && styles.chipTextSelected,
                ]}
              >
                {v.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 분위기 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>분위기</Text>
        <View style={styles.chipGrid}>
          {MOODS.map((mood) => (
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

      {/* 가사 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>가사</Text>
          <TouchableOpacity
            style={styles.aiButton}
            onPress={handleGenerateLyrics}
            disabled={isGeneratingLyrics}
          >
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {!isGeneratingLyrics && <Icon name="sparkles" size={14} color={Colors.primary} style={{marginRight: 4}} />}
              <Text style={styles.aiButtonText}>
                {isGeneratingLyrics ? '생성 중...' : 'AI 가사 생성'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <TextInput
          style={[styles.textInput, styles.lyricsInput]}
          placeholder="가사를 입력하거나 AI로 생성하세요..."
          placeholderTextColor={Colors.textTertiary}
          value={lyrics}
          onChangeText={setLyrics}
          multiline
          textAlignVertical="top"
        />
      </View>

      {/* 태그 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>태그</Text>
        <TextInput
          style={styles.textInput}
          placeholder="쉼표로 구분하여 태그 입력 (예: 감성, 새벽, 드라이브)"
          placeholderTextColor={Colors.textTertiary}
          value={tags}
          onChangeText={setTags}
        />
      </View>

      {/* 고급 설정 토글 */}
      <TouchableOpacity
        style={styles.advancedToggle}
        onPress={() => setShowAdvanced(!showAdvanced)}
      >
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon
            name={showAdvanced ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={Colors.textSecondary}
            style={{marginRight: 4}}
          />
          <Text style={styles.advancedToggleText}>
            {showAdvanced ? '고급 설정 접기' : '고급 설정 펼치기'}
          </Text>
        </View>
      </TouchableOpacity>

      {showAdvanced && (
        <View style={styles.advancedSection}>
          {/* 모델 선택 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>모델 선택</Text>
            <View style={styles.chipGrid}>
              {MODELS.map((model) => (
                <TouchableOpacity
                  key={model.key}
                  style={[
                    styles.chip,
                    selectedModel === model.key && styles.chipSelected,
                  ]}
                  onPress={() => setSelectedModel(model.key)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedModel === model.key && styles.chipTextSelected,
                    ]}
                  >
                    {model.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 제외 태그 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>제외 태그</Text>
            <TextInput
              style={styles.textInput}
              placeholder="제외할 요소를 쉼표로 구분 (예: 노이즈, 디스토션)"
              placeholderTextColor={Colors.textTertiary}
              value={negativeTags}
              onChangeText={setNegativeTags}
            />
          </View>

          {/* 악기 선택 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>악기 선택</Text>
            <View style={styles.chipGrid}>
              {INSTRUMENTS.map((inst) => (
                <TouchableOpacity
                  key={inst}
                  style={[
                    styles.chip,
                    selectedInstruments.includes(inst) && styles.chipSelected,
                  ]}
                  onPress={() => toggleInstrument(inst)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedInstruments.includes(inst) &&
                        styles.chipTextSelected,
                    ]}
                  >
                    {inst}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.subtitle,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
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
  textInput: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    color: Colors.textPrimary,
    ...Typography.body,
  },
  lyricsInput: {
    minHeight: 140,
    maxHeight: 280,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  toggleLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  aiButton: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  aiButtonText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
  advancedToggle: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginBottom: Spacing.md,
  },
  advancedToggleText: {
    ...Typography.body2,
    color: Colors.textSecondary,
  },
  advancedSection: {
    paddingTop: Spacing.sm,
  },
});

export default CustomMode;
