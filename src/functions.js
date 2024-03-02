import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../firebase";
import { collection, doc, getDoc, getDocs, onSnapshot, setDoc } from "firebase/firestore";

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

    await setDoc(doc(scheduleRef, newSchedule.name), newSchedule);

    return newSchedule.name;
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
                console.log(doc.data())
                // Push schedule data to the schedules array
                schedules.push(doc.data());
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