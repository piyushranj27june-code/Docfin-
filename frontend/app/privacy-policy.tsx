import { ScrollView, Text } from 'react-native';

export default function PrivacyPolicy() {
  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Privacy Policy
      </Text>

      <Text>
        DocFin respects your privacy. We collect information such as your
        account details and information you choose to provide while using the
        application.

        {"\n\n"}

        We use this information to provide services, improve the platform,
        enable AI-powered features, and communicate important updates.

        {"\n\n"}

        We do not sell your personal information.

        {"\n\n"}

        By using DocFin, you agree to this Privacy Policy.
      </Text>
    </ScrollView>
  );
}
