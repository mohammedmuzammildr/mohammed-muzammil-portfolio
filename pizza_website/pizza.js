function toggleDarkMode() {
    document.body.classList.toggle('dark-mode') }

function searchpizza() {
const searchterm=document.getElementById('searchInput').value.toLowerCase();

const pizza=document.querySelectorAll('.pizzas');

pizza.forEach(function(pizza) {
    const pizzaname=pizza.getAttribute('data-name').toLowerCase();

    if(pizzaname.includes(searchterm)){
        pizza.style.display= "inline-block";
    }
    else{
        pizza.style.display="none";
    }

});
}

// Shopping Cart Logic
let totalAmount = 0;

document.addEventListener('DOMContentLoaded', () => {
    const orderList = document.getElementById('orderList');
    const orderTotal = document.getElementById('orderTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    document.querySelectorAll('.Buy').forEach(button => {
        if(button.id === 'checkoutBtn') return; // Skip checkout button
        
        button.addEventListener('click', function() {
            const pizzaCard = this.parentElement;
            const pizzaName = pizzaCard.getAttribute('data-name');
            const pizzaPriceText = pizzaCard.querySelector('.price').textContent;
            const pizzaPrice = parseInt(pizzaPriceText);
            
            // Remove empty cart message if present
            const emptyMsg = orderList.querySelector('.empty-cart');
            if(emptyMsg) emptyMsg.remove();
            
            // Add to list
            const listItem = document.createElement('li');
            listItem.innerHTML = `<span>${pizzaName}</span> <span>₹${pizzaPrice}</span>`;
            orderList.appendChild(listItem);
            
            // Update total
            totalAmount += pizzaPrice;
            orderTotal.textContent = totalAmount;
            
            // Show checkout button
            checkoutBtn.style.display = 'block';
            
            // Visual feedback
            const originalText = this.textContent;
            this.textContent = 'Added!';
            this.style.backgroundColor = '#10b981';
            this.style.color = 'white';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.backgroundColor = '';
                this.style.color = '';
            }, 1000);
        });
    });

    if(checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            alert(`Thank you for your order! Your total is ₹${totalAmount}.`);
            orderList.innerHTML = '<li class="empty-cart">No pizzas ordered yet.</li>';
            totalAmount = 0;
            orderTotal.textContent = '0';
            this.style.display = 'none';
        });
    }

    // Modal Logic
    const modal = document.getElementById('pizzaModal');
    const closeBtn = document.querySelector('.close-btn');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalPrice = document.getElementById('modalPrice');
    const modalDesc = document.getElementById('modalDesc');
    const modalBuyBtn = document.getElementById('modalBuyBtn');

    let currentPizzaCard = null;

    document.querySelectorAll('.pizzas').forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't open modal if they clicked the Buy button directly
            if(e.target.classList.contains('Buy')) return;
            
            currentPizzaCard = this;
            
            modalTitle.textContent = this.getAttribute('data-name');
            modalPrice.textContent = '₹' + this.querySelector('.price').textContent;
            modalImg.src = this.querySelector('img').src;
            
            const name = this.getAttribute('data-name');
            modalDesc.textContent = `Enjoy our delicious, freshly baked ${name}. Made with premium ingredients and our signature secret sauce for the perfect slice.`;
            
            modalBuyBtn.textContent = 'Add to Order';
            modalBuyBtn.style.backgroundColor = 'rgb(243, 170, 35)';
            modalBuyBtn.style.color = 'black';
            
            modal.style.display = 'block';
        });
    });

    if(closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
    });

    if(modalBuyBtn) {
        modalBuyBtn.addEventListener('click', function() {
            if(currentPizzaCard) {
                const cardBuyBtn = currentPizzaCard.querySelector('.Buy');
                if(cardBuyBtn) cardBuyBtn.click(); // Reuses existing cart logic
                
                this.textContent = 'Added!';
                this.style.backgroundColor = '#10b981';
                this.style.color = 'white';
                
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 800);
            }
        });
    }
});
