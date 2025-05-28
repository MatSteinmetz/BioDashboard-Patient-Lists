// Random data generators
const firstNames = ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Jamie", "Avery", "Peyton", "Quinn", "Drew", "Skyler", "Reese", "Rowan", "Sawyer", "Emerson", "Finley", "Harper", "Jules", "Kai", "Logan", "Parker", "Remy", "Sage", "Tatum", "Blake", "Cameron", "Dakota", "Elliot", "Hayden"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker"];
const locations = ["ICU", "Med/Surg", "Telemetry", "ER", "Stepdown", "Observation", "Ortho", "Cardiac", "Neuro", "Peds"];
const attendings = ["Dr. Adams", "Dr. Baker", "Dr. Carter", "Dr. Diaz", "Dr. Evans", "Dr. Foster", "Dr. Green", "Dr. Hall", "Dr. Irwin", "Dr. Jones"];
const rns = ["RN Smith", "RN Lee", "RN Patel", "RN Kim", "RN Brown", "RN Clark", "RN Davis", "RN Evans", "RN Garcia", "RN Harris"];
const iso = ["None", "Contact", "Droplet", "Airborne", "Special"];
const fallRisk = ["Low", "Moderate", "High"];
const tele = ["Yes", "No"];
const enrolled = ["Yes", "No"];
function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randomLOS() { return randomInt(1, 30) + 'd'; }
function randomNotifications() { return randomInt(0, 5) ? randomInt(0, 3) : 0; }
function randomActivity() { return ["Low", "Moderate", "High"][randomInt(0,2)]; }
function randomSleep() { return randomInt(2, 10) + ' hrs'; }
function randomDischarge() { return ["Ready", "Not Ready", "Pending"][randomInt(0,2)]; }
function randomRealTimeActivity() { return ["Resting", "Ambulating", "In Bed", "Out of Bed"][randomInt(0,3)]; }
function randomMRN() { return randomInt(100000, 999999); }

function generatePatient() {
  // For all models, generate all possible fields
  const bioButtonLevels = ['white', 'purple', 'yellow', 'green', 'red'];
  const bioButtonLevel = randomFrom(bioButtonLevels);
  const now = new Date();
  const lastReading = new Date(now.getTime() - randomInt(1, 60) * 60000); // 1-60 min ago
  // For Good Catch Report
  const goodCatchNames = firstNames.map((f, i) => f + ' ' + lastNames[i]);
  const nurseNames = ["RN Smith", "RN Lee", "RN Patel", "RN Kim", "RN Brown", "RN Clark", "RN Davis", "RN Evans", "RN Garcia", "RN Harris"];
  const physicianNames = ["Dr. Adams", "Dr. Baker", "Dr. Carter", "Dr. Diaz", "Dr. Evans", "Dr. Foster", "Dr. Green", "Dr. Hall", "Dr. Irwin", "Dr. Jones"];
  const alerts = ["Sepsis", "Hypoxia", "Bradycardia", "Tachycardia", "None"];
  const responses = ["Immediate", "Delayed", "No Response", "Escalated", "Resolved"];
  const statuses = ["Stable", "Critical", "Improving", "Deteriorating"];
  // For default list view
  const notifTypes = [
    "HR threshold",
    "RR threshold",
    "HR trending up",
    "HR trending down",
    "RR trending up",
    "RR trending down"
  ];
  const notifCount = randomInt(0, 4);
  // Pick notifCount random notification types (no duplicates)
  let notifReasons = [];
  if (notifCount > 0) {
    notifReasons = notifTypes.slice().sort(() => 0.5 - Math.random()).slice(0, notifCount);
  }
  return {
    mrn: randomMRN(),
    firstName: randomFrom(firstNames),
    lastName: randomFrom(lastNames),
    unit: randomFrom(locations),
    bioId: randomInt(10000, 99999),
    room: randomInt(100, 499),
    hr: randomInt(50, 140),
    rr: randomInt(10, 40),
    temp: (randomInt(970, 1040) / 10).toFixed(1),
    activityMinHour: randomInt(0, 60),
    notifType: randomFrom(notifTypes),
    notifReviews: randomInt(0, 5),
    lastUpdateMin: randomInt(1, 60),
    percentOnBody: randomInt(70, 100) + '%',
    notifCount: notifCount,
    notifReasons: notifReasons,
    activityMins: randomInt(0, 1440),
    liveActivity: randomFrom(['active', 'inactive']),
    patientStatus: randomFrom(['Sleeping', 'Awake']),
    atHomeOrderStatus: randomFrom(['Ordered', 'Not Ordered', 'Pending']),
    dischargeReadiness: randomFrom(['Ready', 'Not Ready', 'Pending']),
    // Unit Manager fields
    bioButtonDataLevel: bioButtonLevel,
    bioButtonDataPoints: randomInt(0, 20),
    percentFiveOrMore: randomInt(0, 100) + '%',
    lastBioButtonReading: lastReading.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
    rounded: false,
    // Good Catch Report fields
    gcRoom: randomInt(100, 499),
    gcPatient: randomFrom(goodCatchNames),
    gcDate: new Date(now.getTime() - randomInt(0, 7) * 86400000).toLocaleDateString(),
    gcDI: randomInt(1, 10),
    gcSepsis: randomInt(0, 10),
    gcAlert: randomFrom(alerts),
    gcNurse: randomFrom(nurseNames),
    gcNurseResponse: randomFrom(responses),
    gcPhysician: randomFrom(physicianNames),
    gcPhysicianResponse: randomFrom(responses),
    gcNewDiagnosis: randomFrom(["Yes", "No"]),
    gcPatientStatus: randomFrom(statuses),
    gcNotes: randomFrom(["Follow-up required", "Stable after intervention", "Transferred to ICU", "No further action", "Observation ongoing"])
  };
}

let patients = [];
let currentModel = '';
let sortColumn = '';
let sortDirection = 'asc';
let currentPatientIndex = null;

// Add these variables at the top of the file with other global variables
let currentFilters = {
  percentOnBody: 'all',
  notifCount: 'all',
  activityMins: 'all',
  atHome: 'all',
  discharge: 'all',
  considerDischarge: 'all'
};

function getBioButtonColor(level) {
  switch(level) {
    case 'white': return '#fff';
    case 'purple': return '#a259e6';
    case 'yellow': return '#f7c873';
    case 'green': return '#4caf50';
    case 'red': return '#e53935';
    default: return '#ccc';
  }
}

function getVitalColorGroup(value, type) {
  // Define thresholds for each vital sign
  const thresholds = {
    hr: { green: [60, 100], yellow: [50, 110] },
    rr: { green: [12, 20], yellow: [8, 24] },
    temp: { green: [97.0, 99.0], yellow: [96.0, 100.0] }
  };
  
  const t = thresholds[type];
  if (value >= t.green[0] && value <= t.green[1]) return 0; // green
  if (value >= t.yellow[0] && value <= t.yellow[1]) return 1; // yellow
  return 2; // red
}

