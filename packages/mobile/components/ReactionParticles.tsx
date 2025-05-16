import { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";

interface ParticleProps {
  color: string;
  delay: number;
  x: number;
  y: number;
  size: number;
}

function Particle({ color, delay, x, y, size }: ParticleProps) {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(0);

  useEffect(() => {
    // Start animation
    opacity.value = withDelay(delay, withTiming(1, { duration: 200 }));
    scale.value = withDelay(delay, withTiming(1, { duration: 300 }));
    translateX.value = withDelay(
      delay,
      withTiming(x, {
        duration: 500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      })
    );
    translateY.value = withDelay(
      delay,
      withTiming(y, {
        duration: 500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      })
    );

    // Fade out
    const timerId = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 300 });
      scale.value = withTiming(0.5, { duration: 300 });
    }, delay + 300);

    return () => clearTimeout(timerId);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.particle,
        { backgroundColor: color, width: size, height: size },
        animatedStyle,
      ]}
    />
  );
}

interface ReactionParticlesProps {
  color: string;
}

export function ReactionParticles({ color }: ReactionParticlesProps) {
  // Create particles in different directions
  const particles = Array.from({ length: 8 }).map((_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    const distance = 45 + Math.random() * 10;
    return {
      id: i,
      color,
      delay: Math.random() * 100,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      size: 5 + Math.random() * 4,
    };
  });

  return (
    <View style={styles.container}>
      {particles.map((particle) => (
        <Particle
          key={particle.id}
          color={particle.color}
          delay={particle.delay}
          x={particle.x}
          y={particle.y}
          size={particle.size}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  particle: {
    position: "absolute",
    borderRadius: 100,
  },
});
