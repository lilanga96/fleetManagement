import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = 'https://andnagnycyihmiizzrea.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuZG5hZ255Y3lpaG1paXp6cmVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3NDkzODQsImV4cCI6MjA0OTMyNTM4NH0.eVmdl3sn7pjRMasu16qkd0_cxsNlu2TmQiSQJ0ybSwg';
const supabase = createClient(supabaseUrl, supabaseKey);
document.addEventListener("DOMContentLoaded", () => {
    const menuItems = document.querySelectorAll(".menu-item");
    const pageTitle = document.getElementById("page-title");
    const content = document.getElementById("content");

    const vehicles = []; 
    const drivers = []; 
    const maintenanceList = []; 
    let fuelLogs = []; 

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
            case "maintenance":
                renderMaintenance();
                break;
            case "fuel":
                renderFuelManagement();
                break;
            case "reports":
                renderReports();
                break;
        }
    }

    function renderDashboard() {
        const totalVehicles = vehicles.length;
        const activeDrivers = drivers.length;
        const pendingMaintenance = maintenanceList.length;

        pageTitle.innerText = "Dashboard";
        content.innerHTML = `
            <div class="dashboard-stats">
                <div class="stat">
                    <label>Total Vehicles:</label>
                    <span id="total-vehicles">${totalVehicles}</span>
                </div>
                <div class="stat">
                    <label>Active Drivers:</label>
                    <span id="active-drivers">${activeDrivers}</span>
                </div>
                <div class="stat">
                    <label>Pending Maintenance:</label>
                    <span id="pending-maintenance">${pendingMaintenance}</span>
                </div>
            </div>
        `;
    }

    function renderVehicles() {
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
                            <th>Name</th>
                            <th>Number Plate</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        `;
        const form = document.getElementById("vehicle-form");
        const tableBody = document.querySelector("#vehicle-table tbody");

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const vehicleName = document.getElementById("vehicle-name").value;
            const numberPlate = document.getElementById("number-plate").value;

            vehicles.push({ name: vehicleName, plate: numberPlate });
            updateTable(tableBody, vehicles, "vehicle");
            form.reset();
        });

        updateTable(tableBody, vehicles, "vehicle");
    }

    function renderDrivers() {
        pageTitle.innerText = "Manage Drivers";
        content.innerHTML = 
            `<h3>Driver List</h3>
            <form id="driver-form">
                <input type="text" id="driver-name" placeholder="Driver Name" required />
                <input type="text" id="driver-license" placeholder="License Number" required />
                <button type="submit">Add Driver</button>
            </form>
            <div class="table-container">
                <table id="driver-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>License</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>`
        ;
        const form = document.getElementById("driver-form");
        const tableBody = document.querySelector("#driver-table tbody");

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const driverName = document.getElementById("driver-name").value;
            const driverLicense = document.getElementById("driver-license").value;

            drivers.push({ name: driverName, license: driverLicense });
            updateTable(tableBody, drivers, "driver");
            form.reset();
        });

        updateTable(tableBody, drivers, "driver");
    }



    function renderMaintenance() {
    pageTitle.innerText = "Maintenance";
    content.innerHTML = `
        <h3>Maintenance List</h3>
        <form id="maintenance-form">
            <input type="text" id="vehicle-id" placeholder="Vehicle ID" required />
            <textarea id="maintenance-details" placeholder="Details" required></textarea>
            <button type="submit">Add Maintenance</button>
        </form>
        <div class="table-container">
            <table id="maintenance-table">
                <thead>
                    <tr>
                        <th>Vehicle ID</th>
                        <th>Details</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    `;
    const form = document.getElementById("maintenance-form");
    const tableBody = document.querySelector("#maintenance-table tbody");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const vehicleId = document.getElementById("vehicle-id").value;
        const details = document.getElementById("maintenance-details").value;

        maintenanceList.push({ vehicleId, details });
        updateTable(tableBody, maintenanceList, "maintenance");
        form.reset();
    });

    updateTable(tableBody, maintenanceList, "maintenance");
}

