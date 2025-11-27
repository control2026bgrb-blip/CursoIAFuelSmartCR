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
        <h1 className="text-2xl font-bold">Add Record</h1>
        <p className="text-muted-foreground">Register a new fuel or charging record</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Choose Input Method</CardTitle>
            <CardDescription>Select how you want to add your record</CardDescription>
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
                          <p className="text-sm font-medium">Scanning receipt...</p>
                          <p className="text-xs text-muted-foreground">Extracting data using AI</p>
                        </>
                      ) : (
                        <>
                          <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
                          <h3 className="font-medium">Upload Receipt Photo</h3>
                          <p className="mb-4 text-sm text-muted-foreground">
                            Our AI will automatically extract liters, price, date & odometer
                          </p>
                          <div className="flex gap-2">
                            <Button onClick={handleScan} data-testid="button-take-photo">
                              <Camera className="mr-2 h-4 w-4" />
                              Take Photo
                            </Button>
                            <Button variant="outline" onClick={handleScan} data-testid="button-upload">
                              <Upload className="mr-2 h-4 w-4" />
                              Upload
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
                      <h3 className="font-medium text-green-600">Data Extracted Successfully</h3>
                      <p className="text-sm text-muted-foreground">Review the data below and save</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="qr" className="mt-6 space-y-4">
                <div className="rounded-lg border-2 border-dashed p-8">
                  <div className="flex flex-col items-center text-center">
                    <QrCode className="mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="font-medium">Scan Station QR Code</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Point your camera at the QR code at the pump
                    </p>
                    <Button onClick={handleScan} data-testid="button-scan-qr">
                      <Smartphone className="mr-2 h-4 w-4" />
                      Open Camera
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="obd" className="mt-6 space-y-4">
                <div className="rounded-lg border-2 border-dashed p-8">
                  <div className="flex flex-col items-center text-center">
                    <Bluetooth className="mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="font-medium">Connect OBD-II Device</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Get real-time data directly from your vehicle's computer
                    </p>
                    <Button variant="outline" data-testid="button-pair-obd">
                      <Bluetooth className="mr-2 h-4 w-4" />
                      Pair Device
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="manual" className="mt-6">
                <p className="text-sm text-muted-foreground">
                  Enter all details manually using the form on the right
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Record Details</CardTitle>
            <CardDescription>Review and complete the fuel record</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
                <Label htmlFor="price">Price/L ($)</Label>
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
                <Label htmlFor="total">Total ($)</Label>
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
                Clear
              </Button>
              <Button onClick={handleSubmit} data-testid="button-save">
                Save Record
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
