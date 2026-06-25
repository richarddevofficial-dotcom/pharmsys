from rest_framework import serializers
from .models import Prescription, PrescriptionMedicine

class PrescriptionMedicineSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrescriptionMedicine
        fields = ['id', 'name', 'dosage', 'duration']

class PrescriptionSerializer(serializers.ModelSerializer):
    medicines = PrescriptionMedicineSerializer(many=True, required=False)
    
    class Meta:
        model = Prescription
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
    
    def create(self, validated_data):
        medicines_data = validated_data.pop('medicines', [])
        print(f"Creating prescription with {len(medicines_data)} medicines:", medicines_data)
        prescription = Prescription.objects.create(**validated_data)
        
        for med in medicines_data:
            PrescriptionMedicine.objects.create(
                prescription=prescription,
                name=med.get('name', ''),
                dosage=med.get('dosage', ''),
                duration=med.get('duration', '')
            )
        
        print(f"Created prescription #{prescription.id} with {prescription.medicines.count()} medicines")
        return prescription