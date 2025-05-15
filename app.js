var express = require('express');
var path = require('path');
var fs = require('fs');
var session = require('express-session');
var app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.set('view cache', false);

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

app.use(express.static(__dirname));

var LOGIN_FILE = path.join(__dirname, 'login.txt');
var PETS_FILE = path.join(__dirname, 'available_pet_information_file.txt');

if (!fs.existsSync(LOGIN_FILE)) {
    fs.writeFileSync(LOGIN_FILE, '', 'utf8');
}

if (!fs.existsSync(PETS_FILE)) {
    fs.writeFileSync(PETS_FILE, '', 'utf8');
}

function usernameExists(username) {
    var content = fs.readFileSync(LOGIN_FILE, 'utf8');
    var lines = content.split('\n');
    
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        if (line === '') continue;
        
        var parts = line.split(':');
        if (parts[0] === username) {
            return true;
        }
    }
    
    return false;
}

function addUser(username, password) {
    fs.appendFileSync(LOGIN_FILE, username + ':' + password + '\n', 'utf8');
}

function verifyLogin(username, password) {
    var content = fs.readFileSync(LOGIN_FILE, 'utf8');
    var lines = content.split('\n');
    
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        if (line === '') continue;
        
        var parts = line.split(':');
        if (parts[0] === username && parts[1] === password) {
            return true;
        }
    }
    
    return false;
}

function getNextPetId() {
    var content = fs.readFileSync(PETS_FILE, 'utf8');
    var lines = content.split('\n');
    
    var count = 0;
    for (var i = 0; i < lines.length; i++) {
        if (lines[i].trim() !== '') {
            count++;
        }
    }
    
    return count + 1;
}

function addPet(username, petData) {
    var petId = getNextPetId();
    
    var petEntry = petId + ':' + username + ':' + petData.join(':') + '\n';
    
    fs.appendFileSync(PETS_FILE, petEntry, 'utf8');
    
    return petId;
}

function requireLogin(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

function getAllPets() {
    if (!fs.existsSync(PETS_FILE)) {
        return [];
    }
    
    var content = fs.readFileSync(PETS_FILE, 'utf8');
    var lines = content.split('\n');
    
    var pets = [];
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        if (line === '') continue;
        
        var parts = line.split(':');
        if (parts.length < 8) continue;
        
        var pet = {
            id: parts[0],
            username: parts[1],
            type: parts[2],
            breed: parts[3],
            age: parts[4],
            gender: parts[5],
            getAlongWith: parts[6],
            goodWith: parts[7],
            friendly: parts[8] || 'N/A',
            health: parts[9] || 'N/A'
        };
        
        pets.push(pet);
    }
    
    return pets;
}

function searchPets(criteria) {
    var allPets = getAllPets();
    var results = [];
    
    for (var i = 0; i < allPets.length; i++) {
        var pet = allPets[i];
        var match = true;
        
        if (criteria.petType && criteria.petType !== 'any' && pet.type !== criteria.petType) {
            match = false;
        }
        
        if (criteria.breed && criteria.breed.trim() !== '' && 
            !pet.breed.toLowerCase().includes(criteria.breed.toLowerCase())) {
            match = false;
        }
        
        if (criteria.age && criteria.age !== 'any') {
            var petAge = parseFloat(pet.age);
            
            if (criteria.age === 'puppy' && petAge > 1) {
                match = false;
            } else if (criteria.age === 'young' && (petAge <= 1 || petAge > 3)) {
                match = false;
            } else if (criteria.age === 'adult' && (petAge <= 3 || petAge > 7)) {
                match = false;
            } else if (criteria.age === 'senior' && petAge <= 7) {
                match = false;
            }
        }
        
        if (criteria.gender && criteria.gender !== 'any' && pet.gender !== criteria.gender) {
            match = false;
        }
        
        if (criteria.getAlongWith && criteria.getAlongWith.length > 0) {
            var petGetsAlongWith = pet.getAlongWith.split(',');
            
            for (var j = 0; j < criteria.getAlongWith.length; j++) {
                var required = criteria.getAlongWith[j];
                if (!petGetsAlongWith.includes(required)) {
                    match = false;
                    break;
                }
            }
        }
        
        if (match) {
            results.push(pet);
        }
    }
    
    return results;
}

app.get('/', function(req, res) {
    res.render('index', {
        title: 'Home',
        currentPage: 'home'
    });
});

app.get('/browse', function(req, res) {
    var pets = [];
    try {
        var data = fs.readFileSync(PETS_FILE, 'utf8');
        var lines = data.split('\n');
        
        for (var i = 0; i < lines.length; i++) {
            if (lines[i].trim()) {
                var parts = lines[i].split(':');
                if (parts.length >= 10) {
                    pets.push({
                        id: parts[0],
                        username: parts[1],
                        type: parts[2],
                        breed: parts[3],
                        age: parts[4],
                        gender: parts[5],
                        getAlongWith: parts[6].split(','),
                        goodWith: parts[7],
                        friendly: parts[8],
                        health: parts[9]
                    });
                }
            }
        }
    } catch (err) {
        console.error('Error reading pet information file:', err);
    }
    
    res.render('browse', {
        title: 'Browse Available Pets',
        currentPage: 'browse',
        pets: pets
    });
});