function getPastelVitalColor(value, type) {
  const colorGroup = getVitalColorGroup(value, type);
  switch(colorGroup) {
    case 0: return '#b3ffd1'; // green
    case 1: return '#fff7b3'; // yellow
    case 2: return '#ffb3b3'; // red
    default: return '#b3ffd1';
  }
}

function populateTable() {
  const tbody = document.getElementById('dashboardBody');
  tbody.innerHTML = '';
  let headerHtml = '';
  if (!currentModel) {
    headerHtml = `
      <th>Last Name</th>
      <th>First Name</th>
      <th>MRN</th>
      <th>Bio ID</th>
      <th>Room</th>
      <th style="text-align:center;cursor:pointer;" onclick="sortTable('hr')">HR${getSortIndicator('hr')}</th>
      <th style="text-align:center;cursor:pointer;" onclick="sortTable('rr')">RR${getSortIndicator('rr')}</th>
      <th style="text-align:center;cursor:pointer;" onclick="sortTable('temp')">Temp${getSortIndicator('temp')}</th>
      <th style="text-align:center;">Activity<br>Minutes<br>Past Hour</th>
      <th class="stacked-cell" style="text-align:center;cursor:pointer;" onclick="sortTable('notifReviews')">Notification<br>Reviews${getSortIndicator('notifReviews')}</th>
      <th class="stacked-cell" style="text-align:center;">Most Recent<br>Notification</th>
      <th style="text-align:center;">Last Update</th>
    `;
  } else if (currentModel === 'Rounding Optimization') {
    headerHtml = `
      <th>Rounded</th>
      <th>Last Name</th>
      <th>First Name</th>
      <th>MRN</th>
      <th>Bio ID</th>
      <th>Room</th>
      <th style="text-align:center;">BioButton<br>Data</th>
      <th style="text-align:center;">% On Body</th>
      <th class="stacked-cell" style="text-align:center;">Clinical Notif<br>(24h)</th>
      <th class="stacked-cell" style="text-align:center;">Activity<br>(min, 24h)</th>
      <th style="text-align:center;">Activity Past 15 min</th>
      <th style="text-align:center;">Status</th>
    `;
  } else if (currentModel === 'Length of Stay') {
    headerHtml = `
      <th style="text-align:center;">Last Name</th>
      <th style="text-align:center;">First Name</th>
      <th style="text-align:center;">MRN</th>
      <th style="text-align:center;">Bio ID</th>
      <th style="text-align:center;">Room</th>
      <th style="text-align:center;">% On Body</th>
      <th class="stacked-cell" style="text-align:center;">Clinical Notif<br>(24h)</th>
      <th class="stacked-cell" style="text-align:center;">Activity<br>(min, 24h)</th>
      <th class="stacked-cell" style="text-align:center;">At-Home<br>Order Status</th>
      <th class="stacked-cell" style="text-align:center;">Discharge<br>Readiness</th>
      <th class="stacked-cell" style="text-align:center;">Consider for<br>Discharge</th>
    `;
  } else if (currentModel === 'Unit Manager') {
    headerHtml = `
      <th>Last Name</th>
      <th>First Name</th>
      <th>MRN</th>
      <th>Bio ID</th>
      <th>Room</th>
      <th class="stacked-cell" style="text-align:center;">BioButton<br>Data</th>
      <th class="stacked-cell" style="text-align:center;">BioButton Data Points<br>(Past Hour)</th>
      <th class="stacked-cell" style="text-align:center;">% ≥5<br>Data Points<br>(1h)</th>
      <th class="stacked-cell" style="text-align:center;">Last BioButton<br>Reading</th>
      <th class="stacked-cell" style="text-align:center;">Activity min<br>(1h)</th>
    `;
  } else if (currentModel === 'Good Catch Report') {
    headerHtml = `
      <th>MRN</th>
      <th>Room #</th>
      <th class="stacked-cell">Patient</th>
      <th>Date</th>
      <th>DI</th>
      <th>Sepsis<br>score</th>
      <th>Alert</th>
      <th>Nurse<br>Notified</th>
      <th>Nursing<br>Response</th>
      <th>Physician<br>Notified</th>
      <th>Physician<br>Response</th>
      <th class="stacked-cell">New<br>Diagnosis</th>
      <th class="stacked-cell">Patient<br>Status</th>
      <th class="stacked-cell">Notes</th>
    `;
  }
  document.querySelector('#dashboardTable thead tr').innerHTML = headerHtml;

  // Filter patients based on current filters
  let filteredPatients = patients.filter(p => {
    // % On Body filter
    if (currentFilters.percentOnBody !== 'all') {
      const percentVal = parseInt(p.percentOnBody);
      if (currentFilters.percentOnBody === 'high' && percentVal <= 85) return false;
      if (currentFilters.percentOnBody === 'medium' && (percentVal <= 75 || percentVal > 85)) return false;
      if (currentFilters.percentOnBody === 'low' && percentVal > 75) return false;
    }

    // Clinical Notif filter
    if (currentFilters.notifCount !== 'all') {
      if (currentFilters.notifCount === 'high' && p.notifCount < 3) return false;
      if (currentFilters.notifCount === 'medium' && p.notifCount !== 2) return false;
      if (currentFilters.notifCount === 'low' && p.notifCount > 0) return false;
    }

    // Activity filter
    if (currentFilters.activityMins !== 'all') {
      if (currentFilters.activityMins === 'high' && p.activityMins <= 1000) return false;
      if (currentFilters.activityMins === 'medium' && (p.activityMins < 500 || p.activityMins > 1000)) return false;
      if (currentFilters.activityMins === 'low' && p.activityMins >= 500) return false;
    }

    // At-Home Order Status filter
    if (currentFilters.atHome !== 'all') {
      const atHomeChecked = document.querySelector(`#at-home-${patients.indexOf(p)} svg`)?.style.display !== 'none';
      if (currentFilters.atHome === 'checked' && !atHomeChecked) return false;
      if (currentFilters.atHome === 'unchecked' && atHomeChecked) return false;
    }

    // Discharge Readiness filter
    if (currentFilters.discharge !== 'all') {
      const percentVal = parseInt(p.percentOnBody);
      const percentColor = percentVal > 85 ? '#b3ffd1' : (percentVal >= 75 ? '#fff7b3' : '#ffb3b3');
      const notifColor = p.notifCount >= 3 ? '#ffb3b3' : (p.notifCount === 2 ? '#fff7b3' : '#b3ffd1');
      const activityColor = p.activityMins > 1000 ? '#b3ffd1' : (p.activityMins >= 500 ? '#fff7b3' : '#ffb3b3');
      
      let dischargeStatus = 'Not Ready';
      if (percentColor === '#b3ffd1' && notifColor === '#b3ffd1' && activityColor === '#b3ffd1') {
        dischargeStatus = 'Ready';
      } else if (percentColor !== '#ffb3b3' && notifColor !== '#ffb3b3' && activityColor !== '#ffb3b3') {
        dischargeStatus = 'Pending';
      }

      if (currentFilters.discharge === 'ready' && dischargeStatus !== 'Ready') return false;
      if (currentFilters.discharge === 'pending' && dischargeStatus !== 'Pending') return false;
      if (currentFilters.discharge === 'notReady' && dischargeStatus !== 'Not Ready') return false;
    }

    // Consider for Discharge filter
    if (currentFilters.considerDischarge !== 'all') {
      const considerChecked = document.querySelector(`#consider-discharge-${patients.indexOf(p)} svg`)?.style.display !== 'none';
      if (currentFilters.considerDischarge === 'checked' && !considerChecked) return false;
      if (currentFilters.considerDischarge === 'unchecked' && considerChecked) return false;
    }

    return true;
  });

  // Use filteredPatients instead of patients for rendering
  filteredPatients.forEach((p, idx) => {
    const notifTooltip = p.notifCount > 0 ? `title="${p.notifReasons.join(', ')}"` : '';
    if (!currentModel) {
      const tr = document.createElement('tr');
      // Tooltip for Notification Reviews - custom, not native title
      let notifTooltipHtml = '';
      if (p.notifCount > 0) {
        notifTooltipHtml = `<ul style='margin:0;padding-left:18px;'>${p.notifReasons.map(r => `<li>${r}</li>`).join('')}</ul>`;
      }
      // Add an info icon (ℹ️) to the notification reviews value
      const notifIcon = `<span class='notif-icon' style='margin-left:4px;'>\u2139</span>`;
      // Notification Reviews value with icon and custom tooltip trigger
      const notifReviewsCell = p.notifReviews > 0 
        ? `<span class="value-box notif-hover" style="background:#f7c873;color:#22304a;position:relative;cursor:pointer;" data-tooltip="${encodeURIComponent(notifTooltipHtml)}" data-tooltip-color="#f7c873">${p.notifReviews}${notifIcon}</span>`
        : '';
      // Most Recent Notification cell
      const mostRecentNotifCell = p.notifReviews > 0 
        ? `<span style='color:#f7c873;font-weight:bold;text-align:center;'>${p.notifType}</span>`
        : '';
      tr.innerHTML = `
        <td>${p.lastName}</td>
        <td>${p.firstName}</td>
        <td>${p.mrn}</td>
        <td>${p.bioId}</td>
        <td>${p.room}</td>
        <td style="text-align:center;"><span class="value-box" style="background:${getPastelVitalColor(p.hr, 'hr')};color:#22304a;">${p.hr}</span></td>
        <td style="text-align:center;"><span class="value-box" style="background:${getPastelVitalColor(p.rr, 'rr')};color:#22304a;">${p.rr}</span></td>
        <td style="text-align:center;"><span class="value-box" style="background:${getPastelVitalColor(p.temp, 'temp')};color:#22304a;">${p.temp}</span></td>
        <td style="text-align:center;">${p.activityMinHour}</td>
        <td class="stacked-cell" style="text-align:center;">${notifReviewsCell}</td>
        <td class="stacked-cell" style="text-align:center;">${mostRecentNotifCell}</td>
        <td style="text-align:center;">${p.lastUpdateMin} min ago</td>
      `;
      tbody.appendChild(tr);
    } else if (currentModel === 'Rounding Optimization') {
      const liveColor = p.liveActivity === 'active' ? 'background:#4caf50;color:#fff;border-radius:6px;padding:2px 8px;' : 'background:#f7c873;color:#22304a;border-radius:6px;padding:2px 8px;';
      const tr = document.createElement('tr');
      if (p.rounded) tr.classList.add('rounded-on');
      // % On Body color logic
      let percentVal = parseInt(p.percentOnBody);
      let percentColor = '#ffb3b3'; // pastel red
      if (percentVal > 85) percentColor = '#b3ffd1'; // green
      else if (percentVal >= 75) percentColor = '#fff7b3'; // yellow
      // Clinical Notif color logic (reuse from Length of Stay)
      let notifColor = '#b3ffd1'; // pastel green
      if (p.notifCount === 2) notifColor = '#fff7b3'; // pastel yellow
      if (p.notifCount >= 3) notifColor = '#ffb3b3'; // pastel red
      // Activity color logic (reuse from Length of Stay)
      let activityColor = '#ffb3b3'; // pastel red
      if (p.activityMins > 1000) activityColor = '#b3ffd1'; // green
      else if (p.activityMins >= 500) activityColor = '#fff7b3'; // yellow
      // BioButton Data radial color logic
      let bioButtonRadialColor = '#ffb3b3'; // pastel red
      if (p.activityMins > 1000) bioButtonRadialColor = '#b3ffd1'; // green
      else if (p.activityMins >= 500) bioButtonRadialColor = '#fff7b3'; // yellow
      // Live Activity and Status color logic
      let liveActivityColor = p.liveActivity === 'active' ? '#b3ffd1' : '#fff7b3';
      let statusText = p.liveActivity === 'active' ? 'Awake' : 'Sleeping';
      let statusColor = liveActivityColor;
      tr.innerHTML = `
        <td><input type="checkbox" ${p.rounded ? 'checked' : ''} onchange="toggleRounded(${idx})"></td>
        <td>${p.lastName}</td>
        <td>${p.firstName}</td>
        <td>${p.mrn}</td>
        <td>${p.bioId}</td>
        <td>${p.room}</td>
        <td style="text-align:center;"><span style="display:inline-block;width:22px;height:22px;border-radius:50%;background:${bioButtonRadialColor};border:2px solid #22304a;"></span></td>
        <td style="text-align:center;"><span class="value-box" style="background:${percentColor};color:#22304a;border-radius:6px;padding:2px 8px;display:inline-block;">${p.percentOnBody}</span></td>
        <td class="stacked-cell" style="text-align:center;"><span class="value-box" style="background:${notifColor};color:#22304a;border-radius:6px;padding:2px 8px;display:inline-block;">${p.notifCount}</span></td>
        <td class="stacked-cell" style="text-align:center;"><span class="value-box" style="background:${activityColor};color:#22304a;border-radius:6px;padding:2px 8px;display:inline-block;">${p.activityMins}</span></td>
        <td style="text-align:center;"><span class="value-box" style="background:${liveActivityColor};color:#22304a;border-radius:6px;padding:2px 8px;display:inline-block;min-width:60px;">${p.liveActivity === 'active' ? 'Active' : 'No Activity'}</span></td>
        <td style="text-align:center;"><span class="value-box" style="background:${statusColor};color:#22304a;border-radius:6px;padding:2px 8px;display:inline-block;">${statusText}</span></td>
      `;
      tbody.appendChild(tr);
    } else if (currentModel === 'Length of Stay') {
      const tr = document.createElement('tr');
      if (p.rounded) tr.classList.add('rounded-on');
      // Clinical Notif color logic
      let notifColor = '#b3ffd1'; // pastel green
      if (p.notifCount === 2) notifColor = '#fff7b3'; // pastel yellow
      if (p.notifCount >= 3) notifColor = '#ffb3b3'; // pastel red
      // Activity color logic
      let activityColor = '#ffb3b3'; // pastel red
      if (p.activityMins > 1000) activityColor = '#b3ffd1'; // green
      else if (p.activityMins >= 500) activityColor = '#fff7b3'; // yellow
      // % On Body color logic
      let percentVal = parseInt(p.percentOnBody);
      let percentColor = '#ffb3b3'; // pastel red
      if (percentVal > 85) percentColor = '#b3ffd1'; // green
      else if (percentVal >= 75) percentColor = '#fff7b3'; // yellow
      // At-Home Order Status logic with toggleable checkmark
      const atHomeBox = `<span id="at-home-${idx}" style='display:inline-block;width:28px;height:28px;border-radius:6px;background:#e6ffe6;border:1.5px solid #b3ffd1;vertical-align:middle;cursor:pointer;' onclick="toggleAtHome(${idx})"><svg width='18' height='18' style='margin:4px 0 0 4px;vertical-align:middle;display:none;' viewBox='0 0 18 18'><polyline points='3,10 8,15 15,5' style='fill:none;stroke:#4caf50;stroke-width:3;stroke-linecap:round;stroke-linejoin:round'/></svg></span>`;
      // Discharge Readiness logic based on colors
      let dischargeStatus = 'Not Ready';
      let dischargeColor = '#ffb3b3'; // default to red
      // Check if any column is red
      if (percentColor === '#ffb3b3' || notifColor === '#ffb3b3' || activityColor === '#ffb3b3') {
        dischargeStatus = 'Not Ready';
        dischargeColor = '#ffb3b3';
      }
      // Check if all columns are green
      else if (percentColor === '#b3ffd1' && notifColor === '#b3ffd1' && activityColor === '#b3ffd1') {
        dischargeStatus = 'Ready';
        dischargeColor = '#b3ffd1';
      }
      // If no red and not all green, must have at least one yellow
      else {
        dischargeStatus = 'Pending';
        dischargeColor = '#fff7b3';
      }
      // Tooltip for Clinical Notif (24h) - custom, not native title
      let notifTooltipHtml = '';
      if (p.notifCount > 0) {
        notifTooltipHtml = `<ul style='margin:0;padding-left:18px;'>${p.notifReasons.map(r => `<li>${r}</li>`).join('')}</ul>`;
      }
      // Add an info icon (ℹ️) to the notification value
      const notifIcon = `<span class='notif-icon' style='margin-left:4px;'>\u2139</span>`;
      // Notification value with icon and custom tooltip trigger
      const notifCell = `<span class="value-box notif-hover" style="background:${notifColor};color:#22304a;position:relative;cursor:pointer;" data-tooltip="${encodeURIComponent(notifTooltipHtml)}" data-tooltip-color="${notifColor}">${p.notifCount}${notifIcon}</span>`;
      // Consider for Discharge checkbox with green checkmark
      const considerDischargeBox = `<span id="consider-discharge-${idx}" style='display:inline-block;width:28px;height:28px;border-radius:6px;background:#e6ffe6;border:1.5px solid #b3ffd1;vertical-align:middle;cursor:pointer;' onclick="toggleConsiderDischarge(${idx})"><svg width='18' height='18' style='margin:4px 0 0 4px;vertical-align:middle;display:none;' viewBox='0 0 18 18'><polyline points='3,10 8,15 15,5' style='fill:none;stroke:#4caf50;stroke-width:3;stroke-linecap:round;stroke-linejoin:round'/></svg></span>`;
      tr.innerHTML = `
        <td style="text-align:center;">${p.lastName}</td>
        <td style="text-align:center;">${p.firstName}</td>
        <td style="text-align:center;">${p.mrn}</td>
        <td style="text-align:center;">${p.bioId}</td>
        <td style="text-align:center;">${p.room}</td>
        <td style="text-align:center;"><span class="value-box" style="background:${percentColor};color:#22304a;">${p.percentOnBody}</span></td>
        <td class="stacked-cell" style="text-align:center;">${notifCell}</td>
        <td class="stacked-cell" style="text-align:center;"><span class="value-box" style="background:${activityColor};color:#22304a;">${p.activityMins}</span></td>
        <td class="stacked-cell" style="text-align:center;">${atHomeBox}</td>
        <td class="stacked-cell" style="text-align:center;"><span class="value-box" style="background:${dischargeColor};color:#22304a;">${dischargeStatus}</span></td>
        <td class="stacked-cell" style="text-align:center;">${considerDischargeBox}</td>
      `;
      tbody.appendChild(tr);
    } else if (currentModel === 'Unit Manager') {
      const tr = document.createElement('tr');
      if (p.rounded) tr.classList.add('rounded-on');
      // Randomly distribute white (0) values
      let dataPoints = Math.random() < 0.3 ? 0 : p.bioButtonDataPoints; // 30% chance of being 0
      // Color logic for BioButton Data Points (Past Hour)
      let dataPointsColor = '#fff'; // default white
      if (dataPoints >= 5) dataPointsColor = '#b3ffd1'; // green for 5+
      else if (dataPoints >= 2) dataPointsColor = '#fff7b3'; // yellow for 2-4
      // Color logic for BioButton Data (radial)
      let bioDataColor = '#b3ffd1'; // default green
      if (p.percentFiveOrMore.includes('0')) bioDataColor = '#ffb3b3'; // red for 0%
      else if (parseInt(p.percentFiveOrMore) < 50) bioDataColor = '#fff7b3'; // yellow for <50%
      tr.innerHTML = `
        <td>${p.lastName}</td>
        <td>${p.firstName}</td>
        <td>${p.mrn}</td>
        <td>${p.bioId}</td>
        <td>${p.room}</td>
        <td class="stacked-cell" style="text-align:center;"><span style="display:inline-block;width:22px;height:22px;border-radius:50%;background:${bioDataColor};border:2px solid #22304a;"></span></td>
        <td class="stacked-cell" style="text-align:center;"><span class="value-box" style="background:${dataPointsColor};color:#22304a;">${dataPoints}</span></td>
        <td class="stacked-cell" style="text-align:center;"><span class="value-box" style="background:${bioDataColor};color:#22304a;">${p.percentFiveOrMore}</span></td>
        <td class="stacked-cell" style="text-align:center;">${p.lastBioButtonReading}</td>
        <td class="stacked-cell" style="text-align:center;">${p.activityMinHour}</td>
      `;
      tbody.appendChild(tr);
    } else if (currentModel === 'Good Catch Report') {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${p.mrn}</td>
        <td>${p.gcRoom}</td>
        <td class="stacked-cell">${p.gcPatient}</td>
        <td>${p.gcDate}</td>
        <td>${p.gcDI}</td>
        <td>${p.gcSepsis}</td>
        <td>${p.gcAlert}</td>
        <td>${p.gcNurse}</td>
        <td>${p.gcNurseResponse}</td>
        <td>${p.gcPhysician}</td>
        <td>${p.gcPhysicianResponse}</td>
        <td class="stacked-cell">${p.gcNewDiagnosis}</td>
        <td class="stacked-cell">${p.gcPatientStatus}</td>
        <td class="stacked-cell">${p.gcNotes}</td>
      `;
      tbody.appendChild(tr);
    }
  });
  // Add event delegation for clicks on relevant cells
  tbody.onclick = function(e) {
    let cell = e.target;
    // Find the row
    while (cell && cell.tagName !== 'TD') cell = cell.parentElement;
    if (!cell) return;
    const row = cell.parentElement;
    const rowIndex = Array.from(tbody.children).indexOf(row);
    if (rowIndex < 0) return;
    const patient = filteredPatients[rowIndex];
    // Determine if the clicked cell is one of the target fields
    const colIndex = Array.from(row.children).indexOf(cell);
    // For default model: Last Name (1), First Name (2), Notification Reviews (10), HR (6), RR (7), Temp (8)
    // For other models, adjust as needed
    let showDetail = false;
    if (!currentModel && [1,2,6,7,8,10].includes(colIndex)) showDetail = true;
    // For other models, you can add more logic here
    if (showDetail) {
      showPatientDetail(patient);
    }
  };
}

function populateTileGrid() {
  const grid = document.getElementById('tileGrid');
  grid.innerHTML = '';
  patients.forEach((p, idx) => {
    const notifTooltip = p.notifCount > 0 ? `title='${p.notifReasons.join(', ')}'` : '';
    if (!currentModel) {
      const card = document.createElement('div');
      card.className = 'tile-card';
      card.innerHTML = `
        <div class="tile-header">${p.lastName}, ${p.firstName}</div>
        <div class="tile-meta">Unit: ${p.unit} &bull; Room: ${p.room} &bull; MRN: ${p.mrn}</div>
        <div class="tile-row"><span class="tile-label">Bio ID:</span> ${p.bioId}</div>
        <div class="tile-row"><span class="tile-label">HR:</span> <span style='color:${getPastelVitalColor(p.hr, 'hr')};font-weight:bold;'>${p.hr}</span> <span class="tile-label">RR:</span> <span style='color:${getPastelVitalColor(p.rr, 'rr')};font-weight:bold;'>${p.rr}</span> <span class="tile-label">Temp:</span> <span style='color:${getPastelVitalColor(p.temp, 'temp')};font-weight:bold;'>${p.temp}</span></div>
        <div class="tile-row"><span class="tile-label">Activity Min (1h):</span> ${p.activityMinHour}</div>
        <div class="tile-row"><span class="tile-label">Notifications:</span> <span style='color:#f7c873;font-weight:bold;'>${p.notifType}</span></div>
        <div class="tile-row"><span class="tile-label">Notification Reviews:</span> <a href='#' onclick="alert('Review details for ${p.mrn}')" style="color:#f7c873;text-decoration:underline;font-weight:bold;">${p.notifReviews}</a></div>
        <div class="tile-row"><span class="tile-label">Last Update:</span> ${p.lastUpdateMin} min ago</div>
      `;
      grid.appendChild(card);
    } else if (currentModel === 'Rounding Optimization') {
      const liveColor = p.liveActivity === 'active' ? 'background:#4caf50;color:#fff;' : 'background:#f7c873;color:#22304a;';
      const card = document.createElement('div');
      card.className = 'tile-card' + (p.rounded ? ' rounded-on' : '');
      card.innerHTML = `
        <input type="checkbox" class="tile-checkbox" ${p.rounded ? 'checked' : ''} onchange="toggleRounded(${idx})">
        <div class="tile-header">${p.lastName}, ${p.firstName}</div>
        <div class="tile-meta">Unit: ${p.unit} &bull; Room: ${p.room} &bull; MRN: ${p.mrn}</div>
        <div class="tile-row"><span class="tile-label">Bio ID:</span> ${p.bioId} <span class="tile-label">% On Body:</span> ${p.percentOnBody}</div>
        <div class="tile-row"><span class="tile-label">Clinical Notif (24h):</span> <span class='tile-notif' ${notifTooltip}>${p.notifCount}</span></div>
        <div class="tile-row"><span class="tile-label">Activity (min, 24h):</span> ${p.activityMins}</div>
        <div class="tile-row"><span class="tile-label">Activity Past 15 min:</span> <span style='${liveColor}border-radius:6px;padding:2px 8px;'>${p.liveActivity === 'active' ? 'Active' : 'No Activity'}</span></div>
        <div class="tile-row"><span class="tile-label">Status:</span> ${p.patientStatus}</div>
      `;
      grid.appendChild(card);
    } else if (currentModel === 'Length of Stay') {
      const card = document.createElement('div');
      card.className = 'tile-card' + (p.rounded ? ' rounded-on' : '');
      card.innerHTML = `
        <div class="tile-header">${p.lastName}, ${p.firstName}</div>
        <div class="tile-meta">Unit: ${p.unit} &bull; Room: ${p.room} &bull; MRN: ${p.mrn}</div>
        <div class="tile-row"><span class="tile-label">Bio ID:</span> ${p.bioId} <span class="tile-label">% On Body:</span> ${p.percentOnBody}</div>
        <div class="tile-row"><span class="tile-label">Clinical Notif (24h):</span> <span class='tile-notif' ${notifTooltip}>${p.notifCount}</span></div>
        <div class="tile-row"><span class="tile-label">Activity (min, 24h):</span> ${p.activityMins}</div>
        <div class="tile-row"><span class="tile-label">At-Home Order Status:</span> ${p.atHomeOrderStatus}</div>
        <div class="tile-row"><span class="tile-label">Discharge Readiness:</span> ${p.dischargeReadiness}</div>
      `;
      grid.appendChild(card);
    } else if (currentModel === 'Unit Manager') {
      const card = document.createElement('div');
      card.className = 'tile-card' + (p.rounded ? ' rounded-on' : '');
      // BioButton Data Points color logic: green for 1 or more, white for 0 (tile view)
      let dataPoints = p.bioButtonDataPoints;
      let dataPointsColor = dataPoints >= 1 ? '#b3ffd1' : '#fff';
      card.innerHTML = `
        <div class="tile-header">${p.lastName}, ${p.firstName}</div>
        <div class="tile-meta">Unit: ${p.unit} &bull; Room: ${p.room} &bull; MRN: ${p.mrn}</div>
        <div class="tile-row"><span class="tile-label">Bio ID:</span> ${p.bioId}</div>
        <div class="tile-row"><span class="tile-label">BioButton Data:</span> <span style='display:inline-block;width:22px;height:22px;border-radius:50%;background:${getBioButtonColor(p.bioButtonDataLevel)};border:2px solid #22304a;'></span></div>
        <div class="tile-row"><span class="tile-label">BioButton Data Points:</span> <span class="value-box" style="background:${dataPointsColor};color:#22304a;">${p.bioButtonDataPoints}</span></div>
        <div class="tile-row"><span class="tile-label">% ≥5 Data Points (1h):</span> ${p.percentFiveOrMore}</div>
        <div class="tile-row"><span class="tile-label">Last BioButton Reading:</span> ${p.lastBioButtonReading}</div>
        <div class="tile-row"><span class="tile-label">Activity min (1h):</span> ${p.activityMinHour}</div>
      `;
      grid.appendChild(card);
    } else if (currentModel === 'Good Catch Report') {
      const card = document.createElement('div');
      card.className = 'tile-card';
      card.innerHTML = `
        <div class="tile-header">${p.gcPatient}</div>
        <div class="tile-meta">MRN: ${p.mrn} &bull; Room: ${p.gcRoom} &bull; Date: ${p.gcDate}</div>
        <div class="tile-row"><span class="tile-label">DI:</span> ${p.gcDI} <span class="tile-label">Sepsis:</span> ${p.gcSepsis}</div>
        <div class="tile-row"><span class="tile-label">Alert:</span> ${p.gcAlert}</div>
        <div class="tile-row"><span class="tile-label">Nurse Notified:</span> ${p.gcNurse}</div>
        <div class="tile-row"><span class="tile-label">Nursing Response:</span> ${p.gcNurseResponse}</div>
        <div class="tile-row"><span class="tile-label">Physician Notified:</span> ${p.gcPhysician}</div>
        <div class="tile-row"><span class="tile-label">Physician Response:</span> ${p.gcPhysicianResponse}</div>
        <div class="tile-row"><span class="tile-label">New Diagnosis:</span> ${p.gcNewDiagnosis}</div>
        <div class="tile-row"><span class="tile-label">Patient Status:</span> ${p.gcPatientStatus}</div>
        <div class="tile-row"><span class="tile-label">Notes:</span> ${p.gcNotes}</div>
      `;
      grid.appendChild(card);
    }
  });
}

function toggleRounded(idx) {
  patients[idx].rounded = !patients[idx].rounded;
  populateTable();
  if (document.getElementById('tileViewSection').style.display !== 'none') {
    populateTileGrid();
  }
}

function toggleConsiderDischarge(idx) {
  const checkmark = document.querySelector(`#consider-discharge-${idx} svg`);
  if (checkmark.style.display === 'none') {
    checkmark.style.display = 'block';
  } else {
    checkmark.style.display = 'none';
  }
}

function toggleAtHome(idx) {
  const checkmark = document.querySelector(`#at-home-${idx} svg`);
  if (checkmark.style.display === 'none') {
    checkmark.style.display = 'block';
  } else {
    checkmark.style.display = 'none';
  }
}

function updateLastUpdated() {
  const now = new Date();
  document.getElementById('lastUpdated').textContent = 'Last Updated: ' + now.toLocaleString();
}

function updateDashboard() {
  updateLastUpdated();
  populateTable();
  if (document.getElementById('tileViewSection').style.display !== 'none') {
    populateTileGrid();
  }
}

function selectModel(btn, model) {
  document.querySelectorAll('.model-selector button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentModel = model;
  updateDashboard();
}

function setView(view) {
  const listBtn = document.getElementById('listViewBtn');
  const tileBtn = document.getElementById('tileViewBtn');
  const listSection = document.getElementById('listViewSection');
  const tileSection = document.getElementById('tileViewSection');
  
  // Remove active class from all model tabs
  document.querySelectorAll('.model-selector button').forEach(b => b.classList.remove('active'));
  // Reset current model to empty string
  currentModel = '';
  
  if (view === 'list') {
    listBtn.classList.add('active');
    tileBtn.classList.remove('active');
    listSection.style.display = '';
    tileSection.style.display = 'none';
  } else {
    listBtn.classList.remove('active');
    tileBtn.classList.add('active');
    listSection.style.display = 'none';
    tileSection.style.display = '';
    populateTileGrid();
  }
}

// Filtering (for demo, just repopulate with all patients)
document.getElementById('facility').addEventListener('change', updateDashboard);

// Initial load
function init() {
  patients = Array.from({length: 30}, generatePatient);
  // Reset all model tabs to inactive
  document.querySelectorAll('.model-selector button').forEach(b => b.classList.remove('active'));
  // Reset current model to empty string
  currentModel = '';
  // Set view to list and update dashboard
  setView('list');
  updateDashboard();
}

window.onload = init;

// Clicking outside model tabs resets to default view
document.querySelectorAll('.view-toggle button').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.model-selector button').forEach(b => b.classList.remove('active'));
    currentModel = '';
    updateDashboard();
  });
});

