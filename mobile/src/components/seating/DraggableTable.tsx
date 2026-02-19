import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    runOnJS
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';
import { Colors } from '@/constants/Colors';

interface DraggableTableProps {
    id: string;
    name: string;
    x: number;
    y: number;
    maxGuests: number;
    currentGuests: number;
    isVip?: boolean;
    theme: 'light' | 'dark';
    onDragEnd: (id: string, x: number, y: number) => void;
}

const TABLE_RADIUS = 40;
const SEAT_RADIUS = 6;
const SEAT_DISTANCE = 52;
const CANVAS_SIZE = 120; // Size of the SVG container for one table

/**
 * DraggableTable - A component that represents a table in the floor plan.
 * It uses react-native-gesture-handler and reanimated for smooth drag interactions.
 */
export const DraggableTable: React.FC<DraggableTableProps> = ({
    id,
    name,
    x,
    y,
    maxGuests,
    currentGuests,
    isVip,
    theme,
    onDragEnd
}) => {
    const colors = Colors[theme];

    // Shared values for position
    const translateX = useSharedValue(x);
    const translateY = useSharedValue(y);
    const isDragging = useSharedValue(false);
    const scale = useSharedValue(1);

    // Initial position for gesture tracking
    const contextX = useSharedValue(0);
    const contextY = useSharedValue(0);

    const gesture = Gesture.Pan()
        .onStart(() => {
            isDragging.value = true;
            scale.value = withSpring(1.1);
            contextX.value = translateX.value;
            contextY.value = translateY.value;
        })
        .onUpdate((event) => {
            translateX.value = contextX.value + event.translationX;
            translateY.value = contextY.value + event.translationY;
        })
        .onEnd(() => {
            isDragging.value = false;
            scale.value = withSpring(1);
            runOnJS(onDragEnd)(id, translateX.value, translateY.value);
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value - CANVAS_SIZE / 2 },
            { translateY: translateY.value - CANVAS_SIZE / 2 },
            { scale: scale.value }
        ],
        opacity: isDragging.value ? 0.8 : 1,
        zIndex: isDragging.value ? 1000 : 1,
    }));

    // Calculate seat positions around the table
    const renderSeats = () => {
        const seats = [];
        for (let i = 0; i < maxGuests; i++) {
            const angle = (i * 2 * Math.PI) / maxGuests;
            const sx = Math.cos(angle) * SEAT_DISTANCE;
            const sy = Math.sin(angle) * SEAT_DISTANCE;

            // Color seats based on whether they are occupied
            const isOccupied = i < currentGuests;
            const seatColor = isOccupied ? colors.primary : colors.border;

            seats.push(
                <Circle
                    key={`seat-${id}-${i}`}
                    cx={sx}
                    cy={sy}
                    r={SEAT_RADIUS}
                    fill={seatColor}
                />
            );
        }
        return seats;
    };

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View style={[styles.container, animatedStyle]}>
                <Svg width={CANVAS_SIZE} height={CANVAS_SIZE} viewBox={`-${CANVAS_SIZE / 2} -${CANVAS_SIZE / 2} ${CANVAS_SIZE} ${CANVAS_SIZE}`}>
                    <G>
                        {/* Seats around the table */}
                        {renderSeats()}

                        {/* The Table itself */}
                        <Circle
                            cx={0}
                            cy={0}
                            r={TABLE_RADIUS}
                            fill={colors.card}
                            stroke={isVip ? colors.warning : colors.border}
                            strokeWidth={isVip ? 3 : 1}
                        />

                        {/* Table Name */}
                        <SvgText
                            x={0}
                            y={4}
                            fontSize="10"
                            fontWeight="bold"
                            fill={colors.text}
                            textAnchor="middle"
                        >
                            {name}
                        </SvgText>

                        {/* Guest Count */}
                        <SvgText
                            x={0}
                            y={18}
                            fontSize="8"
                            fill={colors.secondary}
                            textAnchor="middle"
                        >
                            {`${currentGuests}/${maxGuests}`}
                        </SvgText>

                        {/* VIP Badge icon if applicable */}
                        {isVip && (
                            <Circle
                                cx={TABLE_RADIUS - 10}
                                cy={-TABLE_RADIUS + 10}
                                r={6}
                                fill={colors.warning}
                            />
                        )}
                    </G>
                </Svg>
            </Animated.View>
        </GestureDetector>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: CANVAS_SIZE,
        height: CANVAS_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
