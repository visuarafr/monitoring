<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Sales Monitoring App</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <div class="container">
        <h1>Sales Monitoring Dashboard</h1>
        <button id="logoutBtn" style="margin-bottom: 20px;">Logout</button>
        
        <!-- Filtres -->
        <div id="filters">
            <label for="date-filter">Date Range:</label>
            <input type="date" id="start-date"> to <input type="date" id="end-date">
            <button id="apply-filters">Apply Filters</button>
        </div>

        <!-- Graphiques -->
        <canvas id="callsChart" width="400" height="200"></canvas>
        <canvas id="appointmentsChart" width="400" height="200"></canvas>
        <canvas id="comparativeChart" width="400" height="200"></canvas>

        <h2>Historique</h2>
        <table id="dataTable">
            <thead>
                <tr>
                    <th>Commercial</th>
                    <th>Nombre d'appels</th>
                    <th>Nombre de RDV</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
    <script src="firebase-config.js"></script>
    <script src="dashboard.js"></script>
</body>
</html>