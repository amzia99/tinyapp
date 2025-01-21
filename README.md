# TinyApp Project

## Goal
The TinyApp project is a four-day web development project using Node.js. The app replicates functionalities of popular URL shortening services like TinyURL.com and bit.ly. Users can shorten long URLs, manage their URLs, and access them via custom short links.

## Project Outcome
This project delivers a multi-page app with the following features:
- User authentication for protected actions.
- CRUD functionalities for URL management (Create, Read, Update, Delete).
- Dynamic behavior based on the user's login state.

## User Stories
1. **As an avid Twitter poster:**  
   I want to shorten links so that I can fit more non-link text in my tweets.

2. **As a Twitter reader:**  
   I want to visit sites via shortened links to read interesting content.

3. **(Stretch)** **As an avid Twitter poster:**  
   I want to track the number of visits to my links to understand user engagement.

---

## Features and Route Checklist

### Authentication and User Management
- **GET /login**  
  - If logged in: Redirects to `/urls`.  
  - If not logged in: Displays a login form.  

- **POST /login**  
  - Valid credentials: Logs in the user and redirects to `/urls`.  
  - Invalid credentials: Returns an error message.

- **GET /register**  
  - If logged in: Redirects to `/urls`.  
  - If not logged in: Displays a registration form.

- **POST /register**  
  - Empty email or password: Returns an error message.  
  - Existing email: Returns an error message.  
  - New user: Registers, encrypts the password, and redirects to `/urls`.

- **POST /logout**  
  - Deletes the cookie and redirects to `/login`.

---

### URL Management (as expected)
- **GET /**  
  - Logged in: Redirects to `/urls`.  
  - Not logged in: Redirects to `/login`.

- **GET /urls**  
  - Logged in: Displays the user's URLs with options to edit, delete, and create new short URLs.  
  - Not logged in: Returns an error message.

- **GET /urls/new**  
  - Logged in: Displays a form for creating a new short URL.  
  - Not logged in: Redirects to `/login`.

- **POST /urls**  
  - Logged in: Creates a new short URL, associates it with the user, and redirects to `/urls/:id`.  
  - Not logged in: Returns an error message.

- **GET /urls/:id**  
  - Logged in and owns the URL: Displays the URL's details and an edit form.  
  - URL doesn't exist: Returns an error message.  
  - Not logged in: Returns an error message.  
  - Logged in but doesn't own the URL: Returns an error message.

- **POST /urls/:id**  
  - Logged in and owns the URL: Updates the long URL and redirects to `/urls`.  
  - Not logged in or doesn't own the URL: Returns an error message.

- **POST /urls/:id/delete**  
  - Logged in and owns the URL: Deletes the URL and redirects to `/urls`.  
  - Not logged in or doesn't own the URL: Returns an error message.

- **GET /u/:id**  
  - URL exists: Redirects to the corresponding long URL.  
  - URL doesn't exist: Returns an error message.

---

### Display and Navigation Features
- **Site Header:**  
  - Logged in: Displays the user's email and a logout button.  
  - Not logged in: Displays links to login and register pages.

- **URL List Page:**  
  - Displays a table of URLs with:  
    - Short URL, Long URL, Edit button (redirects to `/urls/:id`), and Delete button.  

---

### Screenshots
![image](https://github.com/user-attachments/assets/42ae31f0-c04f-41e4-8c93-6e288c80f418)
- Login page
![image](https://github.com/user-attachments/assets/d40e6922-9dc1-440d-8cb6-2df6bbfc40e4)
- Registration page
![image](https://github.com/user-attachments/assets/9508c4d5-4a62-4a0e-aa66-fb1d470a1b40)
- Main page - without URLs
![image](https://github.com/user-attachments/assets/6e9112c4-d5f0-4485-b3a7-d2e42605f13a)
- Create a URL
![image](https://github.com/user-attachments/assets/486c36e0-86aa-4c27-ba84-34874ea00016)
- List of URLs


---

### Dependencies
- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

 ---

 ### Future Enhancements
- Track visitor counts for short URLs
- Implement unique visitor tracking
- Display creation dates for URLs


 ---

## Installation and Setup
1. Clone the repository to your local machine.
2. Install dependencies:
   ```bash
   npm install
