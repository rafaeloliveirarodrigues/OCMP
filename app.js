// Submission Management System JavaScript

// Global state management
let currentView = 'dashboard';
let isAdminAuthenticated = false;
let submissions = [];
let currentSubmissionId = null;
let nextSubmissionNumber = 4;

// Configuration data
const callConfig = {
    title: "Horizon Europe Green Digital Transition Open Call 2025",
    description: "Funding opportunity for innovative projects combining digital technologies with sustainability objectives",
    openingDate: "2025-10-01",
    closingDate: "2025-11-30",
    totalBudget: 500000,
    maxAward: 60000,
    minAward: 10000
};

const countries = [
    "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic",
    "Denmark", "Estonia", "Finland", "France", "Germany", "Greece",
    "Hungary", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg",
    "Malta", "Netherlands", "Poland", "Portugal", "Romania", "Slovakia",
    "Slovenia", "Spain", "Sweden", "Switzerland", "Norway", "Iceland"
];

const categories = [
    "Energy Efficiency", "Renewable Energy", "Digital Sustainability",
    "Circular Economy", "Climate Adaptation"
];

const organizationTypes = [
    "Research Institution", "SME", "Large Enterprise", "NGO", "Public Body"
];

// Sample data
function initializeSampleData() {
    submissions = [
        {
            submission_id: "SUB-2025-001",
            applicant_name: "Green Energy Solutions Ltd",
            applicant_email: "contact@greenenergy.eu",
            country: "Germany",
            organization_type: "SME",
            website: "https://greenenergy.eu",
            project_title: "AI-Driven Building Energy Optimization Platform",
            project_summary: "Development of ML algorithms for real-time building energy optimization",
            funding_amount: 45000,
            duration_months: 12,
            trl: "TRL 6",
            category: "Energy Efficiency",
            innovation_description: "Revolutionary AI platform that uses machine learning to optimize building energy consumption in real-time.",
            expected_impact: "Expected to reduce building energy consumption by 25-30% across participating buildings.",
            work_plan: "Phase 1: Algorithm development (6 months), Phase 2: Pilot testing (6 months)",
            budget_breakdown: "Personnel: €30,000, Equipment: €10,000, Travel: €3,000, Other: €2,000",
            submission_date: "2025-10-15",
            status: "Under Review",
            reviewer: "Dr. Maria Schmidt",
            technical_score: 85,
            innovation_score: 88,
            impact_score: 82,
            budget_score: 85,
            overall_score: 85,
            comments: "Strong technical approach, needs budget clarification",
            decision: "Pending",
            decision_date: null
        },
        {
            submission_id: "SUB-2025-002",
            applicant_name: "Sustainable Cities Initiative",
            applicant_email: "info@sustainablecities.org",
            country: "Netherlands",
            organization_type: "NGO",
            website: "https://sustainablecities.org",
            project_title: "Digital Twin Framework for Urban Energy Planning",
            project_summary: "Creating open-source digital twin tools for municipal energy planning",
            funding_amount: 60000,
            duration_months: 18,
            trl: "TRL 4",
            category: "Digital Sustainability",
            innovation_description: "Open-source platform that creates digital twins of urban energy systems for better planning.",
            expected_impact: "Will enable cities to optimize energy planning and reduce carbon footprint by 20%.",
            work_plan: "Phase 1: Framework design (8 months), Phase 2: Implementation (10 months)",
            budget_breakdown: "Personnel: €40,000, Equipment: €15,000, Travel: €3,000, Other: €2,000",
            submission_date: "2025-10-18",
            status: "Submitted",
            reviewer: "",
            technical_score: 0,
            innovation_score: 0,
            impact_score: 0,
            budget_score: 0,
            overall_score: 0,
            comments: "",
            decision: "Pending",
            decision_date: null
        },
        {
            submission_id: "SUB-2025-003",
            applicant_name: "Climate Tech Innovators",
            applicant_email: "hello@climatetech.se",
            country: "Sweden",
            organization_type: "Research Institution",
            website: "https://climatetech.se",
            project_title: "Blockchain-Based Carbon Credit Tracking System",
            project_summary: "Transparent blockchain solution for tracking renewable energy certificates",
            funding_amount: 38000,
            duration_months: 10,
            trl: "TRL 7",
            category: "Climate Adaptation",
            innovation_description: "Blockchain-based platform for transparent and secure tracking of carbon credits and renewable energy certificates.",
            expected_impact: "Will improve transparency in carbon markets and accelerate renewable energy adoption.",
            work_plan: "Phase 1: Blockchain development (5 months), Phase 2: Testing and deployment (5 months)",
            budget_breakdown: "Personnel: €25,000, Equipment: €8,000, Travel: €3,000, Other: €2,000",
            submission_date: "2025-10-20",
            status: "Approved",
            reviewer: "Prof. Anders Johansson",
            technical_score: 92,
            innovation_score: 95,
            impact_score: 90,
            budget_score: 91,
            overall_score: 92,
            comments: "Excellent innovation potential and clear implementation plan",
            decision: "Approved",
            decision_date: "2025-10-22"
        }
    ];
}

