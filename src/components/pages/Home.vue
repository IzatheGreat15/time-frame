<template>
    <div class="position-relative h-full w-full">
        <!-- Sidebar -->
        <Sidebar v-if="user && schedules" :isHidden="sidebarHidden" :schedules="schedules" :user="user" @toggleSidebar="toggleSidebar" :schedule="selectedSchedule" @schedule-updated="handleScheduleUpdate"/>

        <!-- Main content -->
        <div class="position-absolute h-full w-full" id="main-content" :style="{ 'background-image': 'url(' + selectedSchedule.settings.backgroundImage + ')' }">
            <div class="m-3">
                <svg xmlns="http://www.w3.org/2000/svg" @click="toggleSidebar" width="24" height="24" fill="currentColor" class="bi bi-list text-center" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                </svg>
            </div>
            <!-- Main content goes here -->
            <div class="table-container">
                <table class="w-full">
                    <thead>
                        <tr class="text-center">
                            <th :style="{'width' : columnWidth}" v-if="selectedSchedule.settings.days[0]">Sun</th>
                            <th :style="{'width' : columnWidth}" v-if="selectedSchedule.settings.days[1]">Mon</th>
                            <th :style="{'width' : columnWidth}" v-if="selectedSchedule.settings.days[2]">Tue</th>
                            <th :style="{'width' : columnWidth}" v-if="selectedSchedule.settings.days[3]">Wed</th>
                            <th :style="{'width' : columnWidth}" v-if="selectedSchedule.settings.days[4]">Thu</th>
                            <th :style="{'width' : columnWidth}" v-if="selectedSchedule.settings.days[5]">Fri</th>
                            <th :style="{'width' : columnWidth}" v-if="selectedSchedule.settings.days[6]">Sat</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Classes -->
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Add Class Button -->
        <AddClass />
    </div>
</template>
  
<script>
import Sidebar from '../Sidebar.vue';
import AddClass from '../AddClass.vue';
import { getCurrentUser } from '@/router';
import { getUserSchedulesRealTime } from '@/functions';

export default {
    name: 'Home',
    components: {
        Sidebar,
        AddClass
    },
    data() {
        return {
            sidebarHidden: true,
            user: null,
            schedules: null,
            selectedSchedule: {
                name: '',
                settings: {
                days: [true, true, true, true, true, true, true],
                dimensions: {
                    name: '',
                    width: '',
                    height: ''
                },
                backgroundImage: '',
                textColor: '#ccc'
                },
            }
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
        }
    },
    computed: {
        columnWidth() {
            const selectedDays = this.selectedSchedule.settings.days.filter(day => day === true).length;
            return selectedDays > 0 ? `${100 / selectedDays}%` : '0%';
        }
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

.table-container {
    flex: 1;
    overflow-y: auto;
}

table {
    width: 100%;
    height: 100%;
    border-collapse: collapse;
    border-style: hidden;
}
th, td {
    border: 1px solid white;
}
</style>