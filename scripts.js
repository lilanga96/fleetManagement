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
                vehicleCard.innerHTML = 
                    `<h4>${booking.vehicle.name}</h4>
                    <p><strong>Number Plate:</strong> ${booking.vehicle_plate}</p>
                    <p><strong>Driver:</strong> ${booking.driver.name}</p>
                    <p><strong>Booking Date:</strong> ${booking.date}</p>`
                ;
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

   
    
    async function renderDashboard() {
        pageTitle.innerText = "Dashboard";
        content.innerHTML = 
            `<div class="dashboard-stats">
                <div class="stat" id="total-vehicles-card">
                    <label>Total Vehicles:</label>
                    <span id="total-vehicles">0</span>
                </div>
                <div class="stat" id="active-drivers-card">
                    <label>Active Drivers:</label>
                    <span id="active-drivers">0</span>
                </div>
                <div class="stat" id="total-bookings-card">
                    <label>Total Bookings:</label>
                    <span id="total-bookings">0</span>
                </div>
            </div>
    
            <div class="booked-vehicles">
                <h3>Booked Vehicles</h3>
                <div class="booked-vehicles-list" id="booked-vehicles-list">
                    <!-- Booked vehicle entries will be dynamically added here -->
                </div>
            </div>`;
        
       
        await fetchDashboardData();
        updateDashboardStats();
    
       
        document.getElementById("total-bookings-card").addEventListener("click", renderBookingsPage);
    }
  
    async function renderBookingsPage() {
        pageTitle.innerText = "Booked Vehicles";
        content.innerHTML = `
            <h3>Booked Vehicles</h3>
            <div class="table-container">
                <table id="bookings-table">
                    <thead>
                        <tr>
                            <th>Vehicle</th>
                            <th>Number Plate</th>
                            <th>Driver</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Bookings will be dynamically added here -->
                    </tbody>
                </table>
            </div>`;
        
        const tableBody = document.querySelector("#bookings-table tbody");
    
        try {
            
            const { data: bookings, error } = await supabase
                .from('bookings')
                .select(`
                    driver_id,
                    vehicles (name, plate),
                    date,
                    drivers!fk_driver_id (name)
                `);
    
            if (error) {
                console.error("Error fetching bookings:", error);
                return;
            }
    
            updateBookingTable(tableBody, bookings);
        } catch (error) {
            console.error("Error rendering bookings page:", error);
        }
    }
    
    
    async function fetchDashboardData() {
        try {
            
            const { data: vehicleData, error: vehicleError } = await supabase.from("vehicles").select("*");
            if (vehicleError) throw vehicleError;
            vehicles = vehicleData;
    
            
            const { data: driverData, error: driverError } = await supabase.from("drivers").select("*");
            if (driverError) throw driverError;
            drivers = driverData;
    
            
            const { data: bookingData, error: bookingError } = await supabase
            
            .from('bookings')
            .select(`
                driver_id,
                vehicles (name, plate),
                date,
                drivers!fk_driver_id (name)
            `);
            if (bookingError) throw bookingError;
            bookings = bookingData;
    
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
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
                <select id="booked-driver" required>
                    <option value="" disabled selected>Select a Driver</option>
                </select>
                <input type="date" id="booking-date" required />
                <input type="time" id="time-taken" required />
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
                            <th>Time Taken</th>
                            <th>Time Returned</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>`;
    
    
            const form = document.getElementById("booking-form");
            const tableBody = document.querySelector("#booking-table tbody");
            const vehicleSelect = document.getElementById("booked-vehicle");
            const driverSelect = document.getElementById("booked-driver");
    
            async function fetchVehicles() {
                const { data: vehicles, error } = await supabase.from("vehicles").select("id, name, plate");
                if (error) {
                    console.error("Error fetching vehicles:", error);
                    return;
                }
        
                vehicles.forEach(vehicle => {
                    const option = document.createElement("option");
                    option.value = vehicle.id;
                    option.textContent = `${vehicle.name} (${vehicle.plate})`;
                    vehicleSelect.appendChild(option);
                });
            }
        
            async function fetchDrivers() {
                const { data: drivers, error } = await supabase.from("drivers").select("id, name");
                if (error) {
                    console.error("Error fetching drivers:", error);
                    return;
                }
        
                drivers.forEach(driver => {
                    const option = document.createElement("option");
                    option.value = driver.id;
                    option.textContent = driver.name;
                    driverSelect.appendChild(option);
                });
            }
        
        
    
            async function fetchBookingData() {
                try {
                    const { data, error } = await supabase
                        .from("bookings")
                        .select(`
                            vehicle_id,
                            driver_id,
                            date,
                            time_taken,
                            time_returned,
                            vehicles (name, plate),
                            drivers!fk_driver_id (name)
                        `);
        
                    if (error) throw error;
        
                    updateBookingTable(tableBody, data);
                } catch (error) {
                    console.error("Error fetching booking data:", error);
                }
            }
        
        
        
        
        
            form.addEventListener("submit", async (e) => {
                e.preventDefault();
                const selectedVehicleId = document.getElementById("booked-vehicle").value;
                const selectedDriverId = document.getElementById("booked-driver").value;
                const bookingDate = document.getElementById("booking-date").value;
                const timeTaken = document.getElementById("time-taken").value;
        
                const { error } = await supabase.from("bookings").insert([
                    {
                        vehicle_id: selectedVehicleId,
                        driver_id: selectedDriverId,
                        date: bookingDate,
                        time_taken: timeTaken,
                        time_returned: null // Initially empty
                    }
                ]);
        
                if (error) {
                    console.error("Error booking vehicle:", error);
                    return;
                }
        
                fetchBookingData();
                form.reset();
            });
        
            fetchVehicles();
            fetchDrivers();
            fetchBookingData();
        }
        
        
    
        function updateBookingTable(tableBody, bookings) {
            tableBody.innerHTML = "";
            bookings.forEach((booking) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${booking.vehicles.name}</td>
                    <td>${booking.vehicles.plate}</td>
                    <td>${booking.drivers.name}</td>
                    <td>${booking.date}</td>
                    <td>${booking.time_taken}</td>
                    <td>
                        <input type="time" value="${booking.time_returned || ''}" 
                            data-booking-id="${booking.vehicle_id}" class="time-returned-input"/>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        
            // Add event listener to update "Time Returned"
            document.querySelectorAll(".time-returned-input").forEach(input => {
                input.addEventListener("change", async (e) => {
                    const newTimeReturned = e.target.value;
                    const bookingId = e.target.getAttribute("data-booking-id");
        
                    if (!newTimeReturned) return;
        
                    // Update Supabase database
                    const { error } = await supabase
                        .from("bookings")
                        .update({ time_returned: newTimeReturned })
                        .eq("vehicle_id", bookingId);
        
                    if (error) {
                        console.error("Error updating time returned:", error);
                        return;
                    }
        
                    console.log("Time returned updated successfully!");
                });
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
    
        
        async function fetchFuelLogs() {
            const { data, error } = await supabase.from("fuel_logs").select("*");
            if (error) {
                console.error("Error fetching fuel logs:", error);
                return;
            }
            updateTable(tableBody, data);
        }
    
       
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
    
            con