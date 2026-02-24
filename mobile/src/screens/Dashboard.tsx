import { BudgetCard } from "@/components/dashboard/BudgetCard";
import { CountdownBanner } from "@/components/dashboard/CountdownBanner";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { GuestSummary } from "@/components/dashboard/GuestSummary";
import { PlanningProgress, UpcomingTask } from "@/components/dashboard/PlanningProgress";
import { RemindersCard } from "@/components/dashboard/RemindersCard";
import { SeatingPlan } from "@/components/dashboard/SeatingPlan";
import { PaymentItem, ToDoPayments } from "@/components/dashboard/ToDoPayments";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useAppTheme } from "@/context/ThemeContext";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Dashboard() {
  const { theme } = useAppTheme();
  const colors = Colors[theme];

  const dummyPayments: PaymentItem[] = [
    {
      id: "1",
      title: "Hotel Payments",
      subtitle: "Groom | Hilton Colombo",
      amount: 200000,
      icon: "business-outline",
    },
    {
      id: "2",
      title: "Wedding Cards",
      subtitle: "Bride | Hemax Creations",
      amount: 50000,
      icon: "mail-outline",
    },
  ];

  const dummyTasks: UpcomingTask[] = [
    {
      id: "1",
      title: "Book Florist",
      dueDate: "Due Tomorrow",
    },
    {
      id: "2",
      title: "Salon Appointments",
      dueDate: "Due in 3 Days",
    },
  ];

  return (
    <ThemedView style={[styles.container, { backgroundColor: "transparent" }]}>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        {/* Fixed Header and Countdown Section */}
        <View style={styles.fixedSection}>
          <DashboardHeader userName="Sara & John" />
          <CountdownBanner />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Today's Reminders Section */}
          <RemindersCard
            mainReminder="Photographer Meeting at 2:00pm"
            alertCount={2}
            overdueCount={1}
            onPress={() => console.log("Reminders pressed")}
          />

          {/* Budget Section */}
          <BudgetCard
            totalBudget={300000}
            spentAmount={150000}
          />

          {/* To-Do Payments Section */}
          <ToDoPayments
            payments={dummyPayments}
            onPaymentPress={(item) => console.log("Pressed:", item.title)}
          />

          {/* Guest List Section */}
          <GuestSummary />

          {/* Planning Progress Section */}
          <PlanningProgress
            progress={25}
            upcomingTasks={dummyTasks}
          />

          {/* Seating Plan Section */}
          <SeatingPlan
            assigned={30}
            total={150}
            onManagePress={() => console.log("Manage Seating pressed")}
          />

          {/* Other sections will be added component by component */}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fixedSection: {
    zIndex: 10,
  },
  scrollContent: {
    paddingBottom: 20,
    paddingTop: 10,
  },
});
