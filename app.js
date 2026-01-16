// ==================== STATE MANAGEMENT ====================
// Using localStorage to persist cart across pages
const getCart = () => {
    const cart = localStorage.getItem('savannaSeaCart');
    return cart ? JSON.parse(cart) : { food: [], safari: [] };
};

const saveCart = (cart) => {
    localStorage.setItem('savannaSeaCart', JSON.stringify(cart));
};

let state = {
    guestCount: 2,
    safariPrice: 85
};

// ==================== CART FUNCTIONS ====================
function addToCart(name, price) {
    const cart = getCart();
    const existingItem = cart.food.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.food.push({ name, price: parseFloat(price), quantity: 1 });
    }
    saveCart(cart);
    updateCartDisplay();
    showToast(`${name} added to cart!`);
}

function addSafariToCart() {
    const cart = getCart();
    const safari = {
        name: 'Sunset Marine Safari',
        price: state.safariPrice * state.guestCount,
        guests: state.guestCount,
        date: 'Oct 24'
    };
    cart.safari = [safari];
    saveCart(cart);
    updateCartDisplay();
    showToast('Safari booking added to cart!');
    setTimeout(() => window.location.href = 'checkout.html', 1000);
}

function addSafariBooking(name, price) {
    const cart = getCart();
    const safari = {
        name: name,
        price: parseFloat(price),
        guests: 2,
        date: 'Oct 5'
    };
    cart.safari.push(safari);
    saveCart(cart);
    updateCartDisplay();
    showToast(`${name} added to bookings!`);
}

function updateCartDisplay() {
    const cart = getCart();
    const totalItems = cart.food.reduce((sum, item) => sum + item.quantity, 0);
    const foodTotal = cart.food.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const safariTotal = cart.safari.reduce((sum, item) => sum + item.price, 0);
    const total = foodTotal + safariTotal;

    // Update cart count badges
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = totalItems + cart.safari.length;
    });

    // Update cart total displays
    document.querySelectorAll('.cart-total').forEach(el => {
        el.textContent = `$${total.toFixed(2)}`;
    });
}

function updateGuests(change) {
    const newCount = state.guestCount + change;
    if (newCount >= 1 && newCount <= 8) {
        state.guestCount = newCount;
        const guestCountEl = document.getElementById('guest-count');
        const safariTotalEl = document.getElementById('safari-total');
        const safariPaxEl = document.getElementById('safari-pax');

        if (guestCountEl) guestCountEl.textContent = newCount;
        if (safariTotalEl) safariTotalEl.textContent = `$${(state.safariPrice * newCount)}`;
        if (safariPaxEl) safariPaxEl.textContent = `/ ${newCount} pax`;
    }
}

// ==================== CHECKOUT FUNCTIONS ====================
function updateCheckoutPage() {
    const cart = getCart();
    const foodContainer = document.getElementById('checkout-food-items');
    const safariContainer = document.getElementById('checkout-safari-items');

    if (!foodContainer || !safariContainer) return;

    // Add food items
    if (cart.food.length > 0) {
        foodContainer.innerHTML = cart.food.map(item => createFoodItemHTML(item)).join('');
    } else {
        foodContainer.innerHTML = `
            <div class="px-4 py-8 text-center text-gray-400">
                <span class="material-symbols-outlined text-4xl mb-2">restaurant</span>
                <p class="text-sm">No food items in cart</p>
                <a href="menu.html" class="text-primary text-sm font-semibold">Browse Menu</a>
            </div>
        `;
    }

    // Add safari items
    if (cart.safari.length > 0) {
        safariContainer.innerHTML = cart.safari.map(item => createSafariItemHTML(item)).join('');
    } else {
        safariContainer.innerHTML = `
            <div class="px-4 py-8 text-center text-gray-400">
                <span class="material-symbols-outlined text-4xl mb-2">explore</span>
                <p class="text-sm">No safari bookings</p>
                <a href="safari-booking.html" class="text-primary text-sm font-semibold">Browse Safaris</a>
            </div>
        `;
    }

    // Update totals
    updateCheckoutTotals();
}

function createFoodItemHTML(item) {
    return `
        <div class="flex items-center gap-4 bg-white dark:bg-card-dark/40 px-4 min-h-[88px] py-3 justify-between border-b border-gray-100 dark:border-white/5">
            <div class="flex items-center gap-4">
                <div class="bg-primary/20 rounded-xl size-16 flex items-center justify-center">
                    <span class="material-symbols-outlined text-primary text-2xl">restaurant</span>
                </div>
                <div class="flex flex-col justify-center">
                    <p class="text-slate-900 dark:text-white text-base font-semibold leading-tight">${item.name}</p>
                    <div class="flex items-center gap-2 mt-2">
                        <span class="bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded text-[10px] font-bold">QTY: ${item.quantity}</span>
                    </div>
                </div>
            </div>
            <div class="shrink-0 text-right">
                <p class="text-slate-900 dark:text-white text-base font-bold">$${(item.price * item.quantity).toFixed(2)}</p>
            </div>
        </div>
    `;
}

function createSafariItemHTML(item) {
    return `
        <div class="flex items-center gap-4 bg-white dark:bg-card-dark/40 px-4 min-h-[88px] py-4 justify-between">
            <div class="flex items-center gap-4">
                <div class="bg-primary/20 rounded-xl size-16 flex items-center justify-center">
                    <span class="material-symbols-outlined text-primary text-2xl">sailing</span>
                </div>
                <div class="flex flex-col justify-center">
                    <p class="text-slate-900 dark:text-white text-base font-semibold leading-tight">${item.name}</p>
                    <p class="text-gray-500 dark:text-[#cba490] text-sm font-normal mt-1">Full day booking • ${item.date}</p>
                    <div class="flex items-center gap-2 mt-2">
                        <span class="material-symbols-outlined text-primary text-xs">group</span>
                        <span class="text-xs font-medium text-gray-500 dark:text-white/60">${item.guests} Guests</span>
                    </div>
                </div>
            </div>
            <div class="shrink-0 text-right">
                <p class="text-slate-900 dark:text-white text-base font-bold">$${item.price.toFixed(2)}</p>
            </div>
        </div>
    `;
}

