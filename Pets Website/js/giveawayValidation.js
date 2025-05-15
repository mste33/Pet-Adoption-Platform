var form = document.getElementById('giveawayPetForm');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    var breed = form.querySelector('input[name="breed"]').value;
    breed = breed.trim();
    var comments = form.querySelector('textarea[name="comments"]').value;
    comments = comments.trim(); 
    var ownerName = form.querySelector('input[name="ownerName"]').value;
    ownerName = ownerName.trim();
    var ownerEmail = form.querySelector('input[name="ownerEmail"]').value;
    ownerEmail = ownerEmail.trim();
    
    if (breed == '') {
        alert('Please enter the breed or "Mix breed"');
        return;
    }
    
    if (comments == '') {
        alert('Please add some comments about your pet');
        return;
    }
    
    if (ownerName == '') {
        alert('Please enter your name');
        return;
    }
    
    if (ownerEmail == '') {
        alert('Please enter your email');
        return;
    }
    
    // I found this on stackoverflow
    var emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailCheck.test(ownerEmail)) {
        alert('Please enter a valid email address');
        return;
    }
    
    alert('Form submitted successfully!');
});