import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../firebase";
import { collection, doc, getDoc, getDocs, onSnapshot, setDoc } from "firebase/firestore";

function generateRandomId(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
}

export const uploadFile = (file, filepath) => {
    if(file === ''){
        return null;
    }
    return new Promise((resolve, reject) => {
        const storageRef = ref(storage, filepath);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            // console.log('Upload is ' + progress + '% done');

            switch (snapshot.state) {
                case 'paused':
                    // console.log('Upload is paused');
                    break;
                case 'running':
                    // console.log('Upload is running');
                    break;
            }
        },
        (error) => {
            // Error handling
            reject(error);
        },
        () => {
            // Upload completed
            getDownloadURL(uploadTask.snapshot.ref)
                .then((downloadURL) => {
                    resolve(downloadURL);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    });
}

export const addSchedule = async (schedule, user) => {
    const filepath = user.email+'/'+Date.now();
    console.log(filepath)

    var newSchedule = null;
    
    if (typeof schedule.settings.backgroundImage == 'object' && schedule.settings.backgroundImage !== null) {
        const fileURL = await uploadFile(schedule.settings.backgroundImage, filepath);    
    
        newSchedule = {
            ...schedule,
            settings: {
                ...schedule.settings,
                backgroundImage: fileURL
            }
        }
    } else {
        newSchedule = {
            ...schedule,
            settings: {
                ...schedule.settings,
            }
        }
    }

    const userRef = doc(db, 'users', user.email);
    const scheduleRef = collection(userRef, 'schedules');
    const newDocRef = schedule.id ? doc(scheduleRef, schedule.id) : doc(scheduleRef);

    await setDoc(newDocRef, newSchedule);

    return newSchedule.name;
}

export const addClass = async (schedule, user, newClass) => {
    const userRef = doc(db, 'users', user);
    const scheduleRef = doc(userRef, 'schedules', schedule);
    const scheduleDoc = await getDoc(scheduleRef);
        if (!scheduleDoc.exists()) {
            throw new Error('Schedule document does not exist.');
        }

        const scheduleData = scheduleDoc.data();
        if (!scheduleData.classes) {
            scheduleData.classes = {};
        }

        const classId = newClass.id || generateRandomId(20);

        scheduleData.classes[classId] = newClass;

        await setDoc(scheduleRef, scheduleData);

    return newClass.id;
}

export const getSchedule = async (userId, scheduleId) => {
    try {
        const userRef = doc(db, 'users', userId);
        const scheduleRef = doc(collection(userRef, 'schedules'), scheduleId);
        
        const scheduleSnapshot = await getDoc(scheduleRef);
        if (scheduleSnapshot.exists()) {
            return scheduleSnapshot.data();
        } else {
            return null;
        }
    } catch (error) {
        throw error; 
    }
};

export const getUserSchedulesRealTime = async (userId, callback) => {
    try {
        // Construct a reference to the user document in Firestore
        const userRef = doc(db, 'users', userId);
        
        // Construct a reference to the 'schedules' subcollection of the user document
        const scheduleRef = collection(userRef, 'schedules');
        
        // Set up a real-time listener for the 'schedules' subcollection
        const unsubscribe = onSnapshot(scheduleRef, (querySnapshot) => {
            const schedules = [];
            querySnapshot.forEach((doc) => {
                const scheduleData = { id: doc.id, ...doc.data() };

                // Transform the classes data
                const transformedClasses = transformClasses(scheduleData.classes);

                // Append transformed classes data to the schedule data
                scheduleData.classes = transformedClasses;

                // Push schedule data to the schedules array
                schedules.push(scheduleData);
            });
            // Pass the schedules array to the callback function
            callback(schedules);
        });

        // Return the unsubscribe function so that the caller can stop listening
        return unsubscribe;
    } catch (error) {
        // Throw any errors that occur during the process
        throw error;
    }
}

function transformClasses(classes) {
    const transformedClasses = [];

    for (const classId in classes) {
        const classData = classes[classId];
        const times = classData.times || [];

        times.forEach(time => {
            transformedClasses.push({
                name: classData.name,
                startTime: convertTimeToMinutes(time.start),
                endTime: convertTimeToMinutes(time.end),
                day: time.day,
                color: classData.color
            });
        });
    }
    console.log(transformedClasses)
    return transformedClasses;
}

function convertTimeToMinutes(timeObj) {
    let hour = timeObj.hour;
    let minute = timeObj.minute;
    

    // Adjust for PM shift
    if (timeObj.shift === 'PM' && timeObj.hour !== 12) {
        hour += 12;
    }
    let totalMinutes = hour.toString() + (minute.toString().padStart(2, '0'));
    
    return totalMinutes.toString();
}

function getTimeInMinutes(timeString) {
    // Convert the time string to a string and pad it if necessary
    const paddedTimeString = timeString.toString().padStart(4, '0');

    // Extract hours and minutes from the padded time string
    const hours = parseInt(paddedTimeString.substring(0, 2), 10);
    const minutes = parseInt(paddedTimeString.substring(2), 10);

    // Convert hours and minutes to total minutes
    return (hours * 60) + minutes;
}
  
export const getMinutesDifference = (time1, time2) => {
    // Get the time in minutes for each time string
    const minutes1 = getTimeInMinutes(time1);
    const minutes2 = getTimeInMinutes(time2);
    
    // Calculate the difference in minutes
    let difference = minutes2 - minutes1;
    
    // Handle negative differences (borrow)
    if (difference < 0) {
        difference += 24 * 60; // Add 24 hours worth of minutes
    }
    
    return difference;
}