// Tooltip logic (add at end of file)
// ... existing code ...
// Tooltip logic for notification hover
if (!document.getElementById('notif-tooltip')) {
  const tooltip = document.createElement('div');
  tooltip.id = 'notif-tooltip';
  tooltip.style.position = 'fixed';
  tooltip.style.display = 'none';
  tooltip.style.zIndex = '9999';
  tooltip.style.minWidth = '180px';
  tooltip.style.maxWidth = '320px';
  tooltip.style.padding = '10px 14px';
  tooltip.style.borderRadius = '8px';
  tooltip.style.boxShadow = '0 2px 8px rgba(0,0,0,0.18)';
  tooltip.style.fontSize = '1em';
  tooltip.style.pointerEvents = 'none';
  document.body.appendChild(tooltip);
}

document.addEventListener('mouseover', function(e) {
  const target = e.target.closest('.notif-hover');
  const tooltip = document.getElementById('notif-tooltip');
  if (target && tooltip) {
    const html = decodeURIComponent(target.getAttribute('data-tooltip'));
    const color = target.getAttribute('data-tooltip-color') || '#fff';
    tooltip.innerHTML = html;
    tooltip.style.background = color;
    tooltip.style.color = '#ffffff';
    tooltip.style.display = 'block';
    const rect = target.getBoundingClientRect();
    tooltip.style.left = (rect.left + window.scrollX + rect.width/2 - tooltip.offsetWidth/2) + 'px';
    tooltip.style.top = (rect.bottom + window.scrollY + 8) + 'px';
  }
});

