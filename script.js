// Generate Bill Button Logic
document.getElementById('generateBillBtn').addEventListener('click', () => {
    const customerName = document.getElementById('customerName').value.trim();
    const productSelect = document.getElementById('product');
    const quantityInput = document.getElementById('quantity');
    const discountInput = document.getElementById('discount');
    const billOutput = document.getElementById('billOutput');
    const shareOptions = document.getElementById('shareOptions');

    // Get selected product, quantity, and discount
    const product = productSelect.value;
    const quantity = parseInt(quantityInput.value, 10);
    const discount = parseFloat(discountInput.value) || 0;

    // Validate inputs
    if (!customerName || !product || isNaN(quantity) || quantity <= 0 || discount < 0) {
        billOutput.innerHTML = "<p style='color: red;'>Please fill out all required fields correctly.</p>";
        shareOptions.style.display = 'none';
        return;
    }

    // Product prices
    const prices = {
        "Kulhar": 1.75,
        "Kulhar1": 1.70,
        "Kulhar2": 1.65,
        "Kulhar3": 1.60,
        "Kulhar4": 1.55,
        "Kulhar5": 1.50,
        "Kulhar6": 1.45,
        "Water Bottle": 10,
    };

    // Calculate bill details
    const price = prices[product];
    const subtotal = price * quantity;
    const taxRate = 0; // 0% GST
    const tax = subtotal * taxRate;
    const total = subtotal + tax - discount;

    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();

    // Save Bill Details in JSON
    const billDetails = {
        customerName,
        date,
        time,
        product,
        quantity,
        price,
        discount: discount.toFixed(2),
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2),
    };

    // Render bill output
    billOutput.innerHTML = `
        <div class="bill">
            <div class="bill-header">
                <div>
                    <h3>Piyo Mithila</h3>
                    <p>Mobile: +91 9473012190</p>
                </div>
                <div>
                    <p>Invoice Date: ${date}</p>
                    <p>Time: ${time}</p>
                </div>
            </div>
            <div class="bill-bg">
                <p><strong>Bill To:</strong> ${customerName}</p>
            </div>
            <div class="bill-details">
                <table>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Rate</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${product}</td>
                            <td>${quantity}</td>
                            <td>₹${price}</td>
                            <td>₹${(price * quantity).toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
                <div style="margin-top: 10px;">
                    <p><strong>Subtotal:</strong> ₹${subtotal.toFixed(2)}</p>
                    <p><strong>Tax (0%):</strong> ₹${tax.toFixed(2)}</p>
                    <p><strong>Discount:</strong> ₹${discount.toFixed(2)}</p>
                </div>
            </div>
            <div class="bill-footer">
                <p><strong>Total Amount:</strong> ₹${total.toFixed(2)}</p>
            </div>
            <div class="terms">
                <p><strong>Terms and Conditions:</strong></p>
                <p>1. Goods once sold will not be taken back or exchanged.</p>
                <p>2. All disputes are subject to [Your City] jurisdiction only.</p>
            </div>
        </div>
    `;

    // Show share options
    shareOptions.style.display = 'block';

    // Attach bill details to share options
    shareOptions.setAttribute('data-bill', JSON.stringify(billDetails));
});

// // WhatsApp Share Button Logic - Send Bill as Text
// document.getElementById('sendWhatsAppBtn').addEventListener('click', () => {
//     const whatsappNumber = document.getElementById('whatsappNumber').value.trim();
//     const shareOptions = document.getElementById('shareOptions');
//     const billDetails = JSON.parse(shareOptions.getAttribute('data-bill'));

//     if (!billDetails) {
//         alert('No bill details available. Please generate the bill first.');
//         return;
//     }

//     // Validate WhatsApp number
//     if (!/^\d{10,15}$/.test(whatsappNumber)) {
//         alert('Please enter a valid WhatsApp number.');
//         return;
//     }

//     // Construct WhatsApp message
//     const whatsappMessage = `
//         *Piyo Mithila Invoice*
//         Date: ${billDetails.date}
//         Time: ${billDetails.time}
//         *Customer Name:* ${billDetails.customerName}
//         *Product:* ${billDetails.product}
//         *Quantity:* ${billDetails.quantity}
//         *Rate:* ₹${billDetails.price}
//         *Subtotal:* ₹${billDetails.subtotal}
//         *Discount:* ₹${billDetails.discount}
//         *Total Amount:* ₹${billDetails.total}
//         Thank you for your purchase!
//     `.trim();

//     const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

//     // Open WhatsApp link
//     window.open(whatsappLink, '_blank');
// });

// Share Bill Button Logic (Share as Image)
document.getElementById('shareBillBtn').addEventListener('click', async () => {
    const billOutput = document.getElementById('billOutput');

    if (!billOutput.innerHTML.trim()) {
        alert('No bill found. Please generate the bill first.');
        return;
    }

    try {
        // Convert the bill to an image using html2canvas
        const canvas = await html2canvas(billOutput);
        const image = canvas.toDataURL('image/png'); // Get image as base64

        // Convert the base64 image to Blob
        const blob = await (await fetch(image)).blob();
        const file = new File([blob], 'Bill.png', { type: 'image/png' });

        // Use the navigator.share API for sharing
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
                title: 'Piyo Mithila Invoice',
                text: 'Here is your bill:',
                files: [file],
            });
        } else {
            // Fallback: Download the image if sharing is not supported
            const link = document.createElement('a');
            link.href = image;
            link.download = 'Bill.png';
            link.click();
        }
    } catch (error) {
        console.error('Error generating or sharing image:', error);
        alert('Failed to share the bill image. Please try again.');
    }
});

// Download PDF Button Logic
document.getElementById('downloadPdfBtn').addEventListener('click', async () => {
    const { jsPDF } = window.jspdf;
    const billOutput = document.getElementById('billOutput');

    if (!billOutput.innerHTML.trim()) {
        alert('No bill found. Please generate the bill first.');
        return;
    }

    try {
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: 'a4', // Use A4 page size
        });

        await pdf.html(billOutput, {
            callback: (doc) => {
                doc.save(`Bill_${new Date().toISOString().slice(0, 10)}.pdf`);
            },
            x: 10,
            y: 10,
            margin: [10, 10, 10, 10], // Margins: top, right, bottom, left
        });
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to generate the PDF. Please try again.');
    }
});
