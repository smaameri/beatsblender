# beatsblender

Angular JS based single page application

Allows user to search for videos via Youtube API and create a library from the videos. Features include:
 - ability to search for videos
 - add/remove videos to/from library
 - view the video details
 - related videos retrieved
 - sort the video list based on categories such as title, views, upload date, e.t.c
 
The Youtube API request to Youtube is a nested one, since initial request gets video title and id, and then a request must be for each video to get further details such as views and likes. Code structure is separated into Controller for updating the view variables, and two Factories, one for accessing the Youtube API, and the other for updating the library.

Demo site on: https://beatsblender.herokuapp.com/

A search query return a list of vides. Clicking on the video results add/removes it from the library. Clicking on a video in the library causes the video details to be shown. This also causes a list of Related Videos to be listed below the detail view. 
