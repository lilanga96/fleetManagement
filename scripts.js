import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = 'https://andnagnycyihmiizzrea.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuZG5hZ255Y3lpaG1paXp6cmVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3NDkzODQsImV4cCI6MjA0OTMyNTM4NH0.eVmdl3sn7pjRMasu16qkd0_cxsNlu2TmQiSQJ0ybSwg';
const supabase = createClient(supabaseUrl, supabaseKey);
document.addEventListener("DOMContentLoaded", () => {
    const menuItems = document.querySelectorAll(".menu-item");
    const pageTitle = document.getElementById("page-title");
    const content = document.getElementById("content");

    let vehicles = [];
    let drivers = [];
    let bookings = [];
    let fuelLogs = [];

    
    function updateDashboardStats() {
        const totalVehicles = vehicles.length;
        const activeDrivers = drivers.length;
        const totalBookings = bookings.length;
    
        document.getElementById("total-vehicles").innerText = totalVehicles;
        document.getElementById("active-drivers").innerText = activeDrivers;
        document.getElementById("total-bookings").innerText = totalBookings;
    
        const bookedVehiclesList = document.getElementById("booked-vehicles-list");
        bookedVehiclesList.innerHTML = "";
    
        if (bookings.length === 0) {
            bookedVehiclesList.innerHTML = `<p>No vehicles booked at the moment.</p>`;
        } else {
            bookings.forEach((booking) => {
                const vehicleCard = document.createElement("div");
                vehicleCard.className = "vehicle-card";
                vehicleCard.innerHTML = `
                    <h4>${booking.vehicle_name}</h4> <!-- Use the correct property -->
                    <p><strong>Number Plate:</strong> ${booking.vehicle_plate}</p> <!-- Use the correct property -->
                      <p><strong>Driver:</strong> ${booking.driver}</p><!-- Use the correct property -->
                    <p><strong>Booking Date:</strong> ${booking.date}</p>
                `;
                bookedVehiclesList.appendChild(vehicleCard);
            });
        }
    }
    

    menuItems.forEach((item) => {
        item.addEventListener("click", () => {
            menuItems.forEach((menu) => menu.classList.remove("active"));
            item.classList.add("active");
            const section = item.id;
            updateContent(section);
        });
    });

    function updateContent(section) {
        switch (section) {
            case "dashboard":
                renderDashboard();
                break;
            case "vehicles":
                renderVehicles();
                break;
            case "drivers":
                renderDrivers();
                break;
            case "booking":
                renderBooking();
                break;
            case "fuel":
                renderFuelManagement();
                break;
            case "reports":
                renderReports();
                break;
        }
    }

    // Render Dashboard
    // Render Dashboard
    function renderDashboard() {
        pageTitle.innerText = "Dashboard";
        content.innerHTML = `
            <div class="dashboard-stats">
                <div class="stat">
                    <label>Total Vehicles:</label>
                    <span id="total-vehicles">0</span>
                </div>
                <div class="stat">
                    <label>Active Drivers:</label>
                    <span id="active-drivers">0</span>
                </div>
                <div class="stat">
                    <label>Total Bookings:</label>
                    <span id="total-bookings">0</span>
                </div>
            </div>
    
            <div class="booked-vehicles">
                <h3>Booked Vehicles</h3>
                <div class="booked-vehicles-list" id="booked-vehicles-list">
                    <!-- Booked vehicle entries will be dynamically added here -->
                </div>
            </div>
        `;
    
        // Use setTimeout to ensure DOM is rendered before calling updateDashboardStats
        setTimeout(() => {
            updateDashboardStats();
        }, 100); // Small delay
    }
    
    async function renderVehicles() {
        pageTitle.innerText = "Manage Vehicles";
        content.innerHTML = `
            <h3>Vehicle List</h3>
            <form id="vehicle-form">
                <input type="text" id="vehicle-name" placeholder="Vehicle Name" required />
                <input type="text" id="number-plate" placeholder="Number Plate" required />
                <button type="submit">Add Vehicle</button>
            </form>
            <div class="table-container">
                <table id="vehicle-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Number Plate</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        `;

        const form = document.getElementById("vehicle-form");
        const tableBody = document.querySelector("#vehicle-table tbody");

        
        async function fetchVehicles() {
            const { data, error } = await supabase.from("vehicles").select("*");
            if (error) {
                console.error("Error fetching vehicles:", error);
                return;
            }
            vehicles = data; 
            updateVehicleTable(tableBody, data);
            updateDashboardStats();  
        }

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const vehicleName = document.getElementById("vehicle-name").value;
            const numberPlate = document.getElementById("number-plate").value;

            const { error } = await supabase.from("vehicles").insert([{ name: vehicleName, plate: numberPlate }]);
            if (error) {
                console.error("Error adding vehicle:", error);
                return;
            }

            fetchVehicles(); 
            form.reset();
        });

        fetchVehicles();
    }

   
    function updateVehicleTable(tableBody, vehicles) {
        tableBody.innerHTML = "";
        vehicles.forEach((vehicle) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${vehicle.id}</td>
                <td>${vehicle.name}</td>
                <td>${vehicle.plate}</td>
            `;
            tableBody.appendChild(row);
        });
    }

  
    async function renderDrivers() {
        pageTitle.innerText = "Manage Drivers";
        content.innerHTML = `
            <h3>Driver List</h3>
            <form id="driver-form">
                <input type="text" id="driver-name" placeholder="Driver Name" required />
                <input type="text" id="driver-license" placeholder="License Number" required />
                <button type="submit">Add Driver</button>
            </form>
            <div class="table-container">
                <table id="driver-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>License</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        `;

        const form = document.getElementById("driver-form");
        const tableBody = document.querySelector("#driver-table tbody");

        async function fetchDrivers() {
            const { data, error } = await supabase.from("drivers").select("*");
            if (error) {
                console.error("Error fetching drivers:", error);
                return;
            }
            drivers = data;  
            updateDriverTable(tableBody, data);
            updateDashboardStats();  
        }

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const driverName = document.getElementById("driver-name").value;
            const driverLicense = document.getElementById("driver-license").value;

            const { error } = await supabase.from("drivers").insert([{ name: driverName, license: driverLicense }]);
            if (error) {
                console.error("Error adding driver:", error);
                return;
            }

            fetchDrivers(); 
            form.reset();
        });

        fetchDrivers();
    }

   
    function updateDriverTable(tableBody, drivers) {
        tableBody.innerHTML = "";
        drivers.forEach((driver) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${driver.id}</td>
                <td>${driver.name}</td>
                <td>${driver.license}</td>
            `;
            tableBody.appendChild(row);
        });
    }

   
    async function renderBooking() {
        pageTitle.innerText = "Vehicle Booking";
        content.innerHTML = `
            <h3>Book a Vehicle</h3>
            <form id="booking-form">
                <select id="booked-vehicle" required>
                    <option value="" disabled selected>Select a Vehicle</option>
                </select>
                <input type="text" id="booked-driver" placeholder="Driver Name" required />
                <input type="date" id="booking-date" required />
                <button type="submit">Confirm Booking</button>
            </form>
            <div class="table-container">
                <table id="booking-table">
                    <thead>
                        <tr>
                            <th>Vehicle</th>
                            <th>Number Plate</th>
                            <th>Driver</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        `;
    
        const form = document.getElementById("booking-form");
        const tableBody = document.querySelector("#booking-table tbody");
        const vehicleSelect = document.getElementById("booked-vehicle");
    
        
        async function fetchBookingData() {
            const { data: vehicleData, error: vehicleError } = await supabase.from("vehicles").select("*");
            if (vehicleError) {
                console.error("Error fetching vehicles for booking:", vehicleError);
                return;
            }
            vehicles = vehicleData;
    
            vehicleData.forEach((vehicle) => {
                const option = document.createElement("option");
                option.value = vehicle.id;
                option.innerText = `${vehicle.name} - ${vehicle.plate}`;
                vehicleSelect.appendChild(option);
            });
    
            const { data: bookingData, error: bookingError } = await supabase.from("bookings").select("*");
            if (bookingError) {
                console.error("Error fetching bookings:", bookingError);
                return;
            }
            bookings = bookingData;
            updateBookingTable(tableBody, bookingData);
            updateDashboardStats();
        }
    
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const selectedVehicleId = document.getElementById("booked-vehicle").value;
            const driverName = document.getElementById("booked-driver").value;
            const bookingDate = document.getElementById("booking-date").value;
    
            const { error } = await supabase.from("bookings").insert([{ vehicle_id: selectedVehicleId, driver_name: driverName, date: bookingDate }]);
            if (error) {
                console.error("Error booking vehicle:", error);
                return;
            }
    
            fetchBookingData(); 
            form.reset();
        });
    
        fetchBookingData();
    }
    
  
    function updateBookingTable(tableBody, bookings) {
        tableBody.innerHTML = "";
        bookings.forEach((booking) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${booking.vehicle_name}</td>
                <td>${booking.vehicle_plate}</td>
                <td>${booking.driver_name}</td>
                <td>${booking.date}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    

    function renderFuelManagement() {
        pageTitle.innerText = "Driver and Vehicle logs";
        content.innerHTML = `
            <form id="fuel-form">
                <input type="text" id="fuel-driver" placeholder="Driver Name" required />
                <input type="text" id="fuel-vehicle" placeholder="Vehicle Name" required />
                <input type="text" id="fuel-plate" placeholder="Number Plate" required />
                <textarea id="fuel-description" placeholder="Car Condition Description"></textarea>
                <input type="file" id="fuel-image" accept="image/*" />
                <button type="submit">Add Fuel Log</button>
            </form>
            <div class="table-container">
                <table id="fuel-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Driver</th>
                            <th>Vehicle</th>
                            <th>Number Plate</th>
                            <th>Description</th>
                            <th>Condition Image</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        `;
    
        const form = document.getElementById("fuel-form");
        const tableBody = document.querySelector("#fuel-table tbody");
    
        // Fetch and display fuel logs
        async function fetchFuelLogs() {
            const { data, error } = await supabase.from("fuel_logs").select("*");
            if (error) {
                console.error("Error fetching fuel logs:", error);
                return;
            }
            updateTable(tableBody, data);
        }
    
        // Handle form submission
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
    
            const driver = document.getElementById("fuel-driver").value;
            const vehicle = document.getElementById("fuel-vehicle").value;
            const plate = document.getElementById("fuel-plate").value;
            const description = document.getElementById("fuel-description").value;
            const imageInput = document.getElementById("fuel-image");
            let imageUrl = "";
    
            if (imageInput.files[0]) {
                const file = imageInput.files[0];
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from("fuel-images")
                    .upload(`images/${file.name}`, file);
    
                if (uploadError) {
                    console.error("Error uploading image:", uploadError);
                    return;
                }
    
                imageUrl = `https://andnagnycyihmiizzrea.supabase.co/storage/v1/object/public/fuel-images/${uploadData.path}`;
            }
    
            const { error } = await supabase.from("fuel_logs").insert([
                {
                    driver,
                    vehicle,
                    plate,
                    description,
                    image_url: imageUrl,
                },
            ]);
    
            if (error) {
                console.error("Error adding fuel log:", error);
                return;
            }
    
            fetchFuelLogs();
            form.reset();
        });
    
        fetchFuelLogs();
    }
    
    function updateTable(tableBody, data) {
        tableBody.innerHTML = "";
    
        data.forEach((item) => {
            const row = document.createElement("tr");
    
            row.innerHTML = `
                <td>${item.id || "N/A"}</td>
                <td>${item.driver || "N/A"}</td>
                <td>${item.vehicle || "N/A"}</td>
                <td>${item.plate || "N/A"}</td>
                <td>${item.description || "No Description"}</td>
                <td>
                    ${item.image_url 
                        ? `<img src="${item.image_url}" alt="Condition Image" 
                            style="width: 100px; height: 100px; object-fit: cover; border: 1px solid #000;" />`
                        : "No Image"}
                </td>
                <td>
                    <button data-id="${item.id}" class="delete-button">Delete</button>
                </td>
            `;
    
            tableBody.appendChild(row);
        });
    
        // Bind delete buttons
        document.querySelectorAll(".delete-button").forEach((button) => {
            button.addEventListener("click", async () => {
                const id = button.getAttribute("data-id");
                const { error } = await supabase.from("fuel_logs").delete().eq("id", id);
    
                if (error) {
                    console.error("Error deleting fuel log:", error);
                    return;
                }
    
                fetchFuelLogs();
            });
        });
    }
    
    renderDashboard();
    updateDashboardStats(); 
});
   