document.addEventListener('mouseout', function(e) {
  const target = e.target.closest('.notif-hover');
  const tooltip = document.getElementById('notif-tooltip');
  if (target && tooltip) {
    tooltip.style.display = 'none';
  }
});
// ... existing code ...

function sortTable(column) {
  if (sortColumn === column) {
    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn = column;
    sortDirection = 'asc';
  }
  
  patients.sort((a, b) => {
    let valueA, valueB;
    
    switch(column) {
      case 'hr':
        // First sort by color group (0=green, 1=yellow, 2=red)
        const hrColorA = getVitalColorGroup(a.hr, 'hr');
        const hrColorB = getVitalColorGroup(b.hr, 'hr');
        if (hrColorA !== hrColorB) {
          return sortDirection === 'asc' ? hrColorA - hrColorB : hrColorB - hrColorA;
        }
        // Then sort by value within color group
        valueA = a.hr;
        valueB = b.hr;
        break;
      case 'rr':
        // First sort by color group
        const rrColorA = getVitalColorGroup(a.rr, 'rr');
        const rrColorB = getVitalColorGroup(b.rr, 'rr');
        if (rrColorA !== rrColorB) {
          return sortDirection === 'asc' ? rrColorA - rrColorB : rrColorB - rrColorA;
        }
        // Then sort by value within color group
        valueA = a.rr;
        valueB = b.rr;
        break;
      case 'temp':
        // First sort by color group
        const tempColorA = getVitalColorGroup(parseFloat(a.temp), 'temp');
        const tempColorB = getVitalColorGroup(parseFloat(b.temp), 'temp');
        if (tempColorA !== tempColorB) {
          return sortDirection === 'asc' ? tempColorA - tempColorB : tempColorB - tempColorA;
        }
        // Then sort by value within color group
        valueA = parseFloat(a.temp);
        valueB = parseFloat(b.temp);
        break;
      case 'notifReviews':
        valueA = a.notifReviews;
        valueB = b.notifReviews;
        break;
      default:
        return 0;
    }
    
    if (sortDirection === 'asc') {
      return valueA - valueB;
    } else {
      return valueB - valueA;
    }
  });
  
  updateDashboard();
}

