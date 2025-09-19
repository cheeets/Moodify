import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack>
        {}
        <Stack.Screen 
          name="index" 
          options={{ title: "Home" }} 
        />

        {}
        <Stack.Screen 
          name="auth/login" 
          options={{ title: "Login" }} 
        />
        <Stack.Screen 
          name="auth/signup" 
          options={{ title: "Sign Up" }} 
        />

        {}
        <Stack.Screen 
          name="goals" 
          options={{ headerShown: false }} 
        />

        {}
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  )
}
