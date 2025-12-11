# Arrive on Time: an appointment notification app

This is an app that allows the user to put in an appointment into the app, and the appointment's address, as well as where the user will be beforehand. Then, the app will notify the user when they should depart to arrive to their appointment on time.
This app uses the Google Maps API and React Native with Expo to allow the app to be cross-platform.

## Instructions for Build and Use

### Steps to build and/or run the software:

1. Install dependencies. Navigate in terminal to the porject folder. Command:

   ```bash
   npm install
   ```
    If the install notes any vulnerabilities, run the command
    ```bash
    npx expo-doctor
    ```
    And follow its directions to install or update any needed libraries

2. Start the app

   ```bash
   npx expo start --tunnel
   ```
    The ```--tunnel``` addition to the command allows the app to be transferred to your device if not on a private network.

    In the output, you'll find options to open the app in a

    - [development build](https://docs.expo.dev/develop/development-builds/introduction/)
    - [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
    - [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
    - [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo. This app can scan the QR code provided in the terminal to load the app. Note that this option on Android will pop-up an error for Expo Go (not the app itself), as Expo Go on Android is not equipped to give notifications. This error will not prevent the app from running, so it can be ingored on Expo Go.
    
    3. As the app loads into Expo Go (this option is preferred for testing), the notifications system currently used will stop the app from loading, and state that it is recommended that the user sign in to expo before proceeding. This is not required in any way, but it will block the app from loading on the device until the user selects an option. Using the arrow keys, navigate to the command:
    ```
    > Proceed Anonymously
    ```
    Then press Enter on the keyboard. The app will then load.
    
    4. If the above instruction is not completed in time (due to the terminal window losing focus, or if the app has been waiting to load for too long), the server will need to be quit (using CTRL + C command), and then restarted as directed in step 2, and Expo Go app will need to be reset. Step 3 will then need to be completed in time before the app will load on the user device.
    
    
### Instructions for using the software:

1. The app starts with a list of appointments (originally empty if this is the first use). Press the '+' icon at the bottom right corner of the screen. This will take the user to the "Create" appointment screen.

2. The create screen requires all inputs to be specified in order for the app to function as expected. 
    - The Name of the appointment should be kept short (around 15 characters). 
    - The 2 address boxes below the name will make an assumption about the desired location if full address information is not given (e.g. "Gas Station" in the "Address" Field will likely take the user to the nearest gas station).
    - Arrival time must be specified in a format that takes up 4 digits (a user would type 05:00 instead of 5:00 for the time). The period of day must be set to either AM or PM, or else PM will be assumed for the time period.
    - Extra time allows the user to specify how early before they need to leave for the appointment that they will be notified. The value here must be specified in minutes.
    - Repeating: This section is designed to allow the user to specify what days of the week an appointment repeatedly occurs. Any or all of the 7 days of the week can be specified here.
    - Date: This date must be specified in the format MM/DD/YYYY. This is where the first occurence day of the appointment is specified.

3. Press the Save button at the bottom of the Create Appointment Screen to save this appointment (or update, if this appointment already existed) to the device and schedule when its notifications will appear to the user.
    - Note that the Delete button will appear below this if this appointment is being modified.

4. After an appointment is saved, it will appear in the appointments list on the main screen. A large "Navigate There" button will appear next to each appointment in the list, which will link the user to their device's native maps navigation system. The user's map app will direct the user from where they currently are to the address of the specific appointment.

## Development Environment 

To recreate the development environment, you need the following software and/or libraries with the specified versions:

1. Download Android JDK as outlined in [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/)
2. Download and install Node.js (the above guide will direct this)
3. Download the Expo Go app on user's mobile device

## Useful Websites to Learn More

The following resources were helpful in developing this software:
- [Expo documentation](https://docs.expo.dev/)
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/)

## Future Work

The following items are planned to be fixed, improved, and/or added to this project in the future:

* [ ] Adjust predictions based on measured transit time
* [ ] Settings screen
* [ ] Auto-complete addresses (as they are typed)
* [ ] Google Maps view inside app/from notification
* [ ] A small animation that pops up when you arrive to your location
* [ ] Adding a preferences page
