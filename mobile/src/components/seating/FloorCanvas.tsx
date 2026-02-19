import React, { forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { DraggableTable } from './DraggableTable';

interface TableData {
    id: string;
    name: string;
    description: string;
    currentGuests: number;
    maxGuests: number;
    isVip: boolean;
    x: number;
    y: number;
}

interface FloorCanvasProps {
    tables: TableData[];
    theme: 'light' | 'dark';
    onTableMove: (id: string, x: number, y: number) => void;
}

export interface FloorCanvasRef {
    zoomIn: () => void;
    zoomOut: () => void;
}

/**
 * FloorCanvas - The main interactive area for the seating arrangement.
 * Features a stationary gesture surface that allows the user to pan/zoom 
 * by touching any part of the screen.
 * 
 * Exposes zoom methods via ref for external controls.
 */
export const FloorCanvas = forwardRef<FloorCanvasRef, FloorCanvasProps>(({ tables, theme, onTableMove }, ref) => {
    // Transformation values for the entire canvas
    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const savedTranslateX = useSharedValue(0);
    const savedTranslateY = useSharedValue(0);

    // Expose methods to parent via ref
    useImperativeHandle(ref, () => ({
        zoomIn: () => {
            const newScale = Math.min(scale.value * 1.25, 4); // Cap max zoom
            scale.value = withSpring(newScale);
            savedScale.value = newScale;
        },
        zoomOut: () => {
            const newScale = Math.max(scale.value / 1.25, 0.4); // Cap min zoom
            scale.value = withSpring(newScale);
            savedScale.value = newScale;
        }
    }));

    // Zoom Gesture (Pinch)
    const pinchGesture = Gesture.Pinch()
        .onUpdate((event) => {
            scale.value = savedScale.value * event.scale;
        })
        .onEnd(() => {
            savedScale.value = scale.value;
        });

    // Pan Gesture (Move)
    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            translateX.value = savedTranslateX.value + event.translationX;
            translateY.value = savedTranslateY.value + event.translationY;
        })
        .onEnd(() => {
            savedTranslateX.value = translateX.value;
            savedTranslateY.value = translateY.value;
        });

    // Combine gestures for simultaneous manipulation
    const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

    // Dynamic style for the entire canvas movement
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value }
        ],
    }));

    return (
        <GestureHandlerRootView style={styles.container}>
            <GestureDetector gesture={composedGesture}>
                <View style={styles.gestureSurface}>
                    <Animated.View style={[styles.canvasFrame, animatedStyle]}>
                        {tables.map((table) => (
                            <DraggableTable
                                key={table.id}
                                id={table.id}
                                name={table.name}
                                x={table.x}
                                y={table.y}
                                maxGuests={table.maxGuests}
                                currentGuests={currentGuestsFromMock(table.id, tables)}
                                isVip={table.isVip}
                                theme={theme}
                                onDragEnd={onTableMove}
                            />
                        ))}
                    </Animated.View>
                </View>
            </GestureDetector>
        </GestureHandlerRootView>
    );
});

// Helper to ensure currentGuests is correctly typed/available
const currentGuestsFromMock = (id: string, tables: any[]) => {
    const table = tables.find(t => t.id === id);
    return table ? table.currentGuests : 0;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: 'hidden',
        backgroundColor: 'transparent',
    },
    gestureSurface: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
    },
    canvasFrame: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
