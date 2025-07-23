const items = [
  {
    title: "Used Laptop",
    price: "₹30,000",
    image: "../assets/objects/laptop.jpg",
    category: "Electronics",
    description: "A well-maintained used laptop suitable for daily work, browsing, and entertainment. Comes with charger."
  },
  {
    title: "Bike",
    price: "₹35,999",
    image: "../assets/objects/bike.avif",
    category: "Vehicles",
    description: "Second-hand sports bike in excellent condition. Recently serviced and ready to ride."
  },
  {
    title: "Guitar",
    price: "₹10,100",
    image: "../assets/objects/guitar.jpeg",
    category: "Music",
    description: "Acoustic guitar with great sound quality. Hardly used and includes a carrying case."
  },
  {
    title: "Study Table",
    price: "₹500",
    image: "../assets/objects/table.jpeg",
    category: "Furniture",
    description: "Compact study table made of engineered wood. Ideal for students and small rooms."
  },
  {
    title: "Smartphone",
    price: "₹5,000",
    image: "../assets/objects/phone.avif",
    category: "Electronics",
    description: "Android smartphone with 64GB storage and dual SIM support. Lightly used with original box."
  },
  {
    title: "Books",
    price: "₹300",
    image: "../assets/objects/books.jpeg",
    category: "Books",
    description: "Set of educational and fiction books in good condition. Perfect for casual reading and studies."
  },
  {
    title: "Desk Chair",
    price: "₹500",
    image: "../assets/objects/chair.jpeg",
    category: "Furniture",
    description: "Comfortable swivel desk chair with minor wear. Great for home office setups."
  },
  {
    title: "Headphones",
    price: "₹999",
    image: "../assets/objects/headphone.jpeg",
    category: "Electronics",
    description: "Over-ear wired headphones with noise isolation and great bass. Barely used."
  },
  {
    title: "Washing Machine",
    price: "₹12,500",
    image: "../assets/objects/washingmachine.jpeg",
    category: "Appliances",
    description: "Fully automatic top-load washing machine. Works perfectly and recently serviced."
  },
  {
    title: "Microwave Oven",
    price: "₹5,200",
    image: "../assets/objects/oven.jpeg",
    category: "Appliances",
    description: "20L microwave oven with grill function. Perfect working condition with manual."
  },
  {
    title: "Air Cooler",
    price: "₹4,800",
    image: "../assets/objects/aircooler.png",
    category: "Appliances",
    description: "Portable air cooler with powerful airflow. Ideal for summer months. Low power consumption."
  },
  {
    title: "Table Lamp",
    price: "₹750",
    image: "../assets/objects/lamp.jpeg",
    category: "Home Decor",
    description: "Stylish LED table lamp for reading or decor. Adjustable brightness and energy efficient."
  }
];


let itemIndex = 0;
const itemsPerPage = 10;

function loadItems() {
  const grid = document.getElementById('itemGrid');
  for (let i = itemIndex; i < itemIndex + itemsPerPage && i < items.length; i++) {
    const item = items[i];
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <div class="info">
        <h4>${item.title}</h4>
        <p>${item.price}</p>
      </div>
    `;
    grid.appendChild(card);
  }
  itemIndex += itemsPerPage;
}

function loadMore() {
  loadItems(); 
}


function searchItems() {
  const keyword = document.getElementById('searchInput').value.toLowerCase();
  const grid = document.getElementById('itemGrid');
  grid.innerHTML = '';
  const filtered = items.filter(item => item.title.toLowerCase().includes(keyword));
  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <div class="info">
        <h4>${item.title}</h4>
        <p>${item.price}</p>
      </div>
    `;
    grid.appendChild(card);
  });
  itemIndex = filtered.length;
}


function openModal(id) {
  document.getElementById(id).style.display = "block";

}

function performLogin() {
  const usernameInput = document.getElementById("loginUsername").value.trim();
  const passwordInput = document.getElementById("loginPassword").value.trim();

  const validUsername = "testuser";
  const validPassword = "1234";

  if (usernameInput === validUsername && passwordInput === validPassword) {
    localStorage.setItem("username", usernameInput); 
    window.location.href = "loginui.html"; 
  } else {
    alert("Invalid credentials. Try: testuser / 1234");
  }
}



function closeModal(id) {
  document.getElementById(id).style.display = "none";
}

window.onclick = function(event) {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
};



  
window.onload = loadItems;
