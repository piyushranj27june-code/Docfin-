import { ScrollView, Text } from 'react-native';

export default function PrivacyPolicy() {
  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Privacy Policy
      </Text>

      <Text>
     Last Updated: June 2026

{"\n\n"}Information We Collect
{"\n"}• Name and account information
{"\n"}• Email address
{"\n"}• Hospital revenue and financial data
{"\n"}• Expense records
{"\n"}• Productivity records
{"\n"}• AI queries submitted through the application

{"\n\n"}How We Use Information
{"\n"}• Provide and maintain DocFin services
{"\n"}• Generate AI-powered insights
{"\n"}• Improve platform functionality
{"\n"}• Maintain user accounts
{"\n"}• Provide customer support

{"\n\n"}Data Storage and Security
{"\n"}Your information is stored securely using cloud databases and servers.

{"\n\n"}Data Sharing
{"\n"}DocFin does not sell, rent, or trade personal information.

{"\n\n"}AI Services
{"\n"}AI-powered features may use third-party AI providers to generate insights and recommendations.

{"\n\n"}Account Deletion
{"\n"}Users can permanently delete their account from within the application.

{"\n\n"}Changes to This Policy
{"\n"}This policy may be updated periodically.

{"\n\n"}Contact
{"\n"}Email: piyushranj27june@gmail.com

{"\n\n"}By using DocFin, you agree to this Privacy Policy.
      </Text>
    </ScrollView>
  );
}
