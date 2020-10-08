# DeliveryApplication
An Express API for ordering food online. An online cart is implemented for a delivery shop. The merchant can watch the orders on a single page. MongoDB is used as the data storage.

# Tools
- Node.js v12.18.4
- Express v4.16.1
- MongoDB v4.4.1

# How to run
Clone repository
```
git clone https://github.com/IoannisTsirovasilis/DeliveryApplication.git
```
Install Dependencies
```
npm install
```
Run the API
```
npm start
```
Example calls for the proper use can be found in the following link.

# API Documentation
https://documenter.getpostman.com/view/7405866/TVRj4T31

# Database Architecture
The database contains 5 collections:
- users
- items
- categories
- carts
- orders

Documents' formats:
- user:
  - {  
      "id" : ObjectId  
      "firstName" : String,  
      "lastName" : String,  
      "address" : String,  
      "postalCode : String,  
      "phone" : String,  
      "floor" : String  
  }
- item:
  - {  
    "id" : ObjectId,  
    "name" : String,  
    "description" : String,  
    "price" : Decimal128  
  }
- category:
  - {  
  "id" : ObjectId,  
  "name" : String,  
  "items" : Array  
  }
- cart:
  - {  
  "id" : ObjectId,  
  "userId" : ObjectId,  
  "status" : String,  
  "modifiedOn" : Date,  
  "items" : Array,  
  "totalPrice" : Decimal128   
  }
- order:
  - {  
  "id" : ObjectId,  
  "user" : Object,  
  "cart" : Object,  
  "totalPrice" : Decimal128,  
  "createdOn" : Date  
  }

# API Architecture
The API consists of the following: 
- 'models' folder containing the models for each collection of the database. Each model has functions for CRUD database operations. It also contains a context file that represents the database context.
- 'routes' folder containing the controllers for the incoming requests. The route files handle the client's requests and serve responses.
- 'config' folder containing a config file with hardcoded parameters that are used throughout the service.
- 'utils' folder containing an utility file for currency conversion.
- 'views' folder containing .jade files for the orders and error page.
- 'public' folder containing a stylesheet file for styling the views.