function getSortIndicator(column) {
  if (sortColumn !== column) return '';
  return sortDirection === 'asc' ? ' ↑' : ' ↓';
}

function showPatientDetail(patient, idx = null) {
  const overlay = document.getElementById('patient-detail-overlay');
  const content = document.getElementById('patient-detail-content');
  // Track current index for navigation
  if (idx === null) idx = patients.findIndex(p => p.mrn === patient.mrn);
  currentPatientIndex = idx;
  const total = patients.length;
  const patientNum = idx + 1;
  // Navigation arrows (now outside the card, in the overlay)
  const leftArrow = `<div id='prev-patient-btn' style='position:fixed;left:0;top:50%;transform:translateY(-50%);z-index:1100;display:flex;align-items:center;cursor:pointer;padding:18px 10px 18px 0;user-select:none;'>
    <span style='font-size:2.2em;color:#4169e1;background:rgba(34,48,74,0.7);border-radius:0 16px 16px 0;padding:8px 12px;'>⟵</span>
    <span style='color:#e6eaf1;font-size:1.1em;margin-left:4px;background:rgba(34,48,74,0.7);border-radius:0 12px 12px 0;padding:6px 10px;'>Previous Patient</span>
  </div>`;
  const rightArrow = `<div id='next-patient-btn' style='position:fixed;right:0;top:50%;transform:translateY(-50%);z-index:1100;display:flex;align-items:center;cursor:pointer;padding:18px 0 18px 10px;user-select:none;'>
    <span style='color:#e6eaf1;font-size:1.1em;margin-right:4px;background:rgba(34,48,74,0.7);border-radius:12px 0 0 12px;padding:6px 10px;'>Next Patient</span>
    <span style='font-size:2.2em;color:#4169e1;background:rgba(34,48,74,0.7);border-radius:16px 0 0 16px;padding:8px 12px;'>⟶</span>
  </div>`;
  // Patient number display (top center)
  const patientNumDisplay = `<div style='position:fixed;top:18px;left:50%;transform:translateX(-50%);color:#f7c873;font-size:1.1em;font-weight:bold;z-index:1100;background:rgba(34,48,74,0.85);padding:6px 18px;border-radius:12px;'>${patientNum} of ${total}</div>`;
  content.innerHTML = `
    ${patientNumDisplay}
    ${leftArrow}
    ${rightArrow}
    <div style='display:flex;flex-wrap:wrap;gap:32px;align-items:flex-start;min-height:80vh;max-width:1200px;margin:60px auto 40px auto;position:relative;'>
      <!-- Left Panel -->
      <div style="flex:1 1 340px;min-width:320px;max-width:400px;background:#25345a;border-radius:14px;padding:24px 18px 18px 18px;box-shadow:0 2px 12px rgba(0,0,0,0.10);color:#e6eaf1;">
        <button id='patient-detail-close' style='position:absolute;top:18px;right:18px;font-size:2rem;background:none;border:none;color:#fff;cursor:pointer;z-index:1200;'>&times;</button>
        <div style='font-size:1.3em;font-weight:bold;color:#fff;margin-bottom:6px;margin-left:0;'>${patient.firstName} ${patient.lastName}</div>
        <div style='color:#f7c873;font-size:1.05em;margin-bottom:10px;'>Unit: ${patient.unit} &bull; Room: ${patient.room} &bull; MRN: ${patient.mrn}</div>
        <div style='margin-bottom:8px;'>Bio ID: <b>${patient.bioId}</b></div>
        <div style='margin-bottom:8px;'>Status: <b>${patient.patientStatus}</b></div>
        <div style='margin-bottom:8px;'>% On Body: <b>${patient.percentOnBody}</b></div>
        <div style='margin-bottom:8px;'>Activity (min, 24h): <b>${patient.activityMins}</b></div>
        <div style='margin-bottom:8px;'>Notifications: <b>${patient.notifType} (${patient.notifCount})</b></div>
        <div style='margin-bottom:8px;'>Notification Reviews: <b>${patient.notifReviews}</b></div>
        <div style='margin-bottom:8px;'>HR: <b>${patient.hr}</b></div>
        <div style='margin-bottom:8px;'>RR: <b>${patient.rr}</b></div>
        <div style='margin-bottom:8px;'>Temp: <b>${patient.temp}</b></div>
        <div style='margin-bottom:8px;'>Last Update: <b>${patient.lastUpdateMin} min ago</b></div>
        <hr style='border:0;border-top:1px solid #2d3c5a;margin:18px 0 10px 0;'>
        <div style='font-weight:bold;margin-bottom:6px;'>Active Notifications</div>
        <ul style='margin:0 0 12px 18px;padding:0;'>
          ${(patient.notifReasons && patient.notifReasons.length) ? patient.notifReasons.map(r => `<li>${r}</li>`).join('') : '<li>None</li>'}
        </ul>
        <div style='margin-bottom:8px;'><button style='background:#4169e1;color:#fff;border:none;padding:6px 16px;border-radius:8px;cursor:pointer;'>Body Panel</button> <button style='background:#2d3c5a;color:#fff;border:none;padding:6px 16px;border-radius:8px;cursor:pointer;'>History</button></div>
        <div style='margin-top:18px;'>
          <table style='width:100%;font-size:0.98em;background:none;color:#e6eaf1;'>
            <thead><tr><th style='color:#f7c873;text-align:left;'>Type</th><th style='color:#f7c873;text-align:left;'>Time</th><th style='color:#f7c873;text-align:left;'>Assessment</th><th style='color:#f7c873;text-align:left;'>User Details</th></tr></thead>
            <tbody>
              <tr><td>Tower Note Update</td><td>2024-03-21</td><td>N/A</td><td>clinician@hospital.org</td></tr>
              <tr><td>Notification Review</td><td>2024-03-21</td><td>Assessment: Significant, Review: Continue</td><td>reviewer@hospital.org</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- Right Panel -->
      <div style="flex:2 1 600px;min-width:340px;max-width:900px;display:flex;flex-direction:column;gap:18px;">
        <div style='background:#25345a;border-radius:14px;padding:18px 24px 12px 24px;box-shadow:0 2px 12px rgba(0,0,0,0.10);color:#e6eaf1;'>
          <div style='font-weight:bold;color:#fff;margin-bottom:4px;'>Tower Note</div>
          <div style='font-size:1em;margin-bottom:8px;'>Rolled patient onto side on 2/14/2024 at 6pm. Appears to be breathing better and resting well.<br>Provided 650mg of Acetaminophen at 6am on 2/15/2024.<br>Patient called regarding pain on left side at 3:20am on 2/13/2024.</div>
        </div>
        <div style='background:#25345a;border-radius:14px;padding:18px 24px 12px 24px;box-shadow:0 2px 12px rgba(0,0,0,0.10);color:#e6eaf1;'>
          <div style='font-weight:bold;color:#fff;margin-bottom:4px;'>Notification Review</div>
          <div style='display:flex;align-items:center;gap:12px;margin-bottom:8px;'>
            <span style='background:#f7c873;color:#22304a;border-radius:6px;padding:2px 12px;font-weight:bold;'>${patient.notifReviews}</span>
            <span style='color:#fff;'>Assessment: <b>Significant</b></span>
            <span style='color:#fff;'>Action: <b>Continue</b></span>
            <span style='color:#fff;'>Reaction: <b>Review</b></span>
          </div>
        </div>
        <div style='background:#25345a;border-radius:14px;padding:18px 24px 18px 24px;box-shadow:0 2px 12px rgba(0,0,0,0.10);color:#e6eaf1;flex:1 1 auto;'>
          <div style='font-weight:bold;color:#fff;margin-bottom:8px;'>Heart Rate (bpm)</div>
          <svg width='100%' height='80'><polyline points='0,60 40,50 80,55 120,40 160,45 200,35 240,40 280,30 320,35 360,25 400,30' style='fill:none;stroke:#f7c873;stroke-width:3;'/></svg>
          <div style='font-weight:bold;color:#fff;margin:16px 0 8px 0;'>Respiratory Rate (rpm)</div>
          <svg width='100%' height='80'><polyline points='0,70 40,60 80,65 120,50 160,55 200,45 240,50 280,40 320,45 360,35 400,40' style='fill:none;stroke:#b3ffd1;stroke-width:3;'/></svg>
          <div style='font-weight:bold;color:#fff;margin:16px 0 8px 0;'>Skin Temperature (°F)</div>
          <svg width='100%' height='80'><polyline points='0,50 40,55 80,60 120,50 160,55 200,50 240,55 280,50 320,55 360,50 400,55' style='fill:none;stroke:#a259e6;stroke-width:3;'/></svg>
        </div>
      </div>
    </div>
  `;
  overlay.style.display = 'block';
  // Attach navigation events
  document.getElementById('prev-patient-btn').onclick = function(e) {
    e.stopPropagation();
    if (currentPatientIndex > 0) {
      showPatientDetail(patients[currentPatientIndex - 1], currentPatientIndex - 1);
    }
  };
  document.getElementById('next-patient-btn').onclick = function(e) {
    e.stopPropagation();
    if (currentPatientIndex < patients.length - 1) {
      showPatientDetail(patients[currentPatientIndex + 1], currentPatientIndex + 1);
    }
  };
  document.getElementById('patient-detail-close').onclick = hidePatientDetail;
}

