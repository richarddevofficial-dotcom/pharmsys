"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "lucide-react";
import { formatDate } from "@/lib/utils";

const mockPrescriptions = [
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
  },
];

export default function PrescriptionsPage() {
  const { isLoading: authLoading } = useAuth(true);
  const [search, setSearch] = useState("");
  const [prescriptions] = useState(mockPrescriptions);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

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

  if (authLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Prescriptions" }]} />
      <PageHeader
        title="Prescriptions"
        description="Manage and verify prescriptions"
        backUrl="/dashboard"
        actions={
          <div className="flex gap-2">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Prescription
            </Button>
          </div>
        }
      />

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
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="min-w-[600px] md:min-w-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Medicines</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPrescriptions.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="font-medium text-sm">
                            #{p.id}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">{p.patient_name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Stethoscope className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">{p.doctor_name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm whitespace-nowrap">
                            {formatDate(p.prescription_date)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              <Pill className="h-3 w-3 mr-1" />
                              {p.medicines.length} items
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
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Prescription Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedPrescription ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">#{selectedPrescription.id}</p>
                    <p className="text-xs text-gray-500">
                      {selectedPrescription.status}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Patient</p>
                  <p className="font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {selectedPrescription.patient_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Doctor</p>
                  <p className="font-medium flex items-center gap-2">
                    <Stethoscope className="h-4 w-4" />
                    {selectedPrescription.doctor_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">
                    {formatDate(selectedPrescription.prescription_date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">Medicines</p>
                  <div className="space-y-2">
                    {selectedPrescription.medicines.map((med, i) => (
                      <div key={i} className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium text-sm flex items-center gap-1">
                          <Pill className="h-3 w-3 text-blue-500" />
                          {med.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {med.dosage}
                        </p>
                        <p className="text-xs text-gray-500">
                          Duration: {med.duration}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                {selectedPrescription.status === "VERIFIED" && (
                  <Button className="w-full">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Dispense Medicines
                  </Button>
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
