import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SlidersHorizontal, X } from 'lucide-react-native';
import { useAppStore } from '../../store/useAppStore';
import { lightPalette, darkPalette, spacing, typography } from '../../theme';
import { ProductFilterOptions, ProductSortOption } from '../../types';
import { Button } from '../common/Button';

interface MultiFilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: ProductFilterOptions;
  sortBy: ProductSortOption;
  onApply: (newFilters: ProductFilterOptions, newSortBy: ProductSortOption) => void;
}

const CATEGORIES = [
  'All',
  'Herbal Supplements',
  'Keshya Hair Oils',
  'Skin & Radiant Care',
  'Digestive Care',
  'Immunity Boosters',
  'Joint & Muscle Pain Care',
  'Stress & Sleep Oils',
];

const DOSHAS = ['All', 'Vata', 'Pitta', 'Kapha', 'Tridoshic'];

const SORT_OPTIONS: { label: string; value: ProductSortOption }[] = [
  { label: 'Popularity', value: 'popularity' },
  { label: 'Rating: High to Low', value: 'rating' },
  { label: 'Price: Low to High', value: 'price_low_high' },
  { label: 'Price: High to Low', value: 'price_high_low' },
];

export const MultiFilterModal: React.FC<MultiFilterModalProps> = ({
  visible,
  onClose,
  filters,
  sortBy,
  onApply,
}) => {
  const { themeMode } = useAppStore();
  const theme = themeMode === 'dark' ? darkPalette : lightPalette;

  const [tempCategory, setTempCategory] = useState(filters.category || 'All');
  const [tempDosha, setTempDosha] = useState(filters.doshaTarget || 'All');
  const [tempInStock, setTempInStock] = useState(filters.inStockOnly || false);
  const [tempSortBy, setTempSortBy] = useState<ProductSortOption>(sortBy);

  const handleApply = () => {
    onApply(
      {
        category: tempCategory,
        doshaTarget: tempDosha,
        inStockOnly: tempInStock,
      },
      tempSortBy
    );
    onClose();
  };

  const handleReset = () => {
    setTempCategory('All');
    setTempDosha('All');
    setTempInStock(false);
    setTempSortBy('popularity');
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.container, { backgroundColor: theme.cardBg }]}>
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <View style={styles.titleRow}>
              <SlidersHorizontal color={theme.primary} size={20} style={{ marginRight: 8 }} />
              <Text style={[styles.title, { color: theme.textPrimary }]}>Filters & Sorting</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <X color={theme.textMuted} size={20} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body}>
            {/* Sort Options */}
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Sort By</Text>
            <View style={styles.pillGroup}>
              {SORT_OPTIONS.map(opt => {
                const isSelected = tempSortBy === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => setTempSortBy(opt.value)}
                    style={[
                      styles.pill,
                      {
                        backgroundColor: isSelected ? theme.primary : theme.sand,
                        borderColor: isSelected ? theme.primary : theme.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        { color: isSelected ? '#FFFFFF' : theme.textSecondary },
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Category Filter */}
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Category</Text>
            <View style={styles.pillGroup}>
              {CATEGORIES.map(cat => {
                const isSelected = tempCategory === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setTempCategory(cat)}
                    style={[
                      styles.pill,
                      {
                        backgroundColor: isSelected ? theme.primary : theme.sand,
                        borderColor: isSelected ? theme.primary : theme.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        { color: isSelected ? '#FFFFFF' : theme.textSecondary },
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Dosha Target Filter */}
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Dosha Target</Text>
            <View style={styles.pillGroup}>
              {DOSHAS.map(dosha => {
                const isSelected = tempDosha === dosha;
                return (
                  <TouchableOpacity
                    key={dosha}
                    onPress={() => setTempDosha(dosha)}
                    style={[
                      styles.pill,
                      {
                        backgroundColor: isSelected ? theme.accent : theme.sand,
                        borderColor: isSelected ? theme.accent : theme.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        { color: isSelected ? '#1E2923' : theme.textSecondary },
                      ]}
                    >
                      {dosha}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* In Stock Only Toggle */}
            <View style={styles.toggleRow}>
              <Text style={[styles.toggleText, { color: theme.textPrimary }]}>In Stock Only</Text>
              <Switch value={tempInStock} onValueChange={setTempInStock} />
            </View>
          </ScrollView>

          <View style={[styles.footer, { borderTopColor: theme.border }]}>
            <Button title="Reset All" variant="outline" onPress={handleReset} />
            <Button style={{ flex: 1, marginLeft: spacing.md }} title="Apply Filters" onPress={handleApply} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: spacing.borderRadiusLg,
    borderTopRightRadius: spacing.borderRadiusLg,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  title: { ...typography.h3 },
  body: { padding: spacing.lg },
  sectionTitle: { ...typography.bodyBold, marginTop: spacing.md, marginBottom: spacing.sm },
  pillGroup: { flexDirection: 'row', flexWrap: 'wrap' },
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: spacing.borderRadiusFull,
    borderWidth: 1,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  pillText: { ...typography.captionBold },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: spacing.lg,
  },
  toggleText: { ...typography.bodyBold },
  footer: {
    flexDirection: 'row',
    padding: spacing.lg,
    borderTopWidth: 1,
  },
});