function updateCheckoutTotals() {
    const cart = getCart();
    const foodTotal = cart.food.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const safariTotal = cart.safari.reduce((sum, item) => sum + item.price, 0);
    const subtotal = foodTotal + safariTotal;
    const taxes = subtotal * 0.045;
    const deliveryFee = cart.food.length > 0 ? 2 : 0;
    const total = subtotal + taxes + deliveryFee;

    const subtotalEl = document.getElementById('subtotal');
    const taxesEl = document.getElementById('taxes');
    const deliveryFeeEl = document.getElementById('delivery-fee');
    const checkoutTotalEl = document.getElementById('checkout-total');

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (taxesEl) taxesEl.textContent = `$${taxes.toFixed(2)}`;
    if (deliveryFeeEl) deliveryFeeEl.textContent = `$${deliveryFee.toFixed(2)}`;
    if (checkoutTotalEl) checkoutTotalEl.textContent = `$${total.toFixed(2)}`;
}

function confirmBooking() {
    const cart = getCart();
    if (cart.food.length === 0 && cart.safari.length === 0) {
        showToast('Your cart is empty!');
        return;
    }
    showToast('Booking confirmed! Thank you!');
    localStorage.removeItem('savannaSeaCart');
    updateCartDisplay();
    setTimeout(() => window.location.href = 'index.html', 1500);
}

// ==================== TOAST NOTIFICATIONS ====================
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
}

// ==================== EVENT LISTENERS ====================
document.addEventListener('DOMContentLoaded', () => {
    // Update cart display on page load
    updateCartDisplay();

    // Check if on checkout page
    if (window.location.pathname.includes('checkout')) {
        updateCheckoutPage();
    }

    // Add to cart buttons (food)
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            const name = btn.dataset.name;
            const price = btn.dataset.price;
            addToCart(name, price);
        });
    });

    // Add to cart buttons (safari from booking page)
    document.querySelectorAll('.add-safari-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            const name = btn.dataset.name;
            const price = btn.dataset.price;
            addSafariBooking(name, price);
        });
    });

    // Menu category chips
    document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('.chip').forEach(c => {
                c.classList.remove('bg-primary', 'shadow-lg', 'shadow-primary/20');
                c.classList.add('bg-white', 'dark:bg-card-dark', 'border', 'border-slate-200', 'dark:border-transparent');
                const p = c.querySelector('p');
                if (p) {
                    p.classList.remove('text-white');
                    p.classList.add('text-slate-600', 'dark:text-slate-300');
                }
            });
            chip.classList.add('bg-primary', 'shadow-lg', 'shadow-primary/20');
            chip.classList.remove('bg-white', 'dark:bg-card-dark', 'border', 'border-slate-200', 'dark:border-transparent');
            const p = chip.querySelector('p');
            if (p) {
                p.classList.add('text-white');
                p.classList.remove('text-slate-600', 'dark:text-slate-300');
            }
        });
    });

    // Toggle buttons (delivery/pickup)
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.toggle-btn').forEach(b => {
                b.classList.remove('active', 'bg-white', 'dark:bg-primary', 'shadow-sm', 'text-slate-900', 'dark:text-white');
                b.classList.add('text-gray-500', 'dark:text-gray-400');
            });
            btn.classList.add('active', 'bg-white', 'dark:bg-primary', 'shadow-sm', 'text-slate-900', 'dark:text-white');
            btn.classList.remove('text-gray-500', 'dark:text-gray-400');
        });
    });

    // Favorite button
    const favoriteBtn = document.getElementById('favorite-btn');
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', () => {
            favoriteBtn.classList.toggle('active');
            showToast(favoriteBtn.classList.contains('active') ? 'Added to favorites!' : 'Removed from favorites');
        });
    }

    // Calendar day selection
    document.querySelectorAll('.calendar-day').forEach(day => {
        day.addEventListener('click', () => {
            document.querySelectorAll('.calendar-day').forEach(d => {
                d.classList.remove('bg-primary', 'text-white', 'shadow-lg', 'shadow-primary/30', 'selected');
                d.classList.add('text-gray-900', 'dark:text-white');
            });
            day.classList.add('bg-primary', 'text-white', 'shadow-lg', 'shadow-primary/30', 'selected');
            day.classList.remove('text-gray-900', 'dark:text-white', 'text-gray-400');
        });
    });

    // Carousel scroll handler
    const carousel = document.getElementById('hero-carousel');
    if (carousel) {
        carousel.addEventListener('scroll', () => {
            const scrollLeft = carousel.scrollLeft;
            const firstSlide = carousel.querySelector('.snap-center');
            if (firstSlide) {
                const itemWidth = firstSlide.offsetWidth;
                const activeIndex = Math.round(scrollLeft / itemWidth);

                document.querySelectorAll('#carousel-dots .dot').forEach((dot, index) => {
                    if (index === activeIndex) {
                        dot.classList.add('active', 'w-6', 'bg-primary');
                        dot.classList.remove('w-1.5', 'bg-slate-300', 'dark:bg-white/20');
                    } else {
                        dot.classList.remove('active', 'w-6', 'bg-primary');
                        dot.classList.add('w-1.5', 'bg-slate-300', 'dark:bg-white/20');
                    }
                });
            }
        });
    }
});
