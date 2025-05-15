const form = document.getElementById('findPetForm');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const breed = form.querySelector('input[name="breed"]').value.trim();

    if (breed === '') {
        alert('Please enter a breed or "Doesn\'t matter"');
        return;
    }
    
    alert('Form submitted successfully!');
}); 