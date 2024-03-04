<template>
    <div class="position-relative h-full w-full">
        <!-- Sidebar -->
        <Sidebar v-if="user && schedules" :isHidden="sidebarHidden" :schedules="schedules" :user="user" @toggleSidebar="toggleSidebar" :schedule="selectedSchedule" @schedule-updated="handleScheduleUpdate"/>

        <!-- Main content -->
        <div class="position-absolute h-full w-full" 
            id="main-content" 
            :style="{ 'background-image': 'url(' + (typeof selectedSchedule.settings.backgroundImage == 'string' ? selectedSchedule.settings.backgroundImage : selectedSchedule.settings.selectedImage) + ')' }">
            <div class="m-3">
                <svg xmlns="http://www.w3.org/2000/svg" @click="toggleSidebar" width="24" height="24" fill="currentColor" class="bi bi-list text-center" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                </svg>
            </div>
            <!-- Main content goes here -->
            <Classes :selectedSchedule="selectedSchedule"/>
        </div>

        <!-- Add Class Button -->
        <AddClass v-if="user && selectedSchedule.name" :userId="user.email" :scheduleId="selectedSchedule.name" :selectedDays="selectedSchedule.settings.days" />
    </div>
</template>
  
<script>
import Sidebar from '../Sidebar.vue';
import AddClass from '../AddClass.vue';
import { getCurrentUser } from '@/router';
import { getUserSchedulesRealTime } from '@/functions';
import Classes from '../Classes.vue';

export default {
    name: 'Home',
    components: {
        Sidebar,
        AddClass,
        Classes
    },
    data() {
        return {
            sidebarHidden: true,
            user: null,
            schedules: null,
            selectedSchedule: {
                name: '',
                id: null,
                settings: {
                days: [true, true, true, true, true, true, true],
                dimensions: {
                    name: 'Current Device',
                    width: '100%',
                    height: '100%'
                },
                backgroundImage: '',
                textColor: '#ccc'
                },
            },
        };
    },
    async created() {
        this.fetchUserData(); // Call the function to fetch user data
    },
    methods: {
        async fetchUserData() {
            try {
                this.user = await getCurrentUser();    
                if(this.user) {
                    const unsubscribe = getUserSchedulesRealTime(this.user.email, (schedules) => {
                        this.schedules = schedules;
                        console.log(this.schedules);
                    });
                    
                }
            } catch (error) {
                console.error('Error fetching user or schedule:', error);
            }
        },
        toggleSidebar() {
            this.sidebarHidden = !this.sidebarHidden;
        },
        handleScheduleUpdate(updatedSchedule) {
            this.selectedSchedule = updatedSchedule;
            console.log('new schedule:', this.selectedSchedule);
        },
    }
}
</script>
  
<style scoped>
svg {
    cursor: pointer;
}
#main-content {
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
}
</style>