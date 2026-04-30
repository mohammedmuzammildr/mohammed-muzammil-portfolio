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
