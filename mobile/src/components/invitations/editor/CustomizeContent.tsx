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
                    <TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                        activeOpacity={1}
                    >
                        <TextField
                            label="Date"
                            value={formatDate(date)}
                            editable={false}
                            labelStyle={labelStyle}
                            leftIcon={<Ionicons name="calendar-outline" size={18} color={colors.secondary} />}
                            pointerEvents="none"
                        />
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
});
