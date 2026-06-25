"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useCartStore } from "@/store/cartStore";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Plus,
  Search,
  FileText,
  CheckCircle,
  Clock,
  Eye,
  Upload,
  X,
  Save,
  Pill,
  ShoppingCart,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

export default function PrescriptionsPage() {
  const router = useRouter();
  const { isLoading: authLoading } = useAuth(true);
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const [newPrescription, setNewPrescription] = useState({
    patient_name: "",
    doctor_name: "",
    prescription_date: new Date().toISOString().split("T")[0],
    medicines: [],
    notes: "",
    status: "PENDING",
  });
  const [newMedicine, setNewMedicine] = useState({
    name: "",
    dosage: "",
    duration: "",
  });

  const { data: apiResponse, isLoading: presLoading } = useQuery({
    queryKey: ["prescriptions"],
    queryFn: async () => {
      const response = await api.get("/prescriptions/");
      return response.data;
    },
  });
  const prescriptions = apiResponse?.results || [];

  const createMutation = useMutation({
    mutationFn: async (data) => {
      console.log("📤 SENDING TO API:", JSON.stringify(data, null, 2));
      const response = await api.post("/prescriptions/", data);
      console.log("✅ API RESPONSE:", response.data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["prescriptions"]);
      toast.success("Prescription added!");
      setShowAddForm(false);
      setNewPrescription({
        patient_name: "",
        doctor_name: "",
        prescription_date: new Date().toISOString().split("T")[0],
        medicines: [],
        notes: "",
        status: "PENDING",
      });
    },
    onError: (error) => {
      console.error("❌ API ERROR:", error.response?.data);
      toast.error(JSON.stringify(error.response?.data) || "Failed to add");
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await api.patch(`/prescriptions/${id}/`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["prescriptions"]);
      toast.success("Status updated!");
    },
    onError: () => toast.error("Failed to update"),
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "DISPENSED":
        return (
          <Badge variant="success">
            <CheckCircle className="h-3 w-3 mr-1" />
            Dispensed
          </Badge>
        );
      case "PENDING":
        return (
          <Badge variant="warning">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "VERIFIED":
        return (
          <Badge variant="default">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const addMedicineToNew = () => {
    if (!newMedicine.name) {
      toast.error("Enter medicine name");
      return;
    }
    if (!newMedicine.dosage) {
      toast.error("Enter dosage");
      return;
    }
    if (!newMedicine.duration) {
      toast.error("Enter duration");
      return;
    }

    const updatedMedicines = [...newPrescription.medicines, { ...newMedicine }];
    setNewPrescription({ ...newPrescription, medicines: updatedMedicines });
    setNewMedicine({ name: "", dosage: "", duration: "" });
    toast.success(`${newMedicine.name} added`);
    console.log("📋 Current medicines:", updatedMedicines);
  };

  const removeMedicineFromNew = (index) => {
    const updated = newPrescription.medicines.filter((_, i) => i !== index);
    setNewPrescription({ ...newPrescription, medicines: updated });
  };

  const saveNewPrescription = () => {
    if (!newPrescription.patient_name) {
      toast.error("Enter patient name");
      return;
    }
    if (!newPrescription.doctor_name) {
      toast.error("Enter doctor name");
      return;
    }
    if (newPrescription.medicines.length === 0) {
      toast.error("Add at least one medicine");
      return;
    }

    console.log(
      "💾 Saving prescription with medicines:",
      newPrescription.medicines.length,
    );
    createMutation.mutate(newPrescription);
  };

  const handleDispenseToPOS = () => {
    if (selectedPrescription?.medicines?.length > 0) {
      console.log("🛒 Sending to POS:", selectedPrescription.medicines);
      useCartStore.getState().setPrescriptionItems({
        prescriptionId: selectedPrescription.id,
        medicines: selectedPrescription.medicines,
      });
      router.push("/pos?from=prescription");
    } else {
      toast.error("No medicines in this prescription");
    }
  };

  if (authLoading || presLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Prescriptions" }]} />
      <PageHeader
        title="Prescriptions"
        description="Manage and verify prescriptions"
        backUrl="/dashboard"
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New
            </Button>
          </div>
        }
      />
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".jpg,.jpeg,.png,.pdf"
        onChange={(e) => {
          if (e.target.files[0])
            toast.success("File: " + e.target.files[0].name);
        }}
      />

      {/* ADD FORM MODAL */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">New Prescription</h2>
              <button onClick={() => setShowAddForm(false)}>
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Patient Name *</Label>
                  <Input
                    value={newPrescription.patient_name}
                    onChange={(e) =>
                      setNewPrescription({
                        ...newPrescription,
                        patient_name: e.target.value,
                      })
                    }
                    placeholder="Patient name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Doctor Name *</Label>
                  <Input
                    value={newPrescription.doctor_name}
                    onChange={(e) =>
                      setNewPrescription({
                        ...newPrescription,
                        doctor_name: e.target.value,
                      })
                    }
                    placeholder="Doctor name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={newPrescription.prescription_date}
                  onChange={(e) =>
                    setNewPrescription({
                      ...newPrescription,
                      prescription_date: e.target.value,
                    })
                  }
                />
              </div>

              {/* MEDICINES SECTION */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">
                  Medicines ({newPrescription.medicines.length})
                </h4>

                {/* Show added medicines */}
                {newPrescription.medicines.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {newPrescription.medicines.map((med, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                      >
                        <div>
                          <p className="font-medium text-sm">{med.name}</p>
                          <p className="text-xs text-gray-500">
                            {med.dosage} | {med.duration}
                          </p>
                        </div>
                        <button
                          onClick={() => removeMedicineFromNew(i)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add new medicine */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs font-medium mb-2">Add Medicine:</p>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <Input
                      placeholder="Medicine name *"
                      value={newMedicine.name}
                      onChange={(e) =>
                        setNewMedicine({ ...newMedicine, name: e.target.value })
                      }
                      className="text-sm"
                    />
                    <Input
                      placeholder="Dosage *"
                      value={newMedicine.dosage}
                      onChange={(e) =>
                        setNewMedicine({
                          ...newMedicine,
                          dosage: e.target.value,
                        })
                      }
                      className="text-sm"
                    />
                    <Input
                      placeholder="Duration *"
                      value={newMedicine.duration}
                      onChange={(e) =>
                        setNewMedicine({
                          ...newMedicine,
                          duration: e.target.value,
                        })
                      }
                      className="text-sm"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={addMedicineToNew}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Medicine
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <textarea
                  value={newPrescription.notes}
                  onChange={(e) =>
                    setNewPrescription({
                      ...newPrescription,
                      notes: e.target.value,
                    })
                  }
                  rows={2}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="p-6 border-t flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button
                onClick={saveNewPrescription}
                disabled={createMutation.isLoading}
              >
                <Save className="h-4 w-4 mr-2" />
                {createMutation.isLoading ? "Saving..." : "Save Prescription"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* PRESCRIPTION LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <CardTitle>Prescriptions ({prescriptions.length})</CardTitle>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Meds</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prescriptions.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center py-8 text-gray-400"
                        >
                          <FileText className="h-12 w-12 mx-auto mb-2" />
                          <p>No prescriptions</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      prescriptions.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="font-medium">#{p.id}</TableCell>
                          <TableCell className="text-sm">
                            {p.patient_name}
                          </TableCell>
                          <TableCell className="text-sm">
                            {p.doctor_name}
                          </TableCell>
                          <TableCell className="text-sm whitespace-nowrap">
                            {formatDate(p.prescription_date)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              <Pill className="h-3 w-3 mr-1" />
                              {p.medicines?.length || 0}
                            </Badge>
                          </TableCell>
                          <TableCell>{getStatusBadge(p.status)}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedPrescription(p)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* DETAIL PANEL */}
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedPrescription ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">#{selectedPrescription.id}</p>
                    <p className="text-xs text-gray-500">
                      {selectedPrescription.status}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Patient</p>
                  <p className="font-medium text-sm">
                    {selectedPrescription.patient_name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Doctor</p>
                  <p className="font-medium text-sm">
                    {selectedPrescription.doctor_name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="font-medium text-sm">
                    {formatDate(selectedPrescription.prescription_date)}
                  </p>
                </div>
                {selectedPrescription.medicines?.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Medicines ({selectedPrescription.medicines.length})
                    </p>
                    {selectedPrescription.medicines.map((med, i) => (
                      <div key={i} className="p-2 bg-gray-50 rounded mb-1">
                        <p className="font-medium text-sm">{med.name}</p>
                        <p className="text-xs text-gray-500">
                          {med.dosage} | {med.duration}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                {selectedPrescription.status === "PENDING" && (
                  <Button
                    className="w-full"
                    onClick={() =>
                      updateStatusMutation.mutate({
                        id: selectedPrescription.id,
                        status: "VERIFIED",
                      })
                    }
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Verify
                  </Button>
                )}
                {selectedPrescription.status === "VERIFIED" && (
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={handleDispenseToPOS}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Dispense to POS
                  </Button>
                )}
                {selectedPrescription.status === "DISPENSED" && (
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto mb-1" />
                    <p className="text-sm text-green-600 font-medium">
                      Dispensed
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <FileText className="h-12 w-12 mx-auto mb-2" />
                <p>Select a prescription</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
