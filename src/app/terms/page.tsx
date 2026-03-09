'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TermsPage() {
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
            <CardTitle className="text-2xl">Terms of Service</CardTitle>
            <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-4 text-sm">
            <section>
              <h3 className="font-semibold text-base mb-2">1. Acceptance of Terms</h3>
              <p className="text-muted-foreground">
                By accessing and using DayPilot, you accept and agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use the application.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">2. Use of Service</h3>
              <p className="text-muted-foreground">
                DayPilot is a personal task management and planning application. You may use this service for 
                personal, non-commercial purposes. You are responsible for maintaining the confidentiality of 
                your account credentials.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">3. Data Storage</h3>
              <p className="text-muted-foreground">
                Your data is stored locally on your device using browser storage. We do not store your tasks, 
                preferences, or personal information on our servers. Authentication is handled securely through 
                Firebase Authentication.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">4. User Responsibilities</h3>
              <p className="text-muted-foreground">
                You agree to use DayPilot responsibly and not to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1">
                <li>Use the service for any illegal purposes</li>
                <li>Attempt to gain unauthorized access to the service</li>
                <li>Interfere with or disrupt the service</li>
                <li>Share your account credentials with others</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">5. AI Features</h3>
              <p className="text-muted-foreground">
                DayPilot uses AI-powered features to provide schedule suggestions. These suggestions are 
                automated and should be reviewed before implementation. We are not responsible for decisions 
                made based on AI suggestions.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">6. Disclaimer of Warranties</h3>
              <p className="text-muted-foreground">
                DayPilot is provided "as is" without warranties of any kind. We do not guarantee that the 
                service will be uninterrupted, secure, or error-free.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">7. Limitation of Liability</h3>
              <p className="text-muted-foreground">
                We shall not be liable for any indirect, incidental, special, or consequential damages 
                resulting from your use of DayPilot.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">8. Changes to Terms</h3>
              <p className="text-muted-foreground">
                We reserve the right to modify these terms at any time. Continued use of the service after 
                changes constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">9. Account Termination</h3>
              <p className="text-muted-foreground">
                You may delete your account at any time through the settings page. Upon deletion, all your 
                local data will be removed from your device.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">10. Contact</h3>
              <p className="text-muted-foreground">
                If you have any questions about these Terms of Service, please contact us through the 
                application settings.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
