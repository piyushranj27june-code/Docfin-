import { ScrollView, Text } from 'react-native';

export default function TermsOfService() {
  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Terms of Service
      </Text>

      <Text>
        By using DocFin, you agree to use the platform responsibly and provide
        accurate account information.

        {"\n\n"}

        AI-generated information is provided for informational purposes only and
        should not replace professional medical judgment.

        {"\n\n"}

        DocFin may update or modify services as necessary.

        {"\n\n"}

        Continued use of the platform constitutes acceptance of these terms.
      </Text>
    </ScrollView>
  );
}