function renderFuelManagement() {
    pageTitle.innerText = "Fuel Management";
    content.innerHTML = `
        <h3>Fuel Logs</h3>
        <form id="fuel-form">
            <input type="text" id="fuel-driver" placeholder="Driver Name" required />
            <input type="text" id="fuel-vehicle" placeholder="Vehicle Name" required />
            <input type="text" id="fuel-plate" placeholder="Number Plate" required />
            <input type="number" id="fuel-km" placeholder="Kilometers Driven" required />
            <input type="number" id="fuel-amount" placeholder="Fuel Amount (Liters)" required />
            <textarea id="fuel-description" placeholder="Car Condition Description"></textarea>
            <input type="file" id="fuel-image" accept="image/*" />
            <button type="submit">Add Fuel Log</button>
        </form>
        <div class="table-container">
            <table id="fuel-table">
                <thead>
                    <tr>
                        <th>Driver</th>
                        <th>Vehicle</th>
                        <th>Number Plate</th>
                        <th>Kilometers</th>
                        <th>Fuel Amount</th>
                        <th>Fuel Efficiency (Km/L)</th>
                        <th>Condition Image</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    `;

    const form = document.getElementById("fuel-form");
    const tableBody = document.querySelector("#fuel-table tbody");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const driver = document.getElementById("fuel-driver").value;
        const vehicle = document.getElementById("fuel-vehicle").value;
        const plate = document.getElementById("fuel-plate").value;
        const km = parseFloat(document.getElementById("fuel-km").value);
        const fuelAmount = parseFloat(document.getElementById("fuel-amount").value);
        const description = document.getElementById("fuel-description").value;
        const imageInput = document.getElementById("fuel-image");

        const efficiency = (km / fuelAmount).toFixed(2);
        let image = "";

        if (imageInput.files[0]) {
            const reader = new FileReader();
            reader.onload = () => {
                image = reader.result; // Convert image to Base64 string
                console.log(image);
                addFuelLog(driver, vehicle, plate, km, fuelAmount, efficiency, image, description, tableBody);
            };
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            addFuelLog(driver, vehicle, plate, km, fuelAmount, efficiency, image, description, tableBody);
        }
    
        form.reset();
    });
    
    updateTable(tableBody, fuelLogs);
}

function addFuelLog(driver, vehicle, plate, km, fuelAmount, efficiency, image, description, tableBody) {
    
    fuelLogs.push({
        driver,
        vehicle,
        plate,
        km,
        fuelAmount,
        efficiency,
        image, 
        description,
    });

    
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${driver || "N/A"}</td>
        <td>${vehicle || "N/A"}</td>
        <td>${plate || "N/A"}</td>
        <td>${km || "N/A"}</td>
        <td>${fuelAmount || "N/A"}</td>
        <td>${efficiency || "N/A"}</td>
        <td>
            ${image 
                ? `<img src="${image}" alt="Condition Image" 
                      style="width: 100px; height: 100px; object-fit: cover; border: 1px solid #000;" />`
                : "No Image"}
        </td>
        <td>${description || "No Description"}</td>
    `;

   
    tableBody.appendChild(row);
}


function updateTable(tableBody, data, type) {
    tableBody.innerHTML = ""; 

    data.forEach((item) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.driver || "N/A"}</td>
            <td>${item.vehicle || "N/A"}</td>
            <td>${item.plate || "N/A"}</td>
            <td>${item.km || "N/A"}</td>
            <td>${item.fuelAmount || "N/A"}</td>
            <td>${item.efficiency || "N/A"}</td>
            <td>
                ${item.image 
                    ? `<img src="${item.image}" alt="Condition Image" 
                          style="width: 100px; height: 100px; object-fit: cover; border: 1px solid #000;" />`
                    : "No Image"}
            </td>
            <td>${item.description || "No Description"}</td>
        `;

        
        tableBody.appendChild(row);
    });
}




    function renderReports() {
        pageTitle.innerText = "Reports";
        content.innerHTML = `
            <h3>Generate Reports</h3>
            <button id="generate-report">Generate Report</button>
            <div class="report-output" id="report-output"></div>
        `;
    
        const button = document.getElementById("generate-report");
        const output = document.getElementById("report-output");
    
        button.addEventListener("click", () => {
            output.innerHTML = `
                <div class="report-card">
                    <h4>Fleet Report</h4>
                    <p><strong>Total Vehicles:</strong> ${vehicles.length}</p>
                    <p><strong>Active Drivers:</strong> ${drivers.length}</p>
                    <p><strong>Pending Maintenance:</strong> ${maintenanceList.length}</p>
                </div>
            `;
        });
    }
    

    function updateTable(tableBody, data, type) {
        tableBody.innerHTML = "";
        data.forEach((item, index) => {
            const row = document.createElement("tr");
            Object.values(item).forEach((value) => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

            const actionsCell = document.createElement("td");
            actionsCell.innerHTML = `<button class="delete-btn">Delete</button>`;
            row.appendChild(actionsCell);
            tableBody.appendChild(row);

            actionsCell.querySelector(".delete-btn").addEventListener("click", () => {
                data.splice(index, 1);
                updateTable(tableBody, data, type);
            });
        });
    }

    renderDashboard();
});
