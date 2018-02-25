# FloorNav
Webapp to navigate through buildings

## Inspiration
Three of our team members do not attend UTD, and as such had difficulty finding where our last team member was within the JSOM building. These three members wandered about the JSOM building for quite some time, confused as to exactly where room 12.214 was - the location of where the fourth member had set up our hacking station. They thought it was on the twelfth floor; it made sense as the number before the decimal tended to indicate which floor a room was on. We thought that these problems could be solved or mitigated using an application, a path-finding app for finding rooms in buildings that would display directions to rooms. 
<!-- One of the unsolved problems in computer science is to create a navigation interface that works in close distances like indoors. A few suggestions have been made like Google Indoors or Apple iBeacon, but they either do not work in smaller environments or require additional hardware. Therefore, we decided to tackle this challenge through image analysis. -->

## What it does
The webapp takes in a floor plan image and processes it to become an intractable interface. On a simple display, any user can click on where they are and their destination on the floor plan. Using processed data, the app generates an optimal path to that location.

## How we built it
FloorNav is built using Angular CIS, Node.js, canvas, html5, css3, javascript and typescript, java (for back-end experimentation), and Tesseract.
Once the user uploads the floor plan, they can select a button to signify the quality of the image. Then, the processing algorithm begins:

1. Remove color. This can be done by passing the image through a quick function: ![alt text](http://www.sciweavers.org/upload/Tex2Img_1519574909/render.png "c(x,y) = c(x,y) > t")
2. Sharpen image. This is done through an image convolution filter with the matrix ![alt text](http://www.sciweavers.org/upload/Tex2Img_1519575003/render.png "c(x,y) = c(x,y) > t")
3. Resize image. This is done to speed up the text recognition algorithm.  ![alt text](http://www.sciweavers.org/upload/Tex2Img_1519575428/render.png "c(x,y) = c(x,y) > t")
4. Remove text. This is done by using the optical character recognition package tesseract.js and identifying where text lies within the image and drawing white rectangles over them. 
5. Add weight to cells. For our path-finding algorithm, we're using A* on the smaller version of the image. Our implementation 

## Challenges we ran into
Deciding on a proper development environment was quite a challenge for us. The initial idea was way out of our scope, and we had to limit our scope some. We started working in Unity for easy porting to Web, iOS, and Android, but we quickly realized that Unity was too complex for what we wanted to do. We eventually decided, after much debate, to switch frameworks to Angular CLI and build our application as a Webapp.

--GAHWON and HENRY talk about generating the room-find algorithm

Several hardware issues came about during our development cycle. One of team members accidentally messed up the core dependencies for several of the necessary libraries and packages and spent several hours reinstalling and repairing various versions of Visual Studio.

## Accomplishments that we're proud of
Coming up with the algorithm to convert a picture of a floor plan into a graph is something we are all incredibly proud of. --HENRY/GAHWON elaborate more

--MATTHEW if you want to add anything
## What we learned

## What's next for FloorNav
Our original idea still stands. We hope to one day develop an AR system that can show the user's location on the map which will bring about live directions like a GPS or Google Maps can. This functionality was entirely of our project scope for this event as we lacked both the hardware and experience to implement AR. 

Currently images are uploaded and analyzed, but we want to develop a feature that allows a user to take a photograph directly from the application and analyze that. This brings more practicality to our application and increases ease of use.

This initial version of FloorNav was built for web due to the ease of development. We hope to be able to port this application to iOS and Android for much more practical use.