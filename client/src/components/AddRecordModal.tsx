import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { Card, CardContent } from "@/components/ui/card";
import { Camera, QrCode, Bluetooth, FileText, Upload, Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { vehiclesAPI, fuelRecordsAPI } from "@/lib/api";

interface AddRecordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecordAdded?: () => void;
}

export function AddRecordModal({ open, onOpenChange, onRecordAdded }: AddRecordModalProps) {
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

  // Load user vehicles when modal opens
  useEffect(() => {
    if (open && currentUser?.id) {
      loadVehicles();
    }
  }, [open, currentUser?.id]);

  // Calculate total cost when liters or price changes
  useEffect(() => {
    if (formData.liters && formData.pricePerLiter) {
      const total = (parseFloat(formData.liters) * parseFloat(formData.pricePerLiter)).toFixed(2);
      setFormData(prev => ({ ...prev, totalCost: total }));
    }
  }, [formData.liters, formData.pricePerLiter]);

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

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      
      // Find a vehicle to use for the mock data
      const vehicleToUse = vehicles[0];
      
      setFormData(prev => ({
        ...prev,
        vehicleId: vehicleToUse?.id || "",
        liters: "45.2",
        pricePerLiter: "700",
        totalCost: "31640",
        odometer: "45320",
        station: "Gasolinera Delta - Escazú",
        date: new Date().toISOString().split("T")[0],
        notes: "Datos extraídos automáticamente del recibo",
      }));
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
      
      // Reset form and close modal
      resetForm();
      onOpenChange(false);
      
      // Notify parent component to refresh data
      if (onRecordAdded) {
        onRecordAdded();
      }
      
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

  const resetForm = () => {
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
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Agregar Registro de Combustible</DialogTitle>
          <DialogDescription>
            Elige un método para agregar tu registro
          </DialogDescription>
        </DialogHeader>

        <Tabs value={method} onValueChange={setMethod} className="mt-2">
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

          <TabsContent value="ocr" className="space-y-4">
            {!scanComplete ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  {isScanning ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-16 w-16 animate-pulse rounded-full bg-primary/20" />
                      <p className="text-sm text-muted-foreground">Escaneando recibo...</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="mb-3 h-10 w-10 text-muted-foreground" />
                      <p className="mb-1 text-sm font-medium">Sube foto del recibo</p>
                      <p className="mb-4 text-xs text-muted-foreground">
                        Extraeremos litros, precio, fecha y kilometraje
                      </p>
                      <Button onClick={handleScan} data-testid="button-scan-receipt">
                        <Camera className="mr-2 h-4 w-4" />
                        Escanear Recibo
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                <Check className="h-5 w-5" />
                <span className="text-sm font-medium">Datos extraídos exitosamente</span>
              </div>
            )}
          </TabsContent>

          <TabsContent value="qr" className="space-y-4">
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <QrCode className="mb-3 h-10 w-10 text-muted-foreground" />
                <p className="mb-1 text-sm font-medium">Escanea código QR de la gasolinera</p>
                <p className="mb-4 text-xs text-muted-foreground">
                  Apunta tu cámara al código QR en la bomba
                </p>
                <Button onClick={handleScan} data-testid="button-scan-qr">
                  <QrCode className="mr-2 h-4 w-4" />
                  Abrir Escáner
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="obd" className="space-y-4">
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Bluetooth className="mb-3 h-10 w-10 text-muted-foreground" />
                <p className="mb-1 text-sm font-medium">Conectar dispositivo OBD-II</p>
                <p className="mb-4 text-xs text-muted-foreground">
                  Obtén datos en tiempo real de tu vehículo
                </p>
                <Button variant="outline" data-testid="button-connect-obd">
                  <Bluetooth className="mr-2 h-4 w-4" />
                  Conectar Dispositivo
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manual" className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Ingresa los detalles manualmente
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicle">Vehículo *</Label>
              {loadingVehicles ? (
                <div className="flex items-center justify-center h-10 border rounded-md">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
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
              )}
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
              <Label htmlFor="liters">Litros</Label>
              <Input
                id="liters"
                type="number"
                placeholder="0.00"
                value={formData.liters}
                onChange={(e) => setFormData({ ...formData, liters: e.target.value })}
                data-testid="input-liters"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pricePerLiter">Precio/L (₡)</Label>
              <Input
                id="pricePerLiter"
                type="number"
                placeholder="0"
                value={formData.pricePerLiter}
                onChange={(e) => setFormData({ ...formData, pricePerLiter: e.target.value })}
                data-testid="input-price"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="total">Total (₡)</Label>
              <Input
                id="total"
                type="number"
                placeholder="0"
                value={formData.totalCost}
                onChange={(e) => setFormData({ ...formData, totalCost: e.target.value })}
                data-testid="input-total"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="odometer">Kilometraje</Label>
              <Input
                id="odometer"
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
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} data-testid="button-cancel">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} data-testid="button-save-record">
            Guardar Registro
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
