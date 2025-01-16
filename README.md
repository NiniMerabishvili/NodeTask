
This project implements a backend API for a mini social media platform using **Express.JS**, including user management, follow system, image uploads, and real-time chat functionality.
I have used Postgres SQL for database.
## Key Features

* **Authentication:**
    * User registration and login using JWT tokens for secure authentication.
    * Passwords are hashed before storing in the database.

* **User Model:**
    * The User entity includes fields for:
      * ID
      * Username (unique)
      * Password (hashed)
      * Profile picture URL (optional)

* **Follow System:**
    * Users can follow and unfollow other users.
    * Endpoints are provided to list the followers and following of a user.

* **Image Upload:**
    * Users can upload and update their profile picture.
    * Profile images are stored and accessible via a URL.

* **Real-Time Chat:**
    * WebSocket-based chat system for real-time messaging between users.
    * Users can only chat if they follow each other.

## Technical Implementation

* **Express.js** for building the RESTful API.
* **JWT Authentication** for secure user login and registration.
* **WebSockets** for implementing real-time messaging.
* **File Uploads** with support for image file formats.
* **Database Model:** 
    * -A relational **PostgreSQL** database is used to store users, relationships (followers/following) and Messages - **Sequelize** ORM for data access.

## Installation

1. **Clone the repository:**
 
 ```bash
   git clone https://github.com/YourUsername/social-media-backend
   ```
   
2. **Install dependencies:**
 
 ```bash
   cd social-media-backend
   npm install
   ```
 
3.  **Configure environment variables: **

 ```bash
   Create a `.env` file with the following keys:

DATABASE_URL=<Your Database Connection String>
JWT_SECRET=<Your JWT Secret Key>
DB_USER=<Your Database User>
DB_HOST=<Your Database Host>
DB_NAME=<Your Database Name>
DB_PASSWORD=<Your Database Password>
DB_PORT=<Your Database Port (Default: 5432)>
PORT=<Application Port>

   ```


4. **Connect to Postgres SQL**
 ```bash
   Open PgAdmin and connect to database
   ```

5. **Run database migrations:**
 ```bash
   npm run migration:run
   ```
   
6. **Start the application:**

 ```bash
   node app.js
   ```


## Usage

* **API Documentation:**
    - You can use Postman to test API endpoints and request/response formats.

* **Authentication:**
    - **Register a user** with a unique username and password.
    - **Login** to receive a JWT token for authentication.
    - **JWT token** is required for accessing protected endpoints.

* **Follow System:**
    - `POST /users/follow`: Follow a user by ID.
    - `POST /users/unfollow`: Unfollow a user by ID.
    - `GET /users/getAlFollowers`: Get the list of followers for a user.
    - `GET /users/getAllFollowings`: Get the list of users a user is following.

* **Image Upload:**
    - `POST /users/uploadProfilePicture`: Upload or update a profile picture for the logged-in user. 
    - Insert JWT token generated after authorization in Headers: key - Authorization, Value - Bearer JWT_TOKEN 
    - Go to body >> form-data , insert profilePicture in key, choose file and upload file in value.  Send and profile picture will add into user profile_picture field.

* **Real-Time Chat:**
	* You can you postman to test Websocket Chat. 
	* Choose new -> WebSocket oin postman
    - **Connect to WebSocket** using `ws://localhost:3001?token=YOUR_JWT_TOKEN.
    - Open two WebSocken tabs in postman, each connected to different users.
    - Only **users who follow each other** can send messages.
    - Connect and send message like:
	    {
		    "senderId": 3,
		    "recipientId": 4,
			"messageText": "Hello"
	    }
      Send it and message will display on the second tab in Received Messages section.

---

## Design Decisions

* **JWT Authentication** is used to provide secure access to the API and ensure that only authorized users can access or modify user data.
* **WebSocket** is chosen for the chat system to provide real-time communication between users.
* **Image uploads** are handled via a dedicated file storage system that allows easy retrieval and updating of user profile pictures. Pictures are saved in public/images folder.
* The **Follow System** allows users to create connections within the platform, enabling a variety of future interactions such as private messaging and friend lists.
* I have chosen to use **Express.js** for this project due to my solid experience with the framework, ensuring the project was built efficiently and professionally. However, I am fully capable of learning new technologies and frameworks, such as **Nest.js**, and would be open to implementing it in future projects given its advantages for larger-scale applications.
