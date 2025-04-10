// प्रोडक्ट्स की लिस्ट
let products = [
    { no: 1, category: 'stones', serial: '101', name: 'Lakhared', size: '40x110', minPrice: '80Rs. Sq.ft.', price: '100', photo: '--', details: 'kitchen use', stock: 10 },
    { no: 2, category: 'stones', serial: '102', name: 'parl black', size: '30x100', minPrice: '75Rs. Sq.ft.', price: '110', photo: '--', details: 'hall use', stock: 15 },
    { no: 3, category: 'stones', serial: '103', name: 'chimma pink', size: '50x100', minPrice: '95Rs. Sq.ft.', price: '100', photo: '--', details: 'bathroom use', stock: 20 },
    { no: 4, category: 'Cleaner', serial: 'LL43', name: 'MultiClean', size: '--', minPrice: '150Rs.', price: '200', photo: '--', details: 'tile clean', stock: 5 },
    { no: 5, category: 'Cleaner', serial: 'LL45', name: 'SoftClean', size: '--', minPrice: '110Rs.', price: '180', photo: '--', details: 'tile clean', stock: 8 }
];

let selectedPhoto = null;
let editSelectedPhoto = null;

// प्रोडक्ट्स को Category के आधार पर सॉर्ट करने का फंक्शन (A to Z और लंबाई के आधार पर)
function sortProductsByCategory() {
    products.sort((a, b) => {
        // पहले वर्णमाला क्रम में तुलना करें
        const compareByAlphabet = a.category.localeCompare(b.category);
        if (compareByAlphabet !== 0) {
            return compareByAlphabet; // अगर अक्षर अलग हैं, तो A to Z क्रम में सॉर्ट करें
        }
        // अगर अक्षर एक ही हैं, तो लंबाई के आधार पर सॉर्ट करें (छोटे से बड़ा)
        return a.category.length - b.category.length;
    });

    // सॉर्टिंग के बाद No. को नए क्रम के अनुसार रीसेट करें
    products.forEach((product, index) => {
        product.no = index + 1; // इंडेक्स के आधार पर नया नंबर सेट करें
    });
}

