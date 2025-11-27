import { useState } from "react";
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
import { Camera, QrCode, Bluetooth, FileText, Upload, Check, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Register() {
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

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() =>
                  setFormData({
                    vehicle: "",
                    liters: "",
                    price: "",
                    totalCost: "",
                    odometer: "",
                    station: "",
                    date: new Date().toISOString().split("T")[0],
                  })
                }
                data-testid="button-clear"
              >
                Limpiar
              </Button>
              <Button onClick={handleSubmit} data-testid="button-save">
                Guardar Registro
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
