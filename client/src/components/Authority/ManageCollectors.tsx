import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { GlassCard } from "@/components/ui/glassmorphism";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";
import { mockCollectors } from "@/data/mockData";

interface ManageCollectorsProps {
  onClose: () => void;
}

const addCollectorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  employeeId: z.string().min(3, "Employee ID must be at least 3 characters"),
  phone: z.string().regex(/^\+91\d{10}$/, "Phone must be in format +91XXXXXXXXXX"),
  areaAssigned: z.string().min(2, "Area must be specified")
});

export function ManageCollectors({ onClose }: ManageCollectorsProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [collectors, setCollectors] = useState(mockCollectors);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCollector, setEditingCollector] = useState<any>(null);

  const form = useForm({
    resolver: zodResolver(addCollectorSchema),
    defaultValues: {
      name: "",
      employeeId: "",
      phone: "",
      areaAssigned: ""
    }
  });

  const handleAddCollector = async (data: any) => {
    try {
      // Generate unique ID and employee ID
      const newCollectorId = `collector-${Date.now()}`;
      const newEmployeeId = data.employeeId || `GC${String(collectors.length + 1).padStart(3, '0')}`;
      
      const newCollector = {
        id: newCollectorId,
        name: data.name,
        employeeId: newEmployeeId,
        phone: data.phone,
        area: data.areaAssigned,
        totalTips: 0,
        rating: 0
      };

      // In real app, this would be an API call
      const response = await fetch('/api/collectors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: {
            name: data.name,
            phone: data.phone,
            password: 'garbage23', // Default password
            role: 'collector'
          },
          profile: {
            employeeId: newEmployeeId,
            areaAssigned: data.areaAssigned,
            collectionProgress: 0
          }
        })
      });

      if (response.ok) {
        setCollectors(prev => [...prev, newCollector]);
        setShowAddForm(false);
        form.reset();
        toast({
          title: "Collector Added",
          description: `${data.name} has been added successfully`
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add collector",
        variant: "destructive"
      });
    }
  };

  const handleRemoveCollector = async (collectorId: string, collectorName: string) => {
    if (!confirm(`Are you sure you want to remove ${collectorName}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/collectors/${collectorId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setCollectors(prev => prev.filter(c => c.id !== collectorId));
        toast({
          title: "Collector Removed",
          description: `${collectorName} has been removed successfully`
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove collector",
        variant: "destructive"
      });
    }
  };

  const handleEditCollector = (collector: any) => {
    setEditingCollector(collector);
    form.setValue('name', collector.name);
    form.setValue('employeeId', collector.employeeId);
    form.setValue('phone', collector.phone);
    form.setValue('areaAssigned', collector.area);
    setShowAddForm(true);
  };

  const handleUpdateCollector = async (data: any) => {
    try {
      const response = await fetch(`/api/collectors/${editingCollector.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        setCollectors(prev => prev.map(c => 
          c.id === editingCollector.id 
            ? { ...c, ...data, area: data.areaAssigned }
            : c
        ));
        setShowAddForm(false);
        setEditingCollector(null);
        form.reset();
        toast({
          title: "Collector Updated",
          description: `${data.name} has been updated successfully`
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update collector",
        variant: "destructive"
      });
    }
  };

  const onSubmit = (data: any) => {
    if (editingCollector) {
      handleUpdateCollector(data);
    } else {
      handleAddCollector(data);
    }
  };

  const generateEmployeeId = () => {
    const nextId = `GC${String(collectors.length + 1).padStart(3, '0')}`;
    form.setValue('employeeId', nextId);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-foreground">{t('manage-collectors')}</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-foreground">Collectors Management</h3>
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            data-testid="add-collector-button"
          >
            + Add Collector
          </Button>
        </div>

        {/* Add/Edit Collector Form */}
        {showAddForm && (
          <GlassCard>
            <h4 className="font-semibold text-foreground mb-4">
              {editingCollector ? 'Edit Collector' : 'Add New Collector'}
            </h4>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="glassmorphism border-0" 
                            placeholder="Enter full name"
                            data-testid="collector-name-input"
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
                        <FormLabel className="flex items-center gap-2">
                          Employee ID
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={generateEmployeeId}
                            className="glassmorphism border-0 h-6 px-2 text-xs"
                          >
                            Generate
                          </Button>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="glassmorphism border-0" 
                            placeholder="e.g., GC001"
                            data-testid="employee-id-input"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="tel"
                            className="glassmorphism border-0" 
                            placeholder="+91 98765 43210"
                            data-testid="phone-input"
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
                        <FormLabel>Area Assigned</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="glassmorphism border-0" 
                            placeholder="e.g., Anna Nagar"
                            data-testid="area-input"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button 
                    type="submit"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    data-testid="save-collector-button"
                  >
                    {editingCollector ? 'Update Collector' : 'Add Collector'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingCollector(null);
                      form.reset();
                    }}
                    className="glassmorphism border-0"
                    data-testid="cancel-button"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </GlassCard>
        )}

        {/* Collectors List */}
        <GlassCard>
          <h4 className="font-semibold text-foreground mb-4">Current Collectors ({collectors.length})</h4>
          <div className="space-y-3">
            {collectors.map((collector) => (
              <div key={collector.id} className="p-4 glassmorphism rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center text-xl text-white">
                      👨‍💼
                    </div>
                    <div>
                      <h5 className="font-semibold text-foreground">{collector.name}</h5>
                      <p className="text-sm text-muted-foreground">
                        ID: {collector.employeeId} • Area: {collector.area}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Phone: {collector.phone}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Tips:</span>
                        <span className="text-accent font-semibold">₹{collector.totalTips}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Rating:</span>
                        <div className="flex">
                          {Array.from({ length: 5 }, (_, i) => (
                            <span 
                              key={i} 
                              className={`text-sm ${i < Math.floor(collector.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleEditCollector(collector)}
                        className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                        data-testid={`edit-${collector.id}`}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleRemoveCollector(collector.id, collector.name)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        data-testid={`remove-${collector.id}`}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-4">
          <GlassCard className="text-center">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Total Collectors</h4>
            <p className="text-2xl font-bold text-foreground">{collectors.length}</p>
          </GlassCard>
          
          <GlassCard className="text-center">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Active Areas</h4>
            <p className="text-2xl font-bold text-primary">
              {new Set(collectors.map(c => c.area)).size}
            </p>
          </GlassCard>
          
          <GlassCard className="text-center">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Top Rating</h4>
            <p className="text-2xl font-bold text-yellow-500">
              {Math.max(...collectors.map(c => c.rating)).toFixed(1)}
            </p>
          </GlassCard>
          
          <GlassCard className="text-center">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Total Tips Earned</h4>
            <p className="text-2xl font-bold text-accent">
              ₹{collectors.reduce((sum, c) => sum + c.totalTips, 0)}
            </p>
          </GlassCard>
        </div>

        {/* Close Button */}
        <Button onClick={onClose} variant="outline" className="w-full glassmorphism border-0">
          Close
        </Button>
      </div>
    </>
  );
}
