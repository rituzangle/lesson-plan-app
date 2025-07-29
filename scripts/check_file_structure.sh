# Check if all required files exist
echo "Checking file structure..."

files=(
  "src/contexts/AuthContext.tsx"
  "src/services/authService.ts"
  "src/components/ErrorBoundary.tsx"
  "src/components/LoadingSpinner.tsx"
  "src/components/VoiceInput.tsx"
  "src/components/QRCodeLogin.tsx"
  "src/components/BiometricLogin.tsx"
  "src/components/AccessibilityButton.tsx"
  "src/components/layout/AppLayout.tsx"
  "src/components/layout/AuthLayout.tsx"
  "src/components/layout/Header.tsx"
  "src/components/layout/Navigation.tsx"
  "src/pages/auth/LoginPage.tsx"
  "src/pages/auth/SignUpPage.tsx"
  "src/pages/admin/AdminDashboard.tsx"
  "src/pages/teacher/TeacherDashboard.tsx"
  "src/pages/student/StudentDashboard.tsx"
  "src/pages/DashboardPage.tsx"
  "src/pages/ProfilePage.tsx"
  "src/pages/AccessibilityPage.tsx"
  "src/pages/NotFoundPage.tsx"
  "src/App.tsx"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ Missing: $file"
  fi
done