// प्रोडक्ट्स को टेबल में लोड करने का फंक्शन
function loadProducts() {
    sortProductsByCategory(); // सॉर्ट करें और No. अपडेट करें
    const tableBody = document.getElementById('productTable').querySelector('tbody');
    tableBody.innerHTML = '';
    products.forEach((product, index) => {
        const row = document.createElement('tr');
        row.classList.add('lazy-load');
        row.innerHTML = `
            <td data-label="No.">${product.no}</td>
            <td data-label="Category">${product.category}</td>
            <td data-label="Serial Number">${product.serial}</td>
            <td data-label="Product Name">${product.name}</td>
            <td data-label="Size">${product.size}</td>
            <td data-label="Minimum Price">${product.minPrice}</td>
            <td data-label="Price">${product.price}</td>
            <td data-label="Photo">${product.photo === '--' ? '--' : `<button class="view-photo" onclick="viewPhoto('${product.photo}')">View Photo</button>`}</td>
            <td data-label="Details">${product.details}</td>
            <td data-label="Stock">${product.stock}</td>
            <td data-label="Action">
                <button class="edit" onclick="editProduct(${index})">Edit</button>
                <button class="delete" onclick="confirmDelete(${index})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    lazyLoadProducts();
}

// लेसी लोडिंग लागू करने का फंक्शन
function lazyLoadProducts() {
    const rows = document.querySelectorAll('.lazy-load');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    rows.forEach(row => {
        row.style.opacity = 0;
        row.style.transition = 'opacity 0.5s';
        observer.observe(row);
    });
}

// डिलीट करने की पुष्टि के लिए फंक्शन
function confirmDelete(index) {
    if (confirm("क्या आप इस प्रोडक्ट को डिलीट करना चाहते हैं?")) {
        deleteProduct(index);
        showNotification('Item successfully deleted', 'delete');
    }
}

// प्रोडक्ट डिलीट करने का फंक्शन
function deleteProduct(index) {
    products.splice(index, 1); // प्रोडक्ट हटाएँ
    loadProducts(); // टेबल रिफ्रेश करें (सॉर्टिंग के साथ)
}

// सर्च फीचर लागू करें (नाम, सीरियल, कैटेगरी, और साइज़ से)
document.getElementById('searchInput').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.serial.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.size.toLowerCase().includes(searchTerm)
    );
    const tableBody = document.getElementById('productTable').querySelector('tbody');
    tableBody.innerHTML = '';
    filteredProducts.forEach((product, index) => {
        const row = document.createElement('tr');
        row.classList.add('lazy-load');
        row.innerHTML = `
            <td data-label="No.">${product.no}</td>
            <td data-label="Category">${product.category}</td>
            <td data-label="Serial Number">${product.serial}</td>
            <td data-label="Product Name">${product.name}</td>
            <td data-label="Size">${product.size}</td>
            <td data-label="Minimum Price">${product.minPrice}</td>
            <td data-label="Price">${product.price}</td>
            <td data-label="Photo">${product.photo === '--' ? '--' : `<button class="view-photo" onclick="viewPhoto('${product.photo}')">View Photo</button>`}</td>
            <td data-label="Details">${product.details}</td>
            <td data-label="Stock">${product.stock}</td>
            <td data-label="Action">
                <button class="edit" onclick="editProduct(${index})">Edit</button>
                <button class="delete" onclick="confirmDelete(${index})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    lazyLoadProducts();
});

// फोटो दिखाने का फंक्शन
function viewPhoto(photoUrl) {
    const modal = document.getElementById('photoModal');
    const photoView = document.getElementById('photoView');
    photoView.innerHTML = `<img src="${photoUrl}" alt="Product Photo">`;
    modal.style.display = 'block';
    document.querySelector('.photo-close').onclick = function() {
        modal.style.display = 'none';
    };
}

// फोटो हैंडलिंग (Add Product)
document.getElementById('cameraBtn').addEventListener('click', function() {
    document.getElementById('photoInput').setAttribute('capture', 'environment');
    document.getElementById('photoInput').click();
});

document.getElementById('galleryBtn').addEventListener('click', function() {
    document.getElementById('photoInput').removeAttribute('capture');
    document.getElementById('photoInput').click();
});

document.getElementById('photoInput').addEventListener('change', function() {
    if (this.files && this.files[0]) {
        selectedPhoto = this.files[0];
        const preview = document.getElementById('photoPreview');
        preview.innerHTML = `<img src="${URL.createObjectURL(selectedPhoto)}">`;
        preview.style.display = 'block';
        document.getElementById('cameraBtn').style.display = 'none';
        document.getElementById('galleryBtn').style.display = 'none';
        document.getElementById('cancelPhoto').style.display = 'inline';
        document.getElementById('uploadPhoto').style.display = 'inline';
    }
});

document.getElementById('cancelPhoto').addEventListener('click', function() {
    selectedPhoto = null;
    document.getElementById('photoPreview').innerHTML = '';
    document.getElementById('photoPreview').style.display = 'none';
    document.getElementById('cameraBtn').style.display = 'inline';
    document.getElementById('galleryBtn').style.display = 'inline';
    document.getElementById('cancelPhoto').style.display = 'none';
    document.getElementById('uploadPhoto').style.display = 'none';
});

document.getElementById('uploadPhoto').addEventListener('click', function() {
    const photoUrl = URL.createObjectURL(selectedPhoto);
    selectedPhoto = photoUrl;
    showNotification('Photo Successfully Uploaded', 'success');
    document.getElementById('cancelPhoto').style.display = 'none';
    document.getElementById('uploadPhoto').style.display = 'none';
});

// नया प्रोडक्ट जोड़ने का फंक्शन
document.getElementById('addProductForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const insertAt = parseInt(document.getElementById('insertAt').value) || products.length + 1;
    const newProduct = {
        no: insertAt,
        category: document.getElementById('category').value,
        serial: document.getElementById('serial').value,
        name: document.getElementById('name').value,
        size: document.getElementById('size').value || '--',
        minPrice: document.getElementById('minPrice').value || '--',
        price: document.getElementById('price').value,
        stock: document.getElementById('stock').value,
        photo: selectedPhoto || '--',
        details: document.getElementById('details').value || '--'
    };
    products.push(newProduct); // नए प्रोडक्ट को ऐरे में जोड़ें
    loadProducts(); // टेबल रिफ्रेश करें (सॉर्टिंग के साथ)
    this.reset();
    selectedPhoto = null;
    document.getElementById('photoPreview').innerHTML = '';
    document.getElementById('photoPreview').style.display = 'none';
    document.getElementById('cameraBtn').style.display = 'inline';
    document.getElementById('galleryBtn').style.display = 'inline';
    showNotification('Item successfully added', 'success');
});

