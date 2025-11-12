# Invoice Generation API Documentation

## ✅ What's Implemented

Your TakeCharge application now has a complete invoice generation system using jsPDF.

## 📦 Package Installed

- **jspdf** (v2.5.1) - Client-side PDF generation library

## 🔧 Invoice Service

### Location: `src/services/invoiceService.js`

### Functions:

1. **`generateInvoice(booking, user)`**
   - Generates and downloads a PDF invoice
   - Includes all booking details, pricing, and QR code
   - Automatically saves with filename: `invoice-{bookingId}-{date}.pdf`

2. **`generateInvoiceBlob(booking, user)`**
   - Generates invoice as blob (for preview or email)
   - Returns PDF blob instead of downloading

## 📄 Invoice Contents

The generated invoice includes:

### Header Section
- Company name: "TakeCharge"
- Company tagline: "EV Charging Network"
- Contact information (email, phone)

### Invoice Details
- Invoice number: `INV-{bookingId}`
- Invoice date: Current date

### Customer Information
- Customer name (from user metadata or email)
- Customer email

### Booking Details
- Booking ID
- Station name and address
- Booking date and time
- Duration
- Connector type
- Charging speed
- Energy delivered (if completed)

### Pricing Breakdown
- Rate per kWh
- Charging cost
- Platform fee
- Taxes
- **Total amount** (highlighted)

### Payment Information
- Payment method
- Booking status

### QR Code
- Booking QR code (if space available)
- Can be scanned for booking verification

### Footer
- Thank you message
- Company information

## 💻 Usage Examples

### Download Invoice from Booking History

```javascript
import { generateInvoice } from './services/invoiceService';
import { useAuth } from './contexts/AuthContext';

const { user } = useAuth();

const handleDownloadInvoice = async (booking) => {
  try {
    await generateInvoice(booking, user);
  } catch (error) {
    console.error('Error generating invoice:', error);
  }
};
```

### Download Invoice from Confirmation Page

```javascript
import { generateInvoice } from './services/invoiceService';

// After booking is created
await generateInvoice(bookingData, user);
```

## 🎨 Invoice Format

- **Page Size**: A4 (210mm x 297mm)
- **Font**: Helvetica
- **Colors**: Black text on white background
- **Layout**: Professional invoice layout
- **File Format**: PDF

## 📝 Invoice Filename Format

```
invoice-{bookingId}-{date}.pdf
```

Example: `invoice-TC-2024-001-2024-12-01.pdf`

## 🔄 How It Works

1. **User clicks "Download Invoice"**
2. **Invoice service generates PDF:**
   - Creates new PDF document
   - Adds company header
   - Adds invoice details
   - Adds customer information
   - Adds booking details
   - Adds pricing breakdown
   - Adds QR code (if space available)
   - Adds footer
3. **PDF is automatically downloaded**

## ✅ Updated Components

1. **Booking History** (`src/pages/booking-history/index.jsx`)
   - `handleDownloadInvoice` now generates real PDF
   - Shows loading state while generating

2. **Confirmation Success** (`src/pages/booking-confirmation/components/ConfirmationSuccess.jsx`)
   - `handleDownloadInvoice` now generates real PDF
   - Shows loading state while generating

## 🧪 Testing

### Test Invoice Generation

1. **From Booking History:**
   - Go to `/booking-history`
   - Click "Invoice" button on any booking
   - PDF should download automatically

2. **From Confirmation Page:**
   - Complete a booking
   - On success page, click "Download Invoice"
   - PDF should download automatically

### Verify Invoice Contents

Open the downloaded PDF and check:
- ✅ Company information is correct
- ✅ Invoice number matches booking ID
- ✅ Customer information is correct
- ✅ Booking details are accurate
- ✅ Pricing breakdown is correct
- ✅ Total amount is highlighted
- ✅ QR code is present (if space available)

## 🐛 Troubleshooting

### Issue: Invoice not downloading
**Solution:**
- Check browser console for errors
- Make sure jsPDF package is installed
- Check if booking data is complete

### Issue: Invoice missing data
**Solution:**
- Verify booking object has all required fields
- Check data mapping in invoice service
- Ensure user data is available

### Issue: QR code not showing
**Solution:**
- QR code only shows if there's space on the page
- Check if QR code generation is working
- Verify booking ID is available

### Issue: PDF formatting issues
**Solution:**
- Check page height calculations
- Verify text wrapping is working
- Ensure margins are correct

## 📊 Invoice Data Requirements

The invoice service expects booking data with these fields:

**Required:**
- `bookingId` or `booking_id`
- `totalCost` or `total_cost`

**Optional (but recommended):**
- `stationName` or `station_name`
- `stationAddress` or `station_address`
- `scheduledDate` or `scheduled_date`
- `startTime` or `start_time`
- `durationMinutes` or `duration_minutes`
- `connectorType` or `connector_type`
- `chargingSpeed` or `charging_speed`
- `ratePerKwh` or `rate_per_kwh`
- `chargingCost` or `charging_cost`
- `platformFee` or `platform_fee`
- `taxes`
- `paymentMethod` or `payment_method`
- `status`

## 🎯 Customization

### Change Company Information

Edit `src/services/invoiceService.js`:

```javascript
// Header - Company Info
doc.text('Your Company Name', margin, yPosition);
doc.text('Your Tagline', margin, yPosition);
doc.text('Email: your@email.com', margin, yPosition);
doc.text('Phone: +1 (555) 123-4567', margin, yPosition);
```

### Change Invoice Colors

```javascript
doc.setTextColor(0, 0, 255); // Blue text
doc.setDrawColor(0, 0, 255); // Blue lines
```

### Change Page Size

```javascript
const doc = new jsPDF('p', 'mm', 'a4'); // A4 portrait
// or
const doc = new jsPDF('p', 'mm', 'letter'); // Letter size
```

## 📚 Next Steps

1. **Email Invoices:**
   - Use `generateInvoiceBlob` to get PDF blob
   - Send via email using Supabase Edge Functions

2. **Invoice Storage:**
   - Store generated invoices in Supabase Storage
   - Link invoices to bookings in database

3. **Invoice Templates:**
   - Create multiple invoice templates
   - Allow users to choose template

4. **Invoice History:**
   - Track all generated invoices
   - Show invoice download history

---

**Your invoice generation is now fully implemented!** 🎉









