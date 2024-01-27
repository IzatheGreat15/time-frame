<template>
    <div class="d-flex h-full w-full">
        <div class="col-sm-12 col-md-8 d-flex justify-content-center align-items-center">
            <div class="bg-violet col-sm-12 col-md-6 p-4 text-dark rounded">
                <h2 class="text-center font-weight-bold">TimeFrame</h2>
                <p class="text-center">Make your class schedule as your own!</p>
                <form action="#" class="mt-4">
                    <div class="form-group">
                        <label for="email-address" class="text-md">Email address</label>
                        <input type="email" class="form-control" id="email-address" placeholder="name@example.com">
                    </div>
                    <div class="form-group">
                        <label for="password" class="text-md">Password</label>
                        <input type="password" class="form-control" id="password" placeholder="***********">
                    </div>
                    <div class="form-group">
                        <label for="confirm-password" class="text-md">Confirm Password</label>
                        <input type="password" class="form-control" id="confirm-password" placeholder="***********">
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
export default {
    name: 'Signup',
}
</script>

<style>

</style>