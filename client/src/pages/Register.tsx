import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, QrCode, Bluetooth, FileText, Upload, Check, Smartphone, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { vehiclesAPI, fuelRecordsAPI } from "@/lib/api";

export default function Register() {
  const [method, setMethod] = useState<string>("manual");
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const { toast } = useToast();

  // Get current user from localStorage
  const getCurrentUser = () => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  };

  const currentUser = getCurrentUser();

  const [formData, setFormData] = useState({
    vehicleId: "",
    liters: "",
    pricePerLiter: "",
    totalCost: "",
    odometer: "",
    station: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  // Load user vehicles on component mount
  useEffect(() => {
    if (currentUser?.id) {
      loadVehicles();
    } else {
      setLoadingVehicles(false);
    }
  }, [currentUser?.id]);

  const loadVehicles = async () => {
    try {
      setLoadingVehicles(true);
      const response = await vehiclesAPI.getVehicles(currentUser.id);
      setVehicles(response.data.vehicles);
      
      // Auto-select first vehicle if available
      const firstVehicle = response.data.vehicles[0];
      if (firstVehicle) {
        setFormData(prev => ({ ...prev, vehicleId: firstVehicle.id }));
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los vehículos: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoadingVehicles(false);
    }
  };

  // Calculate total cost when liters or price changes
  useEffect(() => {
    if (formData.liters && formData.pricePerLiter) {
      const total = (parseFloat(formData.liters) * parseFloat(formData.pricePerLiter)).toFixed(2);
      setFormData(prev => ({ ...prev, totalCost: total }));
    }
  }, [formData.liters, formData.pricePerLiter]);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      
      // Find a vehicle to use for the mock data
      const vehicleToUse = vehicles[0];
      
      setFormData({
        vehicleId: vehicleToUse?.id || "",
        liters: "45.2",
        pricePerLiter: "700",
        totalCost: "31640",
        odometer: "45320",
        station: "Gasolinera Delta - Escazú",
        date: new Date().toISOString().split("T")[0],
        notes: "Datos extraídos automáticamente del recibo",
      });
      toast({
        title: "Recibo escaneado exitosamente",
        description: "Datos extraídos del recibo con OCR",
      });
    }, 2000);
  };

  const handleSubmit = async () => {
    if (!currentUser?.id) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para registrar combustible",
        variant: "destructive",
      });
      return;
    }

    if (!formData.vehicleId || !formData.liters || !formData.pricePerLiter) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const recordData = {
        vehicleId: formData.vehicleId,
        liters: formData.liters,
        pricePerLiter: formData.pricePerLiter,
        totalCost: formData.totalCost,
        odometer: formData.odometer || null,
        station: formData.station || null,
        date: new Date(formData.date).toISOString(),
        notes: formData.notes || null,
      };

      await fuelRecordsAPI.createFuelRecord(currentUser.id, recordData);
      
      toast({
        title: "Registro guardado",
        description: "Tu registro de combustible ha sido guardado exitosamente",
      });
      
      // Reset form
      setScanComplete(false);
      setFormData({
        vehicleId: vehicles[0]?.id || "",
        liters: "",
        pricePerLiter: "",
        totalCost: "",
        odometer: "",
        station: "",
        date: new Date().toISOString().split("T")[0],
        notes: "",
      });
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudo guardar el registro: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Inicia sesión requerida</h2>
          <p className="text-muted-foreground">Debes iniciar sesión para registrar combustible</p>
        </div>
      </div>
    );
  }

  if (loadingVehicles) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No tienes vehículos registrados</h2>
          <p className="text-muted-foreground mb-4">Debes agregar al menos un vehículo antes de registrar combustible</p>
          <Button onClick={() => window.location.href = '/settings'}>
            Ir a Configuración
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6" data-testid="page-register">
      <div>
        <h1 className="text-2xl font-bold">Agregar Registro</h1>
        <p className="text-muted-foreground">Registra una nueva carga de combustible o electricidad</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Método de Ingreso</CardTitle>
            <CardDescription>Selecciona cómo quieres agregar tu registro</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={method} onValueChange={setMethod}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="ocr" data-testid="tab-ocr">
                  <Camera className="mr-1 h-4 w-4" />
                  <span className="hidden sm:inline">OCR</span>
                </TabsTrigger>
                <TabsTrigger value="qr" data-testid="tab-qr">
                  <QrCode className="mr-1 h-4 w-4" />
                  <span className="hidden sm:inline">QR</span>
                </TabsTrigger>
                <TabsTrigger value="obd" data-testid="tab-obd">
                  <Bluetooth className="mr-1 h-4 w-4" />
                  <span className="hidden sm:inline">OBD</span>
                </TabsTrigger>
                <TabsTrigger value="manual" data-testid="tab-manual">
                  <FileText className="mr-1 h-4 w-4" />
                  <span className="hidden sm:inline">Manual</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ocr" className="mt-6 space-y-4">
                <div className="rounded-lg border-2 border-dashed p-8">
                  {!scanComplete ? (
                    <div className="flex flex-col items-center text-center">
                      {isScanning ? (
                        <>
                          <div className="mb-4 h-20 w-20 animate-pulse rounded-full bg-primary/20" />
                          <p className="text-sm font-medium">Escaneando recibo...</p>
                          <p className="text-xs text-muted-foreground">Extrayendo datos con IA</p>
                        </>
                      ) : (
                        <>
                          <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
                          <h3 className="font-medium">Subir Foto del Recibo</h3>
                          <p className="mb-4 text-sm text-muted-foreground">
                            Nuestra IA extraerá automáticamente litros, precio, fecha y kilometraje
                          </p>
                          <div className="flex gap-2">
                            <Button onClick={handleScan} data-testid="button-take-photo">
                              <Camera className="mr-2 h-4 w-4" />
                              Tomar Foto
                            </Button>
                            <Button variant="outline" onClick={handleScan} data-testid="button-upload">
                              <Upload className="mr-2 h-4 w-4" />
                              Subir
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                        <Check className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="font-medium text-green-600">Datos Extraídos Exitosamente</h3>
                      <p className="text-sm text-muted-foreground">Revisa los datos abajo y guarda</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="qr" className="mt-6 space-y-4">
                <div className="rounded-lg border-2 border-dashed p-8">
                  <div className="flex flex-col items-center text-center">
                    <QrCode className="mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="font-medium">Escanear Código QR de Gasolinera</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Apunta tu cámara al código QR en la bomba
                    </p>
                    <Button onClick={handleScan} data-testid="button-scan-qr">
                      <Smartphone className="mr-2 h-4 w-4" />
                      Abrir Cámara
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="obd" className="mt-6 space-y-4">
                <div className="rounded-lg border-2 border-dashed p-8">
                  <div className="flex flex-col items-center text-center">
                    <Bluetooth className="mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="font-medium">Conectar Dispositivo OBD-II</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Obtén datos en tiempo real directamente de la computadora de tu vehículo
                    </p>
                    <Button variant="outline" data-testid="button-pair-obd">
                      <Bluetooth className="mr-2 h-4 w-4" />
                      Emparejar Dispositivo
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="manual" className="mt-6">
                <p className="text-sm text-muted-foreground">
                  Ingresa todos los detalles manualmente usando el formulario a la derecha
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Detalles del Registro</CardTitle>
            <CardDescription>Revisa y completa el registro de combustible</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicle">Vehículo *</Label>
                <Select
                  value={formData.vehicleId}
                  onValueChange={(v) => setFormData({ ...formData, vehicleId: v })}
                >
                  <SelectTrigger id="vehicle" data-testid="select-vehicle">
                    <SelectValue placeholder="Seleccionar vehículo" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.name} ({vehicle.year})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Fecha *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  data-testid="input-date"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="liters">Litros *</Label>
                <Input
                  id="liters"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.liters}
                  onChange={(e) => setFormData({ ...formData, liters: e.target.value })}
                  data-testid="input-liters"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pricePerLiter">Precio/L (₡) *</Label>
                <Input
                  id="pricePerLiter"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.pricePerLiter}
                  onChange={(e) => setFormData({ ...formData, pricePerLiter: e.target.value })}
                  data-testid="input-price"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="total">Total (₡)</Label>
                <Input
                  id="total"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.totalCost}
                  onChange={(e) => setFormData({ ...formData, totalCost: e.target.value })}
                  data-testid="input-total"
                  readOnly
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">Calculado automáticamente</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="odometer">Kilometraje</Label>
                <Input
                  id="odometer"
                  type="number"
                  placeholder="Kilometraje actual"
                  value={formData.odometer}
                  onChange={(e) => setFormData({ ...formData, odometer: e.target.value })}
                  data-testid="input-odometer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="station">Gasolinera</Label>
                <Input
                  id="station"
                  placeholder="Nombre de gasolinera"
                  value={formData.station}
                  onChange={(e) => setFormData({ ...formData, station: e.target.value })}
                  data-testid="input-station"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas</Label>
              <Input
                id="notes"
                placeholder="Notas adicionales (opcional)"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() =>
                  setFormData({
                    vehicleId: vehicles[0]?.id || "",
                    liters: "",
                    pricePerLiter: "",
                    totalCost: "",
                    odometer: "",
                    station: "",
                    date: new Date().toISOString().split("T")[0],
                    notes: "",
                  })
                }
                data-testid="button-clear"
                disabled={loading}
              >
                Limpiar
              </Button>
              <Button 
                onClick={handleSubmit} 
                data-testid="button-save"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar Registro"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
