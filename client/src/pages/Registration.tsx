import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { GlassCard } from "@/components/ui/glassmorphism";
import { Header } from "@/components/Layout/Header";
import { useLanguage } from "@/hooks/use-language";
import { useVoice } from "@/hooks/use-voice";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";

const residentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  doorNumber: z.string().min(1, "Door number is required"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  phone: z.string().regex(/^\+91\d{10}$/, "Phone must be in format +91XXXXXXXXXX"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

const collectorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  employeeId: z.string().min(1, "Employee ID is required"),
  phone: z.string().regex(/^\+91\d{10}$/, "Phone must be in format +91XXXXXXXXXX"),
  areaAssigned: z.string().min(1, "Area assignment is required"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

const authoritySchema = z.object({
  authorityName: z.string().min(2, "Authority name is required"),
  employeeId: z.string().min(1, "Employee ID is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().regex(/^\+91\d{10}$/, "Phone must be in format +91XXXXXXXXXX"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export default function Registration() {
  const [, params] = useRoute("/register/:role");
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const { speak } = useVoice();
  const { login } = useApp();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const role = params?.role as 'resident' | 'collector' | 'authority';

  if (!role || !['resident', 'collector', 'authority'].includes(role)) {
    setLocation('/');
    return null;
  }

  const getSchema = () => {
    switch (role) {
      case 'resident': return residentSchema;
      case 'collector': return collectorSchema;
      case 'authority': return authoritySchema;
      default: return residentSchema;
    }
  };

  const form = useForm({
    resolver: zodResolver(getSchema()),
    defaultValues: {
      name: '',
      doorNumber: '',
      address: '',
      phone: '',
      password: '',
      employeeId: '',
      areaAssigned: '',
      authorityName: '',
      email: ''
    }
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // Prepare user data
      const userData = {
        name: data.name || data.authorityName,
        phone: data.phone,
        password: data.password,
        role
      };

      // Prepare profile data
      let profileData = {};
      if (role === 'resident') {
        profileData = {
          doorNumber: data.doorNumber,
          address: data.address,
          beaconScore: 80,
          isAvailable: true
        };
      } else if (role === 'collector') {
        profileData = {
          employeeId: data.employeeId,
          areaAssigned: data.areaAssigned,
          collectionProgress: 0
        };
      } else if (role === 'authority') {
        profileData = {
          authorityName: data.authorityName,
          employeeId: data.employeeId,
          email: data.email
        };
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: userData, profile: profileData })
      });

      if (response.ok) {
        const { user, profile } = await response.json();
        login(user, profile);
        speak('voice-welcome');
        toast({
          title: t('success'),
          description: "Registration successful!"
        });
        setLocation(`/${role}`);
      } else {
        const error = await response.json();
        toast({
          title: t('error'),
          description: error.message || "Registration failed",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: t('error'),
        description: "Network error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = () => {
    const demoData = {
      resident: {
        name: "Demo Resident",
        doorNumber: "DR001",
        address: "123 Anna Nagar, Chennai - 600040",
        phone: "+919876543210",
        password: "resident123"
      },
      collector: {
        name: "Demo Collector",
        employeeId: "GC001",
        phone: "+919876543211",
        areaAssigned: "Anna Nagar",
        password: "garbage23"
      },
      authority: {
        authorityName: "Chennai Municipal Corporation",
        employeeId: "CMC001",
        email: "admin@chennai.gov.in",
        phone: "+914423456789",
        password: "authority123"
      }
    };

    const data = demoData[role];
    Object.entries(data).forEach(([key, value]) => {
      form.setValue(key as any, value);
    });
  };

  const getRoleIcon = () => {
    switch (role) {
      case 'resident': return '🏠';
      case 'collector': return '🚛';
      case 'authority': return '🏢';
      default: return '👤';
    }
  };

  const getRoleTitle = () => {
    switch (role) {
      case 'resident': return t('resident');
      case 'collector': return t('collector');
      case 'authority': return t('authority');
      default: return 'User';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Header />
      
      <GlassCard className="max-w-md w-full">
        <button 
          onClick={() => setLocation('/')}
          className="mb-6 text-muted-foreground hover:text-foreground transition-colors"
          data-testid="back-to-home"
        >
          ← {t('back')} to Home
        </button>
        
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{getRoleIcon()}</div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {getRoleTitle()} {t('register')}
          </h2>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {role === 'resident' && (
              <>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('name')}</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="glassmorphism border-0" 
                          placeholder="Enter your full name"
                          data-testid="input-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="doorNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('door-number')}</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="glassmorphism border-0" 
                          placeholder="e.g., DR001"
                          data-testid="input-door-number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('address')}</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          className="glassmorphism border-0" 
                          placeholder="Enter your complete address"
                          rows={3}
                          data-testid="input-address"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {role === 'collector' && (
              <>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('name')}</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="glassmorphism border-0" 
                          placeholder="Enter your full name"
                          data-testid="input-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="employeeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('employee-id')}</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="glassmorphism border-0" 
                          placeholder="Generated by authority"
                          data-testid="input-employee-id"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="areaAssigned"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('area-assigned')}</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="glassmorphism border-0" 
                          placeholder="Area name"
                          data-testid="input-area-assigned"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {role === 'authority' && (
              <>
                <FormField
                  control={form.control}
                  name="authorityName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('authority-name')}</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="glassmorphism border-0" 
                          placeholder="Authority organization name"
                          data-testid="input-authority-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="employeeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('employee-id')}</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="glassmorphism border-0" 
                          placeholder="Employee ID"
                          data-testid="input-employee-id"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('email')}</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="email"
                          className="glassmorphism border-0" 
                          placeholder="official@email.com"
                          data-testid="input-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('phone')}</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="tel"
                      className="glassmorphism border-0" 
                      placeholder="+91 98765 43210"
                      data-testid="input-phone"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('password')}</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="password"
                      className="glassmorphism border-0" 
                      placeholder="Create password"
                      data-testid="input-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                data-testid="submit-registration"
              >
                {isLoading ? "Registering..." : t('register')}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleDemoFill}
                className="glassmorphism border-0"
                data-testid="demo-fill"
              >
                Demo
              </Button>
            </div>
          </form>
        </Form>
      </GlassCard>
    </div>
  );
}
