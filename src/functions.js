import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../firebase";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";

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
    
    const fileURL = await uploadFile(schedule.settings.backgroundImage, filepath);    
    
    const newSchedule = {
        ...schedule,
        settings: {
            ...schedule.settings,
            backgroundImage: fileURL
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