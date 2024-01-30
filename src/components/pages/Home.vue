<template>
    <div class="position-relative h-full w-full">
        <!-- Sidebar -->
        <Sidebar :isHidden="sidebarHidden" @toggleSidebar="toggleSidebar"/>

        <!-- Main content -->
        <div class="position-absolute h-full w-full">
            <div class="m-3">
                <svg xmlns="http://www.w3.org/2000/svg" @click="toggleSidebar" width="24" height="24" fill="currentColor" class="bi bi-list text-center" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                </svg>
            </div>
            <!-- Main content goes here -->
        </div>

        <!-- Add Class Button -->
        <AddClass />
    </div>
</template>
  
<script>
import Sidebar from '../Sidebar.vue';
import AddClass from '../AddClass.vue';
import { auth } from '../../../firebase';

export default {
    name: 'Home',
    components: {
        Sidebar,
        AddClass
    },
    data() {
        return {
            sidebarHidden: true
        };
    },
    created() {
        //    
    },
    methods: {
        toggleSidebar() {
            this.sidebarHidden = !this.sidebarHidden;
        }
    }
}
</script>
  
<style scoped>
svg {
    cursor: pointer;
}
</style>
