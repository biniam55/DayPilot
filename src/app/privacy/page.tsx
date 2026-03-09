'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background p-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Privacy Policy</CardTitle>
            <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-4 text-sm">
            <section>
              <h3 className="font-semibold text-base mb-2">1. Information We Collect</h3>
              <p className="text-muted-foreground">
                DayPilot collects minimal information necessary to provide the service:
              </p>
              <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1">
                <li><strong>Authentication Data:</strong> Email address and name (via Firebase Authentication)</li>
                <li><strong>Local Data:</strong> Tasks, preferences, and settings stored on your device</li>
                <li><strong>Usage Data:</strong> Basic analytics to improve the service</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">2. How We Use Your Information</h3>
              <p className="text-muted-foreground">
                Your information is used to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1">
                <li>Provide and maintain the service</li>
                <li>Authenticate your account</li>
                <li>Improve user experience</li>
                <li>Send important service updates</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">3. Data Storage</h3>
              <p className="text-muted-foreground">
                <strong>Local Storage:</strong> Your tasks, preferences, and settings are stored locally on 
                your device using browser storage. This data never leaves your device unless you explicitly 
                export it.
              </p>
              <p className="text-muted-foreground mt-2">
                <strong>Authentication:</strong> Authentication is handled by Firebase Authentication, a 
                secure service by Google. We do not store passwords.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">4. Data Sharing</h3>
              <p className="text-muted-foreground">
                We do not sell, trade, or share your personal information with third parties, except:
              </p>
              <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1">
                <li>Firebase Authentication for secure login</li>
                <li>Google AI for AI-powered features (only when you use AI features)</li>
                <li>When required by law</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">5. AI Features</h3>
              <p className="text-muted-foreground">
                When you use AI-powered features, your task data is sent to Google's Gemini AI service to 
                generate suggestions. This data is processed in real-time and not stored by the AI service.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">6. Cookies and Tracking</h3>
              <p className="text-muted-foreground">
                DayPilot uses browser storage (localStorage) to store your preferences and data locally. 
                We use minimal analytics to understand how the app is used and improve the service.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">7. Data Security</h3>
              <p className="text-muted-foreground">
                We implement security measures to protect your data:
              </p>
              <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1">
                <li>Secure authentication via Firebase</li>
                <li>HTTPS encryption for all communications</li>
                <li>Local data storage on your device</li>
                <li>No server-side storage of personal tasks</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">8. Your Rights</h3>
              <p className="text-muted-foreground">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1">
                <li>Access your data at any time</li>
                <li>Export your data</li>
                <li>Delete your account and all associated data</li>
                <li>Opt-out of analytics</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">9. Children's Privacy</h3>
              <p className="text-muted-foreground">
                DayPilot is not intended for children under 13. We do not knowingly collect information 
                from children under 13.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">10. Changes to Privacy Policy</h3>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. We will notify you of any changes by 
                posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">11. Contact Us</h3>
              <p className="text-muted-foreground">
                If you have questions about this Privacy Policy or how we handle your data, please contact 
                us through the application settings.
              </p>
            </section>

            <section className="bg-muted/30 p-4 rounded-lg">
              <h3 className="font-semibold text-base mb-2">Your Privacy Matters</h3>
              <p className="text-muted-foreground">
                DayPilot is designed with privacy in mind. Your tasks and personal data stay on your device. 
                We only use authentication to identify you and provide a personalized experience. You have 
                full control over your data.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