// View management
function showView(viewName) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.add('hidden');
    });
    
    // Update navigation
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected view
    const targetView = document.getElementById(viewName + '-view');
    if (targetView) {
        targetView.classList.remove('hidden');
        currentView = viewName;
        
        // Update active tab
        const activeTab = Array.from(document.querySelectorAll('.nav-tab'))
            .find(tab => tab.textContent.toLowerCase().includes(viewName.toLowerCase()) || 
                       (viewName === 'dashboard' && tab.textContent.includes('Dashboard')) ||
                       (viewName === 'submit' && tab.textContent.includes('Submit')) ||
                       (viewName === 'mysubmissions' && tab.textContent.includes('My Submissions')) ||
                       (viewName === 'admin' && tab.textContent.includes('Admin')) ||
                       (viewName === 'settings' && tab.textContent.includes('Settings')));
        if (activeTab) {
            activeTab.classList.add('active');
        }
        
        // Refresh view data
        if (viewName === 'dashboard') {
            updateDashboardStats();
            renderCharts();
        } else if (viewName === 'admin' && !isAdminAuthenticated) {
            showAdminLogin();
        } else if (viewName === 'admin' && isAdminAuthenticated) {
            renderAdminView();
        } else if (viewName === 'settings') {
            renderSettingsView();
        }
    }
}

// Utility functions
function generateSubmissionId() {
    const id = `SUB-2025-${String(nextSubmissionNumber).padStart(3, '0')}`;
    nextSubmissionNumber++;
    return id;
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-EU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function showNotification(message, type = 'success') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

function updateCountdown() {
    const deadline = new Date('2025-11-30T23:59:59');
    const now = new Date();
    const diff = deadline - now;
    
    if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        document.getElementById('days-remaining').textContent = `${days} days, ${hours} hours remaining`;
    } else {
        document.getElementById('days-remaining').textContent = 'Deadline passed';
    }
}

// Dashboard functions
function updateDashboardStats() {
    const totalSubs = submissions.length;
    const underReview = submissions.filter(s => s.status === 'Under Review').length;
    const approved = submissions.filter(s => s.status === 'Approved').length;
    const rejected = submissions.filter(s => s.status === 'Rejected').length;
    const avgScore = submissions.reduce((acc, s) => acc + s.overall_score, 0) / totalSubs || 0;
    
    document.getElementById('total-submissions').textContent = totalSubs;
    document.getElementById('under-review').textContent = underReview;
    document.getElementById('approved-submissions').textContent = approved;
    document.getElementById('rejected-submissions').textContent = rejected;
    document.getElementById('average-score').textContent = Math.round(avgScore);
}