app.get('/find', function(req, res) {
    res.render('find', {
        title: 'Find a Dog/Cat',
        currentPage: 'find'
    });
});

app.get('/dogcare', function(req, res) {
    res.render('dogcare', {
        title: 'Dog Care',
        currentPage: 'dogcare'
    });
});

app.get('/catcare', function(req, res) {
    res.render('catcare', {
        title: 'Cat Care',
        currentPage: 'catcare'
    });
});

app.get('/contact', function(req, res) {
    res.render('contact', {
        title: 'Contact Us',
        currentPage: 'contact'
    });
});

app.get('/privacy', function(req, res) {
    res.render('privacy', {
        title: 'Privacy Policy',
        currentPage: 'privacy'
    });
});

app.get('/createaccount', function(req, res) {
    res.render('createaccount', {
        title: 'Create an Account',
        currentPage: 'createaccount'
    });
});

app.post('/createaccount', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    
    var usernameRegex = /^[a-zA-Z0-9]+$/;
    var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/;
    
    if (!usernameRegex.test(username)) {
        return res.render('createaccount', {
            title: 'Create an Account',
            currentPage: 'createaccount',
            message: 'Username can only contain letters and digits.'
        });
    }
    
    if (!passwordRegex.test(password)) {
        return res.render('createaccount', {
            title: 'Create an Account',
            currentPage: 'createaccount',
            message: 'Password must be at least 4 characters long and contain at least one letter and one digit.'
        });
    }
    
    if (usernameExists(username)) {
        return res.render('createaccount', {
            title: 'Create an Account',
            currentPage: 'createaccount',
            message: 'Username already exists. Please choose a different username.'
        });
    }
    
    addUser(username, password);
    
    res.render('createaccount', {
        title: 'Create an Account',
        currentPage: 'createaccount',
        message: 'Account created successfully! You are now ready to login whenever you are ready.'
    });
});

app.get('/login', function(req, res) {
    res.render('login', {
        title: 'Login',
        currentPage: 'login'
    });
});

app.post('/login', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    
    var usernameRegex = /^[a-zA-Z0-9]+$/;
    var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/;
    
    if (!usernameRegex.test(username)) {
        return res.render('login', {
            title: 'Login',
            currentPage: 'login',
            message: 'Username can only contain letters and digits.'
        });
    }
    
    if (!passwordRegex.test(password)) {
        return res.render('login', {
            title: 'Login',
            currentPage: 'login',
            message: 'Password must be at least 4 characters long and contain at least one letter and one digit.'
        });
    }
    
    if (verifyLogin(username, password)) {
        req.session.user = username;
        res.redirect('/giveaway');
    } else {
        res.render('login', {
            title: 'Login',
            currentPage: 'login',
            message: 'Invalid username or password.'
        });
    }
});

app.get('/logout', function(req, res) {
    var isLoggedIn = false;
    if (req.session.user) {
        isLoggedIn = true;
    }
    
    req.session.destroy();
    
    res.render('logout', {
        title: 'Logout',
        currentPage: 'logout',
        wasLoggedIn: isLoggedIn
    });
});

app.get('/giveaway', requireLogin, function(req, res) {
    res.render('giveaway', {
        title: 'Have a Pet to Give Away',
        currentPage: 'giveaway',
        username: req.session.user
    });
});

app.post('/giveaway', requireLogin, function(req, res) {
    var username = req.session.user;
    
    var getAlongWith = '';
    if (Array.isArray(req.body.getAlongWith)) {
        getAlongWith = req.body.getAlongWith.join(',');
    } else if (req.body.getAlongWith) {
        getAlongWith = req.body.getAlongWith;
    }
    
    var petData = [
        req.body.petType,
        req.body.breed,
        req.body.age,
        req.body.gender,
        getAlongWith,
        req.body.goodWith,
        req.body.friendly,
        req.body.health
    ];
    
    var petId = addPet(username, petData);
    
    res.render('giveaway', {
        title: 'Have a Pet to Give Away',
        currentPage: 'giveaway',
        username: username,
        message: 'Pet added successfully with ID: ' + petId
    });
});

app.post('/find', function(req, res) {
    var criteria = {
        petType: req.body.petType || 'any',
        breed: req.body.breed || '',
        age: req.body.age || 'any',
        gender: req.body.gender || 'any',
        getAlongWith: req.body.getAlongWith || []
    };
    
    var pets = searchPets(criteria);
    
    res.render('find', {
        title: 'Find a Dog/Cat',
        currentPage: 'find',
        pets: pets,
        message: pets.length > 0 
            ? 'Found ' + pets.length + ' pets matching your criteria.' 
            : 'No pets found matching your criteria.'
    });
});

var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log('Server is running on port ' + PORT);
}); 