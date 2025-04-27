Test overview
• Design a front to back solution to display a list of items and price updates for them
• Use React with TypeScript for the UI and .Net for the server
• You are not constrained what libraries or frameworks to use, but try to keep the number of external dependencies to a minimum
• Style as you see fit, however do not use any styling libraries like bootstrap, MUI etc.
• Your code should be testable, but writing unit tests is not necessary for this exercise
• Try to spend no more than 3-4 hours
• Try to split your efforts 60/40 for UI/Server
• Write a quick readme describing your solution and ways to improve it (if any)

Tasks

1. Display a list of 10 items each containing:
   • ID
   • Name
   • Price
   • Updated at

2. Add two buttons: one to subscribe to price updates and another to unsubscribe
3. When the subscribe button is clicked display price updates
4. When the unsubscribe button is clicked stop the price updates
5. Prices should update every second
6. Update the list of items with the new price data maintaining the existing order
7. Add an indicator on the list showing whether the price went up, down or remained the same
8. The traffic between the server and UI should be kept to a minimum

Description
The solution consiste of two parts

1. Self Hosted .NET 4.7 Web socket application with minimal implementation sutable for the purpose
   Purpose:
   To Start WebSocket server and listen for connections on a port 8080 using web socket protocol
   Keep sa list of connected clients to allow multiple clients to connect and receive updates
   Update sreceived by every client are not synchronized as it was not a part of task
   Receievs request from clients to unsubscribe and closes connected client connection
2. AngryStock Client that subscribes for the market data updates from Price Server and shows tham on a screen
   a) App.tsx main application class that uses AngryStockApi implementatiuon and subscribes for market data updates
   b) AngryStockBlotter that receives collection of AngryStock items and presents them on a screen in a form of a list with required features
   c) AngryStock HOC that is left as an attavism after i changed my mind to implement application store to keep application data and make them available
   d) WebSockerWorker that uses Socket API to connect to the server and receives market data updates and transver them to App class
   e) Toolbar module which shows two buttons to handle subscribe and unsubscribe users actions
