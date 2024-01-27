<template>
    <div class="d-flex h-full w-full">
        <div class="col-sm-12 col-md-8 d-flex justify-content-center align-items-center">
            <div class="bg-violet col-sm-12 col-md-6 p-4 text-dark rounded">
                <h2 class="text-center font-weight-bold">TimeFrame</h2>
                <p class="text-center">Forgot your password? No worries, we’ll send you a reset password link to your email</p>
                <form action="#" class="mt-4">
                    <div class="form-group">
                        <label for="email-address" class="text-md">Email address</label>
                        <input type="email" class="form-control" id="email-address" placeholder="name@example.com">
                    </div>
                    <div class="d-flex form-group align-items-center">
                        <button type="submit" class="btn btn-dark ml-auto">Send Email</button>
                    </div>
                    <div class="form-group text-center mt-5">
                        Remember your password? <a href="/login" class="text-dark">Log in now</a>
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
    name: 'ForgotPassword',
}
</script>

<style>

</style>