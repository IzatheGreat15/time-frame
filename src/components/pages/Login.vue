<template>
    <div class="d-flex h-full w-full">
        <div class="col-sm-12 col-md-8 d-flex justify-content-center align-items-center">
            <div class="bg-violet col-sm-12 col-md-6 p-4 text-dark rounded">
                <h2 class="text-center font-weight-bold">TimeFrame</h2>
                <p class="text-center">Make your class schedule as your own!</p>
                <form @submit.prevent="login" class="mt-4">
                    <div v-if="this.error" class="alert alert-danger">{{ this.error }}</div>

                    <div class="form-group">
                        <label for="email-address" class="text-md">Email address</label>
                        <input type="email" class="form-control" v-model="user.email.value" id="email-address" placeholder="name@example.com">
                    </div>
                    <div class="form-group">
                        <label for="password" class="text-md">Password</label>
                        <input type="password" class="form-control" id="password" v-model="user.password.value" placeholder="***********">
                    </div>
                    <div class="d-flex form-group align-items-center">
                        <a href="/forgot-password" class="text-dark">Forgot Password?</a>
                        <button type="submit" class="btn btn-dark ml-auto">Login</button>
                    </div>
                    <div class="form-group text-center mt-5">
                        Don't have an account yet? <a href="/signup" class="text-dark">Sign up now</a>
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
import { auth, handleErrorMessage } from '../../../firebase'
import { signInWithEmailAndPassword } from "firebase/auth";

export default {
    name: 'Login',
    setup() {
        const router = useRouter();
        const user = {
            email: ref(''),
            password: ref('')
        };
        const error = ref(null);

        const login = async () => {
            try {
                error.value = null;
                signInWithEmailAndPassword(auth, user.email.value, user.password.value)
                    .then((data) => {
                        router.push('/');
                    })
                    .catch((err) => {
                        error.value = handleErrorMessage(err.message);
                    })
            } catch (err) {
                error.value = handleErrorMessage(err.message);
            }
        };

        return {
            user,
            error,
            login
        };
    }
}
</script>

<style>

</style>