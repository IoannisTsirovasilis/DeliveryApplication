# DeliveryApplication
An Express API for ordering food online. An online cart is implemented for a delivery shop. The merchant can watch the orders on a single page. MongoDB is used as the data storage.

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

# API Documentation
https://documenter.getpostman.com/view/7405866/TVRj4T31
