import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { Patient } from '../types/patient';
import type { Appointment } from '../types/appointment';
import type { Bill } from '../types/billing';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const generatePDF = (
  type: 'patient' | 'appointment' | 'bill',
  data: Patient | Appointment | Bill
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // Add header
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 255);
  doc.text('MADICARE', pageWidth / 2, 15, { align: 'center' });

  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(
    type === 'patient'
      ? 'Patient Details'
      : type === 'appointment'
      ? 'Appointment Details'
      : 'Bill Details',
    pageWidth / 2,
    25,
    { align: 'center' }
  );

  // Add content based on type
  if (type === 'bill') {
    const bill = data as Bill;

    // Bill Information
    const billInfo = [
      ['Bill ID:', bill.id],
      ['Date:', bill.billDate],
      ['Due Date:', bill.dueDate],
      ['Status:', bill.status],
      ['Patient ID:', bill.patientId],
      ['Patient Name:', bill.patientName],
    ];

    doc.autoTable({
      startY: 35,
      head: [],
      body: billInfo,
      theme: 'plain',
      styles: { fontSize: 10, cellPadding: 2 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 40 },
        1: { cellWidth: 150 },
      },
    });

    // Bill Items
    const itemsTableBody = bill.items.map((item) => [
      item.description,
      item.quantity.toString(),
      `₹${item.unitPrice.toFixed(2)}`,
      `₹${item.total.toFixed(2)}`,
    ]);

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Description', 'Quantity', 'Unit Price', 'Total']],
      body: itemsTableBody,
      theme: 'striped',
      styles: { fontSize: 10 },
    });

    // Summary
    const summary = [
      ['Subtotal:', `₹${bill.subtotal.toFixed(2)}`],
      ['Tax (10%):', `₹${bill.tax.toFixed(2)}`],
      ['Discount:', `₹${bill.discount.toFixed(2)}`],
      ['Total:', `₹${bill.total.toFixed(2)}`],
    ];

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [],
      body: summary,
      theme: 'plain',
      styles: { fontSize: 10, cellPadding: 2 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 40 },
        1: { cellWidth: 150 },
      },
    });

    if (bill.status === 'paid') {
      const paymentInfo = [
        ['Payment Date:', bill.paymentDate || ''],
        ['Payment Method:', bill.paymentMethod || ''],
      ];

      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 10,
        head: [['Payment Information']],
        body: paymentInfo,
        theme: 'plain',
        styles: { fontSize: 10, cellPadding: 2 },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 40 },
          1: { cellWidth: 150 },
        },
      });
    }
  } else if (type === 'patient') {
    const patient = data as Patient;
    const patientContent = [
      ['Patient ID:', patient.id],
      ['Name:', patient.name],
      ['Age:', patient.age.toString()],
      ['Gender:', patient.gender],
      ['Contact:', patient.contact],
      ['Condition:', patient.condition],
      ['Admission Date:', patient.admissionDate],
      ['Doctor:', patient.doctorName],
      ['Disease:', patient.disease],
      ['Severity:', patient.severity],
      ['Blood Group:', patient.bloodGroup],
      ['Symptoms:', patient.symptoms.join(', ')],
      ['Allergies:', patient.allergies.join(', ')],
      ['Medications:', patient.medications.join(', ')],
    ];

    doc.autoTable({
      startY: 35,
      head: [],
      body: patientContent,
      theme: 'plain',
      styles: { fontSize: 10, cellPadding: 2 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 40 },
        1: { cellWidth: 150 },
      },
    });
  } else {
    const appointment = data as Appointment;
    const appointmentContent = [
      ['Appointment ID:', appointment.id],
      ['Patient Name:', appointment.patientName],
      ['Doctor:', appointment.doctorName],
      ['Date:', appointment.date],
      ['Time:', appointment.time],
      ['Status:', appointment.status],
      ['Disease:', appointment.disease],
      ['Severity:', appointment.severity],
      ['Symptoms:', appointment.symptoms.join(', ')],
      ['Description:', appointment.symptomsDescription],
      ['Contact:', appointment.contact],
      ['Address:', appointment.address],
    ];

    doc.autoTable({
      startY: 35,
      head: [],
      body: appointmentContent,
      theme: 'plain',
      styles: { fontSize: 10, cellPadding: 2 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 40 },
        1: { cellWidth: 150 },
      },
    });
  }

  // Add footer
  const today = new Date().toLocaleDateString();
  doc.setFontSize(8);
  doc.text(`Generated on: ${today}`, 10, doc.internal.pageSize.height - 10);

  // Save the PDF
  const fileName =
    type === 'patient'
      ? `patient_details_${(data as Patient).id}.pdf`
      : type === 'appointment'
      ? `appointment_details_${(data as Appointment).id}.pdf`
      : `bill_${(data as Bill).id}.pdf`;
  doc.save(fileName);
};