function hidePatientDetail() {
  document.getElementById('patient-detail-overlay').style.display = 'none';
}

document.getElementById('patient-detail-close').onclick = hidePatientDetail;
document.getElementById('patient-detail-back').onclick = hidePatientDetail;

// Enhance populateTable to add click handlers after rendering
const originalPopulateTable = populateTable;
populateTable = function() {
  originalPopulateTable.apply(this, arguments);
  // Add event delegation for clicks on relevant cells
  const tbody = document.getElementById('dashboardBody');
  tbody.onclick = function(e) {
    let cell = e.target;
    // Find the row
    while (cell && cell.tagName !== 'TD') cell = cell.parentElement;
    if (!cell) return;
    const row = cell.parentElement;
    const rowIndex = Array.from(tbody.children).indexOf(row);
    if (rowIndex < 0) return;
    const patient = patients[rowIndex];
    // Determine if the clicked cell is one of the target fields
    const colIndex = Array.from(row.children).indexOf(cell);
    // For default model: Last Name (1), First Name (2), Notification Reviews (10), HR (6), RR (7), Temp (8)
    // For other models, adjust as needed
    let showDetail = false;
    if (!currentModel && [1,2,6,7,8,10].includes(colIndex)) showDetail = true;
    // For other models, you can add more logic here
    if (showDetail) {
      showPatientDetail(patient);
    }
  };
};

