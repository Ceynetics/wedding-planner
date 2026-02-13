import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    TextInput,
    FlatList,
    Dimensions,
    Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';

const { width, height } = Dimensions.get('window');

interface Guest {
    id: string;
    name: string;
    category: string;
    avatar: string;
    isVIP: boolean;
}

const UNASSIGNED_GUESTS: Guest[] = [
    {
        id: '1',
        name: 'Nimali Jr.',
        category: 'Work',
        avatar: 'https://i.pravatar.cc/150?u=nimali',
        isVIP: true,
    },
    {
        id: '2',
        name: 'Ravin Jay',
        category: 'Family',
        avatar: 'https://i.pravatar.cc/150?u=ravin',
        isVIP: false,
    },
    {
        id: '3',
        name: 'Julia Ann',
        category: 'Colleague',
        avatar: 'https://i.pravatar.cc/150?u=julia',
        isVIP: true,
    },
    {
        id: '4',
        name: 'Bessie Cooper',
        category: 'Family',
        avatar: 'https://i.pravatar.cc/150?u=bessie',
        isVIP: false,
    },
    {
        id: '5',
        name: 'Albert Flores',
        category: 'Colleague',
        avatar: 'https://i.pravatar.cc/150?u=albert',
        isVIP: true,
    },
    {
        id: '6',
        name: 'Jerome Bell',
        category: 'Family',
        avatar: 'https://i.pravatar.cc/150?u=jerome',
        isVIP: false,
    },
];

const FILTERS = ['All', 'filter2', 'filter3'];

export default function SelectGuestsScreen() {
    const router = useRouter();
    const { theme } = useAppTheme();
    const colors = Colors[theme];

    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    const renderGuestCard = ({ item }: { item: Guest }) => (
        <TouchableOpacity
            style={[styles.guestCard, { backgroundColor: colors.card }]}
            activeOpacity={0.8}
        >
            <View style={styles.avatarContainer}>
                <Image
                    source={{ uri: item.avatar }}
                    style={styles.avatar}
                    contentFit="cover"
                />
                {item.isVIP && (
                    <View style={[styles.vipBadge, { backgroundColor: '#F3E8FF' }]}>
                        <Ionicons name="ribbon" size={10} color={colors.expensePurple} />
                    </View>
                )}
            </View>
            <ThemedText style={[styles.guestName, { color: colors.emphasis }]} numberOfLines={1}>
                {item.name}
            </ThemedText>
            <ThemedText style={[styles.categoryText, { color: colors.secondary }]} numberOfLines={1}>
                {item.category}
            </ThemedText>
        </TouchableOpacity>
    );

    return (
        <View style={styles.root}>
            {/* Backdrop */}
            <Pressable
                style={styles.backdrop}
                onPress={() => router.back()}
            />

            {/* Bottom Sheet Content */}
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                {/* Modal Handle */}
                <View style={[styles.handle, { backgroundColor: colors.border }]} />

                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        <ThemedText style={[styles.title, { color: colors.emphasis }]}>
                            Unassigned Guests <ThemedText style={{ color: colors.secondary }}>({UNASSIGNED_GUESTS.length})</ThemedText>
                        </ThemedText>
                    </View>
                    <TouchableOpacity
                        style={[styles.closeButton, { backgroundColor: colors.inputBackground }]}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="close" size={20} color={colors.emphasis} />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
                    <Ionicons name="search-outline" size={22} color={colors.secondary} style={styles.searchIcon} />
                    <TextInput
                        placeholder="Search Guest"
                        placeholderTextColor={colors.placeholder}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={[styles.searchInput, { color: colors.text }]}
                    />
                </View>

                {/* Filters */}
                <View style={styles.filterContainer}>
                    {FILTERS.map((filter) => (
                        <TouchableOpacity
                            key={filter}
                            onPress={() => setActiveFilter(filter)}
                            style={[
                                styles.filterChip,
                                {
                                    backgroundColor: activeFilter === filter ? colors.expensePurple : colors.card
                                }
                            ]}
                        >
                            <ThemedText
                                style={[
                                    styles.filterText,
                                    { color: activeFilter === filter ? '#FFF' : colors.expensePurple }
                                ]}
                            >
                                {filter}
                            </ThemedText>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Guests List */}
                <FlatList
                    data={UNASSIGNED_GUESTS}
                    renderItem={renderGuestCard}
                    keyExtractor={(item) => item.id}
                    numColumns={3}
                    columnWrapperStyle={styles.columnWrapper}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'transparent',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    container: {
        height: height * 0.8, // Opens approximately 80% screen height
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 20,
        width: '100%',
    },
    handle: {
        width: 60,
        height: 4,
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 20,
        opacity: 0.5,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 64,
        borderRadius: 20,
        paddingHorizontal: 16,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        height: '100%',
    },
    filterContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    filterChip: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 80,
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
    },
    listContent: {
        paddingBottom: 40,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    guestCard: {
        width: (width - 64) / 3, // 3 columns with gaps/padding
        padding: 12,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 12,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
    },
    vipBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    guestName: {
        fontSize: 14,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 4,
    },
    categoryText: {
        fontSize: 12,
        fontWeight: '500',
        textAlign: 'center',
    },
});
