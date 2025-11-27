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

  // todo: remove mock functionality
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
    // Simulate scanning
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      setFormData({
        vehicle: "Toyota Camry",
        liters: "45.2",
        price: "1.42",
        totalCost: "64.18",
        odometer: "45,320",
        station: "Shell Station - Main St",
        date: new Date().toISOString().split("T")[0],
      });
      toast({
        title: "Receipt scanned successfully",
        description: "Data extracted from your receipt",
      });
    }, 2000);
  };

  const handleSubmit = () => {
    toast({
      title: "Record added",
      description: "Your fuel record has been saved successfully",
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
          <DialogTitle>Add Fuel Record</DialogTitle>
          <DialogDescription>
            Choose a method to add your fuel record
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
                      <p className="text-sm text-muted-foreground">Scanning receipt...</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="mb-3 h-10 w-10 text-muted-foreground" />
                      <p className="mb-1 text-sm font-medium">Upload receipt photo</p>
                      <p className="mb-4 text-xs text-muted-foreground">
                        We'll extract liters, price, date & odometer
                      </p>
                      <Button onClick={handleScan} data-testid="button-scan-receipt">
                        <Camera className="mr-2 h-4 w-4" />
                        Scan Receipt
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                <Check className="h-5 w-5" />
                <span className="text-sm font-medium">Data extracted successfully</span>
              </div>
            )}
          </TabsContent>

          <TabsContent value="qr" className="space-y-4">
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <QrCode className="mb-3 h-10 w-10 text-muted-foreground" />
                <p className="mb-1 text-sm font-medium">Scan station QR code</p>
                <p className="mb-4 text-xs text-muted-foreground">
                  Point your camera at the QR code at the pump
                </p>
                <Button onClick={handleScan} data-testid="button-scan-qr">
                  <QrCode className="mr-2 h-4 w-4" />
                  Open Scanner
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="obd" className="space-y-4">
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Bluetooth className="mb-3 h-10 w-10 text-muted-foreground" />
                <p className="mb-1 text-sm font-medium">Connect OBD-II device</p>
                <p className="mb-4 text-xs text-muted-foreground">
                  Get real-time data from your vehicle
                </p>
                <Button variant="outline" data-testid="button-connect-obd">
                  <Bluetooth className="mr-2 h-4 w-4" />
                  Connect Device
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manual" className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Enter the details manually
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicle">Vehicle</Label>
              <Select
                value={formData.vehicle}
                onValueChange={(v) => setFormData({ ...formData, vehicle: v })}
              >
                <SelectTrigger id="vehicle" data-testid="select-vehicle">
                  <SelectValue placeholder="Select vehicle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Toyota Camry">Toyota Camry</SelectItem>
                  <SelectItem value="Tesla Model 3">Tesla Model 3</SelectItem>
                  <SelectItem value="Ford F-150">Ford F-150</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
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
              <Label htmlFor="liters">Liters</Label>
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
              <Label htmlFor="price">Price/L</Label>
              <Input
                id="price"
                type="number"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                data-testid="input-price"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="total">Total</Label>
              <Input
                id="total"
                type="number"
                placeholder="0.00"
                value={formData.totalCost}
                onChange={(e) => setFormData({ ...formData, totalCost: e.target.value })}
                data-testid="input-total"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="odometer">Odometer (km)</Label>
              <Input
                id="odometer"
                placeholder="Current mileage"
                value={formData.odometer}
                onChange={(e) => setFormData({ ...formData, odometer: e.target.value })}
                data-testid="input-odometer"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="station">Station</Label>
              <Input
                id="station"
                placeholder="Gas station name"
                value={formData.station}
                onChange={(e) => setFormData({ ...formData, station: e.target.value })}
                data-testid="input-station"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} data-testid="button-cancel">
            Cancel
          </Button>
          <Button onClick={handleSubmit} data-testid="button-save-record">
            Save Record
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
