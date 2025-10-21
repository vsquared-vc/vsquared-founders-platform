import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Users, DollarSign, MessageSquare, Briefcase, FileText, Mail } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="flex-1 flex flex-col gap-12 w-full max-w-none p-5">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold"># Vsquared Ventures Founders Platform</h1>
        <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
          Welcome to the Vsquared Ventures Founders Platform! Here you will find resources, insights and a community of founders to support your journey. Access expert advice, contacts and partnership offerings, designed to help you on your growth journey. Let's break down barriers and accelerate innovation together!
        </p>
        <p className="text-muted-foreground">
          For any questions surrounding the platform, please reach out to our Head of Platform & Communications:{" "}
          <a href="mailto:gina@vsquared.vc" className="text-primary hover:underline">
            gina@vsquared.vc
          </a>
        </p>
        <div className="pt-4">
          <Button asChild size="lg" className="text-lg px-8 py-3">
            <Link href="/funds">
              Go to Fund Ecosystem
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Getting Started */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Getting Started
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="https://www.notion.so/Meet-the-Vsquared-team-17a07e87807880e8b4fac7dce9c766e3" target="_blank" rel="noopener noreferrer">
                Meet the Vsquared team
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="https://www.notion.so/Set-up-kick-off-meetings-19007e878078802989fcfbea62a4fe05" target="_blank" rel="noopener noreferrer">
                Set up kick-off meetings
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="https://www.notion.so/Our-platform-offering-18207e87807880bea774c1138dd61a20" target="_blank" rel="noopener noreferrer">
                Our platform offering
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="https://www.notion.so/Post-investment-closing-checklist-18b07e87807880ea8a50d13b60d8ea90" target="_blank" rel="noopener noreferrer">
                Post-investment closing checklist
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="https://www.notion.so/Join-the-Vsquared-founders-network-launch-coming-soon-18207e878078801e9178d0d22852b060" target="_blank" rel="noopener noreferrer">
                Join the Vsquared founders network
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Network & Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Network & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="https://www.notion.so/18207e87807880689cebc13ca8208420" target="_blank" rel="noopener noreferrer">
                Browse our network recommendations
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="https://www.notion.so/Connecting-our-portfolio-18207e878078806faea2e07db69a4f9f" target="_blank" rel="noopener noreferrer">
                Connecting our portfolio
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="https://www.notion.so/Partnerships-26f07e87807880b59fb7e36e96bfa5c4" target="_blank" rel="noopener noreferrer">
                Partnerships
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Finance & Fundraising */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Finance & Fundraising
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="https://www.notion.so/Guide-Setting-up-your-baseline-reporting-infrastructure-18307e878078804ebdd2ef7dac46f4e9" target="_blank" rel="noopener noreferrer">
                Guide: Setting up baseline reporting
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="https://www.notion.so/Guide-Your-Annual-ESG-reporting-19607e87807880be8cbdee4a63a91bf9" target="_blank" rel="noopener noreferrer">
                Guide: Your Annual ESG reporting
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="https://www.notion.so/What-to-look-for-in-a-good-term-sheet-8-key-areas-to-pay-attention-to-18307e878078802a9a03ea58a344b9b7" target="_blank" rel="noopener noreferrer">
                What to look for in a good term sheet
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="https://www.notion.so/Financial-Business-Set-Up-of-your-company-18207e8780788072b500eb680788455f" target="_blank" rel="noopener noreferrer">
                Financial/Business Set-Up of your company
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Communications & PR Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Communications & PR Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="https://www.notion.so/Guide-How-to-announce-your-financing-round-15107e8780788111adebfb4f92330b7d" target="_blank" rel="noopener noreferrer">
                How to announce your financing round
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="https://www.notion.so/Your-baseline-communications-set-up-as-a-seed-Series-A-company-15107e878078806ca7bed99d87922599" target="_blank" rel="noopener noreferrer">
                Your baseline communications set-up
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="https://www.notion.so/Startup-tech-media-list-15107e87807881a285ebecf54ba74f4b" target="_blank" rel="noopener noreferrer">
                Startup/tech media list
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="https://www.notion.so/Guide-How-to-write-a-fundraising-press-release-19007e87807880aba3f4f3c8fae024f4" target="_blank" rel="noopener noreferrer">
                How to write fundraising press release
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* HR */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              HR
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="https://www.notion.so/Guide-How-to-effectively-hire-and-assess-potential-talent-incl-evaluation-template-1c207e87807880ec9b93c44dceb80d5e" target="_blank" rel="noopener noreferrer">
                Guide: How to effectively hire talent
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Special Announcements */}
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Special Announcements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="https://www.notion.so/Guide-How-to-announce-your-financing-round-15107e8780788111adebfb4f92330b7d" target="_blank" rel="noopener noreferrer">
                📰 Let us announce your fundraise together
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="https://www.notion.so/Upcoming-events-we-are-hosting-19007e87807880a4b0cbe7c05603dc97" target="_blank" rel="noopener noreferrer">
                Upcoming events we are hosting
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}