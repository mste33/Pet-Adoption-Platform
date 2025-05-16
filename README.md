# Pet-Adoption-Platform
[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/mste33/Pet-Adoption-Platform)

Pet-Adoption-Platform is a web application designed to connect people looking to adopt pets with those who need to find new homes for their animals. It provides a simple interface for browsing available pets, searching with specific criteria, and listing pets for adoption.

## Features

*   **User Authentication:** Create an account and log in to access features like pet giveaways.
*   **Pet Giveaway:** Registered users can submit details of pets they wish to give away.
*   **Browse Pets:** View a catalog of all pets currently available for adoption.
*   **Find a Pet:** Search for pets using various criteria such as type (dog/cat), breed, age, gender, and compatibility with other animals or children.
*   **Pet Care Information:** Dedicated pages offering tips and advice for dog and cat care.
*   **Contact Page:** Displays contact information.
*   **Privacy Policy:** Outlines the site's privacy practices.
*   **Dynamic Content:** Displays the current date and time in the header.

## Technologies Used

*   **Backend:** Node.js, Express.js
*   **Templating Engine:** EJS (Embedded JavaScript templates)
*   **Frontend:** HTML, CSS, JavaScript
*   **Styling:** Bootstrap 5, Custom CSS (`styles.css`)
*   **Data Storage:** User credentials are stored in `login.txt`, and pet information is stored in `available_pet_information_file.txt`.
*   **Session Management:** `express-session` for managing user sessions.

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/mste33/Pet-Adoption-Platform.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd Pet-Adoption-Platform
    ```
3.  **Install dependencies:**
    Ensure you have Node.js and npm installed. Then run:
    ```bash
    npm install
    ```
    This will install dependencies listed in `package.json` (Express.js, EJS, express-session).

## Running the Application

1.  **Start the server:**
    ```bash
    npm start
    ```
2.  **Access the application:**
    Open your web browser and navigate to `http://localhost:3000` (or the port specified if the `PORT` environment variable is set).

## File Structure

```
Pet-Adoption-Platform/
├── README.md                         # This file
├── app.js                            # Main Express application: server setup, routes, and logic
├── available_pet_information_file.txt # Stores data for pets available for adoption
├── login.txt                         # Stores user login credentials
├── package.json                      # Project metadata and dependencies
├── styles.css                        # Custom CSS styles for the application
├── IMG/
│   └── dog-and-cat.webp              # Image used on the homepage
├── js/
│   ├── datetime.js                   # Client-side script to display current date and time
│   ├── formValidation.js             # Client-side validation for the "Find a Pet" form
│   └── giveawayValidation.js         # Client-side validation for the "Give Away a Pet" form
└── views/                            # EJS templates for rendering HTML pages
    ├── browse.ejs                    # Page to browse all available pets
    ├── catcare.ejs                   # Page with cat care information
    ├── contact.ejs                   # Contact information page
    ├── createaccount.ejs             # User account creation page
    ├── dogcare.ejs                   # Page with dog care information
    ├── find.ejs                      # Page to search for pets with specific criteria
    ├── giveaway.ejs                  # Page for registered users to list a pet for adoption
    ├── index.ejs                     # Homepage of the application
    ├── login.ejs                     # User login page
    ├── logout.ejs                    # Logout confirmation page
    ├── privacy.ejs                   # Privacy policy page
    └── partials/                     # Reusable EJS partial templates
        ├── footer.ejs                # Footer section for all pages
        └── header.ejs                # Header and navigation bar for all pages
```

## Available Pages / Routes

*   **`/` (Home):** The main landing page of the application.
*   **`/browse`:** Displays a list of all pets currently available for adoption.
*   **`/find` (GET & POST):**
    *   GET: Renders the search form for finding a dog or cat.
    *   POST: Processes the search criteria and displays matching pets.
*   **`/dogcare`:** Provides information and tips on caring for dogs.
*   **`/catcare`:** Provides information and tips on caring for cats.
*   **`/giveaway` (GET & POST):** (Requires login)
    *   GET: Renders the form for users to list a pet they want to give away.
    *   POST: Processes the pet information submitted for giveaway.
*   **`/contact`:** Displays contact information for the site owner/administrator.
*   **`/createaccount` (GET & POST):**
    *   GET: Renders the account creation form.
    *   POST: Processes new user account registrations.
*   **`/login` (GET & POST):**
    *   GET: Renders the user login form.
    *   POST: Processes user login attempts.
*   **`/logout`:** Logs out the currently authenticated user and displays a confirmation.
*   **`/privacy`:** Displays the website's privacy policy and disclaimer.
