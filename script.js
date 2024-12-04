// script.js
// Generate Bill Button Logic
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
            <div>
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

// WhatsApp Share Button Logic
document.getElementById('sendWhatsAppBtn').addEventListener('click', () => {
    const whatsappNumber = document.getElementById('whatsappNumber').value.trim();
    const shareOptions = document.getElementById('shareOptions');
    const billDetails = JSON.parse(shareOptions.getAttribute('data-bill'));

    if (!billDetails) {
        alert('No bill details available. Please generate the bill first.');
        return;
    }

    // Validate WhatsApp number
    if (!/^\d{10,15}$/.test(whatsappNumber)) {
        alert('Please enter a valid WhatsApp number.');
        return;
    }

    // Construct WhatsApp message
    const whatsappMessage = `
        *Piyo Mithila Invoice*%0A
        Date: ${billDetails.date}%0A
        Time: ${billDetails.time}%0A%0A
        *Customer Name:* ${billDetails.customerName}%0A
        *Product:* ${billDetails.product}%0A
        *Quantity:* ${billDetails.quantity}%0A
        *Rate:* ₹${billDetails.price}%0A
        *Subtotal:* ₹${billDetails.subtotal}%0A
        *Discount:* ₹${billDetails.discount}%0A
        *Total Amount:* ₹${billDetails.total}%0A%0A
        Thank you for your purchase!%0A
    `.trim();

    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    // Open WhatsApp link
    window.open(whatsappLink, '_blank');
});



// // -------------------------------------

// function sendWhatsAppMessage() {
//     const number = document.getElementById("whatsappNumber").value.trim();
//     const message = "Check out this portfolio: https://adityaraj1114resume.netlify.app/";

//     // Format the number, remove any spaces or dashes
//     const formattedNumber = number.replace(/[^0-9]/g, "");

//     if (formattedNumber) {
//         const url = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`;
//         window.open(url, '_blank');
//     } else {
//         alert("Please enter a valid WhatsApp number.");
//     }
// }

// Include jsPDF script (Add this in your HTML file)
// <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js"></script>

document.getElementById('downloadPdfBtn').addEventListener('click', async () => {
    const { jsPDF } = window.jspdf; // Access jsPDF
    const billOutput = document.getElementById('billOutput');

    // Check if the billOutput contains content
    if (!billOutput.innerHTML.trim()) {
        alert('No bill found. Please generate the bill first.');
        return;
    }

    try {
        // Initialize jsPDF
        const pdf = new jsPDF();

        // Add content from billOutput to the PDF
        await pdf.html(billOutput, {
            callback: (doc) => {
                // Save the PDF with a dynamic filename
                doc.save(`Bill_${new Date().toISOString().slice(0, 10)}.pdf`);
            },
            x: 10,
            y: 10,
            width: 190, // Adjust the width to fit content
        });
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to generate the PDF. Please try again.');
    }
});

