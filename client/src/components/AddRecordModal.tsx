import { useState } from "react";
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
import { Camera, QrCode, Bluetooth, FileText, Upload, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddRecordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddRecordModal({ open, onOpenChange }: AddRecordModalProps) {
  const [method, setMethod] = useState<string>("ocr");
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const { toast } = useToast();

  // todo: remove mock functionality - datos de Costa Rica
  const [formData, setFormData] = useState({
    vehicle: "",
    liters: "",
    price: "",
    totalCost: "",
    odometer: "",
    station: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      setFormData({
        vehicle: "Toyota Corolla",
        liters: "45.2",
        price: "700",
        totalCost: "31640",
        odometer: "45,320",
        station: "Gasolinera Delta - Escazú",
        date: new Date().toISOString().split("T")[0],
      });
      toast({
        title: "Recibo escaneado exitosamente",
        description: "Datos extraídos del recibo",
      });
    }, 2000);
  };

  const handleSubmit = () => {
    toast({
      title: "Registro agregado",
      description: "Tu registro de combustible ha sido guardado",
    });
    onOpenChange(false);
    setScanComplete(false);
    setFormData({
      vehicle: "",
      liters: "",
      price: "",
      totalCost: "",
      odometer: "",
      station: "",
      date: new Date().toISOString().split("T")[0],
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
              <Label htmlFor="vehicle">Vehículo</Label>
              <Select
                value={formData.vehicle}
                onValueChange={(v) => setFormData({ ...formData, vehicle: v })}
              >
                <SelectTrigger id="vehicle" data-testid="select-vehicle">
                  <SelectValue placeholder="Seleccionar vehículo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Toyota Corolla">Toyota Corolla</SelectItem>
                  <SelectItem value="BYD Dolphin">BYD Dolphin</SelectItem>
                  <SelectItem value="Mitsubishi L200">Mitsubishi L200</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                data-testid="input-date"
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
              <Label htmlFor="price">Precio/L (₡)</Label>
              <Input
                id="price"
                type="number"
                placeholder="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
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
