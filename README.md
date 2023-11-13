# Data Dashboard Project

## Brief description of the project

The project simulates the data dashboard with two main functions: Displaying in different plots and Predicting the outcome for the users with specific inputs.


## Explanation of the website

### Visualizing data

The users will submit as many files as they want to the website (currently the website only supports 3 categories: Weather, Airline, and Gaming).

![Screenshot 2023-11-12 at 4 32 43 PM](https://github.com/TrongNguyenzzz/data-dashboard/assets/89328535/029e8f8c-32ae-4e60-b1dc-49007555a2da)

After that, the users will also choose the type of plots they want the data to be displayed (currently there are 3 types of plots: bar plot, scatter plot, and pie chart). Finally, they will click on the Process button to send the files to the API in the backend.

According to the files, the data will be displayed separately on different pages by category:

![Screenshot 2023-11-12 at 4 34 54 PM](https://github.com/TrongNguyenzzz/data-dashboard/assets/89328535/0809ece3-6bfe-4ba1-9dec-eeb4a1eda887)

<img width="949" alt="Screenshot 2023-09-29 at 4 06 46 PM" src="https://github.com/TrongNguyenzzz/data-dashboard/assets/89328535/4f737bad-348d-40c6-a365-e10a550ccfad">

There will also be a summary of the information about the data for users:

<img width="1893" alt="Screenshot 2023-09-29 at 4 06 53 PM" src="https://github.com/TrongNguyenzzz/data-dashboard/assets/89328535/0df031c6-87db-4c34-81e6-267289465f79">

### Predicting data

The users also have to submit the file they want to predict to the website (currently supports one file only) and then click on the Predict button. The file will then be sent to the API backend and also be displayed on another page.

Some basic information about the model will be provided such as the coefficient of some important predictors, the type of regression of the model, the accuracy of the model, ... etc.

![Screenshot 2023-10-22 at 5 11 08 PM](https://github.com/TrongNguyenzzz/data-dashboard/assets/89328535/fc1d7bb8-9e45-4c92-aad5-68a7e8563e83)

![Screenshot 2023-10-22 at 5 11 22 PM](https://github.com/TrongNguyenzzz/data-dashboard/assets/89328535/1551263b-b261-461a-89d1-500969aa6ab1)

### How to test the website locally 
* First, the user has to clone the whole project to the local environment.
* Second, the user has to run 3 parts of the program separately. The first part is the website interface, which is where the user submits the data files and requests for the type of plots they want to display data or if they want to use the prediction features.
* Finally, go to the displaying pages to see the charts if they choose to visualize data. If the user wants to see the prediction, go to the prediction page and enter their own inputs to get the predicted input with the corresponding accuracy.

# Disclaimer: The prediction is just model-based and it is not 100% correct. Please don't use this for any betting purposes.

# I hope you enjoy the page

