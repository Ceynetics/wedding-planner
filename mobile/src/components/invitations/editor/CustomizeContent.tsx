import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { TextField } from '@/components/TextField';
import { Colors } from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';
import { DatePicker } from '@/components/DatePicker';

interface CustomizeContentProps {
    name1: string;
    onName1Change: (text: string) => void;
    name2: string;
    onName2Change: (text: string) => void;
    date: Date;
    onDateChange: (date: Date) => void;
    time: string;
    onTimeChange: (text: string) => void;
    venue: string;
    onVenueChange: (text: string) => void;
}

export function CustomizeContent({
    name1,
    onName1Change,
    name2,
    onName2Change,
    date,
    onDateChange,
    time,
    onTimeChange,
    venue,
    onVenueChange,
}: CustomizeContentProps) {
    const { theme } = useAppTheme();
    const colors = Colors[theme];
    const [showDatePicker, setShowDatePicker] = useState(false);

    const formatDate = (date: Date) => {
        const d = date.getDate();
        const m = date.getMonth() + 1;
        const y = date.getFullYear();
        return `${d < 10 ? '0' + d : d}/${m < 10 ? '0' + m : m}/${y}`;
    };

    const labelStyle = {
        color: colors.emphasis || colors.primary,
        fontSize: 16,
        fontWeight: "700" as const,
        marginBottom: 8,
    };

    return (
        <View style={styles.container}>
            <ThemedText style={[styles.sectionTitle, { color: colors.emphasis || colors.primary }]}>
                Customize Card Content
            </ThemedText>

            <View style={styles.row}>
                <View style={styles.halfWidth}>
                    <TextField
                        label="Name 1"
                        placeholder="Enter your name"
                        value={name1}
                        onChangeText={onName1Change}
                        labelStyle={labelStyle}
                    />
                </View>
                <View style={styles.halfWidth}>
                    <TextField
                        label="Name 2"
                        placeholder="Enter your name"
                        value={name2}
                        onChangeText={onName2Change}
                        labelStyle={labelStyle}
                    />
                </View>
            </View>

            <View style={styles.row}>
                <View style={styles.halfWidth}>
                    <ThemedText style={labelStyle}>Date</ThemedText>
                    <TouchableOpacity
                        style={[styles.selector, { backgroundColor: colors.card }]}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Ionicons name="calendar-outline" size={18} color={colors.secondary} />
                        <ThemedText style={[styles.selectorText, { color: colors.text }]}>
                            {formatDate(date)}
                        </ThemedText>
                    </TouchableOpacity>
                </View>
                <View style={styles.halfWidth}>
                    <TextField
                        label="Time"
                        placeholder="00:00"
                        value={time}
                        onChangeText={onTimeChange}
                        labelStyle={labelStyle}
                        leftIcon={<Ionicons name="time-outline" size={18} color={colors.secondary} />}
                    />
                </View>
            </View>

            <View style={styles.fullWidth}>
                <TextField
                    label="Add the Venue"
                    placeholder="e.g : 1st street, Kirulapona Colombo."
                    value={venue}
                    onChangeText={onVenueChange}
                    labelStyle={labelStyle}
                    leftIcon={<Ionicons name="location-outline" size={18} color={colors.secondary} />}
                />
            </View>

            <DatePicker
                visible={showDatePicker}
                onClose={() => setShowDatePicker(false)}
                value={date}
                onChange={(newDate) => {
                    onDateChange(newDate);
                    setShowDatePicker(false);
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        gap: 16,
    },
    halfWidth: {
        flex: 1,
    },
    fullWidth: {
        width: '100%',
    },
    selector: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 52,
        borderRadius: 12,
        paddingHorizontal: 12,
        gap: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    selectorText: {
        fontSize: 14,
        fontWeight: '500',
    },
});
