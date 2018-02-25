# FloorNav
Webapp to navigate through buildings

## Inspiration
One of the unsolved problems in computer science is to create a navigation interface that works in close distances indoors. A few suggestions have been made like Google Indoors or Apple iBeacon, but they either do not work in smaller environments or require additional hardware. Therefore, we decided to tackle this challenege through image analysis.

## What it does
The webapp takes in a floorplan image and processes it to become an interactable interface. On a simple display, any user can click on where they are and their destination on the floorplan. Using processed data, the app generates an optimal path to that location.

## How we built it
FloorNav is built using Angular CIS, Node.js, canvas, html5, css3, javascript and typescript, java (for backend experimentation), and Tesseract.
Once the user uploads the floorplan, they can select a button to signify the quality of the image. Then, the processing algorithm begins:

1. Remove color. This can be done by passing the image through a quick function: ![alt text](http://www.sciweavers.org/upload/Tex2Img_1519574909/render.png "c(x,y) = c(x,y) > t")
2. Sharpen image. This is done through an image convolution filter with the matrix ![alt text](http://www.sciweavers.org/upload/Tex2Img_1519575003/render.png "c(x,y) = c(x,y) > t")
3. Resize image. This is done to speed up the text recognition algorithm.  ![alt text](http://www.sciweavers.org/upload/Tex2Img_1519575428/render.png "c(x,y) = c(x,y) > t")
4. Remove text. TIGER WRITE HERE
5. Add weight to cells. For our pathfinding algorithm, we're using A* on the smaller version of the image. Our implementation 

## Challenges we ran into

## Accomplishments that we're proud of

## What we learned

## What's next for FloorNav
