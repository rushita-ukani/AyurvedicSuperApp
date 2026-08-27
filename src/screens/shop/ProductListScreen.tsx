import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { ShoppingBag, SlidersHorizontal } from 'lucide-react-native';
import { Product, ProductFilterOptions, ProductSortOption } from '../../types';
import { apiClient } from '../../api/apiClient';
import { useAppStore } from '../../store/useAppStore';
import { useCartStore } from '../../store/useCartStore';
import { lightPalette, darkPalette, spacing, typography } from '../../theme';
import { SearchBar } from '../../components/common/SearchBar';
import { ProductCard } from '../../components/shop/ProductCard';
import { MultiFilterModal } from '../../components/shop/MultiFilterModal';
import { t } from '../../utils/i18n';

export const ProductListScreen = ({ navigation }: any) => {
  const { themeMode, language, addToast } = useAppStore();
  const { cart, getCartTotal, loadPersistedCart } = useCartStore();
  const theme = themeMode === 'dark' ? darkPalette : lightPalette;

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<ProductFilterOptions>({
    category: 'All',
    doshaTarget: 'All',
    inStockOnly: false,
  });
  const [sortBy, setSortBy] = useState<ProductSortOption>('popularity');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    loadPersistedCart();
  }, []);

  const fetchProducts = useCallback(
    async (pageNum: number, isReset = false) => {
      if (isLoading) return;
      setIsLoading(true);

      try {
        const res = await apiClient.fetchProducts({
          page: pageNum,
          limit: 20,
          search,
          category: filters.category,
          doshaTarget: filters.doshaTarget,
          inStockOnly: filters.inStockOnly,
          sortBy,
        });

        if (isReset) {
          setProducts(res.items);
        } else {
          setProducts(prev => [...prev, ...res.items]);
        }

        setHasMore(res.hasMore);
        setTotalCount(res.total);
        setPage(pageNum);
      } catch (err: any) {
        addToast({
          type: 'error',
          message: 'Failed to load products',
          description: err.message,
        });
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [search, filters, sortBy, isLoading, addToast]
  );

  useEffect(() => {
    fetchProducts(1, true);
  }, [search, filters, sortBy]);

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      fetchProducts(page + 1, false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchProducts(1, true);
  };

  const { itemCount } = useMemo(() => getCartTotal(), [cart]);

  const renderProductItem = useCallback(
    ({ item }: { item: Product }) => (
      <View style={styles.gridColumn}>
        <ProductCard
          product={item}
          onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
        />
      </View>
    ),
    [navigation]
  );

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: 290,
      offset: 290 * index,
      index,
    }),
    []
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Header Banner */}
      <View style={[styles.headerBanner, { backgroundColor: theme.cardBg, borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>{t('shopProducts', language)}</Text>
        <TouchableOpacity
          accessibilityLabel="Open Cart"
          onPress={() => navigation.navigate('Cart')}
          style={[styles.cartBadgeBtn, { backgroundColor: `${theme.primary}1E` }]}
        >
          <ShoppingBag color={theme.primary} size={20} />
          {itemCount > 0 && (
            <View style={[styles.badgeCircle, { backgroundColor: theme.terracotta }]}>
              <Text style={styles.badgeText}>{itemCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Search & Multi-Filter Bar */}
      <View style={styles.searchRow}>
        <View style={{ flex: 1 }}>
          <SearchBar
            placeholder={t('searchProducts', language)}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <TouchableOpacity
          accessibilityLabel="Open Filters"
          onPress={() => setIsFilterModalOpen(true)}
          style={[styles.filterBtn, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
        >
          <SlidersHorizontal color={theme.primary} size={20} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.countLabel, { color: theme.textMuted }]}>
        Showing {products.length} of {totalCount} Ayurvedic Formulations
      </Text>

      {/* Virtualized Products List */}
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={products}
        getItemLayout={getItemLayout}
        initialNumToRender={10}
        keyExtractor={item => item.id}
        maxToRenderPerBatch={10}
        numColumns={2}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        onRefresh={handleRefresh}
        refreshing={isRefreshing}
        removeClippedSubviews
        renderItem={renderProductItem}
        windowSize={5}
        ListFooterComponent={
          isLoading && !isRefreshing ? (
            <View style={styles.loadingFooter}>
              <ActivityIndicator color={theme.primary} size="small" />
              <Text style={[styles.loadingText, { color: theme.textMuted }]}>
                Loading products dataset...
              </Text>
            </View>
          ) : null
        }
      />

      <MultiFilterModal
        filters={filters}
        sortBy={sortBy}
        visible={isFilterModalOpen}
        onApply={(newFilters, newSortBy) => {
          setFilters(newFilters);
          setSortBy(newSortBy);
        }}
        onClose={() => setIsFilterModalOpen(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: { ...typography.h2, fontSize: 20 },
  cartBadgeBtn: {
    padding: spacing.sm,
    borderRadius: spacing.borderRadiusFull,
    position: 'relative',
  },
  badgeCircle: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { ...typography.badge, color: '#FFFFFF', fontSize: 10 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: spacing.borderRadiusMd,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  countLabel: {
    ...typography.caption,
    paddingHorizontal: spacing.lg,
    marginVertical: spacing.xs,
  },
  listContainer: {
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  gridColumn: {
    flex: 1,
    paddingHorizontal: spacing.xs,
  },
  loadingFooter: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    width: '100%',
  },
  loadingText: { ...typography.caption, marginTop: spacing.xs },
});