// Add CSS for clickable cells and hover effect
if (!document.getElementById('clickable-cell-style')) {
  const style = document.createElement('style');
  style.id = 'clickable-cell-style';
  style.innerHTML = `
    .clickable-cell { cursor: pointer; position: relative; }
    .clickable-cell:hover { background: #2d3c5a !important; box-shadow: 0 0 0 2px #4169e1 inset; z-index: 1; }
  `;
  document.head.appendChild(style);
}

// Patch populateTable to add clickable-cell class to relevant cells
const originalPopulateTable2 = populateTable;
populateTable = function() {
  originalPopulateTable2.apply(this, arguments);
  const tbody = document.getElementById('dashboardBody');
  Array.from(tbody.rows).forEach(row => {
    // For default model: Last Name (1), First Name (2), Notification Reviews (10), HR (6), RR (7), Temp (8)
    if (!currentModel) {
      [1,2,6,7,8,10].forEach(idx => {
        if (row.cells[idx]) row.cells[idx].classList.add('clickable-cell');
      });
    }
    // Add more logic for other models if needed
  });
  // ... existing event delegation code ...
  tbody.onclick = function(e) {
    let cell = e.target;
    while (cell && cell.tagName !== 'TD') cell = cell.parentElement;
    if (!cell) return;
    const row = cell.parentElement;
    const rowIndex = Array.from(tbody.children).indexOf(row);
    if (rowIndex < 0) return;
    const patient = patients[rowIndex];
    const colIndex = Array.from(row.children).indexOf(cell);
    let showDetail = false;
    if (!currentModel && [1,2,6,7,8,10].includes(colIndex)) showDetail = true;
    if (showDetail) {
      showPatientDetail(patient);
    }
  };
};

// Add this function to handle filtering
function filterColumn(column, value) {
  currentFilters[column] = value;
  updateDashboard();
}

// Add CSS for filter buttons
if (!document.getElementById('filter-buttons-style')) {
  const style = document.createElement('style');
  style.id = 'filter-buttons-style';
  style.innerHTML = `
    .filter-buttons {
      display: flex;
      gap: 4px;
      justify-content: center;
      margin-top: 4px;
    }
    .filter-btn {
      padding: 2px 6px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.8em;
      color: #22304a;
    }
    .filter-btn:hover {
      opacity: 0.8;
    }
  `;
  document.head.appendChild(style);
} 