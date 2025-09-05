// Global variables
let currentUser = null;
let selectedPlan = null;
let selectedPayment = 'mtn';
let token = localStorage.getItem('token');

// API base URL
const API_BASE_URL = 'http://localhost:3000/api';

// Show a specific section and hide others
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

// Register a new user
async function register() {
    const fullName = document.getElementById('regFullName').value;
    const phone = document.getElementById('regPhone').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    
    if (!fullName || !phone || !email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fullName, phone, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Store token and user data
            token = data.token;
            localStorage.setItem('token', token);
            currentUser = data.user;
            
            // Update UI
            document.getElementById('userInfo').innerHTML = 
                `Logged in as ${currentUser.email} | <a href="#" onclick="logout()">Logout</a>`;
            
            // Load subscription plans
            await loadSubscriptionPlans();
            showSection('plansSection');
        } else {
            alert(data.error || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed. Please try again.');
    }
}

// Login user
async function login() {
    const emailPhone = document.getElementById('loginEmailPhone').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!emailPhone || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ emailPhone, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Store token and user data
            token = data.token;
            localStorage.setItem('token', token);
            currentUser = data.user;
            
            // Update UI
            document.getElementById('userInfo').innerHTML = 
                `Logged in as ${currentUser.email} | <a href="#" onclick="logout()">Logout</a>`;
            
            // Load subscription plans
            await loadSubscriptionPlans();
            showSection('plansSection');
            
            if (currentUser.subscribed) {
                alert('Welcome back! You already have an active subscription.');
            }
        } else {
            alert(data.error || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
    }
}

// Logout user
async function logout() {
    try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        // Clear stored data
        token = null;
        currentUser = null;
        localStorage.removeItem('token');
        
        // Update UI
        document.getElementById('userInfo').innerHTML = 
            'Not logged in | <a href="#" onclick="showSection(\'loginSection\')">Login</a>';
        
        showSection('loginSection');
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Load subscription plans
async function loadSubscriptionPlans() {
    try {
        const response = await fetch(`${API_BASE_URL}/subscription/plans`);
        const plans = await response.json();
        
        const planCards = document.getElementById('planCards');
        planCards.innerHTML = '';
        
        plans.forEach(plan => {
            const planCard = document.createElement('div');
            planCard.className = 'plan-card';
            planCard.onclick = () => selectPlan(plan);
            
            planCard.innerHTML = `
                <h3>${plan.name}</h3>
                <div class="price">${plan.price} ${plan.currency}</div>
                <ul class="plan-features">
                    ${plan.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
                </ul>
                <div class="selected-indicator" style="display:none; color: #4e54c8;">
                    <i class="fas fa-check-circle"></i> Selected
                </div>
            `;
            
            planCards.appendChild(planCard);
        });
    } catch (error) {
        console.error('Error loading plans:', error);
    }
}

// Select a subscription plan
function selectPlan(plan) {
    selectedPlan = plan;
    
    // Update UI to show selected plan
    document.querySelectorAll('.plan-card').forEach(card => {
        card.classList.remove('selected');
        card.querySelector('.selected-indicator').style.display = 'none';
    });
    
    event.currentTarget.classList.add('selected');
    event.currentTarget.querySelector('.selected-indicator').style.display = 'block';
}

// Proceed to checkout
function proceedToCheckout() {
    if (!selectedPlan) {
        alert('Please select a subscription plan');
        return;
    }
    
    // Update order summary
    document.getElementById('summaryPlan').textContent = selectedPlan.name;
    document.getElementById('summaryPrice').textContent = `${selectedPlan.price} ${selectedPlan.currency}`;
    document.getElementById('summaryTotal').textContent = `${selectedPlan.price} ${selectedPlan.currency}`;
    
    showSection('checkoutSection');
}

// Select payment method
function selectPayment(method) {
    selectedPayment = method;
    
    // Update UI
    document.querySelectorAll('.payment-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    event.currentTarget.classList.add('selected');
}

// Process payment
async function processPayment() {
    showSection('processingSection');
    
    try {
        // Initiate payment with DPO
        const response = await fetch(`${API_BASE_URL}/payment/initiate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                amount: selectedPlan.price,
                plan: selectedPlan.name
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Redirect to DPO payment page
            window.location.href = data.paymentUrl;
        } else {
            alert(data.error || 'Payment initiation failed');
            showSection('checkoutSection');
        }
    } catch (error) {
        console.error('Payment error:', error);
        alert('Payment failed. Please try again.');
        showSection('checkoutSection');
    }
}

// Check if user is already logged in on page load
window.onload = async function() {
    if (token) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                currentUser = data.user;
                
                document.getElementById('userInfo').innerHTML = 
                    `Logged in as ${currentUser.email} | <a href="#" onclick="logout()">Logout</a>`;
                
                await loadSubscriptionPlans();
                showSection('plansSection');
                
                if (currentUser.subscribed) {
                    alert('Welcome back! You already have an active subscription.');
                }
            } else {
                localStorage.removeItem('token');
                token = null;
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
            localStorage.removeItem('token');
            token = null;
        }
    }
};