// प्रोडक्ट एडिट करने का फंक्शन
function editProduct(index) {
    const product = products[index];
    const modal = document.getElementById('editModal');
    modal.style.display = 'block';

    document.getElementById('editIndex').value = index;
    document.getElementById('editCategory').value = product.category;
    document.getElementById('editSerial').value = product.serial;
    document.getElementById('editName').value = product.name;
    document.getElementById('editSize').value = product.size;
    document.getElementById('editMinPrice').value = product.minPrice;
    document.getElementById('editPrice').value = product.price;
    document.getElementById('editStock').value = product.stock;
    document.getElementById('editDetails').value = product.details;

    const preview = document.getElementById('editPhotoPreview');
    preview.innerHTML = product.photo !== '--' ? `<img src="${product.photo}">` : '';
    preview.style.display = product.photo !== '--' ? 'block' : 'none';

    // हमेशा फोटो अपलोड बटन दिखाएँ
    document.getElementById('editCameraBtn').style.display = 'inline';
    document.getElementById('editGalleryBtn').style.display = 'inline';
    document.getElementById('editCancelPhoto').style.display = 'none';
    document.getElementById('editUploadPhoto').style.display = 'none';
    document.getElementById('removePhoto').style.display = product.photo !== '--' ? 'inline' : 'none';

    document.querySelector('.close').onclick = function() {
        modal.style.display = 'none';
        editSelectedPhoto = null;
    };

    document.getElementById('editCameraBtn').onclick = function() {
        document.getElementById('editPhotoInput').setAttribute('capture', 'environment');
        document.getElementById('editPhotoInput').click();
    };

    document.getElementById('editGalleryBtn').onclick = function() {
        document.getElementById('editPhotoInput').removeAttribute('capture');
        document.getElementById('editPhotoInput').click();
    };

    document.getElementById('editPhotoInput').onchange = function() {
        if (this.files && this.files[0]) {
            editSelectedPhoto = this.files[0];
            preview.innerHTML = `<img src="${URL.createObjectURL(editSelectedPhoto)}">`;
            preview.style.display = 'block';
            document.getElementById('editCancelPhoto').style.display = 'inline';
            document.getElementById('editUploadPhoto').style.display = 'inline';
            document.getElementById('removePhoto').style.display = 'none';
        }
    };

    document.getElementById('editCancelPhoto').onclick = function() {
        editSelectedPhoto = null;
        preview.innerHTML = product.photo !== '--' ? `<img src="${product.photo}">` : '';
        preview.style.display = product.photo !== '--' ? 'block' : 'none';
        document.getElementById('editCancelPhoto').style.display = 'none';
        document.getElementById('editUploadPhoto').style.display = 'none';
        document.getElementById('removePhoto').style.display = product.photo !== '--' ? 'inline' : 'none';
    };

    document.getElementById('editUploadPhoto').onclick = function() {
        const photoUrl = URL.createObjectURL(editSelectedPhoto);
        editSelectedPhoto = photoUrl;
        showNotification('Photo Successfully Uploaded', 'success');
        document.getElementById('editCancelPhoto').style.display = 'none';
        document.getElementById('editUploadPhoto').style.display = 'none';
        document.getElementById('removePhoto').style.display = 'inline';
    };

    document.getElementById('removePhoto').onclick = function() {
        editSelectedPhoto = '--';
        preview.innerHTML = '';
        preview.style.display = 'none';
        showNotification('Photo removed', 'edit');
        document.getElementById('removePhoto').style.display = 'none';
        document.getElementById('editCancelPhoto').style.display = 'none';
        document.getElementById('editUploadPhoto').style.display = 'none';
    };
}

// एडिट फॉर्म सबमिट करें
document.getElementById('editProductForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const index = parseInt(document.getElementById('editIndex').value);
    products[index] = {
        no: products[index].no,
        category: document.getElementById('editCategory').value,
        serial: document.getElementById('editSerial').value,
        name: document.getElementById('editName').value,
        size: document.getElementById('editSize').value || '--',
        minPrice: document.getElementById('editMinPrice').value || '--',
        price: document.getElementById('editPrice').value,
        stock: document.getElementById('editStock').value,
        photo: editSelectedPhoto || products[index].photo,
        details: document.getElementById('editDetails').value || '--'
    };
    loadProducts(); // टेबल रिफ्रेश करें (सॉर्टिंग के साथ)
    document.getElementById('editModal').style.display = 'none';
    editSelectedPhoto = null;
    showNotification('Edited successfully', 'edit');
});

// नोटिफिकेशन दिखाने का फंक्शन
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = type;
    notification.style.display = 'block';
    setTimeout(() => notification.style.display = 'none', 3000);
}

// पेज लोड होते ही प्रोडक्ट्स दिखाएँ
loadProducts();