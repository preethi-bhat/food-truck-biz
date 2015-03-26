# food-truck-biz
This repository contains the code for the business logic service.


Description of the problem
 - This app aims to create a service that tells the user what types of food trucks might be found near a specific location on a map. In addition, the user can enter the type of food or the name of the food cart that he/she wants to find around the user's current location. The results are displayed on the map and listed in a tabular fashion.

Description of the solution
 - The solution is full stack. I have decoupled the client and the server code completely. The client contains the user interface and makes an ajax call to the server when a search for food truck is to be made. The server contains the business logic that powers the application. The code has been written in such a way that it can be containerized. I have selected Docker containers and have provided the Docker files.
 - This repository contains the code for the business logic service.
 
 Design choices
 - I have selected a service based architecture to achieve flexibility, scalability and complete decoupling of logic. 
 - This architecture will help develop new functions rapidly and enable a system that can work well with different programming languages based on the problem. 
 - This architecture also enables making changes and pushing the changes to production rapidly. 
 - I have also chosen Node.js for the non blocking I/O capability. The business logic needed to solve this problem such as filtering out food trucks can be done in an asynchronous fashion.

Future enhancements
- Add a caching layer to cache the food truck API response, user queries for faster autocomplete and perhaps for filtering logic as well. I would like to try out Elasticsearch caching infrastructure as it is highly availabe, supports caching json documents, provides built in map-reduce functionality, full text search and has RESTful API to access it.

- Peristance layer - I wanted to use Elasticsearch for persistance as well
  
- Recommendation system: I would like to explore the possibility of making recommendation to users about food items they might like based on other users who have searched for similar food items.
  
Technologies
 - Node.js with Express framework to create the services 
 - jade template engine to render the html page
 - Google maps to display the food truck locations on the page
 - Google geo resolution to resolve user input 
 - Docker to containerize the code

Experience level
 - Basic experience in Node.js (approx. 3 weeks)
 - Intermediate front end skills
 - Advanced back end skills
 
Application
	https://prbhat-webapp.herokuapp.com/

