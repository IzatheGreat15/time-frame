<template>
    <div class="d-flex h-full w-full">
        <div class="col-sm-12 col-md-8 d-flex justify-content-center align-items-center">
            <div class="bg-violet col-sm-12 col-md-6 p-4 text-dark rounded">
                <h2 class="text-center font-weight-bold">TimeFrame</h2>
                <p class="text-center">Make your class schedule as your own!</p>
                <form @submit.prevent="signUp" class="mt-4">
                    <div v-if="this.error" class="alert alert-danger">{{ this.error }}</div>
                    <div class="form-group">
                        <label for="email-address" class="text-md">Email address</label>
                        <input type="email" class="form-control" id="email-address" v-model="user.email.value" placeholder="name@example.com">
                    </div>
                    <div class="form-group">
                        <label for="password" class="text-md">Password</label>
                        <input type="password" class="form-control" id="password" v-model="user.password.value" placeholder="***********">
                    </div>
                    <div class="form-group">
                        <label for="confirm-password" class="text-md">Confirm Password</label>
                        <input type="password" class="form-control" id="confirm-password" v-model="user.confirmPassword.value" placeholder="***********">
                    </div>
                    <div class="d-flex form-group align-items-center">
                        <button type="submit" class="btn btn-dark ml-auto">Signup</button>
                    </div>
                    <div class="form-group text-center mt-5">
                        Already have an account? <a href="/login" class="text-dark">Log in now</a>
                    </div>
                </form>
            </div>
        </div>
        <div class="col-sm-12 col-md-4 d-none d-md-block bg-light">
            
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db, handleErrorMessage } from '../../../firebase'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from 'firebase/firestore';

export default {
    name: 'Signup',
    setup() {
        const router = useRouter();
        const user = {
            email: ref(''),
            password: ref(''),
            confirmPassword: ref('')
        };
        const error = ref(null);

        const signUp = async () => {
            if (user.password.value === user.confirmPassword.value) {
                try {
                    error.value = null;
                    createUserWithEmailAndPassword(auth, user.email.value, user.password.value)
                        .then((data) => {
                            setDoc(doc(db, "users", user.email.value), {
                                email: user.email.value
                            })
                            .then(() => {
                                router.push('/');
                            })
                        })        
                        .catch((err) => {
                            error.value = handleErrorMessage(err.message);
                        })
                } catch (err) {
                    error.value = handleErrorMessage(err.message);
                }
            } else {
                alert('Password and Confirm Password must be the same!');
            }
        };

        return { user, error, signUp };
    }
}
</script>

<style>

</style>