function renderCharts() {
    // Status Chart
    const statusCtx = document.getElementById('statusChart');
    if (statusCtx) {
        const statusData = {};
        submissions.forEach(s => {
            statusData[s.status] = (statusData[s.status] || 0) + 1;
        });
        
        new Chart(statusCtx, {
            type: 'pie',
            data: {
                labels: Object.keys(statusData),
                datasets: [{
                    data: Object.values(statusData),
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    // Country Chart
    const countryCtx = document.getElementById('countryChart');
    if (countryCtx) {
        const countryData = {};
        submissions.forEach(s => {
            countryData[s.country] = (countryData[s.country] || 0) + 1;
        });
        
        new Chart(countryCtx, {
            type: 'bar',
            data: {
                labels: Object.keys(countryData),
                datasets: [{
                    label: 'Submissions',
                    data: Object.values(countryData),
                    backgroundColor: '#1FB8CD'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// Form validation
function validateForm(formId) {
    const form = document.getElementById(formId);
    const errors = [];
    
    // Required field validation
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            errors.push(`${field.labels[0]?.textContent || field.name} is required`);
        }
    });
    
    // Email validation
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
            errors.push('Please enter a valid email address');
        }
    }
    
    // Funding amount validation
    const fundingField = form.querySelector('input[name="funding_amount"]');
    if (fundingField && fundingField.value) {
        const amount = parseFloat(fundingField.value);
        if (amount < 10000 || amount > 60000) {
            errors.push('Funding amount must be between €10,000 and €60,000');
        }
    }
    
    return errors;
}

// Word counter functionality
function updateWordCounter(textarea, counterId, limit) {
    const words = textarea.value.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    const counter = document.getElementById(counterId);
    
    counter.textContent = `${wordCount}/${limit} words`;
    
    if (wordCount > limit) {
        counter.classList.add('over-limit');
    } else {
        counter.classList.remove('over-limit');
    }
}

// Form submission
function submitProposal() {
    const errors = validateForm('proposal-form');
    
    if (errors.length > 0) {
        showNotification('Please fix the following errors: ' + errors.join(', '), 'error');
        return;
    }
    
    const form = document.getElementById('proposal-form');
    const formData = new FormData(form);
    
    const submission = {
        submission_id: generateSubmissionId(),
        applicant_name: formData.get('applicant_name'),
        applicant_email: formData.get('applicant_email'),
        country: formData.get('country'),
        organization_type: formData.get('organization_type'),
        website: formData.get('website') || '',
        project_title: formData.get('project_title'),
        project_summary: formData.get('project_summary'),
        funding_amount: parseFloat(formData.get('funding_amount')),
        duration_months: parseInt(formData.get('duration_months')),
        trl: formData.get('trl'),
        category: formData.get('category'),
        innovation_description: formData.get('innovation_description'),
        expected_impact: formData.get('expected_impact'),
        work_plan: formData.get('work_plan'),
        budget_breakdown: formData.get('budget_breakdown'),
        submission_date: new Date().toISOString().split('T')[0],
        status: 'Submitted',
        reviewer: '',
        technical_score: 0,
        innovation_score: 0,
        impact_score: 0,
        budget_score: 0,
        overall_score: 0,
        comments: '',
        decision: 'Pending',
        decision_date: null
    };
    
    submissions.push(submission);
    form.reset();
    
    // Show success modal
    showSubmissionSuccess(submission.submission_id);
}

function showSubmissionSuccess(submissionId) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            <div class="text-center">
                <h2 class="mb-16">\ud83c\udf89 Submission Successful!</h2>
                <p class="mb-8">Thank you for your proposal submission.</p>
                <div class="card mb-16">
                    <div class="card__body">
                        <strong>Submission ID:</strong> ${submissionId}<br>
                        <strong>Submitted:</strong> ${new Date().toLocaleDateString()}
                    </div>
                </div>
                <p class="mb-16">You will receive a confirmation email shortly. The review process typically takes 4-6 weeks.</p>
                <button class="btn btn--primary" onclick="showView('dashboard'); this.parentElement.parentElement.parentElement.remove();">Return to Dashboard</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    showNotification('Proposal submitted successfully! Confirmation email will be sent.');
}

// My Submissions functionality
function searchMySubmissions() {
    const email = document.getElementById('search-email').value.trim();
    if (!email) {
        showNotification('Please enter your email address', 'error');
        return;
    }
    
    const userSubmissions = submissions.filter(s => s.applicant_email.toLowerCase() === email.toLowerCase());
    renderMySubmissions(userSubmissions);
}

function renderMySubmissions(userSubmissions) {
    const container = document.getElementById('my-submissions-list');
    
    if (userSubmissions.length === 0) {
        container.innerHTML = '<p class="text-center py-16">No submissions found for this email address.</p>';
        return;
    }
    
    const tableHTML = `
        <table class="table">
            <thead>
                <tr>
                    <th>Submission ID</th>
                    <th>Project Title</th>
                    <th>Submission Date</th>
                    <th>Status</th>
                    <th>Funding Amount</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${userSubmissions.map(sub => `
                    <tr>
                        <td><strong>${sub.submission_id}</strong></td>
                        <td>${sub.project_title}</td>
                        <td>${formatDate(sub.submission_date)}</td>
                        <td><span class="status status--${sub.status.toLowerCase().replace(' ', '')}">${sub.status}</span></td>
                        <td>€${sub.funding_amount.toLocaleString()}</td>
                        <td>
                            <button class="btn btn--sm btn--outline" onclick="viewSubmissionDetails('${sub.submission_id}')">View Details</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = tableHTML;
}

function viewSubmissionDetails(submissionId) {
    const submission = submissions.find(s => s.submission_id === submissionId);
    if (!submission) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px;">
            <button class="modal-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            <h2 class="mb-16">Submission Details - ${submission.submission_id}</h2>
            
            <div class="form-section">
                <h3 class="form-section-title">Applicant Information</h3>
                <div class="form-grid">
                    <div><strong>Organization:</strong> ${submission.applicant_name}</div>
                    <div><strong>Email:</strong> ${submission.applicant_email}</div>
                    <div><strong>Country:</strong> ${submission.country}</div>
                    <div><strong>Organization Type:</strong> ${submission.organization_type}</div>
                </div>
            </div>
            
            <div class="form-section">
                <h3 class="form-section-title">Project Information</h3>
                <div><strong>Title:</strong> ${submission.project_title}</div>
                <div class="mt-8"><strong>Summary:</strong></div>
                <p>${submission.project_summary}</p>
                <div class="form-grid">
                    <div><strong>Funding Amount:</strong> €${submission.funding_amount.toLocaleString()}</div>
                    <div><strong>Duration:</strong> ${submission.duration_months} months</div>
                    <div><strong>TRL:</strong> ${submission.trl}</div>
                    <div><strong>Category:</strong> ${submission.category}</div>
                </div>
            </div>
            
            <div class="form-section">
                <h3 class="form-section-title">Review Status</h3>
                <div class="form-grid">
                    <div><strong>Status:</strong> <span class="status status--${submission.status.toLowerCase().replace(' ', '')}">${submission.status}</span></div>
                    <div><strong>Submission Date:</strong> ${formatDate(submission.submission_date)}</div>
                    ${submission.reviewer ? `<div><strong>Reviewer:</strong> ${submission.reviewer}</div>` : ''}
                    ${submission.overall_score > 0 ? `<div><strong>Overall Score:</strong> ${submission.overall_score}/100</div>` : ''}
                </div>
                ${submission.comments ? `<div class="mt-8"><strong>Reviewer Comments:</strong><p>${submission.comments}</p></div>` : ''}
                ${submission.decision_date ? `<div><strong>Decision Date:</strong> ${formatDate(submission.decision_date)}</div>` : ''}
            </div>
            
            <div class="text-center mt-16">
                <button class="btn btn--primary" onclick="this.parentElement.parentElement.parentElement.remove()">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Admin functionality
function showAdminLogin() {
    const adminView = document.getElementById('admin-view');
    adminView.innerHTML = `
        <div class="admin-login">
            <div class="card">
                <div class="card__body">
                    <h2 class="text-center mb-16">🔐 Admin Portal Login</h2>
                    <div class="form-group">
                        <label class="form-label">Password</label>
                        <input type="password" id="admin-password" class="form-control" placeholder="Enter admin password">
                    </div>
                    <button class="btn btn--primary btn--full-width" onclick="authenticateAdmin()">Login</button>
                    <p class="text-center mt-8" style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">Demo password: reviewer2025</p>
                </div>
            </div>
        </div>
    `;
}

function authenticateAdmin() {
    const password = document.getElementById('admin-password').value;
    if (password === 'reviewer2025') {
        isAdminAuthenticated = true;
        renderAdminView();
    } else {
        showNotification('Invalid password', 'error');
    }
}

function renderAdminView() {
    const adminView = document.getElementById('admin-view');
    adminView.innerHTML = `
        <div class="breadcrumb">
            <span>Home</span> › <span>Admin Portal</span>
        </div>
        
        <div class="flex justify-between items-center mb-16">
            <h2>📊 Review Submissions</h2>
            <button class="btn btn--outline btn--sm" onclick="exportSubmissions()">📥 Export CSV</button>
        </div>
        
        <div class="card mb-16">
            <div class="card__body">
                <div class="flex gap-16 mb-16">
                    <div class="form-group" style="margin-bottom: 0; min-width: 200px;">
                        <label class="form-label">Filter by Status</label>
                        <select id="status-filter" class="form-control" onchange="filterSubmissions()">
                            <option value="">All Statuses</option>
                            <option value="Submitted">Submitted</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                    <div class="form-group" style="margin-bottom: 0; min-width: 200px;">
                        <label class="form-label">Filter by Country</label>
                        <select id="country-filter" class="form-control" onchange="filterSubmissions()">
                            <option value="">All Countries</option>
                            ${countries.map(country => `<option value="${country}">${country}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group" style="margin-bottom: 0; flex-grow: 1;">
                        <label class="form-label">Search</label>
                        <input type="text" id="search-input" class="form-control" placeholder="Search by title or applicant" onkeyup="filterSubmissions()">
                    </div>
                </div>
            </div>
        </div>
        
        <div id="admin-submissions-list">
            <!-- Submissions table will be rendered here -->
        </div>
        
        <div class="mt-24">
            <h3 class="mb-16">📈 Analytics Dashboard</h3>
            <div class="grid grid-cols-2 gap-16">
                <div class="card">
                    <div class="card__header">
                        <h4>Submissions by Category</h4>
                    </div>
                    <div class="card__body">
                        <div class="chart-container">
                            <canvas id="categoryChart"></canvas>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card__header">
                        <h4>Score Distribution</h4>
                    </div>
                    <div class="card__body">
                        <div class="chart-container">
                            <canvas id="scoreChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    filterSubmissions();
    renderAdminCharts();
}

function filterSubmissions() {
    const statusFilter = document.getElementById('status-filter')?.value || '';
    const countryFilter = document.getElementById('country-filter')?.value || '';
    const searchInput = document.getElementById('search-input')?.value.toLowerCase() || '';
    
    let filteredSubmissions = submissions.filter(sub => {
        const matchesStatus = !statusFilter || sub.status === statusFilter;
        const matchesCountry = !countryFilter || sub.country === countryFilter;
        const matchesSearch = !searchInput || 
            sub.project_title.toLowerCase().includes(searchInput) ||
            sub.applicant_name.toLowerCase().includes(searchInput);
        
        return matchesStatus && matchesCountry && matchesSearch;
    });
    
    renderAdminSubmissions(filteredSubmissions);
}

function renderAdminSubmissions(submissionsList) {
    const container = document.getElementById('admin-submissions-list');
    
    if (submissionsList.length === 0) {
        container.innerHTML = '<p class="text-center py-16">No submissions found matching the current filters.</p>';
        return;
    }
    
    const tableHTML = `
        <div class="card">
            <div class="card__body" style="padding: 0;">
                <table class="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Applicant</th>
                            <th>Project Title</th>
                            <th>Country</th>
                            <th>Funding</th>
                            <th>Status</th>
                            <th>Score</th>
                            <th>Reviewer</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${submissionsList.map(sub => `
                            <tr>
                                <td><strong>${sub.submission_id}</strong></td>
                                <td>${sub.applicant_name}</td>
                                <td>${sub.project_title}</td>
                                <td>${sub.country}</td>
                                <td>€${sub.funding_amount.toLocaleString()}</td>
                                <td>
                                    <select class="form-control" style="font-size: var(--font-size-sm); padding: var(--space-4) var(--space-8);" onchange="updateSubmissionStatus('${sub.submission_id}', this.value)">
                                        <option value="Submitted" ${sub.status === 'Submitted' ? 'selected' : ''}>Submitted</option>
                                        <option value="Under Review" ${sub.status === 'Under Review' ? 'selected' : ''}>Under Review</option>
                                        <option value="Approved" ${sub.status === 'Approved' ? 'selected' : ''}>Approved</option>
                                        <option value="Rejected" ${sub.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
                                    </select>
                                </td>
                                <td>${sub.overall_score > 0 ? sub.overall_score + '/100' : '-'}</td>
                                <td>
                                    <input type="text" class="form-control" style="font-size: var(--font-size-sm); padding: var(--space-4) var(--space-8); min-width: 150px;" value="${sub.reviewer}" onchange="updateReviewer('${sub.submission_id}', this.value)" placeholder="Assign reviewer">
                                </td>
                                <td>
                                    <div class="flex gap-4">
                                        <button class="btn btn--sm btn--primary" onclick="reviewSubmission('${sub.submission_id}')">Review</button>
                                        <button class="btn btn--sm btn--success" onclick="approveSubmission('${sub.submission_id}')">Approve</button>
                                        <button class="btn btn--sm btn--danger" onclick="rejectSubmission('${sub.submission_id}')">Reject</button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    container.innerHTML = tableHTML;
}

function updateSubmissionStatus(submissionId, newStatus) {
    const submission = submissions.find(s => s.submission_id === submissionId);
    if (submission) {
        submission.status = newStatus;
        if (newStatus === 'Approved' || newStatus === 'Rejected') {
            submission.decision = newStatus;
            submission.decision_date = new Date().toISOString().split('T')[0];
        }
        showNotification(`Status updated for ${submissionId}`);
    }
}

function updateReviewer(submissionId, reviewer) {
    const submission = submissions.find(s => s.submission_id === submissionId);
    if (submission) {
        submission.reviewer = reviewer;
        showNotification(`Reviewer assigned for ${submissionId}`);
    }
}

function reviewSubmission(submissionId) {
    const submission = submissions.find(s => s.submission_id === submissionId);
    if (!submission) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 1000px;">
            <button class="modal-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            <h2 class="mb-16">📋 Review Submission - ${submission.submission_id}</h2>
            
            <div class="grid grid-cols-2 gap-16">
                <div>
                    <div class="form-section">
                        <h3 class="form-section-title">Project Information</h3>
                        <div><strong>Title:</strong> ${submission.project_title}</div>
                        <div class="mt-8"><strong>Applicant:</strong> ${submission.applicant_name}</div>
                        <div><strong>Country:</strong> ${submission.country}</div>
                        <div><strong>Funding:</strong> €${submission.funding_amount.toLocaleString()}</div>
                        <div><strong>Category:</strong> ${submission.category}</div>
                        <div><strong>TRL:</strong> ${submission.trl}</div>
                        <div class="mt-8"><strong>Summary:</strong></div>
                        <p style="font-size: var(--font-size-sm);">${submission.project_summary}</p>
                        <div class="mt-8"><strong>Innovation:</strong></div>
                        <p style="font-size: var(--font-size-sm);">${submission.innovation_description}</p>
                    </div>
                </div>
                
                <div>
                    <div class="form-section">
                        <h3 class="form-section-title">Review Scores</h3>
                        <div class="form-group">
                            <label class="form-label">Technical Quality (0-100)</label>
                            <input type="range" id="technical-score" class="score-slider" min="0" max="100" value="${submission.technical_score}" oninput="updateScoreDisplay('technical', this.value)">
                            <div class="text-center mt-4"><span id="technical-display">${submission.technical_score}</span>/100</div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Innovation (0-100)</label>
                            <input type="range" id="innovation-score" class="score-slider" min="0" max="100" value="${submission.innovation_score}" oninput="updateScoreDisplay('innovation', this.value)">
                            <div class="text-center mt-4"><span id="innovation-display">${submission.innovation_score}</span>/100</div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Impact (0-100)</label>
                            <input type="range" id="impact-score" class="score-slider" min="0" max="100" value="${submission.impact_score}" oninput="updateScoreDisplay('impact', this.value)">
                            <div class="text-center mt-4"><span id="impact-display">${submission.impact_score}</span>/100</div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Budget Reasonableness (0-100)</label>
                            <input type="range" id="budget-score" class="score-slider" min="0" max="100" value="${submission.budget_score}" oninput="updateScoreDisplay('budget', this.value)">
                            <div class="text-center mt-4"><span id="budget-display">${submission.budget_score}</span>/100</div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Overall Score</label>
                            <div class="text-center" style="font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); color: var(--color-primary);"><span id="overall-display">${submission.overall_score}</span>/100</div>
                        </div>
                    </div>
                    
                    <div class="form-section">
                        <h3 class="form-section-title">Review Comments</h3>
                        <div class="form-group">
                            <label class="form-label">Comments</label>
                            <textarea id="review-comments" class="form-control" rows="4" placeholder="Enter your review comments...">${submission.comments}</textarea>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Recommendation</label>
                            <select id="recommendation" class="form-control">
                                <option value="Pending" ${submission.decision === 'Pending' ? 'selected' : ''}>Pending</option>
                                <option value="Approve" ${submission.decision === 'Approved' ? 'selected' : ''}>Approve</option>
                                <option value="Reject" ${submission.decision === 'Rejected' ? 'selected' : ''}>Reject</option>
                                <option value="Request Revisions">Request Revisions</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="flex gap-8 justify-center mt-16">
                <button class="btn btn--primary" onclick="saveReview('${submission.submission_id}')">💾 Save Review</button>
                <button class="btn btn--outline" onclick="showNotification('PDF export feature will be configured with backend system')">📄 Export PDF</button>
                <button class="btn btn--secondary" onclick="this.parentElement.parentElement.parentElement.remove()">Cancel</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    currentSubmissionId = submissionId;
    updateOverallScore();
}

function updateScoreDisplay(type, value) {
    document.getElementById(type + '-display').textContent = value;
    updateOverallScore();
}

function updateOverallScore() {
    const technical = parseInt(document.getElementById('technical-score').value) || 0;
    const innovation = parseInt(document.getElementById('innovation-score').value) || 0;
    const impact = parseInt(document.getElementById('impact-score').value) || 0;
    const budget = parseInt(document.getElementById('budget-score').value) || 0;
    
    const overall = Math.round((technical + innovation + impact + budget) / 4);
    document.getElementById('overall-display').textContent = overall;
}

function saveReview(submissionId) {
    const submission = submissions.find(s => s.submission_id === submissionId);
    if (!submission) return;
    
    submission.technical_score = parseInt(document.getElementById('technical-score').value);
    submission.innovation_score = parseInt(document.getElementById('innovation-score').value);
    submission.impact_score = parseInt(document.getElementById('impact-score').value);
    submission.budget_score = parseInt(document.getElementById('budget-score').value);
    submission.overall_score = Math.round((submission.technical_score + submission.innovation_score + submission.impact_score + submission.budget_score) / 4);
    submission.comments = document.getElementById('review-comments').value;
    
    const recommendation = document.getElementById('recommendation').value;
    if (recommendation !== 'Pending') {
        submission.decision = recommendation === 'Approve' ? 'Approved' : recommendation === 'Reject' ? 'Rejected' : recommendation;
        submission.status = recommendation === 'Approve' ? 'Approved' : recommendation === 'Reject' ? 'Rejected' : 'Under Review';
        if (submission.status === 'Approved' || submission.status === 'Rejected') {
            submission.decision_date = new Date().toISOString().split('T')[0];
        }
    }
    
    // Close modal
    document.querySelector('.modal').remove();
    
    // Refresh admin view
    filterSubmissions();
    
    showNotification('Review saved successfully!');
}

function approveSubmission(submissionId) {
    if (confirm('Are you sure you want to approve this submission?')) {
        const submission = submissions.find(s => s.submission_id === submissionId);
        if (submission) {
            submission.status = 'Approved';
            submission.decision = 'Approved';
            submission.decision_date = new Date().toISOString().split('T')[0];
            filterSubmissions();
            showNotification(`Submission ${submissionId} approved!`);
        }
    }
}

function rejectSubmission(submissionId) {
    if (confirm('Are you sure you want to reject this submission?')) {
        const submission = submissions.find(s => s.submission_id === submissionId);
        if (submission) {
            submission.status = 'Rejected';
            submission.decision = 'Rejected';
            submission.decision_date = new Date().toISOString().split('T')[0];
            filterSubmissions();
            showNotification(`Submission ${submissionId} rejected.`);
        }
    }
}

function renderAdminCharts() {
    // Category Chart
    setTimeout(() => {
        const categoryCtx = document.getElementById('categoryChart');
        if (categoryCtx) {
            const categoryData = {};
            submissions.forEach(s => {
                categoryData[s.category] = (categoryData[s.category] || 0) + 1;
            });
            
            new Chart(categoryCtx, {
                type: 'bar',
                data: {
                    labels: Object.keys(categoryData),
                    datasets: [{
                        label: 'Submissions',
                        data: Object.values(categoryData),
                        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
        
        // Score Distribution Chart
        const scoreCtx = document.getElementById('scoreChart');
        if (scoreCtx) {
            const scoreRanges = {
                '0-20': 0,
                '21-40': 0,
                '41-60': 0,
                '61-80': 0,
                '81-100': 0
            };
            
            submissions.forEach(s => {
                if (s.overall_score > 0) {
                    if (s.overall_score <= 20) scoreRanges['0-20']++;
                    else if (s.overall_score <= 40) scoreRanges['21-40']++;
                    else if (s.overall_score <= 60) scoreRanges['41-60']++;
                    else if (s.overall_score <= 80) scoreRanges['61-80']++;
                    else scoreRanges['81-100']++;
                }
            });
            
            new Chart(scoreCtx, {
                type: 'bar',
                data: {
                    labels: Object.keys(scoreRanges),
                    datasets: [{
                        label: 'Number of Submissions',
                        data: Object.values(scoreRanges),
                        backgroundColor: '#0066CC'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }, 100);
}

function exportSubmissions() {
    const csvContent = "data:text/csv;charset=utf-8," + 
        "Submission ID,Applicant Name,Email,Country,Project Title,Funding Amount,Status,Overall Score,Submission Date\n" +
        submissions.map(s => 
            `${s.submission_id},"${s.applicant_name}",${s.applicant_email},${s.country},"${s.project_title}",${s.funding_amount},${s.status},${s.overall_score},${s.submission_date}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "submissions_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Submissions data exported to CSV file');
}

// Settings functionality
function renderSettingsView() {
    const settingsView = document.getElementById('settings-view');
    settingsView.innerHTML = `
        <div class="breadcrumb">
            <span>Home</span> › <span>Settings</span>
        </div>
        
        <h2 class="mb-16">⚙️ Admin Settings</h2>
        
        <div class="form-section">
            <h3 class="form-section-title">Open Call Configuration</h3>
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">Call Title</label>
                    <input type="text" class="form-control" value="${callConfig.title}" id="call-title">
                </div>
                <div class="form-group">
                    <label class="form-label">Opening Date</label>
                    <input type="date" class="form-control" value="${callConfig.openingDate}" id="opening-date">
                </div>
                <div class="form-group">
                    <label class="form-label">Closing Date</label>
                    <input type="date" class="form-control" value="${callConfig.closingDate}" id="closing-date">
                </div>
                <div class="form-group">
                    <label class="form-label">Total Budget (€)</label>
                    <input type="number" class="form-control" value="${callConfig.totalBudget}" id="total-budget">
                </div>
                <div class="form-group">
                    <label class="form-label">Maximum Award (€)</label>
                    <input type="number" class="form-control" value="${callConfig.maxAward}" id="max-award">
                </div>
                <div class="form-group">
                    <label class="form-label">Minimum Award (€)</label>
                    <input type="number" class="form-control" value="${callConfig.minAward}" id="min-award">
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Call Description</label>
                <textarea class="form-control" rows="4" id="call-description">${callConfig.description}</textarea>
            </div>
            <button class="btn btn--primary" onclick="saveSettings()">💾 Save Configuration</button>
        </div>
        
        <div class="form-section">
            <h3 class="form-section-title">Email Template Configuration</h3>
            <div class="form-group">
                <label class="form-label">Submission Confirmation Email Template</label>
                <textarea class="form-control" rows="6" id="email-template">Dear {{applicant_name}},

Thank you for your submission to the {{call_title}}.

Submission ID: {{submission_id}}
Project Title: {{project_title}}
Submission Date: {{submission_date}}

Your proposal is now under review. You will be notified of the outcome within 4-6 weeks.

Best regards,
Horizon Europe Team</textarea>
            </div>
            <button class="btn btn--outline" onclick="showNotification('Email template saved! Integration with email service will be configured.')">💾 Save Email Template</button>
        </div>
        
        <div class="form-section">
            <h3 class="form-section-title">Data Management</h3>
            <div class="flex gap-8">
                <button class="btn btn--outline" onclick="exportSubmissions()">📥 Export All Submissions (CSV)</button>
                <button class="btn btn--outline" onclick="showNotification('Backup functionality will be integrated with cloud storage service')">💾 Backup Data</button>
                <button class="btn btn--danger" onclick="confirmDataReset()">🗑️ Reset All Data</button>
            </div>
        </div>
    `;
}

function saveSettings() {
    callConfig.title = document.getElementById('call-title').value;
    callConfig.description = document.getElementById('call-description').value;
    callConfig.openingDate = document.getElementById('opening-date').value;
    callConfig.closingDate = document.getElementById('closing-date').value;
    callConfig.totalBudget = parseInt(document.getElementById('total-budget').value);
    callConfig.maxAward = parseInt(document.getElementById('max-award').value);
    callConfig.minAward = parseInt(document.getElementById('min-award').value);
    
    showNotification('Settings saved successfully!');
}

function confirmDataReset() {
    if (confirm('Are you sure you want to reset all submission data? This action cannot be undone.')) {
        if (confirm('This will permanently delete all submissions, reviews, and scores. Are you absolutely sure?')) {
            submissions = [];
            nextSubmissionNumber = 1;
            showNotification('All data has been reset!');
            showView('dashboard');
        }
    }
}

// Initialize application
function initializeApp() {
    initializeSampleData();
    
    // Set up form event listeners
    setupFormEventListeners();
    
    // Update countdown timer
    updateCountdown();
    setInterval(updateCountdown, 60000); // Update every minute
    
    // Show initial view
    showView('dashboard');
}

function setupFormEventListeners() {
    // Word counters for textareas
    const textareas = [
        { id: 'project-summary', counter: 'summary-counter', limit: 250 },
        { id: 'innovation-description', counter: 'innovation-counter', limit: 500 },
        { id: 'expected-impact', counter: 'impact-counter', limit: 300 },
        { id: 'work-plan', counter: 'workplan-counter', limit: 400 }
    ];
    
    textareas.forEach(({ id, counter, limit }) => {
        const textarea = document.getElementById(id);
        if (textarea) {
            textarea.addEventListener('input', () => updateWordCounter(textarea, counter, limit));
            // Initialize counter
            updateWordCounter(textarea, counter, limit);
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Export functions to global scope for onclick handlers
window.showView = showView;
window.submitProposal = submitProposal;
window.searchMySubmissions = searchMySubmissions;
window.viewSubmissionDetails = viewSubmissionDetails;
window.authenticateAdmin = authenticateAdmin;
window.filterSubmissions = filterSubmissions;
window.updateSubmissionStatus = updateSubmissionStatus;
window.updateReviewer = updateReviewer;
window.reviewSubmission = reviewSubmission;
window.updateScoreDisplay = updateScoreDisplay;
window.saveReview = saveReview;
window.approveSubmission = approveSubmission;
window.rejectSubmission = rejectSubmission;
window.exportSubmissions = exportSubmissions;
window.saveSettings = saveSettings;
window.confirmDataReset = confirmDataReset;
window.showNotification = showNotification;

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
    showNotification('An error occurred. Please try again.', 'error');
});