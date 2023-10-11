# Week4tut

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Github link
https://github.com/euler456/3813week4.git

## Git
I've created a repository named "3813week4" and linked it to my local computer. It's based on the workshop we covered in week 4. I'm using GitHub Desktop, which automatically displays any changes made by users. Users only need to provide a brief message when committing changes, and they can then push those changes to GitHub.

I've also created a branch called "week5" to upload all the changes made after week 5. I push these changes whenever I complete or modify different parts of the project. For instance, once I've finished implementing the user login functions, I use GitHub Desktop to upload the related files. This includes the Angular code, server code, and JSON files.

Within the repository, there are two main folders. The first is "src," which contains all the Angular user interface components. The second is the "server" folder, which includes all the Node.js backend code. Notably, there's a folder called "data" under the server directory, where all the JSON files are stored.
## User Data Structure:

**Attributes:**
- `username`: The username of the user.
- `email`: The email address of the user.
- `roles`: The roles or permissions assigned to the user (e.g., "admin," "groupadmin," "user").
- `password`: The user's password (Note: In practice, passwords should be securely hashed and not stored as plaintext).
- `userid`: A unique identifier for the user.
- `groupid`: An array of group IDs that the user belongs to.
- `filename`: The filename associated with the user's profile image.

## Group Data Structure:

**Attributes:**
- `groupid`: A unique identifier for the group.
- `group`: The name or title of the group.
- `channels`: An array of channel names associated with the group.

---
## RestAPI
Server.js:server.js file defines several routes that handle different aspects of your application, including user authentication, superadmin privileges, chat functionality, and user group management. These routes expect specific parameters and return relevant JSON data based on the requested actions. The actual implementation details are found in separate modules (e.g., postLogin, postLoginafter, superadmin, chat, group) that are required for each route.

This chat.js module handles a specific API endpoint, expecting a POST request with a groupId. It reads user and group data, identifies the group, extracts member usernames, and responds with group information or errors. Server parameters are req and res, and return values are HTTP responses (data, errors, status codes). Its purpose is to provide group details, contributing to a modular Node server structure using modules like fs and global variables for routes and ports.

This group.js module handles various actions related to group and channel management based on the provided action parameter. It reads group and user data from JSON files (groups.json and users.json) using the fs module.
If action is 'listGroups', it returns a list of all groups in JSON format.
If action is 'createGroup', it creates a new group with the specified name and an auto-generated groupid. It then writes the updated group data to the JSON file.
If action is 'deleteGroup', it deletes a group based on the provided groupId.
If action is 'createChannel', it creates a new channel within a group specified by groupId and adds it to the group's channels list. It then writes the updated group data to the JSON file.
If action is 'deleteChannel', it deletes a channel from a group specified by groupId and updates the group's channels list in the JSON file.
If action is 'joinGroup', it allows a user to join a group specified by groupId and adds the group's ID to the user's groupid array. It then writes the updated user data to the JSON file.
If action is 'leaveGroup', it allows a user to leave a group specified by groupId by removing the group's ID from the user's groupid array. It then writes the updated user data to the JSON file.
The module also provides functions for reading and writing group and user data to/from the JSON files, generating unique group IDs, and checking for unique usernames and emails among users. If there are any errors during file reading or writing, it logs the errors to the console.

This postLogin.js module is responsible for handling a login action. It reads user data from a JSON file (users.json), compares the provided email and password (u and p) with the stored user data, and returns a response indicating whether the login is valid or not. It extracts user information from the matching user data and sends it as a response if the login is valid, including user ID, username, roles, groups, and email. If the login is invalid, it sends a response with valid set to false. This module relies on the fs module to read user data from the JSON file.

This postLoginafter.js module handles a request to retrieve a user's group memberships based on their user ID (userId). It reads user data and group data from JSON files (users.json and groups.json, respectively). After reading the data, it searches for the user with the specified userId. If the user is found, it extracts the group IDs associated with the user and then finds the corresponding group names using those IDs. The module responds with a JSON array of user groups, each containing groupid and group properties. If the user is not found, it returns a 404 error. If there are any errors during data reading or parsing, it returns a 500 error. This module uses the fs module to read data from the JSON files.

This superadmin.js module handles various actions related to user management based on the provided action parameter. It reads user data from a JSON file (users.json) using the fs module.
If action is 'listUsers' or 'fetchUsers', it returns a list of all users in JSON format.
If action is 'createUser', it creates a new user based on the provided user object. It checks if the username and email are unique among existing users before creating the user. If the username or email is not unique, it sends a response with a success flag set to false.
If action is 'deleteUser', it deletes a user based on the provided userId.
If action is 'changeUserRole', it updates the role of a user specified by userId with the new role (newRole).
The module provides functions for reading and writing user data to/from the JSON file, generating unique user IDs, and checking the uniqueness of usernames and emails. If there are any errors during file reading or writing, it logs the error to the console.



## Angular architecture
The App component serves as the primary layout and navigation structure for the Angular application. It creates a responsive navigation bar using Bootstrap classes, offering links for various routes within the app, such as Home, Login, Profile, Dashboard, and others. The router outlet within the layout dynamically renders the content of the currently selected route or component, allowing users to navigate seamlessly between different views.

The ChatComponent is the central component for managing chat functionality in the Angular application. It divides the interface into three main sections: Users list (left), Chat area (center), and Channels list (right). Users and channels are listed dynamically, messages are displayed in conversation format, and users can send messages via the input field. WebSocket connections are initiated for real-time chat, and data about users and channels is fetched from the server based on the selected group's ID. This component is the core of the chat interface, enabling users to interact in real time.

The DashboardComponent serves as the user's dashboard in the Angular application. It displays a welcome message and lists the groups the user is a member of. If the user is not part of any groups, a message indicating this is displayed. The component fetches the user's group data from the server based on their user ID, ensuring that only authenticated users can access their dashboard. Users can click on a group to save the selected group's ID in session storage for later use, typically when they want to access the chat feature associated with that group.

The GroupAdminPanelComponent is a component responsible for managing groups and channels. It provides features for creating groups and channels, adding users to groups, removing users from groups, deleting groups, and deleting channels. The component interacts with the backend server to perform these actions. Users with the roles of "groupadmin" or "admin" can access this functionality. It includes forms for creating groups and channels, lists of existing groups and channels, and options to add or remove users from groups. Additionally, it handles the deletion of groups and channels. The component ensures that data is refreshed after performing these operations, providing a seamless user experience.

The LoginComponent is responsible for user authentication. It provides a login form to enter email and password. Upon submission, it validates the credentials with the server. Successful logins store user information in session storage, enabling access to protected sections, while failed attempts display an error message.

The ProfileComponent allows users to edit their profile information, including their username and email. It displays a form where users can modify these details, and upon clicking the "Edit" button, the changes are saved to the session storage, updating the user's profile.

The SuperadminComponent is responsible for managing users and their roles. For users with admin or superadmin privileges, it displays a list of users in a table format, allowing them to change a user's role (e.g., make a user a group admin, superadmin, or a regular user) or delete a user. Additionally, it provides a form to create new users, including specifying their username, email, roles, and password. Users with superadmin privileges can perform these administrative tasks to manage the application's user base efficiently.
## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
