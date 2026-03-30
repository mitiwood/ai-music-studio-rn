import React from 'react';
import {Text, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import {Colors} from '../theme/colors';
import {Typography} from '../theme/typography';
import {Spacing, Radius} from '../theme/spacing';
import {GENRES} from '../utils/constants';

interface GenreGridProps {
  selected: string[];
  onSelect: (genreId: string) => void;
  multi?: boolean;
}

export const GenreGrid: React.FC<GenreGridProps> = ({
  selected,
  onSelect,
  multi = false,
}) => {
  const handlePress = (genreId: string) => {
    onSelect(genreId);
  };

  const renderItem = ({item}: {item: (typeof GENRES)[number]}) => {
    const isSelected = selected.includes(item.id);
    return (
      <TouchableOpacity
        onPress={() => handlePress(item.id)}
        activeOpacity={0.7}
        style={[styles.chip, isSelected && styles.chipSelected]}>
        <Text style={styles.chipIcon}>{item.icon}</Text>
        <Text
          style={[
            Typography.captionBold,
            styles.chipLabel,
            isSelected && styles.chipLabelSelected,
          ]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={GENRES}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={3}
      columnWrapperStyle={styles.row}
      scrollEnabled={false}
      contentContainerStyle={styles.grid}
    />
  );
};

const styles = StyleSheet.create({
  grid: {
    gap: Spacing.sm,
  },
  row: {
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  chip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.surfaceDark,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  chipSelected: {
    backgroundColor: Colors.primary + '22',
    borderColor: Colors.primary,
  },
  chipIcon: {
    fontSize: 16,
    marginRight: Spacing.xs,
  },
  chipLabel: {
    color: Colors.text2,
  },
  chipLabelSelected: {
    color: Colors.primary,
  },
});
