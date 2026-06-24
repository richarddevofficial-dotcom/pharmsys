"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
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
  User,
  Stethoscope,
  Pill,
  X,
  Save,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

const initialPrescriptions = [
  {
    id: 1,
    patient_name: "John Doe",
    doctor_name: "Dr. Sarah Wilson",
    prescription_date: "2024-01-15",
    medicines: [
      {
        name: "Amoxicillin 250mg",
        dosage: "1 tablet 3x daily",
        duration: "7 days",
      },
      {
        name: "Paracetamol 500mg",
        dosage: "2 tablets as needed",
        duration: "5 days",
      },
    ],
    status: "DISPENSED",
    notes: "Take after meals",
    file_name: null,
  },
  {
    id: 2,
    patient_name: "Jane Smith",
    doctor_name: "Dr. Michael Brown",
    prescription_date: "2024-01-14",
    medicines: [
      {
        name: "Ibuprofen 400mg",
        dosage: "1 tablet 2x daily",
        duration: "5 days",
      },
    ],
    status: "PENDING",
    notes: "For back pain",
    file_name: null,
  },
  {
    id: 3,
    patient_name: "Bob Wilson",
    doctor_name: "Dr. Emily Davis",
    prescription_date: "2024-01-13",
    medicines: [
      {
        name: "Omeprazole 20mg",
        dosage: "1 capsule daily",
        duration: "30 days",
      },
      {
        name: "Vitamin C 1000mg",
        dosage: "1 tablet daily",
        duration: "30 days",
      },
    ],
    status: "VERIFIED",
    notes: "",
    file_name: "prescription_003.pdf",
  },
];

export default function PrescriptionsPage() {
  const { isLoading: authLoading } = useAuth(true);
  const [search, setSearch] = useState("");
  const [prescriptions, setPrescriptions] = useState(initialPrescriptions);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const fileInputRef = useRef(null);

  // New prescription form state
  const [newPrescription, setNewPrescription] = useState({
    patient_name: "",
    doctor_name: "",
    prescription_date: new Date().toISOString().split("T")[0],
    medicines: [],
    notes: "",
  });
  const [newMedicine, setNewMedicine] = useState({
    name: "",
    dosage: "",
    duration: "",
  });

  const filteredPrescriptions = prescriptions.filter(
    (p) =>
      p.patient_name.toLowerCase().includes(search.toLowerCase()) ||
      p.doctor_name.toLowerCase().includes(search.toLowerCase()) ||
      p.status.toLowerCase().includes(search.toLowerCase()),
  );

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

  // Upload file handler
  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a JPG, PNG, or PDF file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    const newRx = {
      id: Date.now(),
      patient_name: "Uploaded Patient",
      doctor_name: "Dr. Unknown",
      prescription_date: new Date().toISOString().split("T")[0],
      medicines: [],
      status: "PENDING",
      notes: "Uploaded prescription file",
      file_name: file.name,
    };

    setPrescriptions([newRx, ...prescriptions]);
    toast.success(`File "${file.name}" uploaded!`);
    e.target.value = "";
  };

  // Add medicine to new prescription
  const addMedicineToNew = () => {
    if (!newMedicine.name || !newMedicine.dosage || !newMedicine.duration) {
      toast.error("Please fill all medicine fields");
      return;
    }
    setNewPrescription({
      ...newPrescription,
      medicines: [...newPrescription.medicines, { ...newMedicine }],
    });
    setNewMedicine({ name: "", dosage: "", duration: "" });
  };

  // Remove medicine from new prescription
  const removeMedicineFromNew = (index) => {
    setNewPrescription({
      ...newPrescription,
      medicines: newPrescription.medicines.filter((_, i) => i !== index),
    });
  };

  // Save new prescription
  const saveNewPrescription = () => {
    if (!newPrescription.patient_name || !newPrescription.doctor_name) {
      toast.error("Please fill patient and doctor names");
      return;
    }

    const newRx = {
      id: Date.now(),
      ...newPrescription,
      status: "PENDING",
      file_name: null,
    };

    setPrescriptions([newRx, ...prescriptions]);
    toast.success("Prescription added successfully!");
    setShowAddForm(false);
    setNewPrescription({
      patient_name: "",
      doctor_name: "",
      prescription_date: new Date().toISOString().split("T")[0],
      medicines: [],
      notes: "",
    });
  };

  if (authLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".jpg,.jpeg,.png,.pdf"
        className="hidden"
      />

      <Breadcrumb items={[{ label: "Prescriptions" }]} />
      <PageHeader
        title="Prescriptions"
        description="Manage and verify prescriptions"
        backUrl="/dashboard"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleUpload}>
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Prescription
            </Button>
          </div>
        }
      />

      {/* Add New Prescription Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">New Prescription</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
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

              {/* Add Medicines */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Medicines</h4>

                {newPrescription.medicines.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {newPrescription.medicines.map((med, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-sm">{med.name}</p>
                          <p className="text-xs text-gray-500">
                            {med.dosage} | {med.duration}
                          </p>
                        </div>
                        <button
                          onClick={() => removeMedicineFromNew(i)}
                          className="text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2 mb-3">
                  <Input
                    placeholder="Medicine name"
                    value={newMedicine.name}
                    onChange={(e) =>
                      setNewMedicine({ ...newMedicine, name: e.target.value })
                    }
                    className="text-sm"
                  />
                  <Input
                    placeholder="Dosage"
                    value={newMedicine.dosage}
                    onChange={(e) =>
                      setNewMedicine({ ...newMedicine, dosage: e.target.value })
                    }
                    className="text-sm"
                  />
                  <Input
                    placeholder="Duration"
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
                  variant="outline"
                  size="sm"
                  onClick={addMedicineToNew}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Medicine
                </Button>
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
                  placeholder="Additional notes..."
                />
              </div>
            </div>

            <div className="p-6 border-t flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button onClick={saveNewPrescription}>
                <Save className="h-4 w-4 mr-2" />
                Save Prescription
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Prescription List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <CardTitle>Prescription List</CardTitle>
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
                      <TableHead>File</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPrescriptions.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium text-sm">
                          #{p.id}
                        </TableCell>
                        <TableCell className="text-sm">
                          {p.patient_name}
                        </TableCell>
                        <TableCell className="text-sm">
                          {p.doctor_name}
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(p.prescription_date)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {p.medicines.length}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {p.file_name ? (
                            <span className="text-xs text-green-600">
                              📄 {p.file_name}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">-</span>
                          )}
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
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detail Panel */}
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
                {selectedPrescription.file_name && (
                  <div>
                    <p className="text-xs text-gray-500">File</p>
                    <p className="text-sm text-green-600">
                      📄 {selectedPrescription.file_name}
                    </p>
                  </div>
                )}
                {selectedPrescription.medicines.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Medicines</p>
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
