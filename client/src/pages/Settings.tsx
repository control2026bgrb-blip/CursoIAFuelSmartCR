import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { vehiclesAPI, settingsAPI } from "@/lib/api";
import { 
  Car, 
  Plus, 
  Edit, 
  Trash2, 
  Fuel, 
  Gauge, 
  User, 
  Bell, 
  Shield,
  Save,
  Loader2
} from "lucide-react";

export default function Settings() {
  const { toast } = useToast();
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [userSettings, setUserSettings] = useState({
    name: "",
    email: "",
    currency: "CRC",
    units: "metric",
    notifications: {
      fuelReminders: true,
      priceAlerts: true,
      maintenanceAlerts: true,
    },
  });

  // Get current user from localStorage
  const getCurrentUser = () => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  };

  const currentUser = getCurrentUser();

  // Load data on component mount
  useEffect(() => {
    if (currentUser?.id) {
      loadUserData();
    } else {
      setLoading(false);
    }
  }, [currentUser?.id]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Load vehicles
      const vehiclesResponse = await vehiclesAPI.getVehicles(currentUser.id);
      setVehicles(vehiclesResponse.data.vehicles);
      
      // Load user settings
      const settingsResponse = await settingsAPI.getUserSettings(currentUser.id);
      const { user, notifications } = settingsResponse.data;
      
      setUserSettings({
        name: user.name || "",
        email: user.email || "",
        currency: user.currency || "CRC",
        units: user.units || "metric",
        notifications: {
          fuelReminders: notifications.fuelReminders,
          priceAlerts: notifications.priceAlerts,
          maintenanceAlerts: notifications.maintenanceAlerts,
        },
      });
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const [newVehicle, setNewVehicle] = useState({
    name: "",
    year: "",
    fuelType: "Gasolina",
    tankCapacity: "",
    efficiency: "",
  });

  const handleAddVehicle = async () => {
    if (!newVehicle.name || !newVehicle.year || !currentUser?.id) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    try {
      const vehicleData = {
        ...newVehicle,
        isDefault: vehicles.length === 0,
      };

      const response = await vehiclesAPI.createVehicle(currentUser.id, vehicleData);
      
      setVehicles([...vehicles, response.data.vehicle]);
      setNewVehicle({
        name: "",
        year: "",
        fuelType: "Gasolina", 
        tankCapacity: "",
        efficiency: "",
      });
      setIsAddVehicleOpen(false);
      
      toast({
        title: "Vehículo agregado",
        description: `${response.data.vehicle.name} ha sido agregado exitosamente`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudo agregar el vehículo: " + error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    if (!currentUser?.id) return;
    
    try {
      await vehiclesAPI.deleteVehicle(id, currentUser.id);
      setVehicles(vehicles.filter(v => v.id !== id));
      toast({
        title: "Vehículo eliminado",
        description: "El vehículo ha sido eliminado de tu cuenta",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el vehículo: " + error.message,
        variant: "destructive",
      });
    }
  };

  const handleSetDefault = async (id: string) => {
    if (!currentUser?.id) return;
    
    try {
      const vehicle = vehicles.find(v => v.id === id);
      if (!vehicle) return;
      
      await vehiclesAPI.updateVehicle(id, currentUser.id, {
        ...vehicle,
        isDefault: true,
      });
      
      setVehicles(vehicles.map(v => ({
        ...v,
        isDefault: v.id === id
      })));
      
      toast({
        title: "Vehículo predeterminado actualizado",
        description: "Se ha establecido como vehículo predeterminado",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el vehículo: " + error.message,
        variant: "destructive",
      });
    }
  };

  const handleSaveSettings = async () => {
    if (!currentUser?.id) return;
    
    try {
      await settingsAPI.updateUserSettings(currentUser.id, {
        user: {
          name: userSettings.name,
          email: userSettings.email,
          currency: userSettings.currency,
          units: userSettings.units,
        },
        notifications: userSettings.notifications,
      });
      
      toast({
        title: "Configuración guardada",
        description: "Tus preferencias han sido actualizadas",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración: " + error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Inicia sesión requerida</h2>
          <p className="text-muted-foreground">Debes iniciar sesión para acceder a la configuración</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6" data-testid="page-settings">
      <div>
        <h1 className="text-2xl font-bold">Configuración</h1>
        <p className="text-muted-foreground">Administra tu cuenta, vehículos y preferencias</p>
      </div>

      <Tabs defaultValue="vehicles" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="vehicles">
            <Car className="mr-2 h-4 w-4" />
            Vehículos
          </TabsTrigger>
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notificaciones
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-2 h-4 w-4" />
            Seguridad
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vehicles" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Mis Vehículos</CardTitle>
                <CardDescription>
                  Administra los vehículos que usas para el seguimiento de combustible
                </CardDescription>
              </div>
              <Dialog open={isAddVehicleOpen} onOpenChange={setIsAddVehicleOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Vehículo
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Agregar Nuevo Vehículo</DialogTitle>
                    <DialogDescription>
                      Ingresa los detalles de tu vehículo para un mejor seguimiento
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre del Vehículo *</Label>
                        <Input
                          id="name"
                          placeholder="ej. Toyota Corolla"
                          value={newVehicle.name}
                          onChange={(e) => setNewVehicle({...newVehicle, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="year">Año *</Label>
                        <Input
                          id="year"
                          placeholder="2023"
                          value={newVehicle.year}
                          onChange={(e) => setNewVehicle({...newVehicle, year: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fuelType">Tipo de Combustible</Label>
                      <Select
                        value={newVehicle.fuelType}
                        onValueChange={(value) => setNewVehicle({...newVehicle, fuelType: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Gasolina">Gasolina</SelectItem>
                          <SelectItem value="Diesel">Diesel</SelectItem>
                          <SelectItem value="Eléctrico">Eléctrico</SelectItem>
                          <SelectItem value="Híbrido">Híbrido</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="tankCapacity">Capacidad del Tanque</Label>
                        <Input
                          id="tankCapacity"
                          placeholder="50 L / 60 kWh"
                          value={newVehicle.tankCapacity}
                          onChange={(e) => setNewVehicle({...newVehicle, tankCapacity: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="efficiency">Eficiencia</Label>
                        <Input
                          id="efficiency"
                          placeholder="15.5 km/L"
                          value={newVehicle.efficiency}
                          onChange={(e) => setNewVehicle({...newVehicle, efficiency: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddVehicleOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAddVehicle}>Agregar Vehículo</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vehicles.map((vehicle) => (
                  <div key={vehicle.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Car className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{vehicle.name}</h3>
                          {vehicle.isDefault && (
                            <Badge variant="secondary">Predeterminado</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {vehicle.year} • {vehicle.fuelType}
                          {vehicle.tankCapacity && ` • ${vehicle.tankCapacity}`}
                          {vehicle.efficiency && ` • ${vehicle.efficiency}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!vehicle.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefault(vehicle.id)}
                        >
                          Predeterminado
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar vehículo?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Se eliminará permanentemente
                              {vehicle.name} y todos sus registros asociados.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteVehicle(vehicle.id)}>
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>
                Actualiza tu información de perfil y preferencias
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input
                    id="name"
                    value={userSettings.name}
                    onChange={(e) => setUserSettings({...userSettings, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userSettings.email}
                    onChange={(e) => setUserSettings({...userSettings, email: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Moneda</Label>
                  <Select
                    value={userSettings.currency}
                    onValueChange={(value) => setUserSettings({...userSettings, currency: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CRC">Colones (₡)</SelectItem>
                      <SelectItem value="USD">Dólares ($)</SelectItem>
                      <SelectItem value="EUR">Euros (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="units">Sistema de Unidades</Label>
                  <Select
                    value={userSettings.units}
                    onValueChange={(value) => setUserSettings({...userSettings, units: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="metric">Métrico (L, km)</SelectItem>
                      <SelectItem value="imperial">Imperial (gal, mi)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Cambios
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferencias de Notificaciones</CardTitle>
              <CardDescription>
                Configura qué notificaciones quieres recibir
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Recordatorios de Combustible</h4>
                  <p className="text-sm text-muted-foreground">
                    Recibe alertas cuando el combustible esté bajo
                  </p>
                </div>
                <Button
                  variant={userSettings.notifications.fuelReminders ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUserSettings({
                    ...userSettings,
                    notifications: {
                      ...userSettings.notifications,
                      fuelReminders: !userSettings.notifications.fuelReminders
                    }
                  })}
                >
                  {userSettings.notifications.fuelReminders ? "Activado" : "Desactivado"}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Alertas de Precios</h4>
                  <p className="text-sm text-muted-foreground">
                    Notificaciones sobre cambios en precios de combustible
                  </p>
                </div>
                <Button
                  variant={userSettings.notifications.priceAlerts ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUserSettings({
                    ...userSettings,
                    notifications: {
                      ...userSettings.notifications,
                      priceAlerts: !userSettings.notifications.priceAlerts
                    }
                  })}
                >
                  {userSettings.notifications.priceAlerts ? "Activado" : "Desactivado"}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Alertas de Mantenimiento</h4>
                  <p className="text-sm text-muted-foreground">
                    Recordatorios para mantenimiento del vehículo
                  </p>
                </div>
                <Button
                  variant={userSettings.notifications.maintenanceAlerts ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUserSettings({
                    ...userSettings,
                    notifications: {
                      ...userSettings.notifications,
                      maintenanceAlerts: !userSettings.notifications.maintenanceAlerts
                    }
                  })}
                >
                  {userSettings.notifications.maintenanceAlerts ? "Activado" : "Desactivado"}
                </Button>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Preferencias
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Seguridad de la Cuenta</CardTitle>
              <CardDescription>
                Administra la seguridad y privacidad de tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Cambiar Contraseña</h4>
                  <div className="grid gap-2">
                    <Input type="password" placeholder="Contraseña actual" />
                    <Input type="password" placeholder="Nueva contraseña" />
                    <Input type="password" placeholder="Confirmar nueva contraseña" />
                  </div>
                  <Button className="mt-2" variant="outline">
                    Actualizar Contraseña
                  </Button>
                </div>
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2 text-destructive">Zona de Peligro</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Estas acciones son permanentes y no se pueden deshacer
                  </p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Eliminar Cuenta</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar cuenta permanentemente?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Se eliminarán permanentemente
                          todos tus datos, vehículos y registros de combustible.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive text-destructive-foreground">
                          Eliminar Cuenta